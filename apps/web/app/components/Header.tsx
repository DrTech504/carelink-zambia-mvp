import { createClient } from '@/app/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Header() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const signOut = async () => {
        'use server'
        const supabase = createClient()
        await supabase.auth.signOut()
        return redirect('/')
    }

    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
                <Link href="/" className="font-bold text-lg">CareLink Zambia</Link>
                <div>
                    {user ? (
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">Dashboard</Link>
                        <form action={signOut}>
                        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
                            Logout
                        </button>
                        </form>
                    </div>
                    ) : (
                    <Link
                        href="/login"
                        className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
                    >
                        Login
                    </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
