"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Home,
  MessageSquare,
  Settings,
  BarChart3,
  LogOut,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  Activity,
  Shield,
  Bell,
} from "lucide-react"
import { logoutAdmin, getResidents } from "@/lib/actions"
import AdminResidents from "./admin-residents"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DashboardStats {
  totalResidents: number
  pendingApplications: number
  activeResidents: number
  inactiveResidents: number
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState<DashboardStats>({
    totalResidents: 0,
    pendingApplications: 0,
    activeResidents: 0,
    inactiveResidents: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const residents = await getResidents()

      const newStats = {
        totalResidents: residents.length,
        pendingApplications: residents.filter((r: any) => r.status === "pending").length,
        activeResidents: residents.filter((r: any) => r.status === "active").length,
        inactiveResidents: residents.filter((r: any) => r.status === "inactive").length,
      }

      setStats(newStats)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      setError("Gagal memuat data dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutAdmin()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, description }: any) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{isLoading ? "..." : value}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <div className={`p-3 rounded-full ${color.replace("text-", "bg-").replace("-600", "-100")}`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-500">ANTIEQ WISMA KOST</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="residents" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Penghuni</span>
            </TabsTrigger>
            <TabsTrigger value="rooms" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Kamar</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Pesan</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Penghuni"
                value={stats.totalResidents}
                icon={Users}
                color="text-blue-600"
                description="Semua penghuni terdaftar"
              />
              <StatCard
                title="Menunggu Persetujuan"
                value={stats.pendingApplications}
                icon={Clock}
                color="text-yellow-600"
                description="Aplikasi pending"
              />
              <StatCard
                title="Penghuni Aktif"
                value={stats.activeResidents}
                icon={UserCheck}
                color="text-green-600"
                description="Penghuni yang aktif"
              />
              <StatCard
                title="Penghuni Tidak Aktif"
                value={stats.inactiveResidents}
                icon={UserX}
                color="text-red-600"
                description="Penghuni tidak aktif"
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Aktivitas Terbaru</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <UserPlus className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Pendaftaran Baru</p>
                        <p className="text-xs text-gray-500">2 jam yang lalu</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <UserCheck className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Penghuni Disetujui</p>
                        <p className="text-xs text-gray-500">5 jam yang lalu</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium">Menunggu Review</p>
                        <p className="text-xs text-gray-500">1 hari yang lalu</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Statistik Bulanan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pendaftaran Bulan Ini</span>
                      <Badge variant="secondary">{stats.pendingApplications + 5}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tingkat Okupansi</span>
                      <Badge variant="secondary">85%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rating Kepuasan</span>
                      <Badge variant="secondary">4.8/5</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Kamar Tersedia</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="residents">
            <AdminResidents />
          </TabsContent>

          <TabsContent value="rooms">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Kamar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Fitur manajemen kamar akan segera hadir...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Pesan & Komunikasi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Fitur pesan akan segera hadir...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Laporan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Fitur analytics akan segera hadir...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Sistem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Fitur pengaturan akan segera hadir...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
