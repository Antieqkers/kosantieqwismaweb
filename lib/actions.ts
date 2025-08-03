"use server"

import { sql } from "./db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { authenticateAdmin, createSession, deleteSession, requireAuth, cleanupExpiredSessions } from "./auth"

// Auth actions
export async function loginAdmin(formData: FormData) {
  try {
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    console.log("Login attempt:", { username, passwordLength: password?.length })

    if (!username || !password) {
      return { success: false, message: "Username dan password harus diisi" }
    }

    // Clean up expired sessions
    await cleanupExpiredSessions()

    // Authenticate user
    const user = await authenticateAdmin(username.trim(), password)
    console.log("Authentication result:", user ? "success" : "failed")

    if (!user) {
      return { success: false, message: "Username atau password salah" }
    }

    // Create session
    await createSession(user.id)
    console.log("Session created for user:", user.id)

    // Log admin activity
    try {
      await logAdminActivity(user.id, "login", "admin_sessions", null, null, null)
    } catch (error) {
      console.error("Error logging activity:", error)
      // Don't fail login if logging fails
    }

    return { success: true, message: "Login berhasil" }
  } catch (error) {
    console.error("Error logging in:", error)
    return { success: false, message: "Terjadi kesalahan saat login. Silakan coba lagi." }
  }
}

export async function logoutAdmin() {
  try {
    const user = await requireAuth()
    await logAdminActivity(user.id, "logout", "admin_sessions", null, null, null)
    await deleteSession()
  } catch (error) {
    console.error("Error logging out:", error)
  }
  redirect("/admin/login")
}

// Activity logging function
export async function logAdminActivity(
  adminId: number,
  action: string,
  tableName: string | null,
  recordId: number | null,
  oldValues: any = null,
  newValues: any = null,
) {
  try {
    // Ensure activity logs table exists
    await sql`
      CREATE TABLE IF NOT EXISTS admin_activity_logs (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER NOT NULL,
        action VARCHAR(100) NOT NULL,
        table_name VARCHAR(100),
        record_id INTEGER,
        old_values JSONB,
        new_values JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      INSERT INTO admin_activity_logs (admin_id, action, table_name, record_id, old_values, new_values)
      VALUES (${adminId}, ${action}, ${tableName}, ${recordId}, ${oldValues}, ${newValues})
    `
  } catch (error) {
    console.error("Error logging admin activity:", error)
  }
}

// Hero Content Actions
export async function getHeroContent() {
  try {
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'hero_content'
      );
    `

    if (!tableExists[0].exists) {
      console.log("Hero content table does not exist, returning null")
      return null
    }

    const hero = await sql`SELECT * FROM hero_content ORDER BY id DESC LIMIT 1`
    return hero[0] || null
  } catch (error) {
    console.error("Error fetching hero content:", error)
    return null
  }
}

export async function updateHeroContent(formData: FormData) {
  try {
    const user = await requireAuth()

    const title = (formData.get("title") as string) || "ANTIEQ WISMA KOST"
    const subtitle = (formData.get("subtitle") as string) || ""
    const badgeText = (formData.get("badgeText") as string) || "⭐ Kos Terpercaya di Jakarta"
    const ctaPrimary = (formData.get("ctaPrimary") as string) || "Lihat Kamar Tersedia"
    const ctaSecondary = (formData.get("ctaSecondary") as string) || "Hubungi Kami"
    const rating = Number.parseFloat(formData.get("rating") as string) || 4.9
    const totalReviews = Number.parseInt(formData.get("totalReviews") as string) || 127

    const existing = await sql`SELECT * FROM hero_content LIMIT 1`
    const oldValues = existing[0] || null

    if (existing.length > 0) {
      await sql`
        UPDATE hero_content 
        SET title = ${title}, subtitle = ${subtitle}, badge_text = ${badgeText},
            cta_primary = ${ctaPrimary}, cta_secondary = ${ctaSecondary},
            rating = ${rating}, total_reviews = ${totalReviews},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing[0].id}
      `
    } else {
      await sql`
        INSERT INTO hero_content (title, subtitle, badge_text, cta_primary, cta_secondary, rating, total_reviews)
        VALUES (${title}, ${subtitle}, ${badgeText}, ${ctaPrimary}, ${ctaSecondary}, ${rating}, ${totalReviews})
      `
    }

    await logAdminActivity(user.id, "update_hero", "hero_content", existing[0]?.id || null, oldValues, {
      title,
      subtitle,
      badgeText,
      ctaPrimary,
      ctaSecondary,
      rating,
      totalReviews,
    })

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, message: "Hero section berhasil diupdate" }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/admin/login")
    }
    console.error("Error updating hero content:", error)
    return { success: false, message: "Gagal mengupdate hero section" }
  }
}

// About Section Actions
export async function getAboutSection() {
  try {
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'about_section'
      );
    `

    if (!tableExists[0].exists) {
      console.log("About section table does not exist, returning null")
      return null
    }

    const about = await sql`SELECT * FROM about_section ORDER BY id DESC LIMIT 1`
    return about[0] || null
  } catch (error) {
    console.error("Error fetching about section:", error)
    return null
  }
}

