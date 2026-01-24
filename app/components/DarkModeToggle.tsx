"use client";

import { useEffect, useState } from "react";
import { BsSun, BsMoon } from "react-icons/bs";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // check localStorage or system preference
    const saved = localStorage.getItem("dark-mode");
    if (saved === "true") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dark-mode", "false");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dark-mode", "true");
    }
    setDark(!dark);
  };

  return (
    <button
      onClick={toggleDark}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
    >
      {dark ? <BsSun size={18} /> : <BsMoon size={18} />}
    </button>
  );
}
