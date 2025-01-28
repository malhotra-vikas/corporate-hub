import BaseApi from "./_baseApi";

const OPEN_AI_KEY = import.meta.env.VITE_OPEN_AI_KEY;
const MODEL_DEFAULT = import.meta.env.VITE_OPEN_AI_DEFAULT_MODEL;

export default class OpenAiApi extends BaseApi {
  constructor() {
    super();
  }

  async completion(messages: any[], instruction: string) {
    try {
      const data = await OpenAiApi.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: MODEL_DEFAULT,
          top_p: 0.88,
          temperature: 0.7,
          max_completion_tokens: 10000,
          messages: [
            {
              role: "system",
              content: ` ${instruction}`,
            },
            ...messages,
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPEN_AI_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );
      return data;
    } catch (err) {
      console.log("Error in chatgpt api");
    }
  }
}