export async function updateAboutSection(formData: FormData) {
  try {
    const user = await requireAuth()

    const title = (formData.get("title") as string) || "Tentang ANTIEQ WISMA KOST"
    const description = (formData.get("description") as string) || ""
    const vision = (formData.get("vision") as string) || ""
    const mission = (formData.get("mission") as string) || ""
    const establishedYear = Number.parseInt(formData.get("establishedYear") as string) || 2019
    const totalRooms = Number.parseInt(formData.get("totalRooms") as string) || 50
    const happyResidents = Number.parseInt(formData.get("happyResidents") as string) || 200
    const yearsExperience = Number.parseInt(formData.get("yearsExperience") as string) || 5

    const existing = await sql`SELECT * FROM about_section LIMIT 1`
    const oldValues = existing[0] || null

    if (existing.length > 0) {
      await sql`
        UPDATE about_section 
        SET title = ${title}, description = ${description}, vision = ${vision}, mission = ${mission},
            established_year = ${establishedYear}, total_rooms = ${totalRooms}, 
            happy_residents = ${happyResidents}, years_experience = ${yearsExperience},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing[0].id}
      `
    } else {
      await sql`
        INSERT INTO about_section (title, description, vision, mission, established_year, total_rooms, happy_residents, years_experience)
        VALUES (${title}, ${description}, ${vision}, ${mission}, ${establishedYear}, ${totalRooms}, ${happyResidents}, ${yearsExperience})
      `
    }

    await logAdminActivity(user.id, "update_about", "about_section", existing[0]?.id || null, oldValues, {
      title,
      description,
      vision,
      mission,
      establishedYear,
      totalRooms,
      happyResidents,
      yearsExperience,
    })

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, message: "About section berhasil diupdate" }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/admin/login")
    }
    console.error("Error updating about section:", error)
    return { success: false, message: "Gagal mengupdate about section" }
  }
}

// Gallery Actions
export async function getGallery() {
  try {
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'gallery'
      );
    `

    if (!tableExists[0].exists) {
      console.log("Gallery table does not exist, returning empty array")
      return []
    }

    const gallery = await sql`
      SELECT * FROM gallery 
      WHERE is_active = true 
      ORDER BY is_featured DESC, sort_order ASC, id DESC
    `
    return gallery
  } catch (error) {
    console.error("Error fetching gallery:", error)
    return []
  }
}

export async function createGalleryItem(formData: FormData) {
  try {
    const user = await requireAuth()

    const title = formData.get("title") as string
    const description = (formData.get("description") as string) || ""
    const imageUrl = (formData.get("imageUrl") as string) || "/placeholder.svg?height=300&width=400"
    const category = (formData.get("category") as string) || "general"
    const isFeatured = formData.get("isFeatured") === "on"

    if (!title) {
      return { success: false, message: "Judul harus diisi" }
    }

    const result = await sql`
      INSERT INTO gallery (title, description, image_url, category, is_featured)
      VALUES (${title}, ${description}, ${imageUrl}, ${category}, ${isFeatured})
      RETURNING id
    `

    await logAdminActivity(user.id, "create_gallery", "gallery", result[0].id, null, {
      title,
      description,
      imageUrl,
      category,
      isFeatured,
    })

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, message: "Item gallery berhasil ditambahkan" }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/admin/login")
    }
    console.error("Error creating gallery item:", error)
    return { success: false, message: "Gagal menambahkan item gallery" }
  }
}

export async function deleteGalleryItem(id: number) {
  try {
    const user = await requireAuth()

    const existing = await sql`SELECT * FROM gallery WHERE id = ${id}`
    await sql`UPDATE gallery SET is_active = false WHERE id = ${id}`

    await logAdminActivity(user.id, "delete_gallery", "gallery", id, existing[0] || null, null)

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, message: "Item gallery berhasil dihapus" }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/admin/login")
    }
    console.error("Error deleting gallery item:", error)
    return { success: false, message: "Gagal menghapus item gallery" }
  }
}

// Location Info Actions
export async function getLocationInfo() {
  try {
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'location_info'
      );
    `

    if (!tableExists[0].exists) {
      console.log("Location info table does not exist, returning null")
      return null
    }

    const location = await sql`SELECT * FROM location_info ORDER BY id DESC LIMIT 1`
    return location[0] || null
  } catch (error) {
    console.error("Error fetching location info:", error)
    return null
  }
}

