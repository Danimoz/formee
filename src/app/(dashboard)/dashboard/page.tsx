import { auth } from "@/auth"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { formatDistanceToNow } from "date-fns";
import { FileText } from "lucide-react";

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect('/login')
  
  const totalResponses = await prisma.formResponse.count({
    where: {
      form: { userEmail: session?.user?.email as string },
    },
  });

  const recentResponses = await prisma.formResponse.findMany({
    where: {
      form: { userEmail: session?.user?.email as string },
    },
    include: {
      form: {
        select: { title: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const forms = await prisma.form.findMany({
    where: {
      userEmail: session?.user?.email as string,
    },
    include: {
      _count: {
        select: {
          responses: true,
        },
      },
    },
    take: 16
  });

  return (
    <>
      <section className="py-6">
        <div className="space-y-3 text-center">
          <h2 className="text-2xl font-semibold mb-1">Welcome back, {session?.user?.name?.split(' ')[0] || session?.user?.email}</h2>
          <p className="text-gray-600">Here&apos;s a summary of your forms and responses.</p>
        </div>
      </section>

      <section className="md:container mx-4 md:mx-auto py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={<div className="bg-white shadow-md rounded-lg p-4">Loading...</div>}>
            <Card>
              <CardContent>
                <h6>Total Responses</h6>
                <h1 className="text-3xl font-bold">{totalResponses}</h1>
              </CardContent>
            </Card>
          </Suspense>
        </div>
      </section>

      <section className="md:container mx-4 md:mx-auto py-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2 p-4">
            <h2 className="text-2xl font-semibold mb-4">Your Forms</h2>
            <Suspense fallback={<div className="bg-white shadow-md rounded-lg p-4">Loading...</div>}>
              {forms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {forms.map((form) => (
                    <Card key={form.id} className="bg-white shadow-md rounded-lg p-4">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold">{form.title}</CardTitle>
                        <CardDescription>{form.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-500 mt-2">Responses: {form._count.responses}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center mt-4">
                        <Link href={`/dashboard/responses/${form.id}`}>
                          <Button variant="outline">View Responses</Button>
                        </Link>
                        <Link href={`/dashboard/edit/${form.id}`}>
                          <Button>Edit</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg p-4 text-center">
                  <p className="text-gray-600">You have no forms yet. Start creating one!</p>
                </div>
              )}
            </Suspense>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="bg-white shadow-md rounded-lg p-4">Loading...</div>}>
                {recentResponses.length > 0 ? (
                  <div className="space-y-4">
                    {recentResponses.map((response) => (
                      <div key={response.id} className="flex gap-3 items-start border pb-4 border-b last:border-0 last:pb-0">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">New Response on {response.form.title}</h3>
                          <p className="text-gray-500">Submitted {formatDistanceToNow(new Date(response.createdAt), { addSuffix: true })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white shadow-md rounded-lg p-4 text-center">
                    <p className="text-gray-600">No recent activity.</p>
                  </div>
                )}
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}