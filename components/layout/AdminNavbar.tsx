"use client";

import { useRouter } from "next/navigation";
import { useState, FC } from "react";
import Logo from "@/assets/Logo.png";
import {
  Menu,
  X,
  LayoutDashboard,
  AlertCircle,
  CreditCard,
  DoorOpen,
  Users,
} from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ size: number }>;
}

const AdminNavbar: FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks: NavLink[] = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Rooms", href: "/admin/rooms", icon: DoorOpen },
    { label: "Issues", href: "/admin/complaints", icon: AlertCircle },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Profile", href: "/admin/profile", icon: Users },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavigation("/")}
          >
            <img src={Logo.src} alt="StaySync" className="h-8.5 w-8.5" />
            <span className="text-xl font-bold text-text-primary">
              StaySync
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavigation(link.href)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg
                             text-text-secondary hover:text-text-primary
                             hover:bg-background-muted transition"
                >
                  <Icon size={18} />
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-secondary hover:text-text-primary"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border">
            <div className="py-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNavigation(link.href)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
                               text-text-secondary hover:text-text-primary
                               hover:bg-background-muted transition"
                  >
                    <Icon size={18} />
                    {link.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
