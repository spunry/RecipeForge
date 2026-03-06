"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <nav className="border-b bg-white dark:bg-black px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 text-xl font-bold tracking-tight">
          <Image
            src="/logo.png"
            alt="RecipeForge Logo"
            width={40}
            height={40}
            className="rounded-lg shadow-sm"
          />
          <span>RecipeForge</span>
        </Link>
        <div className="flex gap-6 items-center">
          <Link
            href="/"
            className="text-sm font-medium hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/recipes"
            className="text-sm font-medium hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
          >
            Recipes
          </Link>
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="text-sm font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            Advanced Search
          </button>
        </div>
      </div>
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
    </nav>
  );
}
