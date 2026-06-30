"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    toast.success("Payment Successful!");

    setTimeout(() => {
      router.push("/client/invoices");
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-green-600">
        Payment Successful
      </h1>
    </div>
  );
}