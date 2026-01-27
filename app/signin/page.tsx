"use client";

import { useState, FC, FormEvent, ChangeEvent } from "react";
import { signin } from "@/services/auth.services";
import { useRouter } from "next/navigation";
import { LoginData } from "@/types/auth";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { getErrorMessage } from "@/lib/getErrorMessage";

interface FormErrors {
  email?: string;
  password?: string;
  stayId?: string;
}

const SigninPage: FC = () => {
  const router = useRouter();
  const [form, setForm] = useState<LoginData>({
    email: "",
    password: "",
    stayId: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.stayId.trim()) {
      newErrors.stayId = "Stay ID is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await signin(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      router.push(
        res.data.user.role === "admin"
          ? "/admin/dashboard"
          : "/tenant/dashboard"
      );
    } catch (error: unknown) {
      setApiError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 ">
      <div className="w-full max-w-md ">
        <div className="bg-background-card rounded-2xl border border-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-text-secondary">Sign in to StaySync</p>
          </div>

          {apiError && (
            <div className="mb-6 p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium mb-2">
                Stay ID
              </label>
              <input
                type="text"
                name="stayId"
                value={form.stayId}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.stayId ? "border-error" : "border-border"
                } bg-background-muted`}
              />
              {errors.stayId && (
                <p className="mt-2 text-sm text-error">
                  {errors.stayId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-text-muted" size={20} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.email ? "border-error" : "border-border"
                  } bg-background-muted`}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-error">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-text-muted" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.password ? "border-error" : "border-border"
                  } bg-background-muted`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-error">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-primary font-semibold"
            >
              Login
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
