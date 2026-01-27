"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
  allowedRoles?: ("admin" | "tenant")[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push("/signin");
      return;
    }

    const parsedUser = JSON.parse(user);

    if (allowedRoles && !allowedRoles.includes(parsedUser.role)) {
      router.push("/signin");
    }
  }, [router, allowedRoles]);

  return <>{children}</>;
}
