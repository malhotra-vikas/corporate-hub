'use client';

import { updateChatVisibility } from '@/app/aiirgpt-deprecated/chat/actions';
import { VisibilityType } from '@/components/aiirgpt/visibility-selector';
import { Chat } from '@/lib/db/schema';
import { useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { useAuth } from '@/lib/auth-context';
import { User } from '@/lib/types';

export function useChatVisibility({
  chatId,
  initialVisibility,
}: {
  chatId: string;
  initialVisibility: VisibilityType;
}) {
  const SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  const { user, loading } = useAuth()

  const userId = user?._id

  console.log("in useChatVisibility, USER is ", user)

  const apiUrl = `${SERVER_URL}/api/aiirgpt/userChatHistory?id=${userId}`;
  console.log("apiUrl is ", apiUrl)

  const { mutate, cache } = useSWRConfig();
  const history: Array<Chat> = cache.get(apiUrl)?.data;

  const { data: localVisibility, mutate: setLocalVisibility } = useSWR(
    `${chatId}-visibility`,
    null,
    {
      fallbackData: initialVisibility,
    },
  );

  const visibilityType = useMemo(() => {
    if (!history) return localVisibility;
    const chat = history.find((chat) => chat.id === chatId);
    if (!chat) return 'private';
    return chat.visibility;
  }, [history, chatId, localVisibility]);

  const setVisibilityType = (updatedVisibilityType: VisibilityType) => {
    setLocalVisibility(updatedVisibilityType);

    mutate<Array<Chat>>(
      '/api/aiirgpt/getChatsByUserId',
      (history) => {
        return history
          ? history.map((chat) => {
              if (chat.id === chatId) {
                return {
                  ...chat,
                  visibility: updatedVisibilityType,
                };
              }
              return chat;
            })
          : [];
      },
      { revalidate: false },
    );

    updateChatVisibility({
      chatId: chatId,
      visibility: updatedVisibilityType,
    });
  };

  return { visibilityType, setVisibilityType };
}
