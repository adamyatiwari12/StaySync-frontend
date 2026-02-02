"use client";

import { useEffect, useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/home/ProtectedRoute";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { getRooms, assignTenant } from "@/services/room.services";
import { getTenants } from "@/services/user.services";
import { Room } from "@/types/room";
import { Tenant } from "@/types/user";
import { AxiosError } from "axios";
import { ArrowLeft, CheckCircle, AlertCircle, Loader2, UserPlus } from "lucide-react";

function AssignTenantContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramRoomId = searchParams.get("roomId");

  const [rooms, setRooms] = useState<Room[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [roomId, setRoomId] = useState(paramRoomId || "");
  const [tenantId, setTenantId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roomsRes, tenantsRes] = await Promise.all([
          getRooms(),
          getTenants()
        ]);

        // Filter for any room that has space (occupied < capacity)
        // OR the currently selected room (even if full, though unlikely to assign if full)
        // Actually, we should only show rooms with space.
        setRooms(roomsRes.data.filter(r => r.occupiedCount < r.capacity));

        // Filter for tenants without a room
        setTenants(tenantsRes.data.filter(t => !t.roomId));
      } catch (err) {
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update roomId if param changes and not already set
  useEffect(() => {
    if (paramRoomId) {
      setRoomId(paramRoomId);
    }
  }, [paramRoomId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!roomId) {
      setError("Please select a room.");
      return;
    }
    if (!tenantId) {
      setError("Please select a tenant.");
      return;
    }

    try {
      setSubmitting(true);
      await assignTenant({ roomId, tenantId });
      setSuccess("Tenant assigned successfully!");

      // Redirect after short delay
      setTimeout(() => {
        router.push("/admin/rooms");
      }, 1500);

    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Assignment failed.");
      } else {
        setError("Something went wrong.");
      }
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center text-text-muted hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Rooms
      </button>

      <div className="bg-background-card rounded-2xl shadow-xl border border-border overflow-hidden">
        <div className="p-8 border-b border-border bg-background-muted/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <UserPlus size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Assign Tenant</h1>
              <p className="text-text-secondary mt-1">Select a room and a tenant to assign them together.</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-center gap-3 text-error animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} className="flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-xl flex items-center gap-3 text-success animate-in fade-in slide-in-from-top-2">
              <CheckCircle size={20} className="flex-shrink-0" />
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Select Room
              </label>
              <div className="relative">
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background-muted text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                  disabled={submitting}
                >
                  <option value="">-- Choose a Room --</option>
                  {rooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      Room {room.roomNumber} • Floor {room.floor} • {room.capacity - room.occupiedCount} spots left
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-text-muted">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-text-secondary">
                Only rooms with available capacity are shown.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Select Tenant
              </label>
              <div className="relative">
                <select
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background-muted text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                  disabled={submitting}
                >
                  <option value="">-- Choose a Tenant --</option>
                  {tenants.map((tenant) => (
                    <option key={tenant._id} value={tenant._id}>
                      {tenant.username} ({tenant.email})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-text-muted">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-text-secondary">
                Only tenants not currently assigned to a room are shown.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || !roomId || !tenantId}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-text-primary rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {submitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Assigning...
                </>
              ) : (
                "Confirm Assignment"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AssignTenantPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-background">
        <AdminNavbar />
        <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>}>
          <AssignTenantContent />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
