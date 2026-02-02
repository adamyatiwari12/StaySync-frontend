"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/home/ProtectedRoute";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { getRooms, createRoom, removeTenant, deleteRoom } from "@/services/room.services";
import { Room } from "@/types/room";
import RoomCard from "@/components/admin/RoomCard";
import {
  Plus,
  Home,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";

export default function AdminRoomsPage() {

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
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      await deleteRoom(roomId);
      fetchRooms();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete room");
    }
  };

  /* GROUP ROOMS BY FLOOR */
  const groupRoomsByFloor = (rooms: Room[]) => {
    return rooms.reduce((acc, room) => {
      if (!acc[room.floor]) acc[room.floor] = [];
      acc[room.floor].push(room);
      return acc;
    }, {} as Record<number, Room[]>);
  };

  const getFloorLabel = (floor: number) => {
    if (floor === 0) return "Ground Floor";
    if (floor === 1) return "1st Floor";
    if (floor === 2) return "2nd Floor";
    if (floor === 3) return "3rd Floor";
    return `${floor}th Floor`;
  };

  const groupedRooms = groupRoomsByFloor(rooms);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-background">

        <AdminNavbar />

        {/* HEADER SECTION (CENTERED) */}
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

          {/* LOADING */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-background-card rounded-xl" />
              ))}
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="flex items-center justify-center p-8 bg-error/10 rounded-xl border border-error/30 text-error">
              <AlertCircle className="mr-2" size={20} />
              {error}
            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && rooms.length === 0 && (
            <div className="text-center py-16 bg-background-card rounded-xl border border-border">
              <Home className="mx-auto mb-3" />
              <h3 className="text-lg font-medium">No rooms found</h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
              >
                Add First Room
              </button>
            </div>
          )}

        </main>

        {/* FULL WIDTH FLOOR SECTIONS */}
        {!loading && !error && rooms.length > 0 && (
          <div className="space-y-10 pb-10">

            {Object.entries(groupedRooms)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([floor, floorRooms]) => (

                <div key={floor}>

                  {/* Floor Title */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
                    <h2 className="text-xl font-bold mb-2">
                      {getFloorLabel(Number(floor))}
                    </h2>
                  </div>

                  {/* Full Width Background */}
                  <div className="bg-background-muted py-6">

                    <div className=" mx-auto px-4 sm:px-6 lg:px-8">

                      <div className="
                        flex
                        gap-6
                        overflow-x-auto
                        overflow-y-hidden
                        no-scrollbar
                        scroll-smooth
                        [&::-webkit-scrollbar]:hidden
                      ">

                        {floorRooms.map((room) => (
                          <div key={room._id} className="min-w-[320px] max-w-[320px]">

                            <RoomCard
                              room={room}
                              handleRemoveTenant={handleRemoveTenant}
                              handleDeleteRoom={handleDeleteRoom}
                            />

                          </div>
                        ))}

                      </div>

                    </div>

                  </div>

                </div>
              ))}

          </div>
        )}

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-background-card rounded-2xl max-w-md w-full border border-border">

              <div className="flex justify-between items-center p-6 border-b border-border">
                <h3 className="text-xl font-bold">Add New Room</h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">

                {["roomNumber", "floor", "capacity", "rentAmount"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    required
                    type="number"
                    value={(formData as any)[field]}
                    onChange={handleInputChange}
                    placeholder={field}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background-muted"
                  />
                ))}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 bg-primary text-white rounded-lg"
                >
                  {submitting ? "Saving..." : "Create Room"}
                </button>

              </form>
            </div>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}
