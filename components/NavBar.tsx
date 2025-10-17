import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

/**
 * A responsive navigation bar with links to primary pages.
 */
export default function NavBar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleNav = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="w-full bg-[color:var(--edge-slate)] border-b border-gray-700 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <button
          onClick={() => handleNav('/')}
          className="text-xl font-bold text-[color:var(--edge-gold)]"
        >
          Strategic Edge AI
        </button>
        <div className="hidden md:flex space-x-4 text-sm">
          <button onClick={() => handleNav('/dashboard')} className="hover:underline">Dashboard</button>
          <button onClick={() => handleNav('/evaluate')} className="hover:underline">Evaluate</button>
          <button onClick={() => handleNav('/design')} className="hover:underline">Design</button>
          <button onClick={() => handleNav('/generate')} className="hover:underline">Generate</button>
          <button onClick={() => handleNav('/evolve')} className="hover:underline">Evolve</button>
          <button onClick={() => handleNav('/projects')} className="hover:underline">Projects</button>
          <button onClick={() => handleNav('/settings')} className="hover:underline">Settings</button>
          {/* Only show admin link if the current user is admin (placeholder) */}
          {/* <button onClick={() => handleNav('/admin')} className="hover:underline">Admin</button> */}
        </div>
      </div>
      <div className="flex items-center space-x-4 text-sm">
        {user ? (
          <>
            <span className="text-gray-300">{user.email}</span>
            <button onClick={logout} className="edge-btn secondary px-3 py-1 text-sm">Logout</button>
          </>
        ) : (
          <button onClick={() => handleNav('/login')} className="edge-btn secondary px-3 py-1 text-sm">
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
