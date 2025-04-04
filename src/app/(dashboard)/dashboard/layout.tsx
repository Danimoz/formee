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
        {children}
      </main>
    </SidebarProvider>
  )
}
