import LoadingMessages from "./loading-message";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";

interface FormBuilderSkeletonProps {
  justShowLastMessage?: boolean;
}

export default function FormBuilderSkeleton({ justShowLastMessage }: FormBuilderSkeletonProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="md:container mx-4 md:mx-auto">
        <div className="grid md:grid-cols-12 gap-6">
          <Card className="md:col-span-3">
            <CardHeader>
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Middle panel skeleton */}
          <Card className="md:col-span-6">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-20 w-full" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>

          {/* Right panel skeleton */}
          <Card className="md:col-span-3">
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5 rounded-sm" />
                <Skeleton className="h-4 w-28" />
              </div>

              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-16" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-2">
                      <Skeleton className="h-10 flex-1" />
                      <Skeleton className="h-10 w-10" />
                    </div>
                  ))}
                  <Skeleton className="h-9 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={true}>
        <DialogContent>
          <DialogTitle />
          <LoadingMessages justShowLastMessage={justShowLastMessage} />
        </DialogContent>
      </Dialog>
    </main>
  )
}