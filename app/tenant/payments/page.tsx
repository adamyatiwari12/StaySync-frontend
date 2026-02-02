"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import API from "@/lib/axios";
import { getMyPayments } from "@/services/payment.service";
import { Payment } from "@/types/payment";
import ProtectedRoute from "@/components/home/ProtectedRoute";
import TenantNavbar from "@/components/layout/TenantNavbar";
import {
  CreditCard,
  Loader2,
  CheckCircle,
  AlertCircle,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function TenantPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const router = useRouter();

  const fetchPayments = async () => {
    try {
      const { data } = await getMyPayments();
      const sorted = data.sort((a: Payment, b: Payment) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });
      setPayments(sorted);
    } catch (err) {
      console.error("Failed to fetch payments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const getMonthName = (month: number) =>
    new Date(2024, month - 1).toLocaleString("default", { month: "long" });

  const getStatusColor = (status: string) =>
    status === "paid"
      ? "bg-success/10 text-success border-success/30"
      : "bg-warning/10 text-warning border-warning/30";

  const handlePay = async () => {
    if (!selectedPayment) return;

    try {
      const { data } = await API.post(
        `/payments/${selectedPayment._id}/razorpay/order`
      );

      const rzp = new (window as any).Razorpay({
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "StaySync",
        description: "Monthly Rent",
        order_id: data.orderId,
        theme: { color: "#6366f1" },

        handler: async (response: any) => {
          try {
            await API.post("/payments/razorpay/verify", {
              paymentId: selectedPayment._id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            alert("Payment successful 🎉");
            setSelectedPayment(null);
            router.push("/tenant/dashboard");
          } catch (error) {
            console.error("Verification failed", error);
            alert("Payment verification failed, please contact support");
          }
        },

        modal: {
          ondismiss: () => {
            setSelectedPayment(null);
          },
        },
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Failed to initiate payment");
    }
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
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />

        <main className="max-w-7xl mx-auto p-6 space-y-8">

          <div>
            <h1 className="text-3xl font-bold text-text-primary">Payments</h1>
            <p className="text-text-secondary mt-1">
              View and pay your monthly rent
            </p>
          </div>

          <div className="bg-background-card border border-border rounded-2xl overflow-hidden">
            {payments.length === 0 ? (
              <div className="p-12 text-center">
                <CreditCard className="w-8 h-8 mx-auto text-text-muted mb-3" />
                <p className="text-text-secondary">No payments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-background-muted text-text-secondary">
                    <tr>
                      <th className="px-6 py-4 text-left">Month</th>
                      <th className="px-6 py-4 text-left">Room</th>
                      <th className="px-6 py-4 text-left">Amount</th>
                      <th className="px-6 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-left">Paid On</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {payments.map((p) => (
                      <tr key={p._id} className="hover:bg-background-muted/30">
                        <td className="px-6 py-4 font-medium">
                          {getMonthName(p.month)} {p.year}
                        </td>

                        <td className="px-6 py-4 flex items-center gap-2">
                          <Home className="w-4 h-4 text-text-muted" />
                          Room {p.roomId?.roomNumber}
                        </td>

                        <td className="px-6 py-4 font-semibold">
                          ₹{p.amount}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 text-xs rounded-full border ${getStatusColor(
                              p.status
                            )}`}
                          >
                            {p.status === "paid" ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <AlertCircle className="w-3 h-3 mr-1" />
                            )}
                            {p.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-text-secondary">
                          {p.paidAt
                            ? new Date(p.paidAt).toLocaleDateString("en-IN")
                            : "—"}
                        </td>

                        <td className="px-6 py-4 text-right">
                          {p.status === "pending" ? (
                            <button
                              onClick={() => setSelectedPayment(p)}
                              className="bg-primary text-white px-4 py-2 rounded-lg text-xs hover:bg-primary/90 transition"
                            >
                              Pay Now
                            </button>
                          ) : (
                            <span className="text-text-muted text-xs">
                              Completed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {selectedPayment && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-background-card p-6 rounded-2xl border border-border w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>

              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between">
                  <span>Month</span>
                  <span className="font-medium">
                    {getMonthName(selectedPayment.month)}{" "}
                    {selectedPayment.year}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Room</span>
                  <span className="font-medium">
                    {selectedPayment.roomId?.roomNumber}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    ₹{selectedPayment.amount}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePay}
                  className="w-full bg-primary text-white py-3 rounded-xl hover:bg-primary/90 transition"
                >
                  Pay with Razorpay
                </button>

                <button
                  onClick={() => setSelectedPayment(null)}
                  className="w-full text-sm text-text-secondary hover:text-text-primary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
