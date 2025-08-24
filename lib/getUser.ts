import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import { connectToDb } from "./mongodb"


export const getUser = async () => {
  const { userId } = await auth();

  if (!userId) return null;

  await connectToDb();
  const user = await User.findOne({ clerkId: userId });

  return user;
};
