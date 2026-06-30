"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import api from "@/lib/api";
import { toast } from "sonner";

export default function InvoiceDetailPage() {
  const params = useParams();

  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/invoices/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInvoice(res.data.invoice);

    } catch (error: any) {
      toast.error("Failed to load invoice.");
    }
  };

  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/pdf/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.download = `Invoice-${invoice.invoiceNumber}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      toast.error("Failed to download PDF.");
    }
  };

  if (!invoice) {
    return (
      <DashboardLayout>
        Loading...
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="bg-white rounded-2xl shadow border p-8 max-w-3xl">

        <h1 className="text-3xl font-bold mb-6">
          Invoice Details
        </h1>

        <div className="space-y-4">

          <p><strong>Invoice:</strong> {invoice.invoiceNumber}</p>

          <p><strong>Client:</strong> {invoice.clientId.name}</p>

          <p><strong>Email:</strong> {invoice.clientId.email}</p>

          <p><strong>Amount:</strong> ₹{invoice.amount}</p>

          <p><strong>Description:</strong> {invoice.description}</p>

          <p><strong>Status:</strong> {invoice.status}</p>

          <p>
            <strong>Due Date:</strong>{" "}
            {new Date(invoice.dueDate).toLocaleDateString()}
          </p>

        </div>

        <button
          onClick={downloadPDF}
          className="mt-8 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800"
        >
          Download PDF
        </button>

      </div>

    </DashboardLayout>
  );
}