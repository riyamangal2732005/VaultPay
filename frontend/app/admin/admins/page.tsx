"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import api from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";

interface Admin {
  _id: string;
  name: string;
  email: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/admins", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAdmins(response.data.admins);

    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        "Failed to fetch admins"
      );
    }
  };

  return (
    <DashboardLayout>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Admins
        </h1>

        <Link
          href="/admin/admins/create"
          className="bg-slate-900 text-white px-5 py-2 rounded-xl"
        >
          + Create Admin
        </Link>

      </div>

      <div className="bg-white rounded-xl shadow border">

        <table className="w-full">

          <thead className="border-b">

            <tr>

              <th className="text-left p-4">
                Name
              </th>

              <th className="text-left p-4">
                Email
              </th>

            </tr>

          </thead>

          <tbody>

            {admins.map((admin) => (

              <tr
                key={admin._id}
                className="border-b"
              >

                <td className="p-4">
                  {admin.name}
                </td>

                <td className="p-4">
                  {admin.email}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}