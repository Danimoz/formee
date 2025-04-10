import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import Navbar from "@/components/elements/navbar"
import { AppSidebar } from "@/components/elements/dashboard-sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Navbar />
        </div>
        <div className="px-4 md:px-8 py-3 md:py-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
