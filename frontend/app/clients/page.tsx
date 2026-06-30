"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import api from "@/lib/api";

interface Client {
  _id: string;
  name: string;
  email: string;
  companyName: string;
  phone: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/clients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      setClients(response.data.clients);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
  <div className="flex justify-between items-center mb-8">
    <div>
      <h1 className="text-3xl font-bold">
        Clients
      </h1>

      <p className="text-gray-500">
        Manage all clients
      </p>
    </div>

    <a
      href="/clients/create"
      className="bg-slate-900 text-white px-5 py-3 rounded-xl"
    >
      Create Client
    </a>
  </div>

  <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
    <table className="w-full">
      <thead className="bg-slate-50">
        <tr>
          <th className="text-left p-4">
            Name
          </th>

          <th className="text-left p-4">
            Email
          </th>

          <th className="text-left p-4">
            Company
          </th>

          <th className="text-left p-4">
            Phone
          </th>
        </tr>
      </thead>

      <tbody>
        {clients.map((client) => (
          <tr
            key={client._id}
            className="border-t"
          >
            <td className="p-4">
              {client.name}
            </td>

            <td className="p-4">
              {client.email}
            </td>

            <td className="p-4">
              {client.companyName}
            </td>

            <td className="p-4">
              {client.phone}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</DashboardLayout>
  );
}