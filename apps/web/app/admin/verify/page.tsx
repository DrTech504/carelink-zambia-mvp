'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function VerifyDoctors() {
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('verified', false);

      if (!error) setDoctors(data);
    })();
  }, []);

  const verify = async (id: string) => {
    await supabase.from('providers').update({ verified: true }).eq('id', id);
    setDoctors(prev => prev.filter(doc => doc.id !== id));
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Verify Doctors</h1>
      {doctors.length === 0 ? (
        <p>No doctors pending verification.</p>
      ) : (
        <ul className="space-y-4">
          {doctors.map(doc => (
            <li key={doc.id} className="border p-4 rounded">
              <p><strong>{doc.name}</strong></p>
              <p>{doc.specialty}</p>
              <button
                className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
                onClick={() => verify(doc.id)}
              >
                Verify
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
