import OpenAI from "openai";
const client = new OpenAI();

import {
  UIMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
  updateChatVisiblityById,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentMessageMemory,
  getMostRecentUserMessage,
  getTrailingMessageId,
} from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { isProductionEnvironment } from '@/lib/constants';
import { myProvider } from '@/lib/ai/providers';
import { cookies } from "next/headers";
import { INTERNET_CHAT_MODEL, PRIVATE_CHAT_MODEL } from "@/lib/ai/models";
import { extractTextFromFile } from "@/lib/ai/tools/readAttachmentDoc";

import { useAuth } from "@/lib/auth-context"
import UserApi from "@/lib/api/user.api"

export const maxDuration = 60;

const MODELS_SUPPORTING_TOOLS = [
  'gpt-4-turbo',
  'gpt-4-1106-preview',
  'gpt-4-vision-preview',
];

const MODELS_SUPPORTING_TEMPERATURE = [
  'gpt-4-turbo',
  'gpt-4-1106-preview',
  'gpt-4',
  'gpt-3.5-turbo',
];

const HIGH_COST_MODELS = ['gpt-4o-mini-search-preview', 'chat-model-large'];

// Correcting the typo and ensuring proper usage
async function handleChatVisibility(selectedChatModelFromCookie: string, id: string) {
  let visibility: 'private' | 'public';

  // Set visibility based on the selected model
  if (selectedChatModelFromCookie === PRIVATE_CHAT_MODEL) {
    visibility = 'private';
  } else if (selectedChatModelFromCookie === INTERNET_CHAT_MODEL) {
    visibility = 'public';
  } else {
    // Default visibility if needed
    visibility = 'private';
  }

  // Update visibility in the database
  await updateChatVisiblityById({ chatId: id, visibility });
}


