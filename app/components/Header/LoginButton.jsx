"use client"

import { useAuth } from "@/lib/contexts/AuthContext"
import Link from 'next/link'
import { LogOut } from 'lucide-react'

export default function LoginButton() {
    const {
        user,
        isLoading,
        error,
        handleSignInWithGoogle,
        handleLogout,
    } = useAuth();

    if (isLoading) {
        return <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-full"></div>
    }

    if (user) {
        return (
            <div className="flex gap-4 items-center">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                    <LogOut size={18} />
                    Logout
                </button>
                <Link href='/admin'>
                    <div className="flex items-center gap-3 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg">
                        <img className="h-8 w-8 rounded-full object-cover border-2 border-blue-300" src={user?.photoURL} alt="" />
                        <div className="hidden sm:block">
                            <h1 className="font-semibold text-sm text-gray-800">{user?.displayName}</h1>
                            <h2 className="text-xs text-gray-500">{user?.email}</h2>
                        </div>
                    </div>
                </Link>
            </div>
        )
    }

    return (
        <button
            onClick={handleSignInWithGoogle}
            className="flex items-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold px-6 py-2 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg border border-gray-300"
        >
            <img className='h-5' src="/google.png" alt="Google logo" />
            <span className="hidden sm:inline">Sign in with Google</span>
            <span className="sm:hidden">Sign in</span>
        </button>
    )
}