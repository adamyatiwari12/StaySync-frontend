"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { getRooms, createRoom, removeTenant, deleteRoom } from "@/services/room.services";
import { Room } from "@/types/room";
import {
  Plus,
  Users,
  IndianRupee,
  Home,
  AlertCircle,
  X,
  Loader2,
  UserPlus,
  Trash2,
  User,
} from "lucide-react";

export default function AdminRoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: "",
    floor: "",
    capacity: "",
    rentAmount: "",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await getRooms();
      setRooms(res.data);
    } catch {
      setError("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createRoom({
        roomNumber: formData.roomNumber,
        capacity: Number(formData.capacity),
        floor: Number(formData.floor),
        rentAmount: Number(formData.rentAmount),
        occupiedCount: 0,
        isAvailable: true,
      });
      setIsModalOpen(false);
      setFormData({ roomNumber: "", floor: "", capacity: "", rentAmount: "" });
      fetchRooms();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create room");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveTenant = async (tenantId: string) => {
    if (!confirm("Remove this resident from the room?")) return;
    try {
      await removeTenant({ tenantId });
      fetchRooms();
    } catch {
      alert("Failed to remove resident");
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm("Are you sure you want to delete this room? This action cannot be undone.")) return;
    try {
      await deleteRoom(roomId);
      fetchRooms();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete room");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-background">
        <AdminNavbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Rooms Management</h1>
              <p className="text-text-secondary mt-1">
                Manage rooms and their occupancy.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-text-primary rounded-lg transition font-medium"
            >
              <Plus size={20} />
              Add Room
            </button>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-background-card rounded-xl"
                />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center justify-center p-8 bg-error/10 rounded-xl border border-error/30 text-error">
              <AlertCircle className="mr-2" size={20} />
              {error}
            </div>
          )}

          {!loading && !error && rooms.length === 0 && (
            <div className="text-center py-16 bg-background-card rounded-xl border border-border">
              <div className="bg-background-muted rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Home className="h-8 w-8 text-text-muted" />
              </div>
              <h3 className="text-lg font-medium">No rooms found</h3>
              <p className="mt-1 text-text-secondary text-sm">
                Get started by creating a new room.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-text-primary font-medium"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Add First Room
                </button>
              </div>
            </div>
          )}

          {!loading && !error && rooms.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => {
                const isFull = room.occupiedCount >= room.capacity;
                const percentFull = Math.round(
                  (room.occupiedCount / room.capacity) * 100
                );

                return (
                  <div
                    key={room._id}
                    className="bg-background-card rounded-xl border border-border hover:border-primary/50 transition group"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2.5 rounded-lg ${
                              isFull
                                ? "bg-error/10 text-error"
                                : "bg-success/10 text-success"
                            }`}
                          >
                            <Home size={22} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">
                              Room {room.roomNumber}
                            </h3>
                            <span
                              className={`text-xs font-semibold ${
                                isFull ? "text-error" : "text-success"
                              }`}
                            >
                              {isFull ? "Full Occupancy" : "Available"}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => handleDeleteRoom(room._id)}
                            className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition"
                            title="Delete Room"
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className="text-right">
                            <p className="text-lg font-bold flex items-center">
                              <IndianRupee size={16} className="text-text-muted" />
                              {room.rentAmount.toLocaleString("en-IN")}
                            </p>
                            <p className="text-xs text-text-muted">/month</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary flex items-center gap-1.5">
                            <Users size={16} /> Occupancy
                          </span>
                          <span className="font-medium">
                            {room.occupiedCount} / {room.capacity}
                          </span>
                        </div>

                        <div className="h-2 w-full bg-background-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isFull ? "bg-error" : "bg-primary"
                            }`}
                            style={{ width: `${percentFull}%` }}
                          />
                        </div>

                        {/* Residents */}
                        <div className="mt-5 pt-4 border-t border-border">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-semibold">
                              Assigned Residents
                            </h4>
                            {!isFull && (
                              <button
                                onClick={() =>
                                  router.push(
                                    `/admin/rooms/assign?roomId=${room._id}`
                                  )
                                }
                                className="text-xs flex items-center gap-1 text-primary hover:underline font-medium"
                              >
                                <UserPlus size={14} /> Assign
                              </button>
                            )}
                          </div>

                          {room.tenants?.length ? (
                            <div className="space-y-2">
                              {room.tenants.map((tenant) => (
                                <div
                                  key={tenant._id}
                                  className="flex justify-between items-center p-2 bg-background-muted rounded-lg text-sm group/tenant"
                                >
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    <div className="p-1.5 bg-background-card rounded-full text-text-muted border border-border">
                                      <User size={12} />
                                    </div>
                                    <div className="truncate">
                                      <p className="font-medium truncate">
                                        {tenant.username || "Unknown"}
                                      </p>
                                      <p className="text-[10px] text-text-muted truncate">
                                        {tenant.email}
                                      </p>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() =>
                                      handleRemoveTenant(tenant._id)
                                    }
                                    className="opacity-0 group-hover/tenant:opacity-100 p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded transition"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 bg-background-muted rounded-lg border border-dashed border-border">
                              <p className="text-xs text-text-muted">
                                No residents assigned
                              </p>
                              <button
                                onClick={() =>
                                  router.push(
                                    `/admin/rooms/assign?roomId=${room._id}`
                                  )
                                }
                                className="mt-2 text-xs text-primary font-medium hover:underline"
                              >
                                + Assign Resident
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-background-card rounded-2xl max-w-md w-full border border-border">
              <div className="flex justify-between items-center p-6 border-b border-border">
                <h3 className="text-xl font-bold">Add New Room</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-text-muted hover:text-text-primary"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {["roomNumber", "floor", "capacity", "rentAmount"].map(
                  (field) => (
                    <input
                      key={field}
                      name={field}
                      required
                      type="number"
                      value={(formData as any)[field]}
                      onChange={handleInputChange}
                      placeholder={field}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background-muted text-text-primary focus:ring-2 focus:ring-ring outline-none"
                    />
                  )
                )}

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-background-muted hover:bg-background-card rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-text-primary rounded-lg font-medium disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Create Room"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
