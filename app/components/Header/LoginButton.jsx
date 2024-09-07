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
        return <div className="w-32 h-10 bg-gray-200 rounded-full animate-pulse"></div>
    }

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-white transition-colors duration-300 bg-red-500 rounded-full shadow-md hover:bg-red-600 hover:shadow-lg"
                >
                    <LogOut size={18} />
                    Logout
                </button>
                <Link href='/admin'>
                    <div className="flex items-center gap-3 px-4 py-2 transition-colors duration-300 bg-blue-100 rounded-full shadow-md hover:bg-blue-200 hover:shadow-lg">
                        <img className="object-cover w-8 h-8 border-2 border-blue-300 rounded-full" src={user?.photoURL} alt="" />
                        <div className="hidden sm:block">
                            <h1 className="text-sm font-semibold text-gray-800">{user?.displayName}</h1>
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
            className="flex items-center gap-3 px-6 py-2 font-semibold text-gray-800 transition-colors duration-300 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 hover:shadow-lg"
        >
            <img className='h-5' src="/google.png" alt="Google logo" />
            <span className="hidden sm:inline">Sign in with Google</span>
            <span className="sm:hidden">Sign in</span>
        </button>
    )
}
