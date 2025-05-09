"use client"

import { Newspaper } from "lucide-react"
import { useEffect, useState } from "react"
import { formatDistanceToNow, parseISO } from "date-fns"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { NewsItem, NewsSectionProps } from "@/lib/types"
import { toast } from "react-toastify"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

import TwitterApi from "@/lib/api/twitter.api"
import OpenAiApi from "@/lib/api/openApi.api"
import { useAuth } from "@/lib/auth-context"
import UserApi from "@/lib/api/user.api"

const ITEMS_PER_PAGE = 10
const userApi = new UserApi()

function NewsSection({ data, isLoading = false, isTwitterConnected = false, isLinkedInConnected = false }: NewsSectionProps) {
    const { user, loading } = useAuth()
    
    const [currentPage, setCurrentPage] = useState(1)

    const NewsItemSkeleton = () => (
        <div className="flex flex-col gap-2 animate-pulse p-4 border-b last:border-b-0">
            <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-5 w-full" />
        </div>
    )

    const NewsItem = ({ item }: { item: NewsItem }) => {
        const formattedTime = formatDistanceToNow(parseISO(item.time), { addSuffix: true })

        const socialImage = "generate-post.png"

        const [isModalOpen, setIsModalOpen] = useState(false)
        const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
        const [generatedPosts, setGeneratedPosts] = useState<{ platform: string, post: string }[]>([])
        const [currentPostIndex, setCurrentPostIndex] = useState(0)

        const openAiApi = new OpenAiApi();
        const twitterApi = new TwitterApi();

        // Mock social media accounts
        const socialAccounts = [
            { id: "Twitter", name: "Twitter" }
            //{ id: "LinkedIn", name: "LinkedIn" },
        ]

        const toggleAccountSelection = (id: string) => {
            setSelectedAccounts((prev) =>
                prev.includes(id) ? prev.filter((acc) => acc !== id) : [...prev, id]
            )
        }

        const handleGeneratePost = async () => {
            if (selectedAccounts.length === 0) {
                toast.info("Please select at least one social media account.")
                return
            }

            try {
                // Generate posts asynchronously
                const posts = await Promise.all(
                    selectedAccounts.map(async (platform) => {
                        const post = await generateSocialMediaPost(platform, item.title, item.link);
                        return { platform, post };
                    })
                );

                setGeneratedPosts(posts);
                setCurrentPostIndex(0); // Reset to first post
            } catch (error) {
                toast.error("Error generating posts. Please try again.");
            }
        }


        const handleApprovePost = async () => {
            const { platform, post } = generatedPosts[currentPostIndex];

            toast.info(`Publishing post on ${platform}...`);

            try {

                // Call the respective API to publish the post
                if (platform === "Twitter") {
                    console.log("Publishing on Twitter:", post);

                    await twitterApi.publishPost(post, user?._id);
                } else if (platform === "LinkedIn") {
                    // Placeholder API call for LinkedIn (implement if needed)
                    console.log("Publishing on LinkedIn:", post);
                    // await linkedInApi.publishPost(post);
                }

                toast.info(`Post approved and published on  ${platform}!`)

                if (currentPostIndex < generatedPosts.length - 1) {
                    setCurrentPostIndex(currentPostIndex + 1) // Move to next post
                } else {
                    setIsModalOpen(false) // Close modal after the last post
                }
            } catch (error) {
                console.error("Error publishing post:", error);
                toast.error("Failed to publish post.");
            } 
        }

        async function generateSocialMediaPost(platform: string, itemTitle: string, itemLink: string) {

            const system_prompt = "You are an AI that crafts engaging social media posts based on news headlines and news links.";
            const userMessage = `Generate a catchy social media post for ${platform} based on this news link: ${itemLink}. Include a call to action and the link: ${itemLink}`;

            const response = await openAiApi.completion(
                [
                    { role: "system", content: system_prompt },
                    { role: "user", content: userMessage },
                ],
                userMessage,
            );

            const socialMediaPost =
                response?.data.choices[0].message.content;

            return socialMediaPost;
        }


        return (
            <div className="group p-4 border-b last:border-b-0 transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1.5">
                    <span className="font-medium">{item.source}</span>
                    <span>•</span>
                    <time dateTime={item.time}>{formattedTime}</time>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block font-medium text-primary group-hover:text-primary/80 transition-colors flex-1"
                    >
                        {item.title}
                    </a>
                    {isTwitterConnected && (
                        <img
                            src={`/${socialImage}`}
                            alt="Generate Social Media Post"
                            className="w-auto h-auto max-w-[130px] max-h-[50px] object-contain rounded cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setIsModalOpen(true)}
                        />
                    )}
                </div>

                {/* Modal Overlay */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Select Social Media Accounts</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                            {socialAccounts.map((account) => (
                                <div key={account.id} className="flex items-center gap-2">
                                    <Checkbox
                                        id={account.id}
                                        checked={selectedAccounts.includes(account.id)}
                                        onCheckedChange={() => toggleAccountSelection(account.id)}
                                    />
                                    <label htmlFor={account.id} className="text-sm">
                                        {account.name}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {generatedPosts.length > 0 ? (
                            <>
                                {/* Platform Title Outside */}
                                <strong className="block mb-2">
                                    Post for {generatedPosts[currentPostIndex].platform}:
                                </strong>

                                {/* Post Content */}
                                <div className="mt-4 p-4 border rounded-md bg-gray-100 text-sm">
                                    <p className="mt-2">{generatedPosts[currentPostIndex].post}</p>
                                </div>
                            </>) : (
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={handleGeneratePost}>
                                    Generate Post
                                </Button>
                            </div>
                        )}

                        <DialogFooter className="flex justify-end gap-2">
                            {generatedPosts.length > 0 && (
                                <>
                                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" onClick={handleApprovePost}>
                                        {currentPostIndex < generatedPosts.length - 1
                                            ? "Approve Post & Next"
                                            : "Approve Post"}
                                    </Button>
                                </>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    const PaginationControls = ({ totalItems }: { totalItems: number }) => {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
        const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1
        const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems)

        return (
            <div className="flex items-center justify-between border-t pt-4 mt-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                    Showing {startItem}-{endItem} of {totalItems}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        )
    }

    const getCurrentPageItems = (items: NewsItem[]) => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        return items.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }

    if (isLoading) {
        return (
            <div className="divide-y">
                {Array.from({ length: 3 }).map((_, i) => (
                    <NewsItemSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (!data.length) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <Newspaper className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-lg font-medium">No News Available</p>
                <p className="text-sm text-muted-foreground">Check back later for updates</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="divide-y rounded-md border">
                {getCurrentPageItems(data).map((item, index) => (
                    <NewsItem key={index} item={item} />
                ))}
            </div>
            <PaginationControls totalItems={data.length} />
        </div>
    )
}

export default NewsSection
