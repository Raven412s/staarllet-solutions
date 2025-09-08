import { getUser } from "@/lib/getUser";
import { connectToDb } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

export async function getEnquiriesDirect(params: {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
}) {
  await connectToDb();
  const user = await getUser();
  if (!user || user.role !== "Admin") throw new Error("Unauthorized");

  const { page = "1", limit = "10", search = "", status = "all" } = params;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter: any = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } }
    ];
  }
  if (status !== "all") {
    filter.called = status === "called";
  }

  const total = await Enquiry.countDocuments(filter);
  const enquiries = await Enquiry.find(filter)
    .populate("course", "title")
    .skip(skip)
    .limit(parseInt(limit));

  return {
    enquiries: JSON.parse(JSON.stringify(enquiries)), // ✅ serialize
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    }
  };
}
