import { ReactNode } from "react"
import Header from "@/components/layouts/Header"
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar"
import { AppSidebar } from "../app-sidebar"

interface Props {
  children: ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="flex-1 overflow-auto">
        <div className="flex items-center">
          {/* <SidebarTrigger /> */}
          <Header />
        </div>
        <main className="p-8">{children}</main>
      </div>
    </SidebarProvider>
  )
} 