'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import TechnicianCard from '@/components/technicians/TechnicianCard'
import { searchTechnicians } from '@/lib/technicians/actions'
import type { TechnicianSearchResult } from '@/lib/types/database'
import { PREDEFINED_SERVICES, SERVICE_RADIUS_OPTIONS } from '@/lib/types/database'
import { Search, MapPin, Loader, Map as MapIcon, LayoutGrid } from 'lucide-react'

const TechnicianMap = dynamic(() => import('@/components/map/TechnicianMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center">
      <Loader className="h-8 w-8 text-gray-400 animate-spin" />
    </div>
  ),
})

const SERVICE_TYPES = [
  'Networking', 'Hardware Repair', 'Software Support',
  'Data Recovery', 'Cybersecurity', 'Cloud', 'Security', 'Printers',
]

function FindTechniciansContent() {
  const urlParams = useSearchParams()
  const [technicians, setTechnicians] = useState<TechnicianSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'grid' | 'map'>('grid')
  const [mapKey, setMapKey] = useState(0)

  const [location, setLocation] = useState(() => urlParams?.get('location') ?? '')
  const [service, setService] = useState(() => urlParams?.get('service') ?? '')
  const [radius, setRadius] = useState(25)
  const [supportType, setSupportType] = useState<'' | 'remote' | 'onsite' | 'both'>('')
  const [minRating, setMinRating] = useState<number | ''>('')
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const doSearch = useCallback(async () => {
    setLoading(true)
    try {
      const params: Parameters<typeof searchTechnicians>[0] = { radiusMiles: radius }

      if (location.trim()) {
        if (/^\d{5}$/.test(location.trim())) {
          params.zipCode = location.trim()
        } else {
          params.city = location.trim()
        }
      }

      if (service) params.service = service
      if (supportType) params.supportType = supportType as 'remote' | 'onsite' | 'both'
      if (minRating) params.minRating = Number(minRating)

      const result = await searchTechnicians(params)
      let results = result.data ?? []

      if (onlineOnly) {
        results = results.filter(t => t.availability_status === 'online')
      }

      setTechnicians(results)
      setMapKey((k) => k + 1)
    } finally {
      setLoading(false)
    }
  }, [location, service, radius, supportType, minRating, onlineOnly])

  useEffect(() => {
    doSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    doSearch()
  }

  const toggleService = (s: string) => {
    setSelectedServices(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Search bar */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-10 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search technicians or services..."
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative sm:w-56">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="City, State or ZIP"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : 'Search'}
              </button>
            </form>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6">
            {/* Sidebar filters */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 space-y-6">
                {/* Online Now */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">Online Now</span>
                    <button
                      type="button"
                      onClick={() => { setOnlineOnly(!onlineOnly); doSearch() }}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${onlineOnly ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${onlineOnly ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-900">Service Type</p>
                  <div className="space-y-2">
                    {SERVICE_TYPES.map((s) => (
                      <label key={s} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(s)}
                          onChange={() => toggleService(s)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Minimum Rating */}
                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-900">Minimum Rating</p>
                  <div className="space-y-2">
                    {[4, 3, 2].map((r) => (
                      <label key={r} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="minRating"
                          checked={minRating === r}
                          onChange={() => setMinRating(r)}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="flex items-center gap-1 text-sm text-gray-700">
                          {Array.from({ length: r }).map((_, i) => (
                            <svg key={i} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          ))}
                          <span className="ml-0.5">& up</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Distance */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-900">Distance</p>
                    <span className="text-sm font-semibold text-blue-600">{radius} mi</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    step={5}
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {/* Results header */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-base font-semibold text-gray-900">
                  {loading ? 'Searching…' : `${technicians.length} Expert${technicians.length !== 1 ? 's' : ''} Found`}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                  <select className="rounded-lg border border-gray-200 bg-white py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>Recommended</option>
                    <option>Highest Rated</option>
                    <option>Nearest First</option>
                  </select>
                  <button
                    onClick={() => setView('grid')}
                    className={`rounded-lg p-2 ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView('map')}
                    className={`rounded-lg p-2 ${view === 'map' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <MapIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader className="h-10 w-10 text-blue-500 animate-spin" />
                </div>
              ) : technicians.length === 0 ? (
                <div className="rounded-2xl bg-white border border-gray-100 py-20 text-center">
                  <p className="text-lg font-semibold text-gray-700">No technicians found</p>
                  <p className="mt-2 text-gray-400">Try adjusting your location or filters</p>
                </div>
              ) : view === 'grid' ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {technicians.map((tech) => (
                    <TechnicianCard key={tech.user_id} technician={tech} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: '600px' }}>
                  <TechnicianMap key={mapKey} technicians={technicians} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function FindTechniciansPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col bg-gray-50">
        <div className="flex flex-1 items-center justify-center">
          <Loader className="h-10 w-10 text-blue-500 animate-spin" />
        </div>
      </div>
    }>
      <FindTechniciansContent />
    </Suspense>
  )
}
