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
  User,
} from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ size: number }>;
}

const TenantNavbar: FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks: NavLink[] = [
    { label: "Dashboard", href: "/tenant/dashboard", icon: LayoutDashboard },
    { label: "Complaints", href: "/tenant/complaints", icon: AlertCircle },
    { label: "Payments", href: "/tenant/payments", icon: CreditCard },
    { label: "Profile", href: "/tenant/profile", icon: User },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavigation("/")}
          >
            <img src={Logo.src} alt="StaySync" className="w-7" />
            <span className="text-xl font-bold text-text-primary">
              StaySync
            </span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNavigation(link.href)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-muted transition"
                  >
                    <Icon size={20} />
                    {link.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-secondary hover:text-text-primary"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <div className="space-y-2 pt-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNavigation(link.href)}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-muted transition"
                  >
                    <Icon size={20} />
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

export default TenantNavbar;
