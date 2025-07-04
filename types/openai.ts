export interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  max_tokens: number;
  temperature: number;
  frequency_penalty: number;
  presence_penalty: number;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

export type ToneStyle =
  | "professional"
  | "casual"
  | "witty"
  | "friendly"
  | "authoritative"
  | "empathetic";

export interface SocialMediaContext {
  type: "tweet" | "reply" | "comment-reply";
  originalTweet?: string;
  commentText?: string;
  userInput?: string;
  composeContent?: string;
}
