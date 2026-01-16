import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Grid3X3, 
  Mail, 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  Shield, 
  Code, 
  Database,
  Cloud,
  Network,
  Laptop
} from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";

export const GoogleAppsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const apps = [
    {
      name: "Services",
      icon: Grid3X3,
      href: "/categories",
      color: "text-primary"
    },
    {
      name: "Security",
      icon: Shield,
      href: "/categories?category=security",
      color: "text-destructive"
    },
    {
      name: "Development",
      icon: Code,
      href: "/categories?category=software",
      color: "text-education-blue"
    },
    {
      name: "Cloud",
      icon: Cloud,
      href: "/categories?category=cloud",
      color: "text-info"
    },
    {
      name: "Database",
      icon: Database,
      href: "/categories?category=database",
      color: "text-warning"
    },
    {
      name: "Network",
      icon: Network,
      href: "/categories?category=network",
      color: "text-success"
    },
    {
      name: "Hardware",
      icon: Laptop,
      href: "/categories?category=hardware",
      color: "text-education-purple"
    },
    {
      name: "Support",
      icon: Users,
      href: "/contact",
      color: "text-muted-foreground"
    },
    {
      name: "Orders",
      icon: FileText,
      href: "/orders",
      color: "text-primary"
    }
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-muted rounded-full"
        >
          <Grid3X3 className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 p-4"
        sideOffset={8}
      >
        <div className="mb-3">
          <h3 className="font-semibold text-sm">Confidential Connect Ltd Services</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {apps.map((app) => {
            const IconComponent = app.icon;
            return (
              <Link
                key={app.name}
                to={app.href}
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-background border">
                  <IconComponent className={`h-5 w-5 ${app.color}`} />
                </div>
                <span className="text-xs font-medium text-center leading-tight">
                  {app.name}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="border-t border-border mt-4 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Account</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile">Profile</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};