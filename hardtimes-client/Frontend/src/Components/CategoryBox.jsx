import React from 'react';
import { Link } from 'react-router-dom';

function CategoryBox({ title, description, path }) {
  return (
    <Link
      to={path}
      className="flex flex-col justify-between bg-[#F0F8FF] p-6 rounded-xl shadow-lg h-full border border-[#5A4FCF] hover:border-[#5A4FCF] hover:bg-[#D4E3F1] transition"
    >
      <h3 className="text-xl font-semibold mb-4 text-[#5A4FCF]">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
    </Link>
  );
}

export default CategoryBox;