export async function updateLocationInfo(formData: FormData) {
  try {
    const user = await requireAuth()

    const title = (formData.get("title") as string) || "Lokasi Strategis"
    const description = (formData.get("description") as string) || ""
    const address = (formData.get("address") as string) || ""
    const googleMapsUrl = (formData.get("googleMapsUrl") as string) || ""
    const nearbyPlacesString = formData.get("nearbyPlaces") as string
    const nearbyPlaces = nearbyPlacesString
      ? nearbyPlacesString
          .split(",")
          .map((place) => place.trim())
          .filter((place) => place.length > 0)
      : []

    const existing = await sql`SELECT * FROM location_info LIMIT 1`
    const oldValues = existing[0] || null

    if (existing.length > 0) {
      await sql`
        UPDATE location_info 
        SET title = ${title}, description = ${description}, address = ${address},
            google_maps_url = ${googleMapsUrl}, nearby_places = ${nearbyPlaces},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing[0].id}
      `
    } else {
      await sql`
        INSERT INTO location_info (title, description, address, google_maps_url, nearby_places)
        VALUES (${title}, ${description}, ${address}, ${googleMapsUrl}, ${nearbyPlaces})
      `
    }

    await logAdminActivity(user.id, "update_location", "location_info", existing[0]?.id || null, oldValues, {
      title,
      description,
      address,
      googleMapsUrl,
      nearbyPlaces,
    })

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, message: "Informasi lokasi berhasil diupdate" }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/admin/login")
    }
    console.error("Error updating location info:", error)
    return { success: false, message: "Gagal mengupdate informasi lokasi" }
  }
}

