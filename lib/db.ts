import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

// Configure Neon with proper settings to suppress browser warnings
const sql = neon(process.env.DATABASE_URL, {
  // Disable warnings when running in browser environment
  disableWarningInBrowsers: true,
  // Add connection pooling for better performance
  connectionTimeoutMillis: 5000,
})

export { sql }
