"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  createdAt: string;
  called?: boolean; // new field for toggle
}

const EnquiryBox = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await fetch("/api/enquiries");
        if (!res.ok) {
          throw new Error("Failed to fetch enquiries");
        }
        const data: Enquiry[] = await res.json();
        setEnquiries(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  const handleToggleCalled = async (id: string, value: boolean) => {
    try {
      await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ called: value }),
      });

      // locally update state
      setEnquiries((prev) =>
        prev.map((enquiry) =>
          enquiry._id === id ? { ...enquiry, called: value } : enquiry
        )
      );
    } catch (err) {
      console.error("Failed to update called status", err);
    }
  };

  if (loading) return <p>Loading enquiries...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Enquiries</h2>
      {enquiries.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead>Called</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries.map((enquiry) => (
              <TableRow key={enquiry._id}>
                <TableCell className="font-medium">{enquiry.name}</TableCell>
                <TableCell>{enquiry.email}</TableCell>
                <TableCell>{enquiry.phone}</TableCell>
                <TableCell>{enquiry.message || "-"}</TableCell>
                <TableCell>
                  {new Date(enquiry.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={enquiry.called || false}
                    onCheckedChange={(val) =>
                      handleToggleCalled(enquiry._id, val)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => (window.location.href = `tel:${enquiry.phone}`)}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No enquiries yet.</p>
      )}
    </div>
  );
};

export default EnquiryBox;