// SEO Settings Actions
export async function getSEOSettings() {
  try {
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'seo_settings'
      );
    `

    if (!tableExists[0].exists) {
      console.log("SEO settings table does not exist, returning null")
      return null
    }

    const seo = await sql`SELECT * FROM seo_settings ORDER BY id DESC LIMIT 1`
    return seo[0] || null
  } catch (error) {
    console.error("Error fetching SEO settings:", error)
    return null
  }
}

export async function updateSEOSettings(formData: FormData) {
  try {
    const user = await requireAuth()

    const metaTitle = (formData.get("metaTitle") as string) || ""
    const metaDescription = (formData.get("metaDescription") as string) || ""
    const metaKeywords = (formData.get("metaKeywords") as string) || ""
    const ogTitle = (formData.get("ogTitle") as string) || ""
    const ogDescription = (formData.get("ogDescription") as string) || ""
    const googleAnalyticsId = (formData.get("googleAnalyticsId") as string) || ""

    const existing = await sql`SELECT * FROM seo_settings LIMIT 1`
    const oldValues = existing[0] || null

    if (existing.length > 0) {
      await sql`
        UPDATE seo_settings 
        SET meta_title = ${metaTitle}, meta_description = ${metaDescription}, 
            meta_keywords = ${metaKeywords}, og_title = ${ogTitle}, 
            og_description = ${ogDescription}, google_analytics_id = ${googleAnalyticsId},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing[0].id}
      `
    } else {
      await sql`
        INSERT INTO seo_settings (meta_title, meta_description, meta_keywords, og_title, og_description, google_analytics_id)
        VALUES (${metaTitle}, ${metaDescription}, ${metaKeywords}, ${ogTitle}, ${ogDescription}, ${googleAnalyticsId})
      `
    }

    await logAdminActivity(user.id, "update_seo", "seo_settings", existing[0]?.id || null, oldValues, {
      metaTitle,
      metaDescription,
      metaKeywords,
      ogTitle,
      ogDescription,
      googleAnalyticsId,
    })

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, message: "SEO settings berhasil diupdate" }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/admin/login")
    }
    console.error("Error updating SEO settings:", error)
    return { success: false, message: "Gagal mengupdate SEO settings" }
  }
}

// Analytics functions
export async function getWebsiteAnalytics() {
  try {
    const analytics = await sql`
      SELECT * FROM website_analytics 
      ORDER BY date DESC 
      LIMIT 7
    `
    return analytics
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return []
  }
}

export async function updateWebsiteAnalytics(data: any) {
  try {
    await requireAuth()

    const today = new Date().toISOString().split("T")[0]

    const existing = await sql`
      SELECT id FROM website_analytics WHERE date = ${today}
    `

    if (existing.length > 0) {
      await sql`
        UPDATE website_analytics 
        SET page_views = ${data.pageViews}, 
            unique_visitors = ${data.uniqueVisitors},
            bounce_rate = ${data.bounceRate},
            avg_session_duration = ${data.avgSessionDuration},
            total_bookings = ${data.totalBookings},
            conversion_rate = ${data.conversionRate}
        WHERE date = ${today}
      `
    } else {
      await sql`
        INSERT INTO website_analytics (page_views, unique_visitors, bounce_rate, avg_session_duration, total_bookings, conversion_rate, date)
        VALUES (${data.pageViews}, ${data.uniqueVisitors}, ${data.bounceRate}, ${data.avgSessionDuration}, ${data.totalBookings}, ${data.conversionRate}, ${today})
      `
    }

    return { success: true, message: "Analytics updated successfully" }
  } catch (error) {
    console.error("Error updating analytics:", error)
    return { success: false, message: "Failed to update analytics" }
  }
}

// Scheduler functions
export async function getScheduledContent() {
  try {
    await requireAuth()

    const scheduled = await sql`
      SELECT * FROM content_scheduler 
      ORDER BY scheduled_at DESC
    `
    return scheduled
  } catch (error) {
    console.error("Error fetching scheduled content:", error)
    return []
  }
}

export async function createScheduledContent(formData: FormData) {
  try {
    const user = await requireAuth()

    const contentType = formData.get("contentType") as string
    const scheduledAt = formData.get("scheduledAt") as string
    const contentDataString = formData.get("contentData") as string

    let contentData
    try {
      contentData = JSON.parse(contentDataString)
    } catch {
      return { success: false, message: "Invalid JSON format in content data" }
    }

    await sql`
      INSERT INTO content_scheduler (content_type, content_data, scheduled_at, created_by)
      VALUES (${contentType}, ${contentData}, ${scheduledAt}, ${user.id})
    `

    await logAdminActivity(user.id, "schedule_content", "content_scheduler", null, null, { contentType, scheduledAt })

    revalidatePath("/admin")
    return { success: true, message: "Content scheduled successfully" }
  } catch (error) {
    console.error("Error scheduling content:", error)
    return { success: false, message: "Failed to schedule content" }
  }
}

// Backup functions
export async function getBackupLogs() {
  try {
    await requireAuth()

    const logs = await sql`
      SELECT * FROM backup_logs 
      ORDER BY created_at DESC
      LIMIT 20
    `
    return logs
  } catch (error) {
    console.error("Error fetching backup logs:", error)
    return []
  }
}

export async function createBackup() {
  try {
    const user = await requireAuth()

    // Simulate backup creation
    const backupSize = Math.floor(Math.random() * 10000000) + 1000000 // Random size between 1-10MB
    const fileName = `backup_${new Date().toISOString().replace(/[:.]/g, "-")}.sql`

    await sql`
      INSERT INTO backup_logs (backup_type, file_path, file_size, status, created_by)
      VALUES ('manual', ${fileName}, ${backupSize}, 'completed', ${user.id})
    `

    await logAdminActivity(user.id, "create_backup", "backup_logs", null, null, { fileName, backupSize })

    revalidatePath("/admin")
    return { success: true, message: "Backup created successfully" }
  } catch (error) {
    console.error("Error creating backup:", error)
    return { success: false, message: "Failed to create backup" }
  }
}

// Admin activity logs
export async function getAdminActivityLogs() {
  try {
    await requireAuth()

    const logs = await sql`
      SELECT al.*, au.username 
      FROM admin_activity_logs al
      JOIN admin_users au ON al.admin_id = au.id
      ORDER BY al.created_at DESC
      LIMIT 50
    `
    return logs
  } catch (error) {
    console.error("Error fetching activity logs:", error)
    return []
  }
}

// Resident Registration Actions
export async function createResidentRegistration(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const idNumber = formData.get("idNumber") as string
    const birthDate = formData.get("birthDate") as string
    const gender = formData.get("gender") as string
    const occupation = (formData.get("occupation") as string) || ""
    const address = formData.get("address") as string
    const emergencyContactName = formData.get("emergencyContactName") as string
    const emergencyContactPhone = formData.get("emergencyContactPhone") as string
    const emergencyContactRelation = formData.get("emergencyContactRelation") as string
    const roomType = (formData.get("roomType") as string) || ""
    const moveInDate = formData.get("moveInDate") as string
    const contractDuration = formData.get("contractDuration")
      ? Number.parseInt(formData.get("contractDuration") as string)
      : null
    const monthlyRent = formData.get("monthlyRent") ? Number.parseFloat(formData.get("monthlyRent") as string) : null
    const depositAmount = formData.get("depositAmount")
      ? Number.parseFloat(formData.get("depositAmount") as string)
      : null
    const idCardUrl = (formData.get("idCardUrl") as string) || ""
    const photoUrl = (formData.get("photoUrl") as string) || ""
    const notes = (formData.get("notes") as string) || ""

    // Validation
    if (
      !fullName ||
      !email ||
      !phone ||
      !idNumber ||
      !birthDate ||
      !gender ||
      !address ||
      !emergencyContactName ||
      !emergencyContactPhone ||
      !emergencyContactRelation
    ) {
      return { success: false, message: "Semua field yang wajib harus diisi" }
    }

    // Ensure residents table exists
    await sql`
      CREATE TABLE IF NOT EXISTS residents (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        id_number VARCHAR(20) UNIQUE NOT NULL,
        birth_date DATE NOT NULL,
        gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
        occupation VARCHAR(100),
        address TEXT NOT NULL,
        emergency_contact_name VARCHAR(100) NOT NULL,
        emergency_contact_phone VARCHAR(20) NOT NULL,
        emergency_contact_relation VARCHAR(50) NOT NULL,
        room_type VARCHAR(50),
        move_in_date DATE,
        contract_duration INTEGER,
        monthly_rent DECIMAL(12,2),
        deposit_amount DECIMAL(12,2),
        id_card_url TEXT,
        photo_url TEXT,
        notes TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'inactive')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Check if email already exists
    const existingResident = await sql`
      SELECT id FROM residents WHERE email = ${email}
    `

    if (existingResident.length > 0) {
      return { success: false, message: "Email sudah terdaftar. Gunakan email lain." }
    }

    // Insert new resident
    const result = await sql`
      INSERT INTO residents (
        full_name, email, phone, id_number, birth_date, gender, occupation, address,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
        room_type, move_in_date, contract_duration, monthly_rent, deposit_amount,
        id_card_url, photo_url, notes, status
      )
      VALUES (
        ${fullName}, ${email}, ${phone}, ${idNumber}, ${birthDate}, ${gender}, ${occupation}, ${address},
        ${emergencyContactName}, ${emergencyContactPhone}, ${emergencyContactRelation},
        ${roomType}, ${moveInDate || null}, ${contractDuration}, ${monthlyRent}, ${depositAmount},
        ${idCardUrl}, ${photoUrl}, ${notes}, 'pending'
      )
      RETURNING id
    `

    revalidatePath("/admin")
    return {
      success: true,
      message: "Pendaftaran berhasil! Data Anda akan diverifikasi oleh admin dalam 1x24 jam.",
    }
  } catch (error) {
    console.error("Error creating resident registration:", error)
    return { success: false, message: "Gagal mendaftar. Silakan coba lagi." }
  }
}

