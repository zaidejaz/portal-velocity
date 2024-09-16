// components/Header.tsx

import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <ul className="flex space-x-4">
          <li><Link href="/leadgen" className="hover:text-blue-300 transition duration-300">LeadGen</Link></li>
          <li><Link href="/qa" className="hover:text-blue-300 transition duration-300">QA</Link></li>
          <li><Link href="/support" className="hover:text-blue-300 transition duration-300">Support</Link></li>
          <li><Link href="/realtor" className="hover:text-blue-300 transition duration-300">Realtor</Link></li>
          <li><Link href="/sales" className="hover:text-blue-300 transition duration-300">Sales</Link></li>
          <li><Link href="/admin" className="hover:text-blue-300 transition duration-300">Admin</Link></li>
          <li><Link href="/super-admin" className="hover:text-blue-300 transition duration-300">Super Admin</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;