"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import api from "@/lib/api";
import { toast } from "sonner";

export default function CreateAdminPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/admins",
        {
          name,
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Admin created successfully");

      router.push("/admin/admins");

    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        "Failed to create admin"
      );
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Create Admin
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow border space-y-4"
      >
        <input
          type="text"
          placeholder="Admin Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full border rounded-lg p-2"
        />

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border rounded-lg p-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border rounded-lg p-2"
        />

        <button
          type="submit"
          className="bg-slate-900 text-white px-5 py-3 rounded-xl"
        >
          Create Admin
        </button>
      </form>
    </DashboardLayout>
  );
}