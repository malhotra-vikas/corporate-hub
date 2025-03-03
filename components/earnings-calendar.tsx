"use client"

import { useEffect, useState } from "react"
import { format, parseISO } from "date-fns"
import { CalendarPlus, CheckCircle } from "lucide-react"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { EarningsCalendarProps, EarningsEvent } from "@/lib/types"
import UserApi from "@/lib/api/user.api"
import { toast } from "react-toastify"
import { useAuth } from "@/lib/auth-context"

export function EarningsCalendar({ events, isLoading = false }: EarningsCalendarProps) {
    const { user, loading } = useAuth()

    if (!user?.email) {
        throw "no user found"
    }

    const userApi = new UserApi()

    // ✅ State to track sent invites
    let [sentInvites, setSentInvites] = useState<{ [symbol: string]: boolean }>({})

    // ✅ Load sent invites from cookies on component mount
    useEffect(() => {
        const storedInvites = Cookies.get("sentInvites")

        console.log("storedInvites are ", storedInvites)
        if (storedInvites) {
            sentInvites = JSON.parse(storedInvites)

            console.log("sentInvites are ", sentInvites)

            setSentInvites(JSON.parse(storedInvites))
        }

    }, [])

    // ✅ Save sent invites to cookies whenever they change
    useEffect(() => {
        Cookies.set("sentInvites", JSON.stringify(sentInvites), { expires: 365 }) // Save for 7 days
    }, [sentInvites])

    console.log("XXX Events ", events)
    const sortedEvents = [...events]
        .reduce((acc, event) => {
            const existingEvent = acc.find((e) => e.symbol === event.symbol)
            if (!existingEvent || new Date(event.fiscalDateEnding) > new Date(existingEvent.fiscalDateEnding)) {
                const filtered = acc.filter((e) => e.symbol !== event.symbol)
                return [...filtered, event]
            }
            return acc
        }, [] as EarningsEvent[])
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    console.log("YYY Events ", sortedEvents)

    const CalendarItem = ({ event }: { event: EarningsEvent }) => {
        const date = parseISO(event.date)
        console.log("EVENT Date is  ", date)

        const month = format(date, "MMM")
        const day = format(date, "d")
        const fullDate = event.time ? format(date, "MMM d, yyyy, h:mm a") : format(date, "MMM d, yyyy")
        console.log("EVENT Full Date is  ", fullDate)

        const sendInvite = async () => {
            try {
                await userApi.sendEarningCalenderInvite({ email: user?.email || "", symbol: event.symbol, date: date })

                // ✅ Update state and store in cookies
                setSentInvites((prev) => ({ ...prev, [event.symbol]: true }))

                toast.success("Calendar invite sent!");
            } catch (error) {
                console.error(error);
                toast.error("Failed to send invite.");
            }
        }

        return (
            <div className="flex items-center gap-4 p-3 border-b last:border-0 group transition-colors">
                <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-lg flex flex-col items-center justify-center text-blue-600">
                    <div className="text-sm font-medium">{month} </div>
                    <div className="text-sm font-medium">{day} </div>
                </div>
                <div className="flex-grow min-w-0">
                    <h3 className="text-sm font-medium">{event.symbol}</h3>
                    <p className="text-sm font-medium">{fullDate}</p>
                </div>
                {sentInvites[event.symbol] ? (
                    <CheckCircle className="h-6 w-6 text-green-500" /> // ✅ Show green checkmark when sent
                ) : (
                    <CalendarPlus className="h-6 w-6 text-[#0196FD] cursor-pointer" onClick={sendInvite} />
                )}
            </div>
        )
    }

    const SkeletonItem = () => (
        <div className="flex items-center gap-4 p-4 border-b last:border-0">
            <Skeleton className="w-16 h-16 rounded-lg" />
            <div className="flex-grow space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="w-8 h-8 rounded-md" />
        </div>
    )

    if (isLoading) {
        return (
            <div className="divide-y rounded-md border">
                {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonItem key={i} />
                ))}
            </div>
        )
    }

    if (!sortedEvents.length) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarPlus className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-lg font-medium">No Earnings Events</p>
                <p className="text-sm text-muted-foreground">No upcoming earnings calls scheduled</p>
            </div>
        )
    }

    return (
        <ScrollArea className="h-[600px] pr-4 -mr-4">
            <div className="divide-y rounded-md border">
                {sortedEvents.map((event, index) => (
                    <CalendarItem key={index} event={event} />
                ))}
            </div>
        </ScrollArea>
    )
}
