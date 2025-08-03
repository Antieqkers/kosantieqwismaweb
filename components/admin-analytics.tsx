"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, TrendingDown, Users, Eye, MessageSquare, Clock, Target } from "lucide-react"

interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
  avgSessionDuration: number
  totalBookings: number
  conversionRate: number
}

interface AdminAnalyticsProps {
  data: AnalyticsData[]
  totalRooms: number
  totalTestimonials: number
  totalBookings: number
}

export default function AdminAnalytics({ data, totalRooms, totalTestimonials, totalBookings }: AdminAnalyticsProps) {
  const latestData = data[0] || {
    pageViews: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    totalBookings: 0,
    conversionRate: 0,
  }

  const previousData = data[1] || latestData

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const stats = [
    {
      title: "Page Views",
      value: latestData.pageViews.toLocaleString(),
      change: calculateChange(latestData.pageViews, previousData.pageViews),
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Unique Visitors",
      value: latestData.uniqueVisitors.toLocaleString(),
      change: calculateChange(latestData.uniqueVisitors, previousData.uniqueVisitors),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Avg. Session",
      value: formatDuration(latestData.avgSessionDuration),
      change: calculateChange(latestData.avgSessionDuration, previousData.avgSessionDuration),
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Conversion Rate",
      value: `${latestData.conversionRate.toFixed(1)}%`,
      change: calculateChange(latestData.conversionRate, previousData.conversionRate),
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const contentStats = [
    {
      title: "Total Kamar",
      value: totalRooms,
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Testimoni",
      value: totalTestimonials,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Booking",
      value: totalBookings,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Bounce Rate",
      value: `${latestData.bounceRate.toFixed(1)}%`,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Website Analytics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.change > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${stat.change > 0 ? "text-green-600" : "text-red-600"}`}>
                        {Math.abs(stat.change).toFixed(1)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs yesterday</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Content Statistics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentStats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Eye className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New page view record</p>
                  <p className="text-xs text-gray-600">Homepage received 50+ views in last hour</p>
                </div>
              </div>
              <Badge variant="secondary">1h ago</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New booking inquiry</p>
                  <p className="text-xs text-gray-600">Customer interested in Kamar Deluxe</p>
                </div>
              </div>
              <Badge variant="secondary">2h ago</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Content updated</p>
                  <p className="text-xs text-gray-600">Hero section was modified</p>
                </div>
              </div>
              <Badge variant="secondary">3h ago</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