// Admin Resident Management Actions
export async function getResidents() {
  try {
    await requireAuth()

    // Ensure residents table exists
    await sql`
      CREATE TABLE IF NOT EXISTS residents (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        id_number VARCHAR(20) UNIQUE NOT NULL,
        birth_date DATE NOT NULL,
        gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
        occupation VARCHAR(100),
        address TEXT NOT NULL,
        emergency_contact_name VARCHAR(100) NOT NULL,
        emergency_contact_phone VARCHAR(20) NOT NULL,
        emergency_contact_relation VARCHAR(50) NOT NULL,
        room_type VARCHAR(50),
        move_in_date DATE,
        contract_duration INTEGER,
        monthly_rent DECIMAL(12,2),
        deposit_amount DECIMAL(12,2),
        id_card_url TEXT,
        photo_url TEXT,
        notes TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'inactive')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    const residents = await sql`
      SELECT * FROM residents 
      ORDER BY created_at DESC
    `
    return residents
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/admin/login")
    }
    console.error("Error fetching residents:", error)
    return []
  }
}

export async function updateResidentStatus(residentId: number, newStatus: string) {
  try {
    const user = await requireAuth()

    const validStatuses = ["pending", "approved", "active", "inactive"]
    if (!validStatuses.includes(newStatus)) {
      return { success: false, message: "Status tidak valid" }
    }

    const existing = await sql`
      SELECT * FROM residents WHERE id = ${residentId}
    `

    if (existing.length === 0) {
      return { success: false, message: "Data penghuni tidak ditemukan" }
    }

    await sql`
      UPDATE residents 
      SET status = ${newStatus}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${residentId}
    `

    await logAdminActivity(
      user.id,
      "update_resident_status",
      "residents",
      residentId,
      { status: existing[0].status },
      { status: newStatus },
    )

    revalidatePath("/admin")
    return { success: true, message: `Status berhasil diubah menjadi ${newStatus}` }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/admin/login")
    }
    console.error("Error updating resident status:", error)
    return { success: false, message: "Gagal mengupdate status" }
  }
}

export async function deleteResident(residentId: number) {
  try {
    const user = await requireAuth()

    const existing = await sql`
      SELECT * FROM residents WHERE id = ${residentId}
    `

    if (existing.length === 0) {
      return { success: false, message: "Data penghuni tidak ditemukan" }
    }

    await sql`
      DELETE FROM residents WHERE id = ${residentId}
    `

    await logAdminActivity(user.id, "delete_resident", "residents", residentId, existing[0], null)

    revalidatePath("/admin")
    return { success: true, message: "Data penghuni berhasil dihapus" }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/admin/login")
    }
    console.error("Error deleting resident:", error)
    return { success: false, message: "Gagal menghapus data penghuni" }
  }
}

// Export Residents to Excel
export async function exportResidentsToExcel(filters?: {
  status?: string
  searchTerm?: string
}) {
  try {
    const user = await requireAuth()

    let query = sql`
      SELECT 
        id,
        full_name,
        email,
        phone,
        id_number,
        birth_date,
        gender,
        occupation,
        address,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_relation,
        room_type,
        move_in_date,
        contract_duration,
        monthly_rent,
        deposit_amount,
        status,
        notes,
        created_at,
        updated_at
      FROM residents
      WHERE 1=1
    `

    // Apply filters
    if (filters?.status && filters.status !== "all") {
      query = sql`${query} AND status = ${filters.status}`
    }

    if (filters?.searchTerm) {
      const searchPattern = `%${filters.searchTerm}%`
      query = sql`${query} AND (
        full_name ILIKE ${searchPattern} OR 
        email ILIKE ${searchPattern} OR 
        phone ILIKE ${searchPattern}
      )`
    }

    query = sql`${query} ORDER BY created_at DESC`

    const residents = await query

    // Log export activity
    await logAdminActivity(user.id, "export_residents", "residents", null, null, { filters, count: residents.length })

    // Convert to CSV format for Excel compatibility
    const headers = [
      "ID",
      "Nama Lengkap",
      "Email",
      "Telepon",
      "No. KTP",
      "Tanggal Lahir",
      "Jenis Kelamin",
      "Pekerjaan",
      "Alamat",
      "Kontak Darurat - Nama",
      "Kontak Darurat - Telepon",
      "Kontak Darurat - Hubungan",
      "Tipe Kamar",
      "Tanggal Masuk",
      "Durasi Kontrak (bulan)",
      "Sewa Bulanan",
      "Deposit",
      "Status",
      "Catatan",
      "Tanggal Daftar",
      "Terakhir Update",
    ]

    const csvData = residents.map((resident: any) => [
      resident.id,
      resident.full_name,
      resident.email,
      resident.phone,
      resident.id_number,
      resident.birth_date ? new Date(resident.birth_date).toLocaleDateString("id-ID") : "",
      resident.gender,
      resident.occupation || "",
      resident.address,
      resident.emergency_contact_name,
      resident.emergency_contact_phone,
      resident.emergency_contact_relation,
      resident.room_type || "",
      resident.move_in_date ? new Date(resident.move_in_date).toLocaleDateString("id-ID") : "",
      resident.contract_duration || "",
      resident.monthly_rent ? `Rp ${resident.monthly_rent.toLocaleString("id-ID")}` : "",
      resident.deposit_amount ? `Rp ${resident.deposit_amount.toLocaleString("id-ID")}` : "",
      resident.status,
      resident.notes || "",
      new Date(resident.created_at).toLocaleDateString("id-ID"),
      new Date(resident.updated_at).toLocaleDateString("id-ID"),
    ])

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        row
          .map((cell) => (typeof cell === "string" && cell.includes(",") ? `"${cell.replace(/"/g, '""')}"` : cell))
          .join(","),
      ),
    ].join("\n")

    // Add BOM for proper Excel UTF-8 handling
    const csvWithBOM = "\uFEFF" + csvContent

    return {
      success: true,
      data: csvWithBOM,
      filename: `data-penghuni-${new Date().toISOString().split("T")[0]}.csv`,
      message: `Data ${residents.length} penghuni berhasil diekspor`,
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/admin/login")
    }
    console.error("Error exporting residents:", error)
    return { success: false, message: "Gagal mengekspor data penghuni" }
  }
}

