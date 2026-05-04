import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Wrench, PlusCircle, DollarSign } from 'lucide-react'

export default async function ProfessionalServicesPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')

  const { data: services } = await supabase
    .from('technician_services')
    .select('*')
    .eq('professional_id', user.id)
    .order('created_at', { ascending: true })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
          <p className="mt-1 text-sm text-gray-500">Services you offer to clients.</p>
        </div>
        <Link href="/professional/profile">
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            <PlusCircle className="h-4 w-4" />
            Manage Services
          </button>
        </Link>
      </div>

      {!services || services.length === 0 ? (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm py-16 text-center">
          <Wrench className="mx-auto h-10 w-10 text-gray-200 mb-3" />
          <p className="text-base font-semibold text-gray-700">No services listed yet</p>
          <p className="mt-1 text-sm text-gray-400">Add services to your profile so clients can find you.</p>
          <Link href="/professional/profile">
            <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
              <PlusCircle className="h-4 w-4" />
              Add Services
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {services.map((service: any) => (
            <div key={service.id} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                    <Wrench className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{service.service_name}</h3>
                </div>
              </div>
              {service.description && (
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{service.description}</p>
              )}
              {(service.price_min || service.price_max) && (
                <div className="flex items-center gap-1 text-sm font-medium text-green-700">
                  <DollarSign className="h-3.5 w-3.5" />
                  from ${service.price_min}
                  {service.price_max && service.price_max !== service.price_min ? `–$${service.price_max}` : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl bg-blue-50 border border-blue-100 px-5 py-4">
        <p className="text-sm text-blue-700">
          <strong>Tip:</strong> To add, edit, or remove services, go to{' '}
          <Link href="/professional/profile" className="underline font-semibold">Profile Editor → Services tab</Link>.
        </p>
      </div>
    </div>
  )
}
