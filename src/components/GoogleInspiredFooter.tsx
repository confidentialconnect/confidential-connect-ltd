import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, Settings, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export const GoogleInspiredFooter = () => {
  const [isDark, setIsDark] = useState(false);

  const businessLinks = [
    { name: "Advertising", href: "/advertising" },
    { name: "Business Solutions", href: "/business" },
    { name: "How Our Services Work", href: "/how-it-works" }
  ];

  const supportLinks = [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Settings", href: "/settings" }
  ];

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Load theme on component mount
  useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    }
  });

  return (
    <footer className="border-t border-border bg-muted/30">
      {/* Country/Region Info */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span className="text-sm">Nigeria</span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left Links */}
          <div className="flex flex-wrap items-center gap-6">
            {businessLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Center - Environmental/Social Message */}
          <div className="text-center">
            <Link
              to="/sustainability"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="w-2 h-2 bg-success rounded-full"></span>
              Supporting sustainable technology solutions
            </Link>
          </div>

          {/* Right Links & Settings */}
          <div className="flex items-center gap-6">
            {supportLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/search-settings">Search settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/advanced-search">Advanced search</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/data-privacy">Your data in Search</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/search-history">Search history</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/help">Search help</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme}>
                  <div className="flex items-center gap-2">
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    Dark theme: {isDark ? 'On' : 'Off'}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Send feedback
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="text-center text-xs text-muted-foreground">
            <p>© 2024 <span className="font-bold">CONFIDENTIAL CONNECT LTD</span>. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};