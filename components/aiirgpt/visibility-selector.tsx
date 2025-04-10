'use client';

import { ReactNode, useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import {
  CheckCircleFillIcon,
  ChevronDownIcon,
  GlobeIcon,
  LockIcon,
} from './icons';
import { useChatVisibility } from '@/hooks/use-chat-visibility';
import { updateChatVisiblityById } from '@/lib/db/queries';

export type VisibilityType = 'private' | 'public';

const visibilities: Array<{
  id: VisibilityType;
  label: string;
  description: string;
  icon: ReactNode;
}> = [
    {
      id: 'private',
      label: 'Private',
      description: 'Private chat, that only you can access.',
      icon: <LockIcon />,
    },
    {
      id: 'public',
      label: 'Public',
      description: 'Public chat with access to Internet',
      icon: <GlobeIcon />,
    },
  ];

export function VisibilitySelector({
  chatId,
  className,
  selectedVisibilityType,
}: {
  chatId: string;
  selectedVisibilityType: VisibilityType;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);

  const { visibilityType, setVisibilityType } = useChatVisibility({
    chatId,
    initialVisibility: selectedVisibilityType,
  });

  const selectedVisibility = useMemo(
    () => visibilities.find((visibility) => visibility.id === visibilityType),
    [visibilityType],
  );

  // Function to set cookie based on the visibility selection
  const setVisibilityCookie = (visibility: VisibilityType) => {
    const chatModel = visibility === 'public' ? 'chat-model-large' : 'chat-model-small';
    document.cookie = `chat-model=${chatModel}; path=/;`;
  };

  // Handle visibility change
  const handleVisibilityChange = (visibility: VisibilityType) => {
    if (visibility === 'public') {
      setVisibilityCookie('public'); // Set the cookie to public
    } else {
      setVisibilityCookie('private'); // Set the cookie to private
    }
    setVisibilityType(visibility); // Set visibility to public
    setOpen(false); // Close the dropdown menu
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
          className,
        )}
      >
        <Button
          variant="outline"
          className="hidden md:flex md:px-2 md:h-[34px]"
        >
          {selectedVisibility?.icon}
          {selectedVisibility?.label}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-[300px]">
        {visibilities.map((visibility) => (
          <DropdownMenuItem
            key={visibility.id}
            onSelect={() => {
                handleVisibilityChange(visibility.id);
            }}
            className="gap-4 group/item flex flex-row justify-between items-center"
            data-active={visibility.id === visibilityType}
          >
            <div className="flex flex-col gap-1 items-start">
              {visibility.label}
              {visibility.description && (
                <div className="text-xs text-muted-foreground">
                  {visibility.description}
                </div>
              )}
            </div>
            <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
              <CheckCircleFillIcon />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
