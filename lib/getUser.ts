import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import { connectToDb } from "./mongodb"
import { IUserDto } from "@/app/admin/(dashboard)/users/UsersTable";


export const getUser = async () => {
  const { userId } = await auth();
  if (!userId) return null;

  await connectToDb();
  const user = await User.findOne({ clerkId: userId });
  return user; 
};


export async function getUsersFromDb(params: {
  page?: string;
  limit?: string;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  await connectToDb();

  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "50");
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (params.search) {
    filter.$or = [
      { name: { $regex: params.search, $options: "i" } },
      { email: { $regex: params.search, $options: "i" } },
      { clerkId: { $regex: params.search, $options: "i" } },
    ];
  }
  if (params.role && params.role !== "all") filter.role = params.role;
  if (params.status && params.status !== "all")
    filter.isBanned = params.status === "banned";

  const total = await User.countDocuments(filter);

  const sortOptions: Record<string, 1 | -1> = {
    [params.sortBy || "createdAt"]:
      params.sortOrder === "desc" ? -1 : 1,
  };

  const users = await User.find(filter)
    .select("-password")
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .lean<IUserDto[]>()

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