export async function POST(request: Request) {
  try {
    console.log('Received POST request');

    const {
      id,
      messages,
      selectedChatModel,
    }: {
      id: string;
      messages: Array<UIMessage>;
      selectedChatModel: string;
    } = await request.json();

    console.log('Parsed request body:', { id, selectedChatModel });

    // Read the selectedChatModel from cookies
    const cookieStore = await cookies();
    const selectedChatModelCookie = cookieStore.get('chat-model');
    const selectedChatModelFromCookie = selectedChatModelCookie?.value || PRIVATE_CHAT_MODEL

    const { user, loading } = useAuth()
    
    console.log("Model from cookie:", selectedChatModelFromCookie);

    let visbility

    if (selectedChatModelFromCookie === PRIVATE_CHAT_MODEL) {
      visbility = 'private'
    } else if (selectedChatModelFromCookie === INTERNET_CHAT_MODEL) {
      visbility = 'public'
    }

    await handleChatVisibility(selectedChatModelFromCookie, id)

    if (!user) {
      console.log('Unauthorized request');
      return new Response('Unauthorized', { status: 401 });
    }

    const userMessage = getMostRecentUserMessage(messages);
    console.log('Most recent user message:', userMessage);

    if (!userMessage) {
      return new Response('No user message found', { status: 400 });
    }

    const messageMemory = getMostRecentMessageMemory(messages);
    console.log('Most recent message context:', messageMemory);

    // Format the messageMemory array into a readable string
    const formattedMessageMemory = messageMemory
      .map((msg) => `Role: ${msg.role}\nContent: ${msg.content}\n`) // Format each message
      .join("\n"); // Join all formatted messages with a newline separator

    const chat = await getChatById({ id });
    console.log('Fetched chat');

    if (!chat) {
      console.log('Chat not found, creating a new one.');
      const title = await generateTitleFromUserMessage({
        message: userMessage,
      });
      //console.log('Generated title:', title);

      await saveChat({ id, userId: user._id, title });
    } else {
      if (chat.userId !== user._id) {
        console.log('User ID does not match chat owner, unauthorized');
        return new Response('Unauthorized', { status: 401 });
      }
    }

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: userMessage.id,
          role: 'user',
          parts: userMessage.parts,
          attachments: userMessage.experimental_attachments ?? [],
          createdAt: new Date(),
        },
      ],
    });
    console.log('User message saved to DB');

    let messageContent = `${userMessage.content}`;

    if (userMessage.experimental_attachments && userMessage.experimental_attachments.length > 0) {
      // Prepare the user message with the attachment URL included
      const attachmentUrls = userMessage.experimental_attachments?.map((attachment) => {
        return `Document available at: ${attachment.url}`;
      });

      console.log("userMessage.experimental_attachments is ", userMessage.experimental_attachments)

      const attachmentUrl = userMessage.experimental_attachments[0].url

      console.log("attachmentUrl is ", attachmentUrl)

      try {
        // Assuming you extract text from the document (docx in this case) externally
        const extractedText = await extractTextFromFile(attachmentUrl);  // Fetch text from the URL

        // Append the extracted text from the document to the user message
        messageContent = `${userMessage.content}\n\nDocument content:\n\n${extractedText}`;
      } catch (error) {
        console.error('Error extracting text from the file:', error);
        messageContent = `${userMessage.content}\n\nDocument content:\n\n Error extracting text from the file:`;
      }
    } else {
      messageContent = `${userMessage.content}`;
    }

    messageContent = messageContent + `\n\nPast Messages exchanged for content are:\n\n${formattedMessageMemory}`;

    console.log('messageContent sent to the model :', messageContent);

    let modelActual = ""
    let webSearchOptions

    if (HIGH_COST_MODELS.includes(selectedChatModelFromCookie)) {
      modelActual = "gpt-4o-mini-search-preview"
      webSearchOptions = {};  // Add the web_search_options for high-cost models
    } else {
      modelActual = "gpt-4o-mini"
      webSearchOptions = undefined;  // No web_search_options for non-high-cost models
    }

    console.log(`Actual chat model is ${modelActual}`);

    //    if (HIGH_COST_MODELS.includes(selectedChatModel)) {
    const completion = await client.chat.completions.create({
      model: modelActual,
      web_search_options: webSearchOptions,  // Only included if it's a high-cost model
      messages: [{
        "role": "user",
        "content": messageContent
      }],
    });

    //console.log('model response:', completion.choices[0].message.content);

    // Add the AI response to the messages
    const aiMessage = {
      id: generateUUID(),
      role: 'assistant',
      parts: [{ type: 'text', text: completion.choices[0].message.content }],
      createdAt: new Date(),
      attachments: userMessage.experimental_attachments ?? [],
    };

    // Save AI response to the database
    await saveMessages({
      messages: [
        {
          chatId: id,
          id: aiMessage.id,
          role: aiMessage.role,
          parts: aiMessage.parts,
          createdAt: aiMessage.createdAt,
          attachments: aiMessage.attachments
        },
      ],
    });

    // Return the new message array with the AI response added
    return new Response(
      JSON.stringify({
        messages: [
          ...messages,
          aiMessage, // Append the AI message to the list of messages
        ]
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
    //    } 
    /*    
        else {
          const supportsTools = MODELS_SUPPORTING_TOOLS.includes(selectedChatModel);
          console.log(`Model ${selectedChatModel} supports tools:`, supportsTools);
    
          const supportsTemperature = MODELS_SUPPORTING_TEMPERATURE.includes(selectedChatModel);
          console.log(`Model ${selectedChatModel} supports temperature:`, supportsTemperature);
    
          const streamConfig: any = {
            model: myProvider.languageModel(selectedChatModel),
            system: systemPrompt({ selectedChatModel }),
            messages,
            maxSteps: 5,
            experimental_activeTools: supportsTools
              ? ['getWeather', 'createDocument', 'updateDocument', 'requestSuggestions']
              : [],
            experimental_transform: smoothStream({ chunking: 'word' }),
            experimental_generateMessageId: generateUUID,
          };
    
          if (supportsTemperature) {
            streamConfig.temperature = 0.7;
          }
    
          return createDataStreamResponse({
            execute: async (dataStream: any) => {
              try {
                console.log('Executing data stream response');
                const result = streamText(streamConfig);
    
                if (!result.baseStream) {
                  throw new Error('Base stream is missing!');
                }
    
                console.log('Consuming stream now...');
                result.consumeStream();
                console.log('Stream consumed successfully');
    
                console.log('Merging data stream now...');
                result.mergeIntoDataStream(dataStream, {
                  sendReasoning: true,
                });
                console.log('Data stream merged successfully');
              } catch (error) {
                console.error('Error in data stream execution:', error);
                throw error;
              }
            },
            onError: (error) => {
              console.error('Error occurred in data stream response:', error);
              return 'Oops, an error occurred!';
            },
          });
        }   
    */
  } catch (error) {
    console.error('An error occurred while processing request:', error);
    return new Response('An error occurred while processing your request!', {
      status: 404,
    });
  }
}
