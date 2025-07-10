import { auth } from "@/auth"
import ResponseDialog from "@/components/elements/response-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/prisma"
import { ChevronLeft, Download } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

interface PageProps {
  params: Promise<{ formId: string }>
}

export default async function FormResponses({ params }: PageProps) {
  const session = await auth()
  if (!session) redirect('/login')

  const { formId } = await params

  const responses = await prisma.formResponse.findMany({
    where: { formId },
  })

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <>
      <section className="md:container mx-4 md:mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href='/dashboard'>
            <Button variant='ghost'>
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h2 className="text-2xl font-semibold mb-1">Form Responses</h2>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Responses</CardTitle>
            {responses.length > 0 && (
              <Link href={`/api/forms/${formId}/responses/csv`}>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {responses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No responses yet
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>SUBMITTED AT</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response) => (
                      <TableRow key={response.id}>
                        <TableCell className="font-medium">{response.id}</TableCell>
                        <TableCell>{formatDate(response.createdAt)}</TableCell>
                        <TableCell>
                          <ResponseDialog response={response.response} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  )
}