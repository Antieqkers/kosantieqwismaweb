"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus, Trash2, Edit } from "lucide-react"

interface ScheduledContent {
  id: number
  content_type: string
  content_data: any
  scheduled_at: string
  status: string
  created_at: string
}

interface AdminSchedulerProps {
  scheduledContent: ScheduledContent[]
}

export default function AdminScheduler({ scheduledContent }: AdminSchedulerProps) {
  const [showForm, setShowForm] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "published":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "room":
        return "🏠"
      case "testimonial":
        return "⭐"
      case "gallery":
        return "📸"
      case "hero":
        return "🎯"
      default:
        return "📄"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Content Scheduler</h3>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Content
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule New Content</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Content Type</Label>
                  <select
                    name="contentType"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2"
                  >
                    <option value="room">Room</option>
                    <option value="testimonial">Testimonial</option>
                    <option value="gallery">Gallery Item</option>
                    <option value="hero">Hero Section</option>
                  </select>
                </div>
                <div>
                  <Label>Schedule Date & Time</Label>
                  <Input name="scheduledAt" type="datetime-local" className="mt-2" />
                </div>
              </div>
              <div>
                <Label>Content Data (JSON)</Label>
                <Textarea
                  name="contentData"
                  placeholder='{"title": "New Room", "price": "Rp 1.000.000"}'
                  className="mt-2"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Schedule Content
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {scheduledContent.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No scheduled content found</p>
              <p className="text-sm text-gray-400">Schedule content to publish automatically</p>
            </CardContent>
          </Card>
        ) : (
          scheduledContent.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getContentTypeIcon(item.content_type)}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 capitalize">{item.content_type} Content</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(item.scheduled_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(item.scheduled_at).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">Content Preview:</p>
                  <pre className="text-xs text-gray-800 mt-1 overflow-x-auto">
                    {JSON.stringify(item.content_data, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
