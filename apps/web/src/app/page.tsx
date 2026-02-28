import Link from "next/link";
import Image from "next/image";
import RecipeCarousel from "@/components/RecipeCarousel";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center overflow-x-hidden">
      <div className="mb-10 relative">
        <div className="absolute inset-0 bg-orange-500/10 blur-3xl rounded-full" />
        <Image
          src="/logo.png"
          alt="RecipeForge Logo"
          width={240}
          height={240}
          className="relative rounded-2xl shadow-2xl border-4 border-white dark:border-zinc-800"
          priority
        />
      </div>
      <h1 className="text-5xl font-extrabold tracking-tight mb-6">
        Welcome to RecipeForge
      </h1>
      <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10 leading-relaxed">
        Your digital sanctuary for culinary inspiration. Organize, discover, and forge
        extraordinary recipes with ease.
      </p>
      <div className="flex gap-4 mb-16">
        <Link
          href="/recipes"
          className="bg-black dark:bg-zinc-50 text-white dark:text-black px-8 py-3 rounded-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg"
        >
          View Recipes
        </Link>
        <Link
          href="/recipes"
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-8 py-3 rounded-lg font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
        >
          Explore More
        </Link>
      </div>

      <div className="w-full max-w-7xl">
        <h2 className="text-2xl font-bold mb-8 text-zinc-800 dark:text-zinc-200">
          Featured Recipes
        </h2>
        <RecipeCarousel />
      </div>
    </div>
  );
}
