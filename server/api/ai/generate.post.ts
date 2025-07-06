import type { OpenAIRequest, OpenAIResponse } from "~/types/openai";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import { Database } from "~/supabase/supabase";

interface UserPlan {
  plan_type: string;
}

interface RateLimitSettings {
  daily_limit: number;
}

interface RequestBody {
  context: string;
  type: "reply" | "comment" | "tweet";
  tone?: string;
  audience?: string;
  formatInstructions?: string;
  maxTokens?: number;
  temperature?: number;
}

interface ResponseData {
  content: string;
}

export default defineEventHandler(async (event): Promise<ResponseData> => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required to access AI generation",
    });
  }

  const supabase = await serverSupabaseClient<Database>(event);

  // Fetch user plan from cached endpoint
  const { plan_type } = await $fetch<UserPlan>("/api/user/plan", {
    headers: event.headers,
  });

  // Fetch rate limits from cached endpoint
  const rateLimitSettings = await $fetch<RateLimitSettings>(
    `/api/settings/rate-limit?plan_type=${plan_type}`
  );

  if (!rateLimitSettings) {
    throw createError({
      statusCode: 500,
      statusMessage: "Could not retrieve rate limits",
    });
  }

  const twentyFourHoursAgo = new Date(
    new Date().getTime() - 24 * 60 * 60 * 1000
  ).toISOString();

  const { count, error: usageError } = await supabase
    .from("openai_usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", twentyFourHoursAgo);

  if (usageError) {
    console.error("Error fetching usage data:", usageError);
    throw createError({
      statusCode: 500,
      statusMessage: "Could not retrieve usage data",
    });
  }

  if (typeof count !== "number") {
    throw createError({
      statusCode: 500,
      statusMessage: "Could not determine usage count",
    });
  }

  if (count >= rateLimitSettings.daily_limit) {
    throw createError({
      statusCode: 429,
      statusMessage:
        "Daily generation limit reached. Please upgrade your plan.",
    });
  }

  const config = useRuntimeConfig();

  if (!config.openaiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "OpenAI API key not configured",
    });
  }

  const body = await readBody<RequestBody>(event);

  if (!body.context?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "Context is required",
    });
  }

  if (!body.type) {
    throw createError({
      statusCode: 400,
      statusMessage: "Type is required",
    });
  }

  try {
    // Build system prompt
    const systemPrompt = `You are a social media strategist and copywriter specialized in Twitter/X. 
Your job is to write tweet or reply that is concise, engaging, and tailored for the Twitter audience. 
Use clear hooks, don't waste words, and aim for maximum impact in minimal characters.

Write in the same language as the context provided by the user. Use a natural voice and avoid sounding like an AI.`;

    // Build user instructions
    let userInstructions = "";
    if (body.tone) {
      userInstructions += `Tone: ${body.tone}\n`;
    }
    if (body.formatInstructions) {
      userInstructions += `Format: ${body.formatInstructions}\n`;
    }
    if (body.audience) {
      userInstructions += `Audience: ${body.audience}\n`;
    }

    // Prepare OpenAI request
    const openAIPayload: OpenAIRequest = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: userInstructions
            ? `${body.context}\n\n${userInstructions}`
            : body.context,
        },
      ],
      max_tokens: body.maxTokens || 500,
      temperature: body.temperature || 0.7,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };

    // Make request to OpenAI
    const response = await $fetch<OpenAIResponse>(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.openaiApiKey}`,
        },
        body: openAIPayload,
      }
    );

    const aiResponse =
      response.choices[0]?.message?.content || "No response generated";

    // Insert usage record
    const { error: insertError } = await supabase.from("openai_usage").insert({
      user_id: user.id,
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to record usage. Please try again later.",
      });
    }

    return {
      content: aiResponse.replace(/^["']|["']$/g, ""),
    };
  } catch (error: any) {
    console.error("OpenAI API error:", error);

    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || "Failed to generate content",
    });
  }
});
