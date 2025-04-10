import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { Chat } from '@/components/aiirgpt/chat';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import { DataStreamHandler } from '@/components/aiirgpt/data-stream-handler';
import { INTERNET_CHAT_MODEL, PRIVATE_CHAT_MODEL } from '@/lib/ai/models';
import { DBMessage } from '@/lib/db/schema';
import { Attachment, UIMessage } from 'ai';

import { useAuth } from "@/lib/auth-context"
import UserApi from "@/lib/api/user.api"

export default async function Page(props: { params: Promise<{ id: string }> }) {
  console.log('Page component is rendering...');
  
  const { user, loading } = useAuth()
  
  const params = await props.params;
  console.log('Resolved params:', params);

  const { id } = params;
  console.log('Chat ID:', id);

  const chat = await getChatById({ id });
  console.log('Fetched chat:', chat);

  if (!chat) {
    console.log('Chat not found, triggering notFound()');
    notFound();
  }

  //const session = await auth();
  //console.log('User session:', session);

  if (chat.visibility === 'private') {
    if (!user) {
      console.log('No valid session found for a private chat, triggering notFound()');
      return notFound();
    }

    if (user._id !== chat.userId) {
      console.log('Session user ID does not match chat owner ID, triggering notFound()');
      return notFound();
    }
  }

  const messagesFromDb = await getMessagesByChatId({ id });
  console.log('Fetched messages from DB:');

  function convertToUIMessages(messages: Array<DBMessage>): Array<UIMessage> {
    console.log('Converting DB messages to UI messages');
    return messages.map((message) => ({
      id: message.id,
      parts: message.parts as UIMessage['parts'],
      role: message.role as UIMessage['role'],
      content: '',
      createdAt: message.createdAt,
      experimental_attachments:
        (message.attachments as Array<Attachment>) ?? [],
    }));
  }

  console.log('Chat visility:', chat.visibility);

  const cookieStore = await cookies();
  //console.log('Retrieved cookies:', cookieStore);

  const chatModelFromCookie = cookieStore.get('chat-model');
  console.log('Chat model from cookie:', chatModelFromCookie);

  if (!chatModelFromCookie) {
    console.log('No chat model found in cookies, using default model.');
    return (
      <>
        <Chat
          id={chat.id}
          initialMessages={convertToUIMessages(messagesFromDb)}
          selectedChatModel={PRIVATE_CHAT_MODEL}
          selectedVisibilityType={"private"}
          isReadonly={user?._id !== chat.userId}
        />
        <DataStreamHandler id={id} />
      </>
    );
  }

  console.log('Using chat model from cookie:', chatModelFromCookie.value);
  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={convertToUIMessages(messagesFromDb)}
        selectedChatModel={chatModelFromCookie.value}
        selectedVisibilityType={chat.visibility}
        isReadonly={user?._id !== chat.userId}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
