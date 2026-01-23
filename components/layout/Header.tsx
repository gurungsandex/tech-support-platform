'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-secondary-200 bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <span className="text-lg font-bold text-white">TS</span>
              </div>
              <span className="text-xl font-bold text-secondary-900">TechSupport</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/#how-it-works" className="text-sm font-medium text-secondary-700 hover:text-primary-600">
              How It Works
            </Link>
            <Link href="/#features" className="text-sm font-medium text-secondary-700 hover:text-primary-600">
              Features
            </Link>
            <Link href="/login" className="text-sm font-medium text-secondary-700 hover:text-primary-600">
              Sign In
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-secondary-700 hover:bg-secondary-100"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              <Link
                href="/#how-it-works"
                className="block rounded-md px-3 py-2 text-base font-medium text-secondary-700 hover:bg-secondary-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/#features"
                className="block rounded-md px-3 py-2 text-base font-medium text-secondary-700 hover:bg-secondary-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/login"
                className="block rounded-md px-3 py-2 text-base font-medium text-secondary-700 hover:bg-secondary-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <div className="px-3 py-2">
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
