"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { useEffect, useState } from "react";
import { getRooms } from "@/services/room.services";
import { Building, Users, AlertCircle, TrendingUp, Plus, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalCapacity: 0,
    occupiedCount: 0,
    occupancyRate: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getRooms();

        const totalRooms = data.length;
        const availableRooms = data.filter((r) => r.isAvailable).length;
        const totalCapacity = data.reduce((acc, r) => acc + r.capacity, 0);
        const occupiedCount = data.reduce((acc, r) => acc + r.occupiedCount, 0);
        const occupancyRate =
          totalCapacity > 0
            ? Math.round((occupiedCount / totalCapacity) * 100)
            : 0;

        setStats({
          totalRooms,
          availableRooms,
          totalCapacity,
          occupiedCount,
          occupancyRate,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, accent, subValue }: any) => (
    <div className="bg-background-card rounded-xl p-6 border border-border hover:border-primary/50 transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {subValue && (
            <p className="text-xs text-text-muted mt-1">{subValue}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${accent}/10`}>
          <Icon size={24} className={`text-${accent}`} />
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-background">
        <AdminNavbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
            <p className="text-text-secondary mt-1">
              Welcome back, here’s what’s happening today.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-border border-t-primary" />
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Rooms"
                  value={stats.totalRooms}
                  subValue={`${stats.availableRooms} Available`}
                  icon={Building}
                  accent="primary"
                />
                <StatCard
                  title="Total Residents"
                  value={stats.occupiedCount}
                  subValue="Active Residents"
                  icon={Users}
                  accent="secondary"
                />
                <StatCard
                  title="Occupancy Rate"
                  value={`${stats.occupancyRate}%`}
                  subValue="Of total capacity"
                  icon={TrendingUp}
                  accent="success"
                />
                <StatCard
                  title="Pending Issues"
                  value="0"
                  subValue="Needs attention"
                  icon={AlertCircle}
                  accent="error"
                />
              </div>

            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
