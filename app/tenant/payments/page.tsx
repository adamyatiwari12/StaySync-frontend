"use client";

import { useEffect, useState } from "react";
import { getMyPayments } from "@/services/payment.service";
import { Payment } from "@/types/payment";
import ProtectedRoute from "@/components/ProtectedRoute";
import TenantNavbar from "@/components/layout/TenantNavbar";
import {
  CreditCard,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function TenantPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const fetchPayments = async () => {
    try {
      const { data } = await getMyPayments();
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

  const getStatusColor = (status: string) => {
    return status === "paid"
      ? "bg-success/10 text-success border-success/30"
      : "bg-warning/10 text-warning border-warning/30";
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["tenant"]}>
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["tenant"]}>
      <div className="min-h-screen bg-background">
        <TenantNavbar />

        <div className="max-w-7xl mx-auto space-y-6 p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                My Payments
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                View your rent payment history and status
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-background-card border border-border text-text-secondary">
              Total Records: {payments.length}
            </span>
          </div>

          {/* Table */}
          <div className="bg-background-card rounded-xl border border-border overflow-hidden">
            {payments.length === 0 ? (
              <div className="p-12 text-center">
                <CreditCard className="w-6 h-6 mx-auto text-text-muted mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-1">
                  No payments found
                </h3>
                <p className="text-text-secondary text-sm">
                  Your payment history will appear here
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-background-muted border-b border-border text-text-secondary">
                    <tr>
                      <th className="px-6 py-4">Month</th>
                      <th className="px-6 py-4">Room</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Paid On</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {payments.map((p) => (
                      <tr
                        key={p._id}
                        className="hover:bg-background-muted/50 transition"
                      >
                        <td className="px-6 py-4 font-medium text-text-primary">
                          {new Date(
                            p.year,
                            p.month - 1
                          ).toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                          })}
                        </td>

                        <td className="px-6 py-4 text-text-primary">
                          Room {p.roomId.roomNumber}
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
                          {p.status === "pending" ? (
                            <button
                              onClick={() => setSelectedPayment(p)}
                              className="text-xs bg-primary text-white hover:bg-primary/90 px-3 py-1.5 rounded-md transition"
                            >
                              Pay
                            </button>
                          ) : (
                            <span className="text-text-muted text-sm">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* PAYMENT MODAL */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-background-card border border-border rounded-xl w-full max-w-md p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-2">
                Pay Rent
              </h2>

              <p className="text-sm text-text-secondary mb-4">
                Month:{" "}
                {new Date(
                  selectedPayment.year,
                  selectedPayment.month - 1
                ).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <div className="space-y-3">
                <button className="w-full border border-border rounded-lg px-4 py-2 hover:bg-background-muted transition">
                  Pay via UPI
                </button>

                <button className="w-full border border-border rounded-lg px-4 py-2 hover:bg-background-muted transition">
                  Bank Transfer
                </button>

                <button className="w-full border border-border rounded-lg px-4 py-2 hover:bg-background-muted transition">
                  Cash
                </button>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-sm text-text-secondary hover:text-text-primary"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    alert(
                      "Payment submitted. Please wait for admin confirmation."
                    );
                    setSelectedPayment(null);
                  }}
                  className="text-sm bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
                >
                  I’ve Paid
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
