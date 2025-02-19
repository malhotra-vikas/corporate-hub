import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, MessageSquare } from "lucide-react";
import ChatApi from "@/lib/api/chat.api";
import UserApi from "@/lib/api/user.api";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation"

interface ChatSession {
    _id: string;
    chat_type: string;
    chatName: string;
    updatedAt: string;
    createdAt: string;
}

interface PastChatSessionsProps {
    onSelectSession: (sessionId: string) => void;
}

export const PastChatSessions: React.FC<PastChatSessionsProps> = ({ onSelectSession }) => {
    const { user, loading } = useAuth();
    const [companyUserId, setCompanyUserId] = useState<string | null>(null);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const router = useRouter()

    useEffect(() => {
        const fetchChatSessions = async () => {
            if (!user) return;

            try {
                const userApi = new UserApi();
                const chatApi = new ChatApi();

                const companyUser = await userApi.getClientByEmail(user.email);
                setCompanyUserId(companyUser._id);

                if (companyUser._id) {
                    const pastSessions = await chatApi.getAllChat({ id: companyUser._id });
                    console.log("in past tsx - pastSessions are ", pastSessions.data)

                    // Sort sessions by `updatedAt` in descending order (most recent first)
                    const sortedSessions = pastSessions.data.sort(
                        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                    );

                    console.log("in past tsx - sortedSessions are ", sortedSessions)


                    setSessions(sortedSessions);
                }
            } catch (error) {
                console.error("Error fetching chat sessions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChatSessions();
    }, [user]);

    const handleSelectSession = (sessionId: string) => {
        setSelectedSession(sessionId);
        onSelectSession(sessionId);
        router.push(`/ai-doc-builder/press-release?chatSessionId=${sessionId}`); // Navigate with session ID
    };

    if (loading || isLoading) {
        return <p className="text-center">Loading chat sessions...</p>;
    }

    if (!sessions.length) {
        return <p className="text-center">No past chat sessions found.</p>;
    }

    return (
        <ScrollArea className="h-[calc(100vh-16rem)]">
            {sessions.map((session) => (
                <Card
                    key={session.id}
                    className={`mb-4 cursor-pointer transition-colors ${selectedSession === session.id ? "bg-secondary" : "bg-white"
                        }`}
                    onClick={() => handleSelectSession(session._id)}
                >
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-[#1B2559]">{session.chatName}</h3>
                            <span className="text-sm text-muted-foreground">{session.updatedAt}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <Button variant="ghost" size="sm" className="px-0 text-[#1B2559]">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                View Chat
                            </Button>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </ScrollArea>
    );
};