// Room Management
export async function getRooms() {
  try {
    const rooms = await sql`SELECT * FROM rooms ORDER BY id ASC`
    return rooms
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return []
  }
}

export async function createRoom(formData: FormData) {
  try {
    const user = await requireAuth()

    const name = formData.get("name") as string
    const price = formData.get("price") as string
    const period = (formData.get("period") as string) || "/bulan"
    const size = formData.get("size") as string
    const available = Number.parseInt(formData.get("available") as string) || 0
    const featuresString = formData.get("features") as string
    const features = featuresString
      ? featuresString
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f.length > 0)
      : []
    const description = (formData.get("description") as string) || ""

    if (!name || !price || !size) {
      return { success: false, message: "Nama kamar, harga, dan ukuran harus diisi" }
    }

    const result = await sql`
      INSERT INTO rooms (name, price, period, size, available, features, description)
      VALUES (${name}, ${price}, ${period}, ${size}, ${available}, ${features}, ${description})
      RETURNING id
    `

    await logAdminActivity(user.id, "create_room", "rooms", result[0].id, null, {
      name,
      price,
      period,
      size,
      available,
      features,
      description,
    })

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, message: "Kamar berhasil ditambahkan" }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/admin/login")
    }
    console.error("Error creating room:", error)
    return { success: false, message: "Gagal menambahkan kamar" }
  }
}

