import { useRouter } from "next/navigation"
import { Room } from "@/types/room"
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

type RoomCardProps = {
    room: Room,
    handleDeleteRoom: (roomId: string) => void,
    handleRemoveTenant: (tenantId: string) => void,
}

export default function RoomCard({ room, handleDeleteRoom, handleRemoveTenant }: RoomCardProps) {
    const isFull = room.occupiedCount >= room.capacity;
    const percentFull = Math.round(
        (room.occupiedCount / room.capacity) * 100
    );
    const router = useRouter();
    return (

        <div
            key={room._id}
            className="bg-background-card rounded-xl border border-border hover:border-primary/50 transition group"
        >
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`p-2.5 rounded-lg ${isFull
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
                                className={`text-xs font-semibold ${isFull ? "text-error" : "text-success"
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
                            className={`h-full rounded-full ${isFull ? "bg-error" : "bg-primary"
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
    )
}


