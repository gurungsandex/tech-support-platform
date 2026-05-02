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
      <div className="flex flex-col sm:flex-row gap-2 rounded-2xl bg-white/10 p-2 backdrop-blur-sm">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-white px-4 py-3">
          <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="Service (e.g. WiFi repair)"
            className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
          />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-white px-4 py-3">
          <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City or ZIP code"
            className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 text-sm font-semibold transition-colors"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
    </form>
  )
}
