"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
} from "lucide-react";

export default function Sidebar() {

  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-slate-950 to-blue-950 text-white flex-shrink-0">

      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">
          VaultPay
        </h1>
      </div>

      <nav className="p-4 space-y-2">

        {role === "admin" && (
          <>
            <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-600">
              <LayoutDashboard size={18}/>
              Dashboard
            </Link>

            <Link href="/invoices" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-600">
              <FileText size={18}/>
              Invoices
            </Link>

            <Link href="/clients" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-600">
              <Users size={18}/>
              Clients
            </Link>

            <Link href="/admin/admins" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-600">
              <Users size={18}/>
              Admins
            </Link>
          </>
        )}

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="w-full text-left p-3 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>

      </nav>

    </aside>
  );
}