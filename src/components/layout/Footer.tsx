import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1c1c1e] text-white py-6 mt-auto shadow-inner">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm gap-4">
        <p className="text-gray-400">&copy; {new Date().getFullYear()} Японский с субтитрами.</p>
        <div className="flex gap-4">
          <a
            href="https://vk.com/princess_for_mommy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-300 transition"
          >
            VK
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
