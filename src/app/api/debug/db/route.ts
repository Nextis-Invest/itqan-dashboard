import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env: {
      nodeEnv: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlPrefix: process.env.DATABASE_URL?.split("://")[0],
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL,
    },
    tests: {}
  }

  // Test 1: Database connection
  try {
    await prisma.$queryRaw`SELECT 1 as test`
    diagnostics.tests.dbConnection = { status: "✅ OK", message: "Database connection successful" }
  } catch (error) {
    diagnostics.tests.dbConnection = {
      status: "❌ FAILED",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }
  }

  // Test 2: Check if User table exists
  try {
    const userCount = await prisma.user.count()
    diagnostics.tests.userTable = { status: "✅ OK", message: `User table exists with ${userCount} users` }
  } catch (error) {
    diagnostics.tests.userTable = {
      status: "❌ FAILED",
      error: error instanceof Error ? error.message : String(error)
    }
  }

  // Test 3: Check if FreelancerProfile table exists
  try {
    const profileCount = await prisma.freelancerProfile.count()
    diagnostics.tests.freelancerProfileTable = { status: "✅ OK", message: `FreelancerProfile table exists with ${profileCount} profiles` }
  } catch (error) {
    diagnostics.tests.freelancerProfileTable = {
      status: "❌ FAILED",
      error: error instanceof Error ? error.message : String(error)
    }
  }

  // Test 4: Check if Mission table exists
  try {
    const missionCount = await prisma.mission.count()
    diagnostics.tests.missionTable = { status: "✅ OK", message: `Mission table exists with ${missionCount} missions` }
  } catch (error) {
    diagnostics.tests.missionTable = {
      status: "❌ FAILED",
      error: error instanceof Error ? error.message : String(error)
    }
  }

  const hasErrors = Object.values(diagnostics.tests).some(
    (test: any) => test.status?.includes("❌")
  )

  return NextResponse.json(diagnostics, {
    status: hasErrors ? 500 : 200
  })
}
