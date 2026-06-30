"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

interface LoggedInUser {
  name: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<LoggedInUser>({
    name: "",
    role: "",
  });

  useEffect(() => {
    const name = localStorage.getItem("name") || "";
    const role = localStorage.getItem("role") || "";

    setUser({
      name,
      role,
    });
  }, []);

  return (
    <header className="h-20 bg-white border-b flex items-center justify-end px-8">

      <div className="flex items-center gap-6">

        <Bell
          size={20}
          className="cursor-pointer"
        />

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div>
            <p className="font-semibold">
              {user.name}
            </p>

            <p className="text-sm text-gray-500">
              ({user.role})
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}