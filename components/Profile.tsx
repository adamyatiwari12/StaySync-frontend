"use client";

import { useEffect, useState, FormEvent } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getProfile, updateProfile } from "@/services/user.services";
import { UpdateProfileData } from "@/types/user";
import { AxiosError } from "axios";
import {
  User,
  Mail,
  Shield,
  Camera,
  Loader2,
  Save,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  name?: string;
  role: string;
}

interface ProfileProps {
  navbar: React.ReactNode;
  role: "admin" | "tenant";
}

export default function Profile({ navbar, role }: ProfileProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<UpdateProfileData>({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await getProfile();
        setUser(res.data);
        setForm({
          name: res.data.name || "",
          email: res.data.email,
        });
      } catch {
        setError("Failed to load profile");
      }
    };
    fetchMe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await updateProfile(form);
      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: res.data.user.name,
              email: res.data.user.email,
            }
          : prev
      );
      setSuccess("Profile updated successfully");
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Update failed");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  const getInitials = (name?: string) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "A";

  return (
    <ProtectedRoute allowedRoles={[role]}>
      <div className="min-h-screen bg-background">
        {navbar}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8 text-center sm:text-left">
              <h1 className="text-3xl font-bold tracking-tight">
                Profile Settings
              </h1>
              <p className="text-text-secondary mt-2">
                Manage your admin account information
              </p>
            </div>

            <div className="bg-background-card rounded-3xl border border-border overflow-hidden">
              {/* Cover */}
              <div className="h-32 bg-background-muted" />

              <div className="px-8 pb-8">
                {/* Avatar */}
                <div className="relative -mt-16 mb-6 flex flex-col items-center sm:items-start">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-background bg-background-card flex items-center justify-center overflow-hidden">
                      {user ? (
                        <div className="w-full h-full bg-background-muted flex items-center justify-center text-4xl font-bold text-primary">
                          {getInitials(user.name)}
                        </div>
                      ) : (
                        <div className="w-full h-full bg-background-muted animate-pulse" />
                      )}
                    </div>

                    <button className="absolute bottom-1 right-1 p-2 bg-background-muted text-text-primary rounded-full opacity-0 group-hover:opacity-100 transition">
                      <Camera size={16} />
                    </button>
                  </div>

                  <div className="mt-4 text-center sm:text-left">
                    <h2 className="text-2xl font-bold">
                      {user?.name || "Loading..."}
                    </h2>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-text-secondary">
                      <Shield size={14} className="text-primary" />
                      <span className="text-sm font-medium capitalize">
                        {user?.role || "admin"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/30 text-error text-sm font-medium">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-6 p-4 rounded-xl bg-success/10 border border-success/30 text-success text-sm font-medium">
                    {success}
                  </div>
                )}

                {/* Form */}
                {user && (
                  <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
                    <div className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-semibold mb-1.5">
                          Full Name
                        </label>
                        <div className="relative">
                          <User
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                            size={18}
                          />
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background-muted text-text-primary focus:ring-2 focus:ring-ring outline-none transition"
                            placeholder="Enter your name"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                            size={18}
                          />
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background-muted text-text-primary focus:ring-2 focus:ring-ring outline-none transition"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center px-6 py-2.5 bg-primary hover:bg-primary-dark text-text-primary rounded-xl font-medium transition disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2
                              size={18}
                              className="mr-2 animate-spin"
                            />
                            Saving Changes
                          </>
                        ) : (
                          <>
                            <Save size={18} className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Logout */}
              <div className="bg-background-muted px-8 py-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold">Sign Out</h3>
                    <p className="text-sm text-text-secondary mt-1">
                      Securely log out of your account
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center px-5 py-2.5 text-error bg-error/10 hover:bg-error/20 border border-error/30 rounded-xl font-medium transition"
                  >
                    <LogOut size={18} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
