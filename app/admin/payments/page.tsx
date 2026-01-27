"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPayments, markPaymentAsPaid, deletePayment } from "@/services/payment.service";
import { Payment } from "@/types/payment";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminNavbar from "@/components/layout/AdminNavbar";
import {
  Search,
  Filter,
  Loader2,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Trash2,
} from "lucide-react";
import { AxiosError } from "axios";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid">(
    "all"
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      const { data } = await getPayments();
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleMarkPaid = async (id: string) => {
    setUpdatingId(id);
    try {
      await markPaymentAsPaid(id);

      setPayments((prev) =>
        prev.map((p) =>
          p._id === id
            ? { ...p, status: "paid", paidAt: new Date().toISOString() }
            : p
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment record?")) return;

    try {
      setPayments((prev) => prev.filter((p) => p._id !== id));
      await deletePayment(id);
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data?.message || "Delete failed");
      } else {
        alert("Something went wrong");
      }
      fetchPayments();
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      (payment.tenantId?.username?.toLowerCase() || "").includes(search) ||
      (payment.tenantId?.email?.toLowerCase() || "").includes(search) ||
      (payment.roomId?.roomNumber?.toLowerCase() || "").includes(search);

    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    return status === "paid"
      ? "bg-success/10 text-success border-success/30"
      : "bg-warning/10 text-warning border-warning/30";
  };

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
              <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
              <p className="text-sm text-text-secondary mt-1">
                Track rent payments and transaction history
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-background-card border border-border text-text-secondary">
                Total Records: {payments.length}
              </span>

              <Link href="/admin/payments/create">
                <button className="bg-primary text-white text-sm px-4 py-2 rounded-md hover:bg-primary/90 transition">
                  + Create Payment
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-background-card p-4 rounded-xl border border-border flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="text"
                placeholder="Search by tenant, email, or room..."
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
                  setStatusFilter(
                    e.target.value as "all" | "pending" | "paid"
                  )
                }
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
              <MoreVertical className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            </div>
          </div>

          <div className="bg-background-card rounded-xl border border-border overflow-hidden">
            {filteredPayments.length === 0 ? (
              <div className="p-12 text-center">
                <CreditCard className="w-6 h-6 mx-auto text-text-muted mb-4" />
                <h3 className="text-lg font-medium mb-1">
                  No payments found
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
                      <th className="px-6 py-4">Tenant</th>
                      <th className="px-6 py-4">Room</th>
                      <th className="px-6 py-4">Month</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Paid On</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {filteredPayments.map((p) => (
                      <tr
                        key={p._id}
                        className="hover:bg-background-muted/50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-text-primary">
                            {p.tenantId.username}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {p.tenantId.email}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-text-primary">
                          Room {p.roomId.roomNumber}
                        </td>

                        <td className="px-6 py-4 text-text-secondary">
                          {new Date(
                            p.year,
                            p.month - 1
                          ).toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                          })}
                        </td>

                        <td className="px-6 py-4 font-medium text-text-primary">
                          ₹{p.amount}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${getStatusColor(
                              p.status
                            )}`}
                          >
                            {p.status === "paid" ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <AlertCircle className="w-3 h-3 mr-1" />
                            )}
                            <span className="capitalize">{p.status}</span>
                          </span>
                        </td>

                        <td className="px-6 py-4 text-text-secondary">
                          {p.paidAt
                            ? new Date(p.paidAt).toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="px-6 py-4 text-right">
                          {p.status === "pending" && (
                            <button
                              onClick={() => handleMarkPaid(p._id)}
                              disabled={updatingId === p._id}
                              className="text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-1.5 rounded-md transition disabled:opacity-50"
                            >
                              {updatingId === p._id
                                ? "Updating..."
                                : "Mark Paid"}
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(p._id)}
                            className="text-text-muted hover:text-error transition ml-3 p-1"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
