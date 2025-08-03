"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Filter,
  Download,
  Eye,
  UserCheck,
  UserX,
  Trash2,
  Calendar,
  Phone,
  Mail,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import { getResidents, updateResidentStatus, deleteResident, exportResidentsToExcel } from "@/lib/actions"

interface Resident {
  id: number
  full_name: string
  email: string
  phone: string
  id_number: string
  birth_date: string
  gender: string
  occupation: string
  address: string
  emergency_contact_name: string
  emergency_contact_phone: string
  emergency_contact_relation: string
  room_type: string
  move_in_date: string
  contract_duration: number
  monthly_rent: number
  deposit_amount: number
  status: string
  notes: string
  created_at: string
  updated_at: string
}

export default function AdminResidents() {
  const [residents, setResidents] = useState<Resident[]>([])
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadResidents()
  }, [])

  useEffect(() => {
    filterResidents()
  }, [residents, searchTerm, statusFilter])

  const loadResidents = async () => {
    try {
      setIsLoading(true)
      const data = await getResidents()
      setResidents(data)
    } catch (error) {
      console.error("Error loading residents:", error)
      setMessage({ type: "error", text: "Gagal memuat data penghuni" })
    } finally {
      setIsLoading(false)
    }
  }

  const filterResidents = () => {
    let filtered = residents

    if (statusFilter !== "all") {
      filtered = filtered.filter((resident) => resident.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (resident) =>
          resident.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resident.phone.includes(searchTerm),
      )
    }

    setFilteredResidents(filtered)
  }

  const handleStatusUpdate = async (residentId: number, newStatus: string) => {
    try {
      const result = await updateResidentStatus(residentId, newStatus)
      if (result.success) {
        setMessage({ type: "success", text: result.message })
        loadResidents()
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      console.error("Error updating status:", error)
      setMessage({ type: "error", text: "Gagal mengupdate status" })
    }
  }

  const handleDelete = async (residentId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data penghuni ini?")) {
      return
    }

    try {
      const result = await deleteResident(residentId)
      if (result.success) {
        setMessage({ type: "success", text: result.message })
        loadResidents()
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      console.error("Error deleting resident:", error)
      setMessage({ type: "error", text: "Gagal menghapus data penghuni" })
    }
  }

  const handleExport = async () => {
    try {
      const result = await exportResidentsToExcel({
        status: statusFilter,
        searchTerm: searchTerm,
      })

      if (result.success) {
        // Create and download file
        const blob = new Blob([result.data], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", result.filename)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setMessage({ type: "success", text: result.message })
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      console.error("Error exporting data:", error)
      setMessage({ type: "error", text: "Gagal mengekspor data" })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Menunggu" },
      approved: { color: "bg-blue-100 text-blue-800", icon: CheckCircle, label: "Disetujui" },
      active: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Aktif" },
      inactive: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Tidak Aktif" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={`${config.color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("id-ID")
  }

  const formatCurrency = (amount: number) => {
    if (!amount) return "-"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          {message.type === "error" ? (
            <AlertCircle className="h-4 w-4 text-red-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription className={message.type === "error" ? "text-red-700" : "text-green-700"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Data Penghuni</span>
              <Badge variant="secondary">{filteredResidents.length}</Badge>
            </CardTitle>
            <Button onClick={handleExport} className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari nama, email, atau telepon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Kamar</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Daftar</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredResidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Tidak ada data penghuni
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResidents.map((resident) => (
                    <TableRow key={resident.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{resident.full_name}</p>
                          <p className="text-sm text-gray-500">{resident.occupation || "Tidak disebutkan"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="w-3 h-3 mr-1 text-gray-400" />
                            {resident.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="w-3 h-3 mr-1 text-gray-400" />
                            {resident.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{resident.room_type || "Belum ditentukan"}</p>
                          <p className="text-xs text-gray-500">
                            {resident.monthly_rent ? formatCurrency(resident.monthly_rent) : "-"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(resident.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          {formatDate(resident.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedResident(resident)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Detail Penghuni</DialogTitle>
                              </DialogHeader>
                              {selectedResident && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Informasi Pribadi</h4>
                                      <div className="space-y-2 text-sm">
                                        <p>
                                          <strong>Nama:</strong> {selectedResident.full_name}
                                        </p>
                                        <p>
                                          <strong>Email:</strong> {selectedResident.email}
                                        </p>
                                        <p>
                                          <strong>Telepon:</strong> {selectedResident.phone}
                                        </p>
                                        <p>
                                          <strong>No. KTP:</strong> {selectedResident.id_number}
                                        </p>
                                        <p>
                                          <strong>Tanggal Lahir:</strong> {formatDate(selectedResident.birth_date)}
                                        </p>
                                        <p>
                                          <strong>Jenis Kelamin:</strong>{" "}
                                          {selectedResident.gender === "male" ? "Laki-laki" : "Perempuan"}
                                        </p>
                                        <p>
                                          <strong>Pekerjaan:</strong> {selectedResident.occupation || "-"}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">Kontak Darurat</h4>
                                      <div className="space-y-2 text-sm">
                                        <p>
                                          <strong>Nama:</strong> {selectedResident.emergency_contact_name}
                                        </p>
                                        <p>
                                          <strong>Telepon:</strong> {selectedResident.emergency_contact_phone}
                                        </p>
                                        <p>
                                          <strong>Hubungan:</strong> {selectedResident.emergency_contact_relation}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-2">Alamat</h4>
                                    <p className="text-sm">{selectedResident.address}</p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Informasi Kamar</h4>
                                      <div className="space-y-2 text-sm">
                                        <p>
                                          <strong>Tipe Kamar:</strong> {selectedResident.room_type || "-"}
                                        </p>
                                        <p>
                                          <strong>Tanggal Masuk:</strong> {formatDate(selectedResident.move_in_date)}
                                        </p>
                                        <p>
                                          <strong>Durasi Kontrak:</strong>{" "}
                                          {selectedResident.contract_duration
                                            ? `${selectedResident.contract_duration} bulan`
                                            : "-"}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">Informasi Pembayaran</h4>
                                      <div className="space-y-2 text-sm">
                                        <p>
                                          <strong>Sewa Bulanan:</strong> {formatCurrency(selectedResident.monthly_rent)}
                                        </p>
                                        <p>
                                          <strong>Deposit:</strong> {formatCurrency(selectedResident.deposit_amount)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {selectedResident.notes && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Catatan</h4>
                                      <p className="text-sm">{selectedResident.notes}</p>
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between pt-4 border-t">
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Status: {getStatusBadge(selectedResident.status)}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        Terakhir update: {formatDate(selectedResident.updated_at)}
                                      </p>
                                    </div>
                                    <div className="flex space-x-2">
                                      {selectedResident.status === "pending" && (
                                        <Button
                                          size="sm"
                                          onClick={() => handleStatusUpdate(selectedResident.id, "approved")}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          <UserCheck className="w-4 h-4 mr-1" />
                                          Setujui
                                        </Button>
                                      )}
                                      {selectedResident.status === "approved" && (
                                        <Button
                                          size="sm"
                                          onClick={() => handleStatusUpdate(selectedResident.id, "active")}
                                          className="bg-blue-600 hover:bg-blue-700"
                                        >
                                          <UserCheck className="w-4 h-4 mr-1" />
                                          Aktifkan
                                        </Button>
                                      )}
                                      {selectedResident.status === "active" && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleStatusUpdate(selectedResident.id, "inactive")}
                                        >
                                          <UserX className="w-4 h-4 mr-1" />
                                          Nonaktifkan
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(resident.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
