"use client";

import ProtectedRoute from "@/components/home/ProtectedRoute";
import TenantNavbar from "@/components/layout/TenantNavbar";
import { useState, useEffect } from "react";
import { Home, CreditCard, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthUser } from "@/types/auth";

export default function TenantDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const QuickActionCard = ({
    title,
    icon: Icon,
    onClick,
    color,
    description,
  }: any) => (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 bg-background-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all group w-full text-center"
    >
      <div
        className={`p-4 rounded-full ${color}/10 mb-4 group-hover:scale-110 transition-transform`}
      >
        <Icon size={32} className={color} />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </button>
  );

  return (
    <ProtectedRoute allowedRoles={["tenant"]}>
      <div className="min-h-screen bg-background">
        <TenantNavbar />

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary">
              Hello, {user?.username || "Tenant"}!
            </h1>
            <p className="text-text-secondary mt-1">
              Welcome to your dashboard. Here's an overview of your stay.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-8">
              {/* My Room */}
              <div className="bg-background-card rounded-2xl p-6 border border-border">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                    <Home className="text-primary" /> My Room
                  </h2>
                  <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Info label="Room Number" value="101" />
                  <Info label="Monthly Rent" value="₹5,000" />
                  <Info label="Floor" value="1st Floor" />
                  <Info label="Room Type" value="Shared (2 Sharing)" />
                </div>
              </div>

              {/* Rent Alert */}
              <div className="bg-warning/10 border border-warning/30 rounded-2xl p-6 flex gap-4">
                <AlertCircle className="text-warning mt-1" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-warning">
                    Rent Due Soon
                  </h3>
                  <p className="text-warning/80 mt-1">
                    Your rent is due on{" "}
                    <strong>25th Jan, 2026</strong>. Please pay on time.
                  </p>
                  <button
                    onClick={() => router.push("/tenant/payments")}
                    className="mt-4 px-4 py-2 bg-warning text-black rounded-lg text-sm font-semibold hover:opacity-90 transition"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-text-primary">
                Quick Actions
              </h2>
              <div className="grid gap-4">
                <QuickActionCard
                  title="Raise Complaint"
                  description="Facing an issue? Let us know."
                  icon={AlertCircle}
                  color="text-error"
                  onClick={() => router.push("/tenant/complaints")}
                />
                <QuickActionCard
                  title="Payment History"
                  description="View your past transactions."
                  icon={CreditCard}
                  color="text-primary"
                  onClick={() => router.push("/tenant/payments")}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-text-secondary">{label}</p>
      <p className="text-lg font-semibold text-text-primary">{value}</p>
    </div>
  );
}
