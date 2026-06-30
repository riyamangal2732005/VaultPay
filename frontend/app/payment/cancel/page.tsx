"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PaymentCancelPage() {
  const router = useRouter();

  useEffect(() => {
    toast.error("Payment Cancelled");

    setTimeout(() => {
      router.push("/client/invoices");
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-red-600">
        Payment Cancelled
      </h1>
    </div>
  );
}