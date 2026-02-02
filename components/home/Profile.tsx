"use client";

import { useEffect, useState, FormEvent } from "react";
import ProtectedRoute from "@/components/home/ProtectedRoute";
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
  Lock,
  Smartphone,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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

type TabType = "general" | "security";

export default function Profile({ navbar, role }: ProfileProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [user, setUser] = useState<UserProfile | null>(null);

  // Form State
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

  // Tab Button Component
  const TabButton = ({
    id,
    label,
    icon: Icon,
  }: {
    id: TabType;
    label: string;
    icon: any;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === id
        ? "bg-primary text-white shadow-md shadow-primary/20"
        : "text-text-secondary hover:bg-background-muted"
        }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        <span className="font-medium">{label}</span>
      </div>
      {activeTab === id && <ChevronRight size={16} />}
    </button>
  );

  return (
    <ProtectedRoute allowedRoles={[role]}>
      <div className="min-h-screen bg-background pb-20">
        {navbar}

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold font-serif text-text-primary">
              Account Settings
            </h1>
            <p className="text-text-secondary mt-1">
              Manage your profile and security preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* SIDEBAR NAVIGATION */}
            <div className="lg:col-span-3 space-y-6">
              {/* Mini User Card */}
              <div className="flex items-center gap-4 p-4 bg-background-card border border-border rounded-2xl shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {getInitials(user?.name)}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-semibold text-text-primary truncate">
                    {user?.name || "User"}
                  </h3>
                  <p className="text-xs text-text-secondary capitalize">
                    {user?.role || role} Account
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="bg-background-card border border-border rounded-2xl p-2 shadow-sm space-y-1">
                <TabButton id="general" label="General" icon={User} />
                <TabButton id="security" label="Security" icon={Shield} />

                <div className="my-2 border-t border-border-muted mx-2"></div>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-error rounded-xl hover:bg-error/10 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Sign Out</span>
                </button>
              </nav>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                {activeTab === "general" && (
                  <motion.div
                    key="general"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* AVATAR SECTION */}
                    <div className="bg-background-card border border-border rounded-3xl p-8 shadow-sm">
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group cursor-pointer">
                          <div className="w-24 h-24 rounded-full border-4 border-background bg-background-muted flex items-center justify-center text-3xl font-bold text-primary overflow-hidden">
                            {user?.name ? getInitials(user.name) : <User />}
                          </div>
                          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white" size={24} />
                          </div>
                        </div>
                        <div className="text-center sm:text-left">
                          <h3 className="text-lg font-bold">Profile Picture</h3>
                          <p className="text-sm text-text-secondary mt-1 max-w-xs">
                            Upload a new avatar. Recommended size 400x400px.
                          </p>
                          <div className="mt-3 flex gap-3 justify-center sm:justify-start">
                            <button className="text-sm px-4 py-2 bg-background-muted hover:bg-border-muted border border-border rounded-lg transition font-medium">
                              Upload
                            </button>
                            <button className="text-sm px-4 py-2 text-error hover:bg-error/10 rounded-lg transition font-medium">
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BASIC INFO FORM */}
                    <div className="bg-background-card border border-border rounded-3xl p-8 shadow-sm">
                      <div className="mb-6">
                        <h2 className="text-xl font-bold">Personal Information</h2>
                        <p className="text-sm text-text-secondary">Update your personal details here.</p>
                      </div>

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

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold mb-2">Full Name</label>
                            <div className="relative">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                              <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background hover:bg-background-muted focus:bg-background text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                placeholder="Your Name"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-2">Email Address</label>
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                              <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background hover:bg-background-muted focus:bg-background text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                placeholder="name@example.com"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-border-muted">
                          <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium shadow-lg shadow-primary/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {loading ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
                            {loading ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}

                {activeTab === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* PASSWORD SECTION */}
                    <div className="bg-background-card border border-border rounded-3xl p-8 shadow-sm">
                      <div className="mb-6">
                        <h2 className="text-xl font-bold">Password & Security</h2>
                        <p className="text-sm text-text-secondary">Manage your password and security settings.</p>
                      </div>

                      <div className="space-y-6">
                        <div className="p-5 border border-border rounded-2xl bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-background-muted rounded-full text-text-primary">
                              <Lock size={20} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-text-primary">Change Password</h4>
                              <p className="text-sm text-text-secondary">Update your password regularly to keep your account secure.</p>
                            </div>
                          </div>
                          <button className="px-5 py-2 border border-border-muted hover:border-text-muted hover:bg-background-muted rounded-xl text-sm font-medium transition cursor-not-allowed opacity-60">
                            Update
                          </button>
                        </div>

                        <div className="p-5 border border-border rounded-2xl bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-background-muted rounded-full text-text-primary">
                              <Smartphone size={20} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-text-primary">Two-Factor Authentication</h4>
                              <p className="text-sm text-text-secondary">Add an extra layer of security to your account.</p>
                            </div>
                          </div>
                          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-border-muted">
                            <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
