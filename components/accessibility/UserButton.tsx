import { connectToDb } from '@/lib/mongodb';
import User from '@/models/User';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link'
import React from 'react'

const UserButton = async () => {
    const session = await auth();
    const userId = session.userId;

    await connectToDb();
    const user = await User.findOne({ clerkId: userId })
    return (
        <Link
            href={"/account"}
        >
            <button className="hidden md:flex w-9 h-9 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-500">
                    {user.image ? (
                        <Image
                            src={user.image}
                            alt={user.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
            </button>
        </Link>
    )
}

export default UserButton
