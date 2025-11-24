import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, User, Settings, Bell, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';

const navItems = [
  { title: 'Dashboard', icon: LayoutDashboard, url: '/my-account', section: 'dashboard' },
  { title: 'My Applications', icon: FileText, url: '/my-account', section: 'applications' },
  { title: 'Profile', icon: User, url: '/my-account', section: 'profile' },
  { title: 'Notifications', icon: Bell, url: '/my-account', section: 'notifications' },
  { title: 'Settings', icon: Settings, url: '/my-account', section: 'settings' },
];

interface AccountSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AccountSidebar({ activeSection, onSectionChange }: AccountSidebarProps) {
  const { state } = useSidebar();
  const { signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className={cn("border-r border-border", isCollapsed ? "w-16" : "w-64")}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.section}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.section)}
                    className={cn(
                      "cursor-pointer transition-all hover:bg-muted/80",
                      activeSection === item.section && "bg-primary/10 text-primary font-semibold hover:bg-primary/15"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                    {!isCollapsed && (
                      <span className="flex-1">{item.title}</span>
                    )}
                    {!isCollapsed && item.section === 'notifications' && unreadCount > 0 && (
                      <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                        {unreadCount}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className="hover:bg-muted/80">
                    <Home className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                    {!isCollapsed && <span>Home</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={signOut}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                  {!isCollapsed && <span>Sign Out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
