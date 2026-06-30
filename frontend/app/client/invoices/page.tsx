"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import api from "@/lib/api";
import {toast} from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface Invoice {
  _id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
}

export default function ClientInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payingInvoice, setPayingInvoice] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get("/invoices/my-invoices", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);

    setInvoices(response.data.invoices);
  } catch (error:any) {
    toast.error(
    error.response?.data?.message || "Failed to fetch invoices."
  );
  }
};

const payInvoice = async (id: string) => {
  try {
    setPayingInvoice(id);

    const token = localStorage.getItem("token");
    const response = await api.post(`/invoices/${id}/pay`, {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    window.location.href = response.data.url;
  } catch (error: any) {
    setPayingInvoice(null);
    
    toast.error(
    error.response?.data?.message || "Payment Failed"
  );
  }
};
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        My Invoices
      </h1>

      <div className="space-y-4">
        {invoices.map((invoice) => (
          <div
            key={invoice._id}
            className="border rounded-xl p-4 bg-white shadow"
          >
            <Link
              href={`/client/invoices/${invoice._id}`}
              className="font-semibold text-blue-600 hover:underline"
            >
              {invoice.invoiceNumber}
            </Link>

            <p>Amount: ₹{invoice.amount}</p>

            <p>Status: {invoice.status}</p>
            {invoice.status === "paid" ? (
              <button
                disabled
                className="mt-3 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
              >
                ✓ Paid
              </button>
            ) : (
              <button
                onClick={() => payInvoice(invoice._id)}
                disabled={payingInvoice === invoice._id}
                className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {payingInvoice === invoice._id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                     Redirecting...
                  </>
                ) : (
                  "Pay Now"
                )}
              </button>
            )}
          </div>
        ))}

        {invoices.length === 0 && (
          <p>No invoices found.</p>
        )}
      </div>
    </DashboardLayout>
  );
}