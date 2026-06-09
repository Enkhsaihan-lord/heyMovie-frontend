"use client";

import { Button, Input } from "@base-ui/react";
import { useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  subscription: string;
  clerkId: string | null;
}

// Хэрэглэгчийн мэдээллийг харуулах карт
const UserInfoCard = ({ user }: { user: User }) => (
  <div
    style={{
      border: "1px solid #ddd",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "10px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    }}
  >
    <h3 style={{ margin: "0 0 5px 0" }}>{user.name}</h3>
    <p style={{ margin: "2px 0", color: "#666" }}>
      <b>Email:</b> {user.email}
    </p>
    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
      <span
        style={{
          padding: "2px 8px",
          background: "#eee",
          borderRadius: "4px",
          fontSize: "12px",
        }}
      >
        {user.role}
      </span>
      <span
        style={{
          padding: "2px 8px",
          background: "#e0f7fa",
          borderRadius: "4px",
          fontSize: "12px",
        }}
      >
        {user.subscription}
      </span>
    </div>
  </div>
);

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Анх хуудас ачаалагдахад датаг татаж авна
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/allUsersGet`,
      );
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Search & Filters */}
      <div style={{ marginBottom: "20px" }}>
        <Input
          placeholder="Search users..."
          style={{ marginBottom: "10px", width: "100%" }}
        />
        <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
          <Button>Premium</Button>
          <Button>Normal</Button>
        </div>
        <div style={{ display: "flex", gap: "5px" }}>
          <Button>SUPERADMIN</Button>
          <Button>ADMIN</Button>
          <Button>NORMAL</Button>
        </div>
      </div>

      <hr style={{ margin: "20px 0", borderColor: "#eee" }} />

      {/* User List Rendering */}
      <div className="user-list">
        {loading ? (
          <p>Ачаалж байна...</p>
        ) : users.length > 0 ? (
          users.map((user) => <UserInfoCard key={user.id} user={user} />)
        ) : (
          <p>Хэрэглэгч олдсонгүй.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
