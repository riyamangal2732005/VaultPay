"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRole, getToken } from "@/lib/auth";
import { toast } from "sonner";

export default function ClientLayout({
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
        toast.error("pls login first");
        router.replace("/login");
        return;
    }

    // Admin trying to access client
    if (role !== "client") {
        toast.error("You are not authorized");
        router.replace("/admin");
        return;
    }
    setAuthorized(true);
  }, [router]);
  if(!authorized){
    return null;
  }

  return <>{children}</>;
}