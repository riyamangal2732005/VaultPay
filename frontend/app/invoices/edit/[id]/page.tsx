"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import api from "@/lib/api";
import {toast} from "sonner";

export default function EditInvoicePage() {
  const params = useParams();

  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        `/invoices/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInvoice(response.data.invoice);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        "Failed to fetch invoice"
    );
    }
  };
  const handleUpdate = async () => {
    try {
        const token = localStorage.getItem("token");

        await api.put(
        `/invoices/${params.id}`,
        {
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.amount,
            description: invoice.description,
            dueDate: invoice.dueDate,
            status: invoice.status,
        },
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        toast.success("Invoice updated successfully");
        setTimeout(() => {
            window.location.href = "/invoices";
        }, 1500);

    } catch (error: any) {
        console.error(error);
        console.log(error.response?.data);

        toast.error("Failed to update invoice");
    }
    };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Edit Invoice
      </h1>

      {invoice && (
        <div className="bg-white p-6 rounded-xl shadow border space-y-4">

            <div>
            <label className="block mb-1">
                Invoice Number
            </label>

            <input
                type="text"
                value={invoice.invoiceNumber}
                onChange={(e) =>
                setInvoice({
                    ...invoice,
                    invoiceNumber: e.target.value,
                })
                }
                className="w-full border rounded-lg p-2"
            />
            </div>

            <div>
            <label className="block mb-1">
                Amount
            </label>

            <input
                type="number"
                value={invoice.amount}
                onChange={(e) =>
                setInvoice({
                    ...invoice,
                    amount: Math.max(
                        0,
                        Number(e.target.value)
                    ),
                })
                }
                className="w-full border rounded-lg p-2"
            />
            </div>

            <div>
            <label className="block mb-1">
                Description
            </label>

            <textarea
                value={invoice.description}
                onChange={(e) =>
                setInvoice({
                    ...invoice,
                    description: e.target.value,
                })
                }
                className="w-full border rounded-lg p-2"
            />
            </div>

            <div>
                <label className="block mb-1">
                    Due Date
                </label>

                <input
                    type="date"
                    value={invoice.dueDate?.split("T")[0]}
                    onChange={(e) =>
                    setInvoice({
                        ...invoice,
                        dueDate: e.target.value,
                    })
                    }
                    className="w-full border rounded-lg p-2"
                />
                </div>
            <div>
            
            <div>
                <label className="block mb-1">
                    Status
                </label>

                <select
                    value={invoice.status}
                    onChange={(e) =>
                    setInvoice({
                        ...invoice,
                        status: e.target.value,
                    })
                    }
                    className="w-full border rounded-lg p-2"
                >
                    <option value="pending">
                    Pending
                    </option>

                    <option value="paid">
                    Paid
                    </option>

                    <option value="overdue">
                    Overdue
                    </option>
                </select>
                </div>
            <button
                onClick={handleUpdate}
                className="bg-slate-900 text-white px-5 py-3 rounded-xl"
            >
                Update Invoice
            </button>
            </div>            
        </div>
        )}
    </DashboardLayout>
  );
}