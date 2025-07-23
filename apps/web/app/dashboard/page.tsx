import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'

async function PostGigForm() {
    const postGig = async (formData: FormData) => {
        'use server'
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return redirect('/login')
        }

        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const pay = formData.get('pay') as string

        const { error } = await supabase.from('gigs').insert({
            clinic_id: user.id,
            title,
            description,
            pay: Number(pay),
        })

        if (error) {
            console.error("Error posting gig:", error)
        } else {
            console.log('Gig posted successfully')
        }
    }

    return (
        <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Post a New Gig</h2>
            <form className="flex flex-col gap-4" action={postGig}>
                <div>
                    <label htmlFor="title" className="block mb-2 text-sm font-medium">Gig Title</label>
                    <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="e.g., Weekend Locum Doctor" required />
                </div>
                <div>
                    <label htmlFor="description" className="block mb-2 text-sm font-medium">Description</label>
                    <textarea name="description" id="description" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Describe the role..."></textarea>
                </div>
                 <div>
                    <label htmlFor="pay" className="block mb-2 text-sm font-medium">Pay (ZMW)</label>
                    <input type="number" name="pay" id="pay" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="e.g., 5000" required />
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Post Gig</button>
            </form>
        </div>
    )
}

async function GigList() {
    const supabase = createClient()
    const { data: gigs, error } = await supabase.from('gigs').select(`
        *,
        users ( full_name )
    `)

    if (error) {
        console.error("Error fetching gigs", error)
        return <p>Could not load gigs.</p>
    }

    return (
         <div className="w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Available Gigs</h2>
            <div className="space-y-4">
                {gigs?.map((gig) => (
                    <div key={gig.id} className="p-4 border rounded-lg">
                        <h3 className="text-xl font-semibold">{gig.title}</h3>
                        <p className="text-gray-500">Posted by: {gig.users?.full_name || 'A Clinic'}</p>
                        <p className="mt-2">{gig.description}</p>
                        <div className="mt-2 font-bold">Pay: ZMW {gig.pay}</div>
                        <button className="mt-4 text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5">Apply Now</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile, error } = await supabase
    .from('users')
    .select('full_name, role, is_verified')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    console.error("Could not find user profile", error)
    return redirect('/login?message=Could not find your profile.')
  }

  return (
    <div className="w-full flex flex-col items-center p-8">
        <div className="w-full max-w-4xl">
            <h1 className="text-3xl font-bold mb-2">Welcome, {profile.full_name}!</h1>
            <p className="text-lg text-gray-600 mb-8">Your Role: <span className="font-semibold capitalize">{profile.role}</span></p>

            {profile.role === 'clinic' && <PostGigForm />}
            {profile.role === 'doctor' && <GigList />}
            {(profile.role === 'patient' || profile.role === 'officer') && (
                <p>Your dashboard is under construction. Check back soon!</p>
            )}
        </div>
    </div>
  )
}
