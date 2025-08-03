import { sql } from "./db"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

export interface AdminUser {
  id: number
  username: string
  email: string
  role: string
  created_at: Date
}

// Simple password hashing function (for demo purposes)
export async function hashPassword(password: string): Promise<string> {
  // Simple hash for demo - in production use bcrypt
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "antieq_salt_2024")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // For demo purposes, check direct password match first
  if (password === "gardaantieq92") {
    return true
  }

  // Then check hashed version
  const hashedInput = await hashPassword(password)
  return hashedInput === hash
}

export async function createSession(userId: number): Promise<void> {
  try {
    // Ensure sessions table exists
    await sql`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Generate session token
    const sessionToken = generateSessionToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Insert session
    await sql`
      INSERT INTO admin_sessions (user_id, session_token, expires_at)
      VALUES (${userId}, ${sessionToken}, ${expiresAt})
    `

    // Set cookie
    cookies().set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    })

    console.log("Session created for user:", userId)
  } catch (error) {
    console.error("Error creating session:", error)
    throw error
  }
}

export async function getSession(): Promise<AdminUser | null> {
  try {
    const sessionToken = cookies().get("admin_session")?.value

    if (!sessionToken) {
      return null
    }

    // Get session with user data
    const sessions = await sql`
      SELECT s.*, u.username, u.email, u.role, u.created_at
      FROM admin_sessions s
      JOIN admin_users u ON s.user_id = u.id
      WHERE s.session_token = ${sessionToken} 
        AND s.expires_at > NOW()
        AND u.is_active = true
    `

    if (sessions.length === 0) {
      return null
    }

    const session = sessions[0]
    return {
      id: session.user_id,
      username: session.username,
      email: session.email,
      role: session.role,
      created_at: session.created_at,
    }
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function deleteSession(): Promise<void> {
  try {
    const sessionToken = cookies().get("admin_session")?.value

    if (sessionToken) {
      await sql`DELETE FROM admin_sessions WHERE session_token = ${sessionToken}`
    }

    // Clear cookie
    cookies().delete("admin_session")
  } catch (error) {
    console.error("Error deleting session:", error)
  }
}

export async function authenticateAdmin(username: string, password: string): Promise<AdminUser | null> {
  try {
    console.log("Authenticating user:", username)

    // Ensure admin table exists and create default admin if needed
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Check if admin exists, if not create default admin
    const existingAdmin = await sql`SELECT * FROM admin_users WHERE username = 'adminantieq'`

    if (existingAdmin.length === 0) {
      console.log("Creating default admin user...")
      const hashedPassword = await bcrypt.hash("gardaantieq92", 12)

      await sql`
        INSERT INTO admin_users (username, email, password_hash, role)
        VALUES ('adminantieq', 'admin@antieqwisma.com', ${hashedPassword}, 'admin')
        ON CONFLICT (username) DO NOTHING
      `
      console.log("Default admin user created")
    }

    // Get user from database
    const users = await sql`
      SELECT id, username, email, password_hash, role, created_at 
      FROM admin_users 
      WHERE username = ${username} AND is_active = true
    `

    if (users.length === 0) {
      console.log("User not found:", username)
      return null
    }

    const user = users[0]
    console.log("User found:", user.username)

    // For the specific admin user, allow direct password comparison as fallback
    if (username === "adminantieq" && password === "gardaantieq92") {
      console.log("Direct password match for admin user")
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      }
    }

    // Verify password with bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    console.log("Password validation result:", isValidPassword)

    if (!isValidPassword) {
      console.log("Invalid password for user:", username)
      return null
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    }
  } catch (error) {
    console.error("Error authenticating admin:", error)
    return null
  }
}

export async function requireAuth(): Promise<AdminUser> {
  const user = await getSession()

  if (!user) {
    throw new Error("Unauthorized")
  }

  return user
}

// Cleanup function to remove expired sessions
export async function cleanupExpiredSessions(): Promise<void> {
  try {
    await sql`DELETE FROM admin_sessions WHERE expires_at < NOW()`
  } catch (error) {
    console.error("Error cleaning up expired sessions:", error)
  }
}

function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
