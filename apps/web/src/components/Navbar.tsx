"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
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
        </div>
      </div>
    </nav>
  );
}
