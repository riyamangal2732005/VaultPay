"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import api from "@/lib/api";
import { useRouter } from "next/navigation";


export default function CreateClientPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] =
    useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
 

  
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token");

      await api.post(
        "/clients",
        {
          name,
          email,
          password,
          companyName,
          phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Client created successfully");

      router.push("/clients");

    } catch (error) {
      console.error(error);

      alert("Failed to create client");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Create Client
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow border space-y-4"
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full border rounded-lg p-2"
        />

        <input
          type="email"
          placeholder="Email"
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
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-2"
        />

        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) =>
            setCompanyName(e.target.value)
          }
          className="w-full border rounded-lg p-2"
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
          className="w-full border rounded-lg p-2"
        />

        <button
          type="submit"
          className="bg-slate-900 text-white px-5 py-3 rounded-xl"
        >
          Create Client
        </button>
      </form>
    </DashboardLayout>
  );
}