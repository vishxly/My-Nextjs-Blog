"use client";

import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import { useState } from "react";
import LoginButton from "./LoginButton";
import AuthContextProvider from "@/lib/contexts/AuthContext";
import Link from "next/link";
import ThemeToggle from "../../../lib/contexts/ThemeContext";
import "@/public/styles.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="px-4 py-3 border-b sm:px-7 dark:bg-black dark:border-gray-700 nav">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-2 md:hidden"></div>
          <Link href={"/"}>
            {/* <img className="h-8 sm:h-10" src="/logo.png" alt="" /> */}
            {/* <h1 className='text-2xl '>BlogV</h1> */}
            <h1 className="inline-block pb-2 mt-5 mb-4 text-4xl font-bold text-indigo-600 transition-all duration-300 border-b-4 border-indigo-600 hover:text-indigo-800 hover:border-indigo-800 hover:scale-105">
              Blog<span className="text-pink-500">V</span>
            </h1>
          </Link>
        </div>

        <div className="items-center hidden gap-6 sm:flex">
          <NavLinks />
        </div>

        <div className="items-center hidden gap-4 sm:flex">
          <ThemeToggle />
          <AuthContextProvider>
            <LoginButton />
          </AuthContextProvider>
        </div>

        <button
          className="sm:hidden dark:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <MenuIcon />
        </button>
      </div>

      {isMenuOpen && (
        <div className="mt-4 sm:hidden">
          <NavLinks />
          <div className="flex items-center gap-4 mt-4">
            <ThemeToggle />
            <AuthContextProvider>
              <LoginButton />
            </AuthContextProvider>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLinks() {
  return (
    <ul className="flex flex-col items-start gap-4 sm:flex-row sm:gap-6 sm:items-center">
      <Link href={"/"}>
        <li className="flex items-center gap-2 dark:text-white">
          <HomeIcon fontSize="small" />
          Home
        </li>
      </Link>
      <Link href={"/categories"}>
        <li className="flex items-center gap-2 dark:text-white">
          <CategoryIcon fontSize="small" />
          Categories
        </li>
      </Link>
      <Link href={"/contact"}>
        <li className="flex items-center gap-2 dark:text-white">
          <ContactMailIcon fontSize="small" />
          Contact Us
        </li>
      </Link>
    </ul>
  );
}
