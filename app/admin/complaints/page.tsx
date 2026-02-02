"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/home/ProtectedRoute";
import {
  getComplaints,
  updateComplaintStatus,
} from "@/services/complaint.service";
import { Complaint, ComplaintStatus } from "@/types/complaint";
import { AxiosError } from "axios";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  Loader2,
} from "lucide-react";
import AdminNavbar from "@/components/layout/AdminNavbar";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<ComplaintStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await getComplaints();
        setComplaints(res.data);
      } catch {
        setError("Failed to load issues");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleStatusChange = async (
    complaintId: string,
    newStatus: ComplaintStatus
  ) => {
    setUpdatingId(complaintId);
    try {
      await updateComplaintStatus(complaintId, newStatus);
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === complaintId
            ? {
              ...c,
              status: newStatus,
              resolvedAt:
                newStatus === "resolved"
                  ? new Date().toISOString()
                  : null,
            }
            : c
        )
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data?.message || "Update failed");
      } else {
        alert("Something went wrong");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case "resolved":
        return "bg-success/10 text-success border-success/30";
      case "in_progress":
        return "bg-secondary/10 text-secondary border-secondary/30";
      case "open":
        return "bg-error/10 text-error border-error/30";
      default:
        return "bg-background-muted text-text-secondary border-border";
    }
  };

  const getStatusIcon = (status: ComplaintStatus) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case "in_progress":
        return <Clock className="w-4 h-4 mr-1" />;
      case "open":
        return <AlertCircle className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const search = searchTerm.toLowerCase();
    return (
      (complaint.tenantId?.name?.toLowerCase() || "").includes(search) ||
      (complaint.description?.toLowerCase() || "").includes(search) ||
      (complaint.category?.toLowerCase() || "").includes(search)
    ) &&
      (statusFilter === "all" || complaint.status === statusFilter);
  });

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-background">
        <AdminNavbar />

        <div className="max-w-7xl mx-auto space-y-6 p-6 sm:p-8">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Issues</h1>
              <p className="text-sm text-text-secondary mt-1">
                Manage and track resident issues and requests
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-background-card border border-border text-text-secondary">
              Total: {complaints.length}
            </span>
          </div>

          <div className="bg-background-card p-4 rounded-xl border border-border flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="text"
                placeholder="Search by resident, category, or description..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background-muted text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-ring outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <select
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background-muted text-text-primary focus:ring-2 focus:ring-ring outline-none text-sm appearance-none"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as ComplaintStatus | "all")
                }
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <MoreVertical className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            </div>
          </div>

          {error && (
            <div className="bg-error/10 text-error p-4 rounded-lg text-sm border border-error/30 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <div className="bg-background-card rounded-xl border border-border overflow-hidden">
            {filteredComplaints.length === 0 ? (
              <div className="p-12 text-center">
                <Search className="w-6 h-6 mx-auto text-text-muted mb-4" />
                <h3 className="text-lg font-medium mb-1">
                  No issues found
                </h3>
                <p className="text-text-secondary text-sm">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-background-muted border-b border-border text-text-secondary">
                    <tr>
                      <th className="px-6 py-4">Resident</th>
                      <th className="px-6 py-4">Issue</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredComplaints.map((c) => (
                      <tr
                        key={c._id}
                        className="hover:bg-background-muted/50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium">
                            {c.tenantId.name}
                          </div>
                          <div className="text-xs text-text-muted mt-0.5">
                            Room {c.roomId.roomNumber}
                          </div>
                        </td>

                        <td className="px-6 py-4 max-w-xs truncate">
                          {c.description}
                        </td>

                        <td className="px-6 py-4">
                          <span className="px-2.5 py-0.5 rounded-full text-xs bg-background-muted border border-border">
                            {c.category}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${getStatusColor(
                              c.status
                            )}`}
                          >
                            {getStatusIcon(c.status)}
                            {c.status.replace("_", " ")}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-text-secondary">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <select
                            disabled={updatingId === c._id}
                            value={c.status}
                            onChange={(e) =>
                              handleStatusChange(
                                c._id,
                                e.target.value as ComplaintStatus
                              )
                            }
                            className="text-xs border border-border rounded-md py-1.5 pl-2 pr-8 bg-background-muted text-text-primary focus:ring-2 focus:ring-ring outline-none disabled:opacity-50"
                          >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
