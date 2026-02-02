"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/home/ProtectedRoute";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { createPayment } from "@/services/payment.service";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";

interface Tenant {
  _id: string;
  username: string;
  roomId?: {
    _id: string;
    roomNumber: string;
  };
}

export default function CreatePaymentPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantId, setTenantId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchTenants = async () => {
      const res = await API.get("/users/tenants");
      setTenants(res.data);
    };
    fetchTenants();
  }, []);

  const handleTenantChange = (id: string) => {
    setTenantId(id);
    const tenant = tenants.find((t) => t._id === id);
    setRoomId(tenant?.roomId?._id || "");
  };

  const handleSubmit = async () => {
    if (!tenantId || !roomId || !amount) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      await createPayment({
        tenantId,
        roomId,
        amount: Number(amount),
        month,
        year,
      });
      alert("Payment created successfully");
      setAmount("");
      router.push("/admin/payments");
    } catch (error: any) {
      alert(
        error?.response?.data?.message || "Failed to create payment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-background">
        <AdminNavbar />

        <div className="max-w-xl mx-auto p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-text-primary mb-6">
            Create Payment
          </h1>

          <div className="bg-background-card border border-border rounded-xl p-6 space-y-5">

            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Tenant
              </label>
              <select
                value={tenantId}
                onChange={(e) => handleTenantChange(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary"
              >
                <option value="">Select tenant</option>
                {tenants.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.username}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Room
              </label>
              <input
                value={
                  tenants.find((t) => t._id === tenantId)?.roomId
                    ?.roomNumber || ""
                }
                disabled
                className="w-full bg-background-muted border border-border rounded-md px-3 py-2 text-text-secondary"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">
                  Month
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary"
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Payment"}
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
