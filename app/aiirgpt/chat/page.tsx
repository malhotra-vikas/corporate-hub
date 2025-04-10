import { cookies } from 'next/headers';

import { Chat } from '@/components/aiirgpt/chat';
import { INTERNET_CHAT_MODEL } from '@/lib/ai/models';
import { PRIVATE_CHAT_MODEL } from '@/lib/ai/models';

import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/aiirgpt/data-stream-handler';
import { VisibilityType } from '@/components/aiirgpt/visibility-selector';

export default async function Page() {
  
  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');

  console.log("In app chat modelIdFromCookie is ", modelIdFromCookie)

  // Determine the selectedVisibilityType based on the cookie value
  let selectedVisibilityType: VisibilityType = "private"; // Default visibility type
  if (modelIdFromCookie) {
    // Set selectedVisibilityType based on cookie value
    if (modelIdFromCookie.value === INTERNET_CHAT_MODEL) {
      selectedVisibilityType = 'public';
    } else if (modelIdFromCookie.value === PRIVATE_CHAT_MODEL) {
      selectedVisibilityType = 'private';
    }
  }

  if (!modelIdFromCookie) {
    return (
      <>
        <Chat
          key={id}
          id={id}
          initialMessages={[]}
          selectedChatModel={PRIVATE_CHAT_MODEL}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={false}
        />
        <DataStreamHandler id={id} />
      </>
    );
  }

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedChatModel={modelIdFromCookie.value}
        selectedVisibilityType={selectedVisibilityType}
        isReadonly={false}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
