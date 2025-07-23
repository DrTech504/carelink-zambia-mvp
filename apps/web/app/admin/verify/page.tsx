import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'

// Define a specific type for a user instead of using 'any'
interface UserProfile {
    id: string;
    full_name: string | null;
    is_verified: boolean | null;
    email: string | undefined;
}

export default async function VerifyUsersPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // In a real app, you'd add logic here to check if the user is an admin
    
    const { data: users, error } = await supabase.from('users').select('*')

    if (error) {
        return <p>Could not load users.</p>
    }

    return (
        <div className="w-full max-w-4xl p-8">
            <h1 className="text-2xl font-bold mb-4">Verify Doctors</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u: UserProfile) => (
                            <tr key={u.id}>
                                <td className="py-2 px-4 border-b">{u.full_name}</td>
                                <td className="py-2 px-4 border-b">{u.email}</td>
                                <td className="py-2 px-4 border-b">{u.is_verified ? 'Verified' : 'Not Verified'}</td>
                                <td className="py-2 px-4 border-b">
                                    <button className="bg-green-500 text-white px-3 py-1 rounded">Verify</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
