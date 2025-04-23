import React from 'react';

function Footer() {
  return (
    <footer className="p-4 bg-[#F0F8FF] text-center text-gray-500">
      &copy; {new Date().getFullYear()} HardTimes.com. All rights reserved.
    </footer>
  );
}

export default Footer;
