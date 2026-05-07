import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Megaphone, Package, Users as UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/promotions", label: "Promotions", icon: Megaphone },
  { to: "/admin/orders", label: "Orders", icon: Package },
  { to: "/admin/users", label: "Users", icon: UsersIcon },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex flex-col w-56 border-r bg-card pt-20 px-3 sticky top-0 h-screen">
        <div className="px-2 mb-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Admin</p>
          <p className="font-semibold">Confidential Connect Ltd</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile top nav */}
      <nav className="md:hidden fixed top-16 inset-x-0 z-30 bg-card border-b flex overflow-x-auto px-2 py-2 gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-md text-xs whitespace-nowrap",
                isActive ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
              )
            }
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="flex-1 min-w-0 pt-10 md:pt-0">{children}</main>
    </div>
  );
};

export default AdminLayout;