'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { CartDrawer } from './CartDrawer';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#menu', label: 'Menu' },
  { href: '/#deals', label: 'Deals' },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    if (isMenuOpen || isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isCartOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo.jpeg"
                alt="BurgerFuel"
                width={48}
                height={48}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop Links - Centered */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground/80 hover:text-accent transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side: Cart + Hamburger */}
            <div className="flex items-center gap-2">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center justify-center w-10 h-10 rounded-md hover:bg-secondary/10 transition-colors cursor-pointer"
                aria-label="Open cart"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center bg-accent text-white text-[10px] font-bold rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-md hover:bg-secondary/10 transition-colors cursor-pointer"
                aria-label="Open menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Mega Menu Overlay */}
        <div
          className={`md:hidden fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Mobile Mega Menu Panel */}
        <div
          className={`md:hidden fixed inset-y-0 right-0 z-[60] w-72 bg-background shadow-xl transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-border">
              <Image
                src="/images/logo.jpeg"
                alt="BurgerFuel"
                width={36}
                height={36}
                className="h-8 w-auto"
              />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-secondary/10 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-6 py-3 text-lg font-medium text-foreground/80 hover:text-accent hover:bg-secondary/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
