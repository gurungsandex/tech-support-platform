'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  getMyTechnicianProfile, updateTechnicianProfile,
  saveServices, saveCertifications, savePortfolioItem, deletePortfolioItem,
  toggleProfilePause, updateAvailabilityStatus
} from '@/lib/technicians/actions'
import { PREDEFINED_SERVICES, US_STATES, SERVICE_RADIUS_OPTIONS } from '@/lib/types/database'
import type { TechnicianService, TechnicianCertification, TechnicianPortfolioItem } from '@/lib/types/database'
import {
  Settings, MapPin, Briefcase, Award, FolderOpen, Eye, Power,
  Plus, Trash2, ExternalLink, Save, CheckCircle, AlertCircle,
  Wifi, Home, DollarSign, Pause, Play, Globe
} from 'lucide-react'

type Tab = 'basic' | 'services' | 'certifications' | 'portfolio' | 'availability' | 'privacy'

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'basic', label: 'Basic Info', icon: Settings },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'portfolio', label: 'Portfolio', icon: FolderOpen },
  { id: 'availability', label: 'Availability', icon: Power },
  { id: 'privacy', label: 'Privacy', icon: Eye },
]

export default function TechnicianProfileEditor() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('basic')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Basic profile state
  const [fullName, setFullName] = useState('')
  const [tagline, setTagline] = useState('')
  const [bio, setBio] = useState('')
  const [yearsExp, setYearsExp] = useState(0)
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [serviceRadius, setServiceRadius] = useState(25)
  const [supportType, setSupportType] = useState<'remote' | 'onsite' | 'both'>('both')
  const [hourlyMin, setHourlyMin] = useState('')
  const [hourlyMax, setHourlyMax] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')

  // Services
  const [services, setServices] = useState<Array<TechnicianService & { _dirty?: boolean }>>([])
  const [customService, setCustomService] = useState('')

  // Certifications
  const [certs, setCerts] = useState<TechnicianCertification[]>([])
  const [newCert, setNewCert] = useState({ name: '', issuer: '', issued_date: '', verification_url: '' })

  // Portfolio
  const [portfolio, setPortfolio] = useState<TechnicianPortfolioItem[]>([])
  const [newPortfolio, setNewPortfolio] = useState({ title: '', description: '', project_url: '' })

  // Availability & Privacy
  const [isOnline, setIsOnline] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [phoneVisibility, setPhoneVisibility] = useState<'public' | 'registered' | 'hidden'>('registered')
  const [emailVisibility, setEmailVisibility] = useState<'public' | 'registered' | 'hidden'>('registered')

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  useEffect(() => {
    getMyTechnicianProfile().then(({ data, error }) => {
      if (error || !data) {
        showMessage('error', error || 'Failed to load profile')
        return
      }
      setTagline(data.tagline ?? '')
      setBio(data.bio ?? '')
      setYearsExp(data.years_of_experience)
      setCity(data.city ?? '')
      setState(data.state ?? '')
      setZipCode(data.zip_code ?? '')
      setServiceRadius(data.service_radius_miles)
      setSupportType(data.support_type ?? 'both')
      setHourlyMin(data.hourly_rate_min?.toString() ?? '')
      setHourlyMax(data.hourly_rate_max?.toString() ?? '')
      setWebsiteUrl(data.website_url ?? '')
      setLinkedinUrl(data.linkedin_url ?? '')
      setIsOnline(data.availability_status === 'online')
      setIsPaused(data.is_paused)
      setPhoneVisibility(data.phone_visibility ?? 'registered')
      setEmailVisibility(data.email_visibility ?? 'registered')
      setServices(data.services)
      setCerts(data.certifications)
      setPortfolio(data.portfolio)
      setLoading(false)
    })
  }, [])

  // ---- SAVE HANDLERS ----

  async function saveBasicInfo() {
    setSaving(true)
    const result = await updateTechnicianProfile({
      tagline: tagline || null,
      bio: bio || null,
      years_of_experience: yearsExp,
      city: city || null,
      state: state || null,
      zip_code: zipCode || null,
      service_radius_miles: serviceRadius,
      support_type: supportType,
      hourly_rate_min: hourlyMin ? parseInt(hourlyMin) : null,
      hourly_rate_max: hourlyMax ? parseInt(hourlyMax) : null,
      website_url: websiteUrl || null,
      linkedin_url: linkedinUrl || null,
    })
    setSaving(false)
    if (result.error) showMessage('error', result.error)
    else showMessage('success', 'Profile updated!')
  }

  async function saveServicesList() {
    setSaving(true)
    const result = await saveServices(services.map(s => ({
      id: s.id,
      service_name: s.service_name,
      is_custom: s.is_custom,
      price_min: s.price_min,
      price_max: s.price_max,
    })))
    setSaving(false)
    if (result.error) showMessage('error', result.error)
    else showMessage('success', 'Services saved!')
  }

  async function saveCertsList() {
    setSaving(true)
    const result = await saveCertifications(certs.map(c => ({
      id: c.id,
      name: c.name,
      issuer: c.issuer,
      issued_date: c.issued_date,
      verification_url: c.verification_url,
    })))
    setSaving(false)
    if (result.error) showMessage('error', result.error)
    else showMessage('success', 'Certifications saved!')
  }

  const addPredefinedService = (name: string) => {
    if (services.find(s => s.service_name === name)) return
    setServices(prev => [...prev, {
      id: crypto.randomUUID(),
      technician_id: '',
      service_name: name,
      is_custom: false,
      price_min: null,
      price_max: null,
      created_at: new Date().toISOString(),
    }])
  }

  const addCustomService = () => {
    if (!customService.trim()) return
    setServices(prev => [...prev, {
      id: crypto.randomUUID(),
      technician_id: '',
      service_name: customService.trim(),
      is_custom: true,
      price_min: null,
      price_max: null,
      created_at: new Date().toISOString(),
    }])
    setCustomService('')
  }

  const updateServicePrice = (id: string, field: 'price_min' | 'price_max', value: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value ? parseInt(value) : null } : s))
  }

  const removeService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id))
  }

  const addCert = () => {
    if (!newCert.name.trim()) return
    setCerts(prev => [...prev, {
      id: crypto.randomUUID(),
      technician_id: '',
      name: newCert.name,
      issuer: newCert.issuer || null,
      issued_date: newCert.issued_date || null,
      expiry_date: null,
      verification_url: newCert.verification_url || null,
      created_at: new Date().toISOString(),
    }])
    setNewCert({ name: '', issuer: '', issued_date: '', verification_url: '' })
  }

  const removeCert = (id: string) => setCerts(prev => prev.filter(c => c.id !== id))

  const addPortfolioItem = async () => {
    if (!newPortfolio.title.trim()) return
    setSaving(true)
    const result = await savePortfolioItem({
      title: newPortfolio.title,
      description: newPortfolio.description || null,
      project_url: newPortfolio.project_url || null,
    })
    setSaving(false)
    if (result.error) {
      showMessage('error', result.error)
    } else {
      setPortfolio(prev => [...prev, {
        id: crypto.randomUUID(),
        technician_id: '',
        title: newPortfolio.title,
        description: newPortfolio.description || null,
        image_url: null,
        project_url: newPortfolio.project_url || null,
        created_at: new Date().toISOString(),
      }])
      setNewPortfolio({ title: '', description: '', project_url: '' })
      showMessage('success', 'Portfolio item added!')
    }
  }

  const removePortfolioItem = async (id: string) => {
    const result = await deletePortfolioItem(id)
    if (result.error) showMessage('error', result.error)
    else setPortfolio(prev => prev.filter(p => p.id !== id))
  }

  async function toggleAvailability() {
    const newStatus = isOnline ? 'offline' : 'online'
    const result = await updateAvailabilityStatus(newStatus)
    if (result.error) showMessage('error', result.error)
    else {
      setIsOnline(!isOnline)
      showMessage('success', `You are now ${newStatus}`)
    }
  }

  async function handleTogglePause() {
    const result = await toggleProfilePause(!isPaused)
    if (result.error) showMessage('error', result.error)
    else {
      setIsPaused(!isPaused)
      showMessage('success', isPaused ? 'Profile is now active' : 'Profile paused — you won\'t appear in search results')
    }
  }

  async function savePrivacy() {
    setSaving(true)
    const result = await updateTechnicianProfile({
      phone_visibility: phoneVisibility,
      email_visibility: emailVisibility,
    })
    setSaving(false)
    if (result.error) showMessage('error', result.error)
    else showMessage('success', 'Privacy settings saved!')
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your public profile, services, and settings</p>
      </div>

      {/* Toast message */}
      {message && (
        <div className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      {/* Availability banner */}
      <div className={`flex items-center justify-between rounded-xl px-5 py-3 ${isOnline ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <span className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="text-sm font-medium text-gray-700">
            You are currently <strong>{isOnline ? 'online' : 'offline'}</strong>
            {isPaused && ' — Profile paused (hidden from search)'}
          </span>
        </div>
        <button
          onClick={toggleAvailability}
          className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-colors ${isOnline ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-green-600 hover:bg-green-700 text-white'}`}
        >
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-0 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                tab === id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* ---- TAB: Basic Info ---- */}
      {tab === 'basic' && (
        <div className="space-y-5">
          <div className="rounded-xl bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Professional Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input value={tagline} onChange={e => setTagline(e.target.value)} maxLength={100}
                placeholder="e.g. Fast, friendly IT support for homes and small businesses"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} maxLength={1000}
                placeholder="Tell customers about your background and approach..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input type="number" min={0} max={50} value={yearsExp} onChange={e => setYearsExp(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Type</label>
                <select value={supportType} onChange={e => setSupportType(e.target.value as 'remote' | 'onsite' | 'both')}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="remote">Remote Only</option>
                  <option value="onsite">On-site Only</option>
                  <option value="both">Remote & On-site</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><MapPin className="h-4 w-4" /> Location (US Only)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input value={city} onChange={e => setCity(e.target.value)}
                  placeholder="e.g. Austin"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select value={state} onChange={e => setState(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select state</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input value={zipCode} onChange={e => setZipCode(e.target.value)} maxLength={5} placeholder="e.g. 78701"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Radius (on-site)</label>
                <select value={serviceRadius} onChange={e => setServiceRadius(parseInt(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {SERVICE_RADIUS_OPTIONS.map(r => <option key={r} value={r}>{r} miles</option>)}
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-400">Your ZIP code is used to place you on the map for nearby searches.</p>
          </div>

          <div className="rounded-xl bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><DollarSign className="h-4 w-4" /> Hourly Rate Estimate (Optional)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min ($/hr)</label>
                <input type="number" min={0} value={hourlyMin} onChange={e => setHourlyMin(e.target.value)} placeholder="e.g. 40"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max ($/hr)</label>
                <input type="number" min={0} value={hourlyMax} onChange={e => setHourlyMax(e.target.value)} placeholder="e.g. 80"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Globe className="h-4 w-4" /> Links (Optional)</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://yoursite.com"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <button onClick={saveBasicInfo} disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* ---- TAB: Services ---- */}
      {tab === 'services' && (
        <div className="space-y-5">
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Your Services</h2>

            {services.length > 0 ? (
              <div className="space-y-2 mb-6">
                {services.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-2.5">
                    <span className="flex-1 text-sm font-medium text-gray-700">{s.service_name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">$</span>
                      <input type="number" placeholder="Min" value={s.price_min ?? ''} onChange={e => updateServicePrice(s.id, 'price_min', e.target.value)}
                        className="w-16 rounded border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      <span className="text-xs text-gray-400">–</span>
                      <input type="number" placeholder="Max" value={s.price_max ?? ''} onChange={e => updateServicePrice(s.id, 'price_max', e.target.value)}
                        className="w-16 rounded border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <button onClick={() => removeService(s.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 mb-4">No services added yet. Add from the list below.</p>
            )}

            <h3 className="text-sm font-medium text-gray-700 mb-3">Add Predefined Service</h3>
            <div className="flex flex-wrap gap-2 mb-5">
              {PREDEFINED_SERVICES.map((name) => (
                <button key={name} onClick={() => addPredefinedService(name)}
                  disabled={!!services.find(s => s.service_name === name)}
                  className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  + {name}
                </button>
              ))}
            </div>

            <h3 className="text-sm font-medium text-gray-700 mb-2">Add Custom Service</h3>
            <div className="flex gap-2">
              <input value={customService} onChange={e => setCustomService(e.target.value)} placeholder="Custom service name..."
                onKeyDown={e => e.key === 'Enter' && addCustomService()}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={addCustomService}
                className="flex items-center gap-1 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-colors">
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
          </div>

          <button onClick={saveServicesList} disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Services'}
          </button>
        </div>
      )}

      {/* ---- TAB: Certifications ---- */}
      {tab === 'certifications' && (
        <div className="space-y-5">
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Your Certifications</h2>

            {certs.length > 0 && (
              <div className="space-y-3 mb-6">
                {certs.map((cert) => (
                  <div key={cert.id} className="flex items-start gap-3 rounded-lg bg-gray-50 px-4 py-3">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">{cert.name}</div>
                      {cert.issuer && <div className="text-xs text-gray-500">{cert.issuer}</div>}
                      {cert.verification_url && (
                        <a href={cert.verification_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                          <ExternalLink className="h-3 w-3" /> Verify
                        </a>
                      )}
                    </div>
                    <button onClick={() => removeCert(cert.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <h3 className="text-sm font-medium text-gray-700 mb-3">Add Certification</h3>
            <div className="space-y-3 rounded-lg bg-gray-50 p-4">
              <input value={newCert.name} onChange={e => setNewCert(p => ({ ...p, name: e.target.value }))} placeholder="Certification name (e.g. CompTIA A+) *"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input value={newCert.issuer} onChange={e => setNewCert(p => ({ ...p, issuer: e.target.value }))} placeholder="Issuing organization (e.g. CompTIA)"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="date" value={newCert.issued_date} onChange={e => setNewCert(p => ({ ...p, issued_date: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input value={newCert.verification_url} onChange={e => setNewCert(p => ({ ...p, verification_url: e.target.value }))} placeholder="Public verification URL (optional)"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={addCert}
                className="flex items-center gap-1 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-colors">
                <Plus className="h-4 w-4" /> Add Certification
              </button>
            </div>
          </div>

          <button onClick={saveCertsList} disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Certifications'}
          </button>
        </div>
      )}

      {/* ---- TAB: Portfolio ---- */}
      {tab === 'portfolio' && (
        <div className="space-y-5">
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Portfolio & Past Projects</h2>

            {portfolio.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {portfolio.map((item) => (
                  <div key={item.id} className="rounded-lg border border-gray-100 p-4 relative">
                    <button onClick={() => removePortfolioItem(item.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <h3 className="font-medium text-sm text-gray-900 pr-6">{item.title}</h3>
                    {item.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
                    {item.project_url && (
                      <a href={item.project_url} target="_blank" rel="noopener noreferrer"
                        className="mt-2 text-xs text-blue-600 hover:underline flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" /> View
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            <h3 className="text-sm font-medium text-gray-700 mb-3">Add Project</h3>
            <div className="space-y-3 rounded-lg bg-gray-50 p-4">
              <input value={newPortfolio.title} onChange={e => setNewPortfolio(p => ({ ...p, title: e.target.value }))} placeholder="Project title *"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <textarea value={newPortfolio.description} onChange={e => setNewPortfolio(p => ({ ...p, description: e.target.value }))} placeholder="Short description..." rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              <input value={newPortfolio.project_url} onChange={e => setNewPortfolio(p => ({ ...p, project_url: e.target.value }))} placeholder="Project URL (optional)"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={addPortfolioItem} disabled={saving}
                className="flex items-center gap-1 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50 transition-colors">
                <Plus className="h-4 w-4" /> Add Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- TAB: Availability ---- */}
      {tab === 'availability' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Power className="h-5 w-5" /> Availability Status</h2>
            <div className="space-y-3">
              <div className={`flex items-center justify-between rounded-xl p-4 border-2 cursor-pointer transition-colors ${isOnline ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                onClick={toggleAvailability}>
                <div>
                  <div className="font-medium text-gray-900">Online</div>
                  <div className="text-sm text-gray-500">Customers can see you&apos;re available for chat</div>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 ${isOnline ? 'border-green-500 bg-green-500' : 'border-gray-300'}`} />
              </div>
              <div className={`flex items-center justify-between rounded-xl p-4 border-2 cursor-pointer transition-colors ${!isOnline ? 'border-gray-800 bg-gray-50' : 'border-gray-200'}`}
                onClick={toggleAvailability}>
                <div>
                  <div className="font-medium text-gray-900">Offline</div>
                  <div className="text-sm text-gray-500">Profile visible but you appear unavailable</div>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 ${!isOnline ? 'border-gray-800 bg-gray-800' : 'border-gray-300'}`} />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
              {isPaused ? <Pause className="h-5 w-5 text-yellow-600" /> : <Play className="h-5 w-5 text-gray-600" />}
              Profile Pause
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Pause your profile when you&apos;re on vacation or temporarily unavailable.
              Your profile will still exist but <strong>will not appear in search results</strong>.
            </p>
            <button onClick={handleTogglePause}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${isPaused ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}>
              {isPaused ? <><Play className="h-4 w-4" /> Reactivate Profile</> : <><Pause className="h-4 w-4" /> Pause Profile</>}
            </button>
          </div>
        </div>
      )}

      {/* ---- TAB: Privacy ---- */}
      {tab === 'privacy' && (
        <div className="space-y-5">
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2"><Eye className="h-5 w-5" /> Contact Info Visibility</h2>
            <p className="text-sm text-gray-500 mb-5">Control who can see your phone number and email address on your public profile.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number Visibility</label>
                <div className="space-y-2">
                  {([
                    { value: 'public', label: 'Public', desc: 'Everyone can see your phone number' },
                    { value: 'registered', label: 'Registered users only', desc: 'Only logged-in users can see your phone' },
                    { value: 'hidden', label: 'Hidden', desc: 'Phone number is never shown' },
                  ] as const).map(opt => (
                    <label key={opt.value} className={`flex items-start gap-3 rounded-lg border-2 p-3 cursor-pointer transition-colors ${phoneVisibility === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                      <input type="radio" name="phone_visibility" value={opt.value} checked={phoneVisibility === opt.value}
                        onChange={() => setPhoneVisibility(opt.value)} className="mt-0.5 accent-blue-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{opt.label}</div>
                        <div className="text-xs text-gray-500">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Visibility</label>
                <div className="space-y-2">
                  {([
                    { value: 'public', label: 'Public', desc: 'Everyone can see your email address' },
                    { value: 'registered', label: 'Registered users only', desc: 'Only logged-in users can see your email' },
                    { value: 'hidden', label: 'Hidden', desc: 'Email address is never shown' },
                  ] as const).map(opt => (
                    <label key={opt.value} className={`flex items-start gap-3 rounded-lg border-2 p-3 cursor-pointer transition-colors ${emailVisibility === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                      <input type="radio" name="email_visibility" value={opt.value} checked={emailVisibility === opt.value}
                        onChange={() => setEmailVisibility(opt.value)} className="mt-0.5 accent-blue-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{opt.label}</div>
                        <div className="text-xs text-gray-500">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800">
              When contact info is hidden from non-registered users, they will see:
              &quot;Contact details are visible only to registered users. Please create an account to view.&quot;
            </div>
          </div>

          <button onClick={savePrivacy} disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Privacy Settings'}
          </button>
        </div>
      )}
    </div>
  )
}
