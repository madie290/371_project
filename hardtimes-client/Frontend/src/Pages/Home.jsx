import React from 'react';
import Navbar from '../Components/Navbar';
import CategoryBox from '../Components/CategoryBox';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';

const categories = [
  { title: 'Grief & Loss', description: 'Find comfort and words of support during loss.', path: '/category/grief-loss' },
  { title: 'Workplace Issues', description: 'Navigate difficult conversations at work.', path: '/category/workplace-issues' },
  { title: 'Apologies', description: 'Craft meaningful apologies for any situation.', path: '/category/apologies' }
];

function Home() {
  const navigate = useNavigate();

  const handleBrowseClick = () => {
    navigate('/Categories');
  };

  return (
    <div className="bg-[#B0C4DE] min-h-screen"> {/* Background color applied here */}
      <Navbar />
      <div className="p-8 text-center">
        <h2 className="text-4xl font-bold text-[#5A4FCF] mb-8">
          For life's toughest moments, we're here for you.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
          {categories.map((cat, index) => (
            <CategoryBox 
              key={index} 
              title={cat.title} 
              description={cat.description} 
              path={cat.path} 
              className="h-full"
            />
          ))}
        </div>
        <button
          onClick={handleBrowseClick}
          className="mt-4 bg-[#5A4FCF] text-white px-6 py-3 rounded-xl hover:bg-[#4A3F9C] transition"
        >
          Browse All Categories
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
