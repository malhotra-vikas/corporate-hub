"use client"

import { format, parseISO } from "date-fns"
import { CalendarPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { EarningsCalendarProps, EarningsEvent } from "@/lib/types"


export function EarningsCalendar({ events, isLoading = false }: EarningsCalendarProps) {

    console.log("XXX Events ", events)
    const sortedEvents = [...events]
        // Group by symbol and get most recent date
        .reduce((acc, event) => {
            const existingEvent = acc.find((e) => e.symbol === event.symbol)
            if (!existingEvent || new Date(event.fiscalDateEnding) > new Date(existingEvent.fiscalDateEnding)) {
                const filtered = acc.filter((e) => e.symbol !== event.symbol)
                return [...filtered, event]
            }
            return acc
        }, [] as EarningsEvent[])
        // Sort by date
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    console.log("YYY Events ", sortedEvents)

    const CalendarItem = ({ event }: { event: EarningsEvent }) => {
        const date = parseISO(event.date)
        console.log("EVENT Date is  ", date)

        const month = format(date, "MMM")
        const day = format(date, "d")
        const fullDate = event.time ? format(date, "MMM d, yyyy, h:mm a") : format(date, "MMM d, yyyy")

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
                <CalendarPlus className="h-6 w-6" />
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

