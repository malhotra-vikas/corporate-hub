"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Brain, Zap, TrendingUp, Clock } from "lucide-react"
import CountUp from "react-countup"
import { cn } from "@/lib/utils"

interface Stat {
    value: number
    trend: number
    prefix?: string
    suffix?: string
}

export function StatsDashboard() {
    // In a real app, these would come from an API
    const [stats, setStats] = useState({
        activeUsers: { value: 2547, trend: 12, suffix: "" },
        documentsCreated: { value: 15890, trend: 8, suffix: "" },
        aiActions: { value: 127456, trend: 23, suffix: "" },
        avgTimeReduction: { value: 85, trend: 15, suffix: "%" },
    })

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setStats((prev) => ({
                activeUsers: { ...prev.activeUsers, value: prev.activeUsers.value + Math.floor(Math.random() * 3) },
                documentsCreated: {
                    ...prev.documentsCreated,
                    value: prev.documentsCreated.value + Math.floor(Math.random() * 5),
                },
                aiActions: { ...prev.aiActions, value: prev.aiActions.value + Math.floor(Math.random() * 10) },
                avgTimeReduction: prev.avgTimeReduction,
            }))
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Powering Corporate Communications</h2>
                        <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                            See how AI is transforming document creation and management in real-time
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 mt-12 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Active Users"
                        value={stats.activeUsers}
                        icon={Users}
                        description="Professionals using our platform"
                    />
                    <StatsCard
                        title="Documents Created"
                        value={stats.documentsCreated}
                        icon={FileText}
                        description="Corporate documents generated"
                    />
                    <StatsCard title="AI Actions" value={stats.aiActions} icon={Brain} description="AI-powered improvements" />
                    <StatsCard
                        title="Time Reduction"
                        value={stats.avgTimeReduction}
                        icon={Clock}
                        description="Average time saved per document"
                    />
                </div>

                <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <AIFeatureCard
                        icon={Brain}
                        title="Smart Document Analysis"
                        description="AI analyzes your existing documents to learn your corporate style and terminology"
                    />
                    <AIFeatureCard
                        icon={Zap}
                        title="Instant Drafts"
                        description="Generate first drafts in seconds, not hours, with context-aware AI"
                    />
                    <AIFeatureCard
                        icon={TrendingUp}
                        title="Continuous Learning"
                        description="Our AI models improve with each document, becoming more aligned with your needs"
                    />
                </div>
            </div>
        </section>
    )
}

interface StatsCardProps {
    title: string
    value: Stat
    icon: React.ElementType
    description: string
}

function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
    const prevValueRef = useRef(value.value)

    useEffect(() => {
        prevValueRef.current = value.value
    }, [value.value])

    return (
        <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {value.prefix}
                    <CountUp start={prevValueRef.current} end={value.value} separator="," duration={2} />
                    {value.suffix}
                </div>
                <p className="text-xs text-muted-foreground">{description}</p>
                {value.trend > 0 && (
                    <div className="absolute bottom-2 right-2 flex items-center text-xs text-green-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {value.trend}%
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

interface AIFeatureCardProps {
    icon: React.ElementType
    title: string
    description: string
}

function AIFeatureCard({ icon: Icon, title, description }: AIFeatureCardProps) {
    return (
        <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">{title}</h3>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

