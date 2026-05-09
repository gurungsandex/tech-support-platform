'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Search } from 'lucide-react'

export default function HeroSearch() {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [service, setService] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location.trim()) params.set('location', location.trim())
    if (service.trim()) params.set('service', service.trim())
    router.push(`/find-technicians${params.toString() ? '?' + params.toString() : ''}`)
  }

  return (
    <form onSubmit={handleSearch} className="mx-auto mt-10 max-w-2xl">
      <div className="flex flex-col sm:flex-row gap-2 rounded-xl bg-white p-2 shadow-lg">
        <div className="flex flex-1 items-center gap-2 rounded-lg bg-ink-50 border border-ink-200 px-4 py-3 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
          <Search className="h-4 w-4 text-ink-400 flex-shrink-0" />
          <input
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="What do you need help with?"
            className="w-full bg-transparent text-sm text-ink-900 placeholder-ink-400 focus:outline-none"
          />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-lg bg-ink-50 border border-ink-200 px-4 py-3 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
          <MapPin className="h-4 w-4 text-ink-400 flex-shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City or ZIP code"
            className="w-full bg-transparent text-sm text-ink-900 placeholder-ink-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-lg bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white px-6 py-3 text-sm font-semibold transition-colors shadow-sm"
        >
          <Search className="h-4 w-4" />
          Find Techs
        </button>
      </div>
    </form>
  )
}
