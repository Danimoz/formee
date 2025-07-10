import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { formId } = await params

    // Get form and responses
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        responses: {
          orderBy: { createdAt: "desc" }
        }
      }
    })

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    // Check if user owns this form
    if (form.userEmail !== session.user?.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Extract field names from form schema
    const formFields = form.fields as any[]
    const fieldNames = formFields.map(field => field.name || field.label || field.id)

    // Create CSV headers
    const headers = ["Response ID", "Submitted At", ...fieldNames]

    // Create CSV rows
    const csvRows = [
      headers.join(","), // Header row
      ...form.responses.map(response => {
        const responseData = response.response as Record<string, any>
        const row = [
          response.id,
          new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(response.createdAt),
          ...fieldNames.map(fieldName => {
            const value = responseData[fieldName] || ""
            // Escape commas and quotes in CSV
            const escapedValue = String(value).replace(/"/g, '""')
            return escapedValue.includes(",") || escapedValue.includes("\n") || escapedValue.includes('"')
              ? `"${escapedValue}"`
              : escapedValue
          })
        ]
        return row.join(",")
      })
    ]

    const csvContent = csvRows.join("\n")

    // Sanitize filename for CSV download
    const sanitizedTitle = form.title
      .replace(/[^a-zA-Z0-9\s-_]/g, '')
      .replace(/\s+/g, '_')

    // Create response with CSV content
    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${sanitizedTitle}_responses.csv"`,
      },
    })

    return response
  } catch (error) {
    console.error("Error generating CSV:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
