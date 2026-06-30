"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import { toast } from "sonner";

interface Client {
  _id: string;
  name: string;
}

export default function CreateInvoicePage() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    clientId: "",
    amount: "",
    description: "",
    dueDate: "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClients(response.data.clients);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch clients."
      )
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
        !formData.invoiceNumber ||
        !formData.clientId ||
        !formData.amount ||
        !formData.description ||
        !formData.dueDate
        ) {
        toast.error("Please fill all fields");
        return;
    }
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/invoices",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Invoice Created Successfully");

      router.push("/invoices");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to create invoice"
      );
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">
        Create Invoice
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow border max-w-3xl"
      >
        <div className="grid gap-6">

          <input
            type="text"
            placeholder="Invoice Number"
            className="border p-3 rounded-xl"
            value={formData.invoiceNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                invoiceNumber: e.target.value,
              })
            }
          />

          <select
            className="border p-3 rounded-xl"
            value={formData.clientId}
            onChange={(e) =>
              setFormData({
                ...formData,
                clientId: e.target.value,
              })
            }
          >
            <option value="">
              Select Client
            </option>

            {clients.map((client) => (
              <option
                key={client._id}
                value={client._id}
              >
                {client.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            required
            placeholder="Amount"
            className="border p-3 rounded-xl"
            value={formData.amount}
            onChange={(e) =>
              setFormData({
                ...formData,
                amount: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Description"
            className="border p-3 rounded-xl"
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />

          <input
            type="date"
            className="border p-3 rounded-xl"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                dueDate: e.target.value,
              })
            }
          />

          <button
            type="submit"
            className="bg-slate-900 text-white py-3 rounded-xl"
          >
            Create Invoice
          </button>

        </div>
      </form>
    </DashboardLayout>
  );
}