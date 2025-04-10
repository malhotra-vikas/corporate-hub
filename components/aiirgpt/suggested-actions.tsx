'use client';

import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { memo } from 'react';

interface SuggestedActionsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'Help me draft a Press Release',
      //label: 'of using Next.js?',
      action: 'Help me draft a Press Release. Ask relevant questions that enables you to build the press release document?',
    },
    {
      title: 'What was the latest earnings for TSLA?',
      //label: `demonstrate djikstra's algorithm`,
      action: `What was the latest earnings for TSLA?`,
    },
    {
      title: 'Summarize this document for me',
      //label: `about silicon valley`,
      action: `Refer to the attached document and summarize its key points to me in various relevant sections`,
    },
    {
      title: 'Who are the key competitors for TSLA?',
//      label: 'in San Francisco?',
      action: 'Who are the key competitors for TSLA?',
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>

          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
