import { useState, useEffect, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper, ChevronRight, ChevronDown } from "lucide-react";
import ChatApi from "@/lib/api/chat.api";
import UserApi from "@/lib/api/user.api";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

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
    const [sortedSessions, setSortedSessions] = useState<{ [key: string]: ChatSession[] }>({
        today: [],
        thisWeek: [],
        lastWeek: [],
        thisMonth: [],
        rest: [],
    });

    const [selectedSession, setSelectedSession] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    const sections = useMemo(() => [
        { label: "Today", key: "today" },
        { label: "This Week", key: "thisWeek" },
        { label: "Last Week", key: "lastWeek" },
        { label: "This Month", key: "thisMonth" },
        { label: "Older", key: "rest" },
    ], []);

    useEffect(() => {
        const fetchChatSessions = async () => {
            if (!user) return;

            try {
                setIsLoading(true);
                const userApi = new UserApi();
                const chatApi = new ChatApi();

                const companyUser = await userApi.getClientByEmail(user.email);
                setCompanyUserId(companyUser._id);

                const today: ChatSession[] = [];
                const thisWeek: ChatSession[] = [];
                const lastWeek: ChatSession[] = [];
                const thisMonth: ChatSession[] = [];
                const rest: ChatSession[] = [];

                const now = new Date();
                const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const startOfWeek = new Date(startOfToday);
                startOfWeek.setDate(startOfWeek.getDate() - startOfToday.getDay());

                const startOfLastWeek = new Date(startOfWeek);
                startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

                if (companyUser._id) {
                    const pastSessions = await chatApi.getAllChat({ id: companyUser._id });

                    pastSessions.data.forEach((chat: ChatSession) => {
                        const createdAt = new Date(chat.createdAt);

                        if (createdAt >= startOfToday) {
                            today.push(chat);
                        } else if (createdAt >= startOfWeek) {
                            thisWeek.push(chat);
                        } else if (createdAt >= startOfLastWeek) {
                            lastWeek.push(chat);
                        } else if (createdAt >= startOfMonth) {
                            thisMonth.push(chat);
                        } else {
                            rest.push(chat);
                        }
                    });

                    const sortByRecent = (arr: ChatSession[]) =>
                        arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                    const sortedSessions = {
                        today: sortByRecent(today),
                        thisWeek: sortByRecent(thisWeek),
                        lastWeek: sortByRecent(lastWeek),
                        thisMonth: sortByRecent(thisMonth),
                        rest: sortByRecent(rest),
                    };


                    console.log("in past tsx - sortedSessions are ", sortedSessions)


                    setSortedSessions(sortedSessions);
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
        router.push(`/ai-doc-builder/press-release?chatSessionId=${sessionId}`);
    };

    // State to track which sections are expanded/collapsed
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        today: true,
        thisWeek: false,
        lastWeek: false,
        thisMonth: false,
        rest: false,
    });


    useEffect(() => {
        if (Object.keys(sortedSessions).length > 0) {
            setOpenSections((prev) => {
                const updatedSections = { ...prev };

                sections.forEach(({ key }) => {
                    if (!(key in updatedSections)) {
                        updatedSections[key] = false; // Ensure missing keys are added as false
                    }
                });

                return updatedSections;
            });
        }
    }, [sortedSessions, sections]);

    const toggleSection = (key: string) => {
        setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    if (loading || isLoading) {
        return <p className="text-center">Loading chat sessions...</p>;
    }

    if (Object.values(sortedSessions).every((group) => group.length === 0)) {
        return <p className="text-center">No past chat sessions found.</p>;
    }

    return (
        <ScrollArea className="h-[calc(100vh-16rem)] px-4">
            {sections.map(({ label, key }) => {
                const chats = sortedSessions[key];
                if (!chats?.length) return null;

                return (
                    <div key={key} className="mb-6">
                        {/* Section Header with Expand/Collapse Toggle */}
                        <div
                            className="flex justify-between items-center cursor-pointer bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                            onClick={() => toggleSection(key)}
                        >
                            <h2 className="text-md font-semibold text-[#1B2559] uppercase tracking-wide">
                                {label}
                            </h2>
                            {openSections[key] ? (
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            ) : (
                                <ChevronRight className="h-5 w-5 text-gray-600" />
                            )}
                        </div>

                        {/* Chat Cards (Collapsible Content) */}
                        {openSections[key] && (
                            <div className="mt-2 space-y-3">
                                {chats.map((session) => (
                                    <Card
                                        key={session._id}
                                        className={`cursor-pointer transition-transform transform hover:scale-[1.02] rounded-lg shadow-sm border ${selectedSession === session._id ? "bg-gray-100 border-gray-300" : "bg-white"
                                            }`}
                                        onClick={() => handleSelectSession(session._id)}
                                    >
                                        <CardContent className="p-4 flex justify-between items-center">
                                            {/* Left: Icon & Title */}
                                            <div className="flex items-center space-x-3 overflow-hidden w-full">
                                                <Newspaper className="h-5 w-5 text-[#2563EB] flex-shrink-0" /> {/* 🔵 Keeps icon fixed */}
                                                <h3 className="font-medium text-[#1B2559] w-full overflow-hidden break-words line-clamp-2">
                                                    {session.chatName}
                                                </h3>
                                            </div>

                                            {/* Right: Date & Chevron */}
                                            <div className="flex items-center space-x-2 flex-shrink-0">
                                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                                    {new Date(session.updatedAt).toLocaleDateString(undefined, {
                                                        weekday: "short",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                            </div>
                                        </CardContent>

                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </ScrollArea>
    );
};
