import { createClient } from '../lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AboutPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) redirect('/login')

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">About CareLink Zambia</h1>
      <p>Welcome, {data.user.email}</p>
    </main>
  )
}
