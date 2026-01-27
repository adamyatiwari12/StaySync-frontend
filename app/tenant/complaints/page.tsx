"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import TenantNavbar from "@/components/layout/TenantNavbar";
import {
  getMyComplaints,
  createComplaint,
} from "@/services/complaint.service";
import { Complaint } from "@/types/complaint";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Wrench,
  Zap,
  Droplets,
  Wifi,
  Loader2,
  X,
} from "lucide-react";
import { AxiosError } from "axios";

const CATEGORIES: Record<
  string,
  { icon: any; text: string; bg: string }
> = {
  Maintenance: {
    icon: Wrench,
    text: "text-primary",
    bg: "bg-primary/10",
  },
  Plumbing: {
    icon: Droplets,
    text: "text-info",
    bg: "bg-info/10",
  },
  Electrical: {
    icon: Zap,
    text: "text-warning",
    bg: "bg-warning/10",
  },
  Internet: {
    icon: Wifi,
    text: "text-secondary",
    bg: "bg-secondary/10",
  },
  Other: {
    icon: AlertCircle,
    text: "text-text-secondary",
    bg: "bg-background-muted",
  },
};

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    category: "Maintenance",
    description: "",
  });

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await getMyComplaints();
      setComplaints(res.data);
    } catch {
      setError("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    setSubmitting(true);
    try {
      await createComplaint(formData);
      setFormData({ category: "Maintenance", description: "" });
      setIsModalOpen(false);
      fetchComplaints();
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(
          err.response?.data?.message ||
            "Failed to submit complaint"
        );
      } else {
        alert("Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "resolved":
        return {
          text: "text-success",
          bg: "bg-success/10",
          icon: CheckCircle,
          label: "Resolved",
        };
      case "in_progress":
        return {
          text: "text-primary",
          bg: "bg-primary/10",
          icon: Clock,
          label: "In Progress",
        };
      default:
        return {
          text: "text-error",
          bg: "bg-error/10",
          icon: AlertCircle,
          label: "Open",
        };
    }
  };

  return (
    <ProtectedRoute allowedRoles={["tenant"]}>
      <div className="min-h-screen bg-background">
        <TenantNavbar />

        <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                My Complaints
              </h1>
              <p className="text-text-secondary">
                Report and track issues with your stay
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition font-medium"
            >
              <Plus size={18} />
              Raise Complaint
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-40 rounded-2xl bg-background-muted animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && complaints.length === 0 && (
            <div className="text-center py-16 bg-background-card border border-border rounded-2xl">
              <CheckCircle className="mx-auto mb-4 text-success" size={32} />
              <h3 className="font-semibold text-text-primary">
                No complaints raised
              </h3>
              <p className="text-text-secondary text-sm mt-1">
                Everything looks good so far 🎉
              </p>
            </div>
          )}

          {/* Complaints */}
          <div className="grid md:grid-cols-2 gap-4">
            {complaints.map((c) => {
              const status = getStatusStyle(c.status);
              const cat = CATEGORIES[c.category] || CATEGORIES.Other;
              const Icon = cat.icon;

              return (
                <div
                  key={c._id}
                  className="bg-background-card border border-border rounded-2xl p-5 hover:border-primary/50 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${cat.bg} ${cat.text}`}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-xs uppercase text-text-secondary">
                          {c.category}
                        </p>
                        <p className="font-semibold text-text-primary">
                          Room {c.roomId.roomNumber}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                    >
                      <status.icon size={14} />
                      {status.label}
                    </span>
                  </div>

                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                    {c.description}
                  </p>

                  <div className="flex justify-between items-center text-xs text-text-secondary border-t border-border pt-3">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                    {c.resolvedAt && (
                      <span className="flex items-center gap-1 text-success">
                        <CheckCircle size={12} />
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-background-card border border-border rounded-2xl w-full max-w-md">
                <div className="p-5 border-b border-border flex justify-between">
                  <h3 className="font-bold text-text-primary">
                    Raise Complaint
                  </h3>
                  <button onClick={() => setIsModalOpen(false)}>
                    <X />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  >
                    {Object.keys(CATEGORIES).map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>

                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2"
                    placeholder="Describe the issue..."
                  />

                  <button
                    disabled={submitting}
                    className="w-full py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin mx-auto" />
                    ) : (
                      "Submit Complaint"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
