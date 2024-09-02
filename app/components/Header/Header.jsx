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
    <nav className="px-4 py-4 border-b sm:px-8 dark:bg-black dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href={"/"} aria-label="Home">
            <img
              className="h-10 transition-transform duration-300 ease-in-out rounded-md sm:h-12 hover:scale-105"
              src="/blog.jpg"
              alt="BlogV Logo"
            />
          </Link>
        </div>

        <div className="items-center hidden gap-8 sm:flex">
          <NavLinks />
        </div>

        <div className="items-center hidden gap-5 sm:flex">
          <ThemeToggle />
          <AuthContextProvider>
            <LoginButton />
          </AuthContextProvider>
        </div>

        <button
          className="transition-transform duration-300 ease-in-out sm:hidden dark:text-white hover:scale-110"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <MenuIcon />
        </button>
      </div>

      {isMenuOpen && (
        <div
          className="mt-4 transition-all duration-300 ease-in-out sm:hidden"
          style={{ transform: isMenuOpen ? "translateY(0)" : "translateY(-10px)", opacity: isMenuOpen ? 1 : 0 }}
        >
          <NavLinks />
          <div className="flex items-center gap-4 mt-6">
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
    <ul className="flex flex-col items-start gap-4 sm:flex-row sm:gap-8 sm:items-center">
      <Link href={"/"} aria-label="Home">
        <li className="flex items-center gap-2 text-lg font-medium transition-colors duration-300 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-300">
          <HomeIcon fontSize="small" />
          Home
        </li>
      </Link>
      <Link href={"/categories"} aria-label="Categories">
        <li className="flex items-center gap-2 text-lg font-medium transition-colors duration-300 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-300">
          <CategoryIcon fontSize="small" />
          Categories
        </li>
      </Link>
      <Link href={"/contact"} aria-label="Contact Us">
        <li className="flex items-center gap-2 text-lg font-medium transition-colors duration-300 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-300">
          <ContactMailIcon fontSize="small" />
          Contact Us
        </li>
      </Link>
    </ul>
  );
}
