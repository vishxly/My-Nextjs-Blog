"use client";

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useState } from "react";
import LoginButton from "./LoginButton";
import AuthContextProvider from "@/lib/contexts/AuthContext";
import Link from "next/link";
import ThemeToggle from "../../../lib/contexts/ThemeContext";
import "@/public/styles.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="px-4 sm:px-7 py-3 border-b dark:bg-gray-800 dark:border-gray-700 nav">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-2 md:hidden"></div>
          <Link href={"/"}>
            <img className="h-8 sm:h-10" src="/logo.png" alt="" />
          </Link>
        </div>

        <div className="hidden sm:flex gap-6 items-center">
          <NavLinks />
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <ThemeToggle />
          <AuthContextProvider>
            <LoginButton />
          </AuthContextProvider>
        </div>

        <button
          className="sm:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <MenuIcon />
        </button>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden mt-4">
          <NavLinks />
          <div className="mt-4 flex items-center gap-4">
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
    <ul className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
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