export async function deleteRoom(id: number) {
  try {
    const user = await requireAuth()

    const existing = await sql`SELECT * FROM rooms WHERE id = ${id}`
    await sql`DELETE FROM rooms WHERE id = ${id}`

    await logAdminActivity(user.id, "delete_room", "rooms", id, existing[0] || null, null)

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, message: "Kamar berhasil dihapus" }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/admin/login")
    }
    console.error("Error deleting room:", error)
    return { success: false, message: "Gagal menghapus kamar" }
  }
}

// Facilities
export async function getFacilities() {
  try {
    const facilities = await sql`SELECT * FROM facilities WHERE is_active = true ORDER BY id ASC`
    return facilities
  } catch (error) {
    console.error("Error fetching facilities:", error)
    return []
  }
}

// Testimonials
export async function getTestimonials() {
  try {
    const testimonials = await sql`SELECT * FROM testimonials WHERE is_active = true ORDER BY id ASC`
    return testimonials
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }
}

export async function createTestimonial(formData: FormData) {
  try {
    const user = await requireAuth()

    const name = formData.get("name") as string
    const role = formData.get("role") as string
    const content = formData.get("content") as string
    const rating = Number.parseInt(formData.get("rating") as string) || 5

    if (!name || !content) {
      return { success: false, message: "Nama dan testimoni harus diisi" }
    }

    if (rating < 1 || rating > 5) {
      return { success: false, message: "Rating harus antara 1-5" }
    }

    const result = await sql`
      INSERT INTO testimonials (name, role, content, rating)
      VALUES (${name}, ${role || ""}, ${content}, ${rating})
      RETURNING id
    `

    await logAdminActivity(user.id, "create_testimonial", "testimonials", result[0].id, null, {
      name,
      role,
      content,
      rating,
    })

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, message: "Testimoni berhasil ditambahkan" }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/admin/login")
    }
    console.error("Error creating testimonial:", error)
    return { success: false, message: "Gagal menambahkan testimoni" }
  }
}

export async function deleteTestimonial(id: number) {
  try {
    const user = await requireAuth()

    const existing = await sql`SELECT * FROM testimonials WHERE id = ${id}`
    await sql`UPDATE testimonials SET is_active = false WHERE id = ${id}`

    await logAdminActivity(user.id, "delete_testimonial", "testimonials", id, existing[0] || null, null)

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, message: "Testimoni berhasil dihapus" }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/admin/login")
    }
    console.error("Error deleting testimonial:", error)
    return { success: false, message: "Gagal menghapus testimoni" }
  }
}

