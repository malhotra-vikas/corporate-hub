import BaseApi from "./_baseApi";

const OPEN_AI_KEY = process.env.NEXT_PUBLIC_OPEN_AI_KEY;
const MODEL_DEFAULT = process.env.NEXT_PUBLIC_OPEN_AI_DEFAULT_MODEL;

export default class OpenAiApi extends BaseApi {
  constructor() {
    super();
  }

  async completion(messages: any[], instruction: string, model: string = MODEL_DEFAULT) {
    try {
      const gptModel: string = model || MODEL_DEFAULT; // Ensure `string` type

      console.log("Model being used is ", gptModel)

      const data = await OpenAiApi.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: gptModel,
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
