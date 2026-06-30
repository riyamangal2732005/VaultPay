"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DashboardStats {
  totalClients: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalRevenue: number;
}

export default function AdminPage() {
  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if(!token){
      router.replace("/login");
      return;
    }
    setAuthorized(true);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(response.data.stats);
    } catch (error) {
      console.error(error);
    }
  };
  if(!authorized){
    return null;
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-2">
        Dashboard
      </h1>

      <p className="text-gray-500 mb-8">
        Welcome back. Here's what's happening today.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">

        <div className="bg-emerald-600 text-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm opacity-80">
            Total Revenue
            </p>

            <h2 className="text-4xl font-bold mt-3">
            ₹{stats?.totalRevenue || 0}
            </h2>

            <p className="text-sm mt-3 opacity-80">
            Paid invoices revenue
            </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow border">
            <p className="text-gray-500 text-sm">
            Total Clients
            </p>

            <h2 className="text-4xl font-bold mt-3">
            {stats?.totalClients || 0}
            </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow border">
            <p className="text-gray-500 text-sm">
            Total Invoices
            </p>

            <h2 className="text-4xl font-bold mt-3">
            {stats?.totalInvoices || 0}
            </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow border">
            <p className="text-gray-500 text-sm">
            Pending Payments
            </p>

            <h2 className="text-4xl font-bold mt-3">
            {stats?.pendingInvoices || 0}
            </h2>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border">
          <p className="text-gray-500">
            Overdue
          </p>

          <h2 className="text-3xl font-bold text-red-600">
            {stats?.overdueInvoices || 0}
          </h2>
        </div>
        </div>
        <div className="bg-white rounded-2xl shadow border p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                Recent Invoices
                </h2>

                <Link
                  href="/invoices"
                  className="text-blue-600 hover:text-blue-800 font-medium transition"
                >
                  View All →
                </Link>
            </div>

            <table className="w-full">
                <thead>
                <tr className="border-b">
                    <th className="text-left py-3">
                    Invoice
                    </th>

                    <th className="text-left py-3">
                    Client
                    </th>

                    <th className="text-left py-3">
                    Amount
                    </th>

                    <th className="text-left py-3">
                    Status
                    </th>
                </tr>
                </thead>

                <tbody>
                <tr>
                    <td className="py-4">
                    INV-001
                    </td>

                    <td>
                    ABC Corp
                    </td>

                    <td>
                    ₹5000
                    </td>

                    <td>
                    Pending
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </DashboardLayout>
  );
}