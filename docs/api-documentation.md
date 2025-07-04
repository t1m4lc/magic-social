# AI Content Generation API

## Overview

This API endpoint securely handles OpenAI requests for generating social media content, keeping your API key protected on the server.

## Endpoint

**URL:** `/api/ai/generate`  
**Method:** `POST`  
**Content-Type:** `application/json`

## Environment Setup

Add this to your `.env` file:

```bash
NUXT_OPENAI_API_KEY=your_openai_api_key_here
```

## Request Format

### Request Body

```json
{
  "context": "string (required)",
  "tone": "string (optional)",
  "audience": "string (optional)", 
  "formatInstructions": "string (optional)",
  "model": "string (optional, default: 'gpt-4o-mini')",
  "maxTokens": "number (optional, default: 500)",
  "temperature": "number (optional, default: 0.7)"
}
```

### Parameters

- **context** (required): The main content/prompt for generation
- **tone** (optional): Tone style (`"professional"`, `"casual"`, `"witty"`, `"friendly"`, `"authoritative"`, `"empathetic"`)
- **audience** (optional): Target audience description
- **formatInstructions** (optional): Specific formatting requirements
- **model** (optional): OpenAI model to use (default: `"gpt-4o-mini"`)
- **maxTokens** (optional): Maximum tokens in response (default: 500)
- **temperature** (optional): Creativity level 0.0-1.0 (default: 0.7)

## Response Format

### Success Response (200)

```json
{
  "content": "Generated content string",
  "usage": {
    "total_tokens": 150,
    "prompt_tokens": 100,
    "completion_tokens": 50
  }
}
```

### Error Responses

**400 Bad Request**
```json
{
  "statusCode": 400,
  "statusMessage": "Context is required"
}
```

**500 Internal Server Error**
```json
{
  "statusCode": 500,
  "statusMessage": "OpenAI API key not configured"
}
```

## Chrome Extension Implementation

Replace your existing OpenAI implementation with this code:

```javascript
// Configuration
const API_BASE_URL = 'https://your-domain.com'; // Replace with your actual domain

// Main function to call the API
export const callOpenAI = async (context, tone) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context,
        tone,
        // Add other parameters as needed from your existing functions
        formatInstructions: await getFormatInstructions(),
        audience: await getAudience(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.statusMessage || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Keep your existing helper functions unchanged
export const buildTwitterContext = (socialMediaContext, additionalContext) => {
  // ...existing implementation unchanged...
};

// Updated backward compatibility wrappers
export const callOpenAIForTwitter = async (tweetText, commentText, additionalContext, tone) => {
  const socialMediaContext = {
    type: commentText ? "reply" : "tweet",
    originalTweet: tweetText,
    commentText,
    userInput: additionalContext,
  };

  const context = buildTwitterContext(socialMediaContext);
  return callOpenAI(context, tone);
};

export const callOpenAIForTwitterReply = async (tweetText, commentText, additionalContext) => {
  const socialMediaContext = {
    type: commentText ? "comment-reply" : "reply",
    originalTweet: tweetText,
    commentText,
    userInput: additionalContext,
  };

  const context = buildTwitterContext(socialMediaContext);
  return callOpenAI(context);
};

export const callOpenAIForTwitterReplyWithTone = async (tone, tweetText, commentText, additionalContext) => {
  const socialMediaContext = {
    type: commentText ? "comment-reply" : "reply",
    originalTweet: tweetText,
    commentText,
    userInput: additionalContext,
  };

  const context = buildTwitterContext(socialMediaContext);
  return callOpenAI(context, tone);
};
```

## Usage Examples

### Basic Tweet Generation

```javascript
const content = await callOpenAI("Generate a tweet about AI productivity tools");
```

### Tweet with Tone

```javascript
const content = await callOpenAI(
  "Generate a tweet about remote work benefits", 
  "professional"
);
```

### Full Configuration

```javascript
const response = await fetch(`${API_BASE_URL}/api/ai/generate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    context: "Generate a reply to a tweet about climate change",
    tone: "empathetic",
    audience: "environmental advocates", 
    formatInstructions: "Keep under 280 characters",
    temperature: 0.8
  })
});

const data = await response.json();
console.log(data.content);
```

### Using with Chrome Extension Context

```javascript
// Example with your existing social media context
const socialMediaContext = {
  type: "reply",
  originalTweet: "AI is changing everything!",
  userInput: "I want to add my perspective on AI adoption"
};

const context = buildTwitterContext(socialMediaContext);
const generatedReply = await callOpenAI(context, "friendly");
```

## Security Notes

- Your OpenAI API key stays secure on your server
- No API keys are exposed to the Chrome extension
- All requests go through your server endpoint
- CORS headers may need to be configured for Chrome extension access

## Migration Steps

1. Replace your existing `callOpenAI` function with the new implementation
2. Update your API_BASE_URL to point to your deployed server
3. Keep all your existing helper functions (`buildTwitterContext`, etc.)
4. All backward compatibility wrappers remain functional
5. Test the new endpoint with your existing Chrome extension code

The new implementation maintains the same function signatures and behavior while securely proxying requests through your server.
