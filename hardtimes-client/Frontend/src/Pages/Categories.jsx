import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const categories = [
  "Grief & Loss",
  "Workplace Issues",
  "Apologies",
  "Mental Health",
  "Family Conflicts",
  "Breakups & Relationships",
  "Friendship Tension",
  "Self-Advocacy",
  "School & Academic Pressure",
  "Support for Others",
  "Motivational Quotes"   // ← NEW
];

function Categories() {
  const navigate = useNavigate();

  const handleClick = category => {
    const slug = category
      .toLowerCase()
      .replace(/ & /g, "-")
      .replace(/\s+/g, "-");
    navigate(`/category/${slug}`);
  };

  return (
    <>
      <Navbar/>
      <main className="flex flex-col items-center justify-center min-h-screen bg-[#B0C4DE] p-6">
        <h2 className="text-3xl font-bold text-[#5A4FCF] mb-8 text-center">
          Choose a Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleClick(cat)}
              className="bg-[#F0F8FF] border border-gray-300 rounded-xl px-6 py-4 text-lg text-gray-700 hover:bg-[#E6F0FF] hover:text-[#5A4FCF] shadow-sm transition"
            >
              {cat}
            </button>
          ))}
        </div>
      </main>
      <Footer/>
    </>
  );
}

export default Categories;
