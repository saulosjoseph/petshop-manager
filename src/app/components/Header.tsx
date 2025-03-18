'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">
        <a href="/dashboard">Petshop Manager</a>
      </h1>
        
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center space-x-4">
          <Link
            href="/services/new"
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
          >
            Novo Serviço
          </Link>
          <Link
            href="/pets/new"
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
          >
            Novo Pet
          </Link>
          <Link
            href="/tutor/new"
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
          >
            Novo Tutor
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="lg:hidden flex flex-col items-center bg-blue-700 text-white p-4 mt-3 space-y-2">
          <Link
            href="/services/new"
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 w-full text-center"
          >
            Novo Serviço
          </Link>
          <Link
            href="/pets/new"
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 w-full text-center"
          >
            Novo Pet
          </Link>
          <Link
            href="/tutor/new"
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 w-full text-center"
          >
            Novo Tutor
          </Link>
        </nav>
      )}
    </header>
  );
}
