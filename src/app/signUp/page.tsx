"use client";

import { useState, useEffect } from "react";

const Page = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    password: "",
    clerkId: "",
    role: "USER",
    email: "",
    subscription: "NORMAL",
  });
  const createUser = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signUp`, {
      method: "POST",

    });
  };
  return (
    <div>
      <div>
        <input></input>
      </div>
    </div>
  );
};
export default Page;
