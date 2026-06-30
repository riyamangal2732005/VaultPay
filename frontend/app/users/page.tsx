"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/ui/layout/DashboardLayout";
import api from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      "Delete this user?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(
        `/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Users
        </h1>

        <p className="text-gray-500">
          Manage system users
        </p>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Role
              </th>

              <th className="p-4 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t"
              >
                <td className="p-4">
                  {user.name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">
                  {user.role}
                </td>

                <td className="p-4">
                  <button
                    onClick={() =>
                      deleteUser(user._id)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
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