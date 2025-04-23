import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../Components/Auth_context';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const allCategories = [
  { name: 'Grief & Loss',             slug: 'grief-loss' },
  { name: 'Workplace Issues',         slug: 'workplace-issues' },
  { name: 'Apologies',                slug: 'apologies' },
  { name: 'Mental Health',            slug: 'mental-health' },
  { name: 'Family Conflicts',         slug: 'family-conflicts' },
  { name: 'Breakups & Relationships', slug: 'breakups-relationships' },
  { name: 'Friendship Tension',       slug: 'friendship-tension' },
  { name: 'Self-Advocacy',            slug: 'self-advocacy' },
  { name: 'School & Academic Pressure', slug: 'school-academic-pressure' },
  { name: 'Support for Others',       slug: 'support-for-others' },
  { name: 'Motivational Quotes',      slug: 'motivational-quotes' },
];

export default function CategoryPage() {
  const { user } = useAuth();
  const { categoryName } = useParams(); // slug
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  const formattedCategory =
    allCategories.find(c => c.slug === categoryName)?.name || categoryName;

  useEffect(() => {
    fetch(`http://localhost:5000/api/prompts?category=${encodeURIComponent(formattedCategory)}`)
      .then(r => {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .then(data => setPrompts(data.prompts || []))
      .catch(err => console.error('Fetch error:', err));
  }, [formattedCategory]);

  const toggleFavorite = (id, owner, fav) => {
    fetch('http://localhost:5000/api/favorite-prompt', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, owner, favorite: fav }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setPrompts(prompts.map(p => (p.id === id && p.owner === owner ? { ...p, favorite: fav } : p)));
        }
      })
      .catch(console.error);
  };

  return (
    <div className="bg-[#B0C4DE] min-h-screen">
      <Navbar />

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 p-4 md:p-6">
          <h3 className="text-2xl md:text-3xl font-bold text-[#5A4FCF] mb-4">
            Categories
          </h3>
          <ul className="space-y-2">
            {allCategories.map(cat => (
              <li key={cat.slug}>
                <Link
                  to={`/category/${cat.slug}`}
                  className={`block text-[#5A4FCF] hover:underline ${
                    cat.slug === categoryName ? 'font-bold text-lg' : 'text-base md:text-lg'
                  }`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="w-full md:w-3/4 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-2xl md:text-3xl font-bold text-[#5A4FCF]">
              {formattedCategory}
            </h2>
            {user && (
              <Link
                to="/add-prompt"
                className="bg-[#5A4FCF] text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-hover-blue text-sm md:text-base"
              >
                Add a Prompt
              </Link>
            )}
          </div>

          {prompts.length > 0 ? (
            prompts.map(p => (
              <div key={`${p.owner}-${p.id}`} className="bg-white p-3 md:p-4 rounded-lg shadow mb-4 relative">
                {user && (
                  <button
                    onClick={() => toggleFavorite(p.id, p.owner, !p.favorite)}
                    className="absolute top-3 right-3 text-xl focus:outline-none"
                    aria-label={p.favorite ? 'Unsave' : 'Save'}
                  >
                    {p.favorite ? '★' : '☆'}
                  </button>
                )}
                <p className="text-xs md:text-sm text-gray-500">{p.username}</p>
                <p className="text-base md:text-lg font-medium">{p.content}</p>
                {p.description && (
                  <p className="mt-1 text-gray-700 italic">{p.description}</p>
                )}
                <button
                  onClick={() => setSelectedPrompt(p)}
                  className="mt-2 text-blue-500 hover:underline text-sm md:text-base"
                >
                  Copy Prompt
                </button>
              </div>
            ))
          ) : (
            <p className="text-base md:text-lg">No prompts available.</p>
          )}

          {selectedPrompt && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
                <h3 className="text-xl font-bold mb-2">Copy this prompt</h3>
                <p className="mb-2">{selectedPrompt.content}</p>
                {selectedPrompt.description && (
                  <p className="mb-4 italic text-gray-700">{selectedPrompt.description}</p>
                )}
                <button
                  onClick={() => setSelectedPrompt(null)}
                  className="bg-[#5A4FCF] text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
