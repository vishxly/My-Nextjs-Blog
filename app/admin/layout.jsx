"use client";

import AuthContextProvider, { useAuth } from "@/lib/contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import { useAdmin } from "@/lib/firebase/admin/read";

export default function Layout({ children }) {
  return (
    <AuthContextProvider>
      <InnerLayout>{children}</InnerLayout>
    </AuthContextProvider>
  );
}

function InnerLayout({ children }) {
  const { user, isLoading: authIsLoading } = useAuth();
  const { data, error, isLoading } = useAdmin({ uid: user?.uid });

  if (authIsLoading || isLoading) {
    return <h2>Loading ...</h2>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-black dark:text-white">
        <div className="p-8 text-center rounded-lg shadow-lg dark:bg-black dark:text-white">
          <h1 className="mb-4 text-2xl font-bold">Access Denied</h1>
          <p className="text-lg">You are not an admin</p>
          <div className="mt-6">
            <svg
              className="w-12 h-12 mx-auto text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="flex">
        <Sidebar />
        {children}
      </section>
    </>
  );
}
