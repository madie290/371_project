import React, { useState } from 'react';
import { useAuth } from '../Components/Auth_context';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const AddPrompt = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    prompt: '',
    description: '',
  });
  const [isPublic, setIsPublic] = useState(true);
  const [message, setMessage] = useState('');

  // 👇 include every category here
  const categories = [
    'Grief & Loss',
    'Workplace Issues',
    'Apologies',
    'Mental Health',
    'Family Conflicts',
    'Breakups & Relationships',
    'Friendship Tension',
    'Self-Advocacy',
    'School & Academic Pressure',
    'Support for Others',
    'Motivational Quotes'
  ];

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');

    const newPrompt = {
      category: formData.category,
      content: formData.prompt,
      description: formData.description,
      public: isPublic
    };

    try {
      const res = await fetch('http://localhost:5000/api/prompts', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrompt),
      });
      const data = await res.json();
      if (data.success) {
        //navigate to the newly selected category
        const slug = formData.category
          .toLowerCase()
          .replace(/ & /g, '-')
          .replace(/\s+/g, '-');
        navigate(`/category/${slug}`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong.');
    }
  };

  if (!user) {
    //Redirect guests to login
    navigate('/login');
    return null;
  }

  return (
    <div className="bg-[#B0C4DE] min-h-screen">
      <Navbar/>
      <div className="max-w-xl md:max-w-3xl mx-auto p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#5A4FCF] mb-6">
          Add a Prompt
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 md:p-6 rounded-lg shadow-lg">
          {/* Category dropdown */}
          <div>
            <label className="block text-sm md:text-base font-medium text-[#5A4FCF] mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 md:p-3 border border-gray-300 rounded-lg text-sm md:text-base"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Prompt text */}
          <div>
            <label className="block text-sm md:text-base font-medium text-[#5A4FCF] mb-1">
              Prompt
            </label>
            <input
              type="text"
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              className="w-full p-2 md:p-3 border border-gray-300 rounded-lg text-sm md:text-base"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm md:text-base font-medium text-[#5A4FCF] mb-1">
              Description (optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 md:p-3 border border-gray-300 rounded-lg text-sm md:text-base"
              rows="3"
            />
          </div>

          {/* Public/private toggle */}
          <div className="flex items-center space-x-2">
            <input
              id="public"
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic(prev => !prev)}
              className="h-4 w-4"
            />
            <label htmlFor="public" className="text-sm md:text-base">
              Make this prompt <strong>public</strong>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#5A4FCF] text-white px-4 py-2 rounded-lg text-base hover:bg-hover-blue"
          >
            Submit Prompt
          </button>

          {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
        </form>
      </div>
      <Footer/>
    </div>
  );
};

export default AddPrompt;
