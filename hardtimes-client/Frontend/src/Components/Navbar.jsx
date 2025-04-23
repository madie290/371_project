import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Components/Auth_context';

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="flex justify-between items-center p-6 bg-[#F0F8FF] shadow-md">
      <Link to="/">
        <h1 className="text-2xl font-bold text-[#5A4FCF] cursor-pointer">HardTimes.com</h1> 
      </Link>
      <div className="space-x-4">
        <Link to={user ? "/account" : "/login"}>
          <button className="text-gray-600 hover:text-[#5A4FCF]">Account</button> 
        </Link>
        <Link to="/account?section=saved">
          <button className="text-gray-600 hover:text-[#5A4FCF]">Saved Responses</button> 
        </Link>
        <Link to="/about">
          <button className="text-gray-600 hover:text-[#5A4FCF]">About</button> 
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
