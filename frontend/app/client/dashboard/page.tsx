"use client";

import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import Link from "next/link";

export default function ClientDashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">
        Client Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/client/invoices"
          className="bg-white border rounded-xl p-6 shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">
            My Invoices
          </h2>

          <p className="text-gray-500 mt-2">
            View and pay your invoices.
          </p>
        </Link>
      </div>
    </DashboardLayout>
  );
}