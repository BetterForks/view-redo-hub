import { NavLink } from "react-router-dom";
import {
  Target,
  Headphones,
  Network,
  BarChart3,
  FileCheck,
  ArrowRight,
  Settings,
  Layers3,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Scans", icon: Target, url: "/scans" },
  { title: "Assets", icon: Headphones, url: "/assets" },
  { title: "Visualize", icon: Layers3, url: "/visualize" },
  { title: "Policies", icon: Network, url: "/policies" },
  { title: "Reports", icon: BarChart3, url: "/reports" },
  { title: "Compliance", icon: FileCheck, url: "/compliance" },
  { title: "Export", icon: ArrowRight, url: "/export" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-primary"
                          : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