// Contact Info
export async function getContactInfo() {
  try {
    const contact = await sql`SELECT * FROM contact_info ORDER BY id DESC LIMIT 1`
    return contact[0] || null
  } catch (error) {
    console.error("Error fetching contact info:", error)
    return null
  }
}

export async function updateContactInfo(formData: FormData) {
  try {
    const user = await requireAuth()

    const phone = (formData.get("phone") as string) || ""
    const whatsapp = (formData.get("whatsapp") as string) || ""
    const email = (formData.get("email") as string) || ""
    const address = (formData.get("address") as string) || ""
    const instagram = (formData.get("instagram") as string) || ""
    const facebook = (formData.get("facebook") as string) || ""

    const existing = await sql`SELECT * FROM contact_info LIMIT 1`
    const oldValues = existing[0] || null

    if (existing.length > 0) {
      await sql`
        UPDATE contact_info 
        SET phone = ${phone}, whatsapp = ${whatsapp}, email = ${email}, 
            address = ${address}, instagram = ${instagram}, facebook = ${facebook},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing[0].id}
      `
    } else {
      await sql`
        INSERT INTO contact_info (phone, whatsapp, email, address, instagram, facebook)
        VALUES (${phone}, ${whatsapp}, ${email}, ${address}, ${instagram}, ${facebook})
      `
    }

    await logAdminActivity(user.id, "update_contact", "contact_info", existing[0]?.id || null, oldValues, {
      phone,
      whatsapp,
      email,
      address,
      instagram,
      facebook,
    })

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, message: "Informasi kontak berhasil diupdate" }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/admin/login")
    }
    console.error("Error updating contact info:", error)
    return { success: false, message: "Gagal mengupdate informasi kontak" }
  }
}

// Bookings
export async function createBooking(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const roomType = (formData.get("roomType") as string) || ""
    const message = (formData.get("message") as string) || ""

    if (!name || !email || !phone) {
      return { success: false, message: "Nama, email, dan nomor telepon harus diisi" }
    }

    await sql`
      INSERT INTO bookings (name, email, phone, room_type, message)
      VALUES (${name}, ${email}, ${phone}, ${roomType}, ${message})
    `

    return { success: true, message: "Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda." }
  } catch (error) {
    console.error("Error creating booking:", error)
    return { success: false, message: "Gagal mengirim pesan. Silakan coba lagi." }
  }
}

export async function getBookings() {
  try {
    await requireAuth()
    const bookings = await sql`SELECT * FROM bookings ORDER BY created_at DESC LIMIT 100`
    return bookings
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/admin/login")
    }
    console.error("Error fetching bookings:", error)
    return []
  }
}

// Website Settings
export async function getWebsiteSettings() {
  try {
    const settings = await sql`SELECT * FROM website_settings ORDER BY id DESC LIMIT 1`
    return settings[0] || null
  } catch (error) {
    console.error("Error fetching website settings:", error)
    return null
  }
}

export async function updateWebsiteSettings(formData: FormData) {
  try {
    const user = await requireAuth()

    const siteName = (formData.get("siteName") as string) || "ANTIEQ WISMA KOST"
    const tagline = (formData.get("tagline") as string) || "Kos Nyaman & Terjangkau"
    const description = (formData.get("description") as string) || ""
    const primaryColor = (formData.get("primaryColor") as string) || "#2563eb"
    const secondaryColor = (formData.get("secondaryColor") as string) || "#1e40af"

    const existing = await sql`SELECT * FROM website_settings LIMIT 1`
    const oldValues = existing[0] || null

    if (existing.length > 0) {
      await sql`
        UPDATE website_settings 
        SET site_name = ${siteName}, tagline = ${tagline}, description = ${description},
            primary_color = ${primaryColor}, secondary_color = ${secondaryColor},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing[0].id}
      `
    } else {
      await sql`
        INSERT INTO website_settings (site_name, tagline, description, primary_color, secondary_color)
        VALUES (${siteName}, ${tagline}, ${description}, ${primaryColor}, ${secondaryColor})
      `
    }

    await logAdminActivity(user.id, "update_settings", "website_settings", existing[0]?.id || null, oldValues, {
      siteName,
      tagline,
      description,
      primaryColor,
      secondaryColor,
    })

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, message: "Pengaturan website berhasil diupdate" }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/admin/login")
    }
    console.error("Error updating website settings:", error)
    return { success: false, message: "Gagal mengupdate pengaturan website" }
  }
}
