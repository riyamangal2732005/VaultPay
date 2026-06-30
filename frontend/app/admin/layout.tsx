"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRole, getToken } from "@/lib/auth";
import { toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();
    const role = getRole();

    // Not logged in
    if (!token) {
        toast.error("Please login first");
        router.replace("/login");
        return;
    }

    // Client trying to access admin
    if (role !== "admin") {
        toast.error("You are not authorized to access this page");
        router.replace("/client/dashboard");
        return;
    }
    setAuthorized(true);
  }, [router]);

  if(!authorized){
    return null;
  }

  return <>{children}</>;
}