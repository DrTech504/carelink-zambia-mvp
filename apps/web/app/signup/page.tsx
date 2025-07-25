import Link from 'next/link'
import { headers } from 'next/headers'
import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SubmitButton } from '../login/submit-button'

// Using 'any' here is a targeted fix to bypass the Vercel-specific build error.
export default function Signup({ searchParams }: { searchParams: any }) {
  const signUp = async (formData: FormData) => {
    'use server'

    const origin = headers().get('origin')
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const role = formData.get('role') as 'doctor' | 'clinic' | 'officer' | 'patient';
    const supabase = createClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (authError) {
      return redirect('/signup?message=Could not authenticate user')
    }

    const { error: profileError } = await supabase.from('users').insert({
        id: authData.user?.id,
        email,
        full_name: fullName,
        role,
    })

    if (profileError) {
        console.error('Error creating profile:', profileError)
        return redirect('/signup?message=Could not create user profile. Please contact support.')
    }

    return redirect('/signup?message=Check email to continue sign in process')
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>

      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground" action={signUp}>
        <label className="text-md" htmlFor="fullName">
          Full Name
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="fullName"
          placeholder="John Doe"
          required
        />
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <label className="text-md" htmlFor="role">
          I am a...
        </label>
        <select
            name="role"
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            required
        >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="clinic">Clinic</option>
            <option value="officer">Clinical Officer</option>
        </select>

        <SubmitButton
          formAction={signUp}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Signing Up..."
        >
          Sign Up
        </SubmitButton>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
