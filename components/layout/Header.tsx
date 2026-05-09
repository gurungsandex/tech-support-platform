'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-ink-200 bg-white sticky top-0 z-50 shadow-xs">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-extrabold tracking-tighter text-ink-900">TechLink</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/find-technicians" className="text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors">
              Find Technicians
            </Link>
            <Link href="/#how-it-works" className="text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors">
              How It Works
            </Link>
            <Link href="/register?role=professional" className="text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors">
              For Technicians
            </Link>
            <Link href="/login" className="text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors">
              Log In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden items-center justify-center rounded-md p-2 text-ink-600 hover:bg-ink-100"
            aria-label="Open main menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-ink-100 py-3">
            <div className="space-y-1">
              <Link href="/find-technicians"
                className="block rounded-md px-3 py-2.5 text-base font-medium text-ink-700 hover:bg-ink-50"
                onClick={() => setIsMobileMenuOpen(false)}>
                Find Technicians
              </Link>
              <Link href="/#how-it-works"
                className="block rounded-md px-3 py-2.5 text-base font-medium text-ink-700 hover:bg-ink-50"
                onClick={() => setIsMobileMenuOpen(false)}>
                How It Works
              </Link>
              <Link href="/register?role=professional"
                className="block rounded-md px-3 py-2.5 text-base font-medium text-ink-700 hover:bg-ink-50"
                onClick={() => setIsMobileMenuOpen(false)}>
                For Technicians
              </Link>
              <Link href="/login"
                className="block rounded-md px-3 py-2.5 text-base font-medium text-ink-700 hover:bg-ink-50"
                onClick={() => setIsMobileMenuOpen(false)}>
                Log In
              </Link>
              <div className="px-3 py-2">
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full rounded-lg bg-primary-500 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-600">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
