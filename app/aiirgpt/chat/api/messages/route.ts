import { NextResponse } from 'next/server';
import { getMessagesByChatId, saveMessages } from '@/lib/db/queries';
import { generateUUID } from '@/lib/utils';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('id');

    if (!chatId) {
        return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
    }

    try {
        const messages = await getMessagesByChatId({ id: chatId });
        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { chatId, newMessage } = await request.json();

    if (!chatId || !newMessage) {
        return NextResponse.json({ error: 'Chat ID and message content are required' }, { status: 400 });
    }

    try {
        // Create a new message object
        const message = {
            chatId: chatId,  // Include the chatId
            id: generateUUID(),  // Generate a unique ID for the message
            role: 'user',  // Role of the sender (could be 'user' or 'assistant')
            parts: [{ type: 'text', text: newMessage }],  // Include the message content
            createdAt: new Date(),  // Timestamp for the message
            attachments: []  // Handle attachments if needed
        };

        // Save the message to the database (note: pass an array of messages)
        await saveMessages({
            messages: [message],  // Ensure the messages property is an array
        });
        return NextResponse.json({ message: 'Message saved successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }
}
