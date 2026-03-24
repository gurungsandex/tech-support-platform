'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import TechnicianCard from '@/components/technicians/TechnicianCard'
import { searchTechnicians } from '@/lib/technicians/actions'
import type { TechnicianSearchResult } from '@/lib/types/database'
import { PREDEFINED_SERVICES, SERVICE_RADIUS_OPTIONS } from '@/lib/types/database'
import { Search, MapPin, Filter, Loader, LayoutGrid, Map as MapIcon, SlidersHorizontal } from 'lucide-react'

const TechnicianMap = dynamic(() => import('@/components/map/TechnicianMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center">
      <Loader className="h-8 w-8 text-gray-400 animate-spin" />
    </div>
  ),
})

export default function FindTechniciansPage() {
  const [technicians, setTechnicians] = useState<TechnicianSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'grid' | 'map'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [mapKey, setMapKey] = useState(0)

  // Search params
  const [location, setLocation] = useState('')
  const [service, setService] = useState('')
  const [radius, setRadius] = useState(25)
  const [supportType, setSupportType] = useState<'' | 'remote' | 'onsite' | 'both'>('')
  const [minRating, setMinRating] = useState<number | ''>('')

  const doSearch = useCallback(async () => {
    setLoading(true)
    try {
      const params: Parameters<typeof searchTechnicians>[0] = {
        radiusMiles: radius,
      }

      if (location.trim()) {
        // Check if ZIP code
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
      setTechnicians(result.data ?? [])
      setMapKey((k) => k + 1)
    } finally {
      setLoading(false)
    }
  }, [location, service, radius, supportType, minRating])

  // Load all on mount
  useEffect(() => {
    doSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    doSearch()
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Search Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              {/* Location */}
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="City or ZIP code (leave blank for all)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Service */}
              <div className="relative sm:w-56">
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">All Services</option>
                  {PREDEFINED_SERVICES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search
              </button>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </form>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-3 flex flex-wrap gap-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-600">Radius</label>
                  <select
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="rounded-lg border border-gray-200 py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {SERVICE_RADIUS_OPTIONS.map((r) => (
                      <option key={r} value={r}>{r} miles</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-600">Support Type</label>
                  <select
                    value={supportType}
                    onChange={(e) => setSupportType(e.target.value as '' | 'remote' | 'onsite' | 'both')}
                    className="rounded-lg border border-gray-200 py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Any</option>
                    <option value="remote">Remote Only</option>
                    <option value="onsite">On-site Only</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-600">Min Rating</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : '')}
                    className="rounded-lg border border-gray-200 py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Any</option>
                    <option value="3">3+ stars</option>
                    <option value="4">4+ stars</option>
                    <option value="4.5">4.5+ stars</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {/* Header row */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {loading ? 'Searching...' : `${technicians.length} technician${technicians.length !== 1 ? 's' : ''} found`}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('grid')}
                className={`rounded-lg p-2 ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setView('map')}
                className={`rounded-lg p-2 ${view === 'map' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <MapIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
          ) : technicians.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-semibold text-gray-700">No technicians found</p>
              <p className="mt-2 text-gray-500">Try adjusting your location or filters</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {technicians.map((tech) => (
                <TechnicianCard key={tech.user_id} technician={tech} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: '600px' }}>
              <TechnicianMap
                key={mapKey}
                technicians={technicians}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
