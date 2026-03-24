'use client'

import { useEffect, useRef } from 'react'
import type { TechnicianSearchResult } from '@/lib/types/database'

interface Props {
  technicians: TechnicianSearchResult[]
  centerLat?: number
  centerLng?: number
  zoom?: number
  onTechnicianClick?: (technician: TechnicianSearchResult) => void
}

export default function TechnicianMap({
  technicians,
  centerLat = 39.5,
  centerLng = -98.35,
  zoom = 4,
  onTechnicianClick,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Dynamic import to avoid SSR issues
    const initMap = async () => {
      const L = (await import('leaflet')).default

      // Load leaflet CSS dynamically
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      // Fix default marker icons
      delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      if (!mapRef.current) return

      const map = L.map(mapRef.current).setView([centerLat, centerLng], zoom)
      mapInstanceRef.current = map

      // OpenStreetMap tiles (free)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map)

      // Online technician icon (green)
      const onlineIcon = L.divIcon({
        html: `<div style="
          width:32px;height:32px;
          background:#16a34a;border:3px solid white;
          border-radius:50%;display:flex;align-items:center;
          justify-content:center;color:white;font-size:14px;
          box-shadow:0 2px 6px rgba(0,0,0,0.35);
        ">💻</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -20],
        className: '',
      })

      // Offline technician icon (gray)
      const offlineIcon = L.divIcon({
        html: `<div style="
          width:32px;height:32px;
          background:#6b7280;border:3px solid white;
          border-radius:50%;display:flex;align-items:center;
          justify-content:center;color:white;font-size:14px;
          box-shadow:0 2px 6px rgba(0,0,0,0.25);
        ">💻</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -20],
        className: '',
      })

      // Add markers for each technician
      technicians.forEach((tech) => {
        if (!tech.latitude || !tech.longitude) return

        const isOnline = tech.availability_status === 'online'
        const stars = tech.average_rating > 0
          ? '⭐'.repeat(Math.round(tech.average_rating))
          : 'No reviews yet'

        const popup = L.popup({ maxWidth: 280 }).setContent(`
          <div style="font-family:sans-serif;padding:4px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <div style="width:40px;height:40px;border-radius:50%;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">
                ${tech.profile_photo_url
                  ? `<img src="${tech.profile_photo_url}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" />`
                  : '👤'}
              </div>
              <div>
                <div style="font-weight:600;font-size:14px;">${tech.full_name}</div>
                <div style="font-size:12px;color:${isOnline ? '#16a34a' : '#6b7280'};">
                  ${isOnline ? '🟢 Online' : '⚫ Offline'}
                </div>
              </div>
            </div>
            ${tech.tagline ? `<div style="font-size:12px;color:#374151;margin-bottom:6px;font-style:italic;">"${tech.tagline}"</div>` : ''}
            <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">📍 ${tech.city || ''}, ${tech.state || ''}</div>
            <div style="font-size:12px;margin-bottom:8px;">${stars}</div>
            <a href="/technicians/${tech.user_id}"
              style="display:block;text-align:center;background:#2563eb;color:white;padding:6px 12px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:500;">
              View Profile →
            </a>
          </div>
        `)

        const marker = L.marker([tech.latitude, tech.longitude], {
          icon: isOnline ? onlineIcon : offlineIcon,
        })
          .bindPopup(popup)
          .addTo(map)

        if (onTechnicianClick) {
          marker.on('click', () => onTechnicianClick(tech))
        }
      })

      // If we have technicians with coordinates, fit map to markers
      const withCoords = technicians.filter((t) => t.latitude && t.longitude)
      if (withCoords.length > 0) {
        const bounds = L.latLngBounds(
          withCoords.map((t) => [t.latitude!, t.longitude!] as [number, number])
        )
        if (withCoords.length === 1) {
          map.setView([withCoords[0].latitude!, withCoords[0].longitude!], 12)
        } else {
          map.fitBounds(bounds, { padding: [40, 40] })
        }
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        const L = mapInstanceRef.current as { remove: () => void }
        if (typeof L.remove === 'function') L.remove()
        mapInstanceRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update markers when technicians change
  useEffect(() => {
    if (!mapInstanceRef.current) return
    // Re-init on data change by removing and reinitializing
    // For simplicity, a full re-render is triggered by key changes in parent
  }, [technicians])

  return (
    <div
      ref={mapRef}
      className="h-full w-full rounded-lg"
      style={{ minHeight: '400px' }}
    />
  )
}
