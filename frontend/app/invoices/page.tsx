"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import Link from "next/link";
import {toast} from "sonner";
import { Loader2 } from "lucide-react";

interface Invoice {
  _id: string;
  invoiceNumber: string;
  amount: number;
  description: string;
  dueDate: string;
  status: string;
  clientId: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  

  useEffect(() => {
    fetchInvoices();

    const interval = setInterval(() => {
      fetchInvoices();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("Token: ", token);
      const response = await api.get(
        "/invoices",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInvoices(response.data.invoices);
    } catch (error) {
      console.error(error);
    }
  };
  const markAsPaid = async (
    invoiceId: string
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      console.log("Token: ", token);

      const response = await api.patch(
        `/invoices/${invoiceId}/status`,
        {
          status: "paid",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      fetchInvoices();
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(
        `/invoices/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchInvoices();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete invoice");
    }
  };
  const handleStatusUpdate = async (
    id: string,
    status: string
  ) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/invoices/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchInvoices();
    } catch (error) {
      console.error(error);

      toast.error("Failed to update status");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Invoices
          </h1>

          <p className="text-gray-500">
            Manage all invoices
          </p>
        </div>

        <Link
            href="/invoices/create"
            className="bg-slate-900 text-white px-5 py-3 rounded-xl"
            >
            Create Invoice
            </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4">
                Invoice
              </th>

              <th className="text-left p-4">
                Client
              </th>

              <th className="text-left p-4">
                Amount
              </th>

              <th className="text-left p-4">
                Due Date
              </th>

              <th className="text-left p-4">
                Status
              </th>
              <th className="text-left p-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice._id}
                className="border-t"
              >
                <td className="p-4 font-medium">
                  <Link
                    href={`/invoices/${invoice._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {invoice.invoiceNumber}
                  </Link>
                </td>

                <td className="p-4">
                  {invoice.clientId?.name}
                </td>

                <td className="p-4">
                  ₹{invoice.amount}
                </td>

                <td className="p-4">
                  {new Date(
                    invoice.dueDate
                  ).toLocaleDateString()}
                </td>

                <td className="p-4">
                  {invoice.status === "paid" && (
                    <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                      Paid
                    </span>
                  )}

                  {invoice.status === "pending" && (
                    <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                      Pending
                    </span>
                  )}

                  {invoice.status === "overdue" && (
                    <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                      Overdue
                    </span>
                  )}
                </td>
                <td className="p-4 flex gap-2">
                  {invoice.status !== "paid" && (
                    <button
                      onClick={() =>
                        markAsPaid(invoice._id)
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded-lg"
                    >
                      Mark Paid
                    </button>
                  )}
                  <Link
                    href={`/invoices/edit/${invoice._id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      handleDelete(invoice._id)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}