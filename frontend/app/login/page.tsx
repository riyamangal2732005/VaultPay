"use client";

import { useState } from "react";
import api from "@/lib/api";
import {useRouter} from "next/navigation";
import { saveToken, saveRole } from "@/lib/auth";
import {toast} from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );
      

      saveToken(response.data.token);
      saveRole(response.data.role);
      localStorage.setItem(
        "name",
        response.data.user.name
      );

      localStorage.setItem(
        "role",
        response.data.user.role
      );
      if(response.data.role === "admin"){
        router.push("/admin");
      } else{
        router.push("/client/dashboard");
      }

    } catch (error: any) {
      console.log("===== LOGIN ERROR =====");
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);
      

      if (error.response?.status === 401) {
        toast.error("Invalid email or password.");
      } else if (error.response?.status === 404) {
        toast.error("User not found.");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Unable to connect to server.");
      }
      }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="w-96 space-y-4 rounded border p-6"
      >
        <h1 className="text-2xl font-bold">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded border p-2"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded border p-2"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          type="submit"
          className="w-full rounded bg-black p-2 text-white"
        >
          Login
        </button>
      </form>
    </main>
  );
}