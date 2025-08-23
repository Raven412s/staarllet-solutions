"use client";
import { IUser } from "@/models/User";
import { useEffect, useState } from "react";

export function useCurrentUser() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/current-user");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return { user, loading };
}
