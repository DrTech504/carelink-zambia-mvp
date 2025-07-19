'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';

export default function Triage() {
  const [symptoms, setSymptoms] = useState('');
  const [vitals, setVitals] = useState({ fever: 0, pain: 0, chestPain: false });
  const [result, setResult] = useState<{ urgency: string; advice: string } | null>(null);

  const triage = async () => {
    // Zambia-guideline rule engine
    let urgency = 'MILD', advice = 'Self-care';
    if (vitals.fever > 38.5 && symptoms.includes('cough')) {
      urgency = 'URGENT'; advice = 'Go to nearest ER';
    } else if (vitals.chestPain) {
      urgency = 'URGENT'; advice = 'Call 911';
    } else if (vitals.pain >= 7) {
      urgency = 'MODERATE'; advice = 'Book GP within 24 hrs';
    }

    // store & notify admin
    await supabase.from('triage_logs').insert([{ symptoms, vitals, urgency, advice }]);
    await sendEmail('admin@carelink-zambia.com', 'Urgent Triage', `<p>${urgency}: ${advice}</p>`);

    setResult({ urgency, advice });
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Triage (Zambia Guidelines)</h1>
      <textarea placeholder="Describe symptoms..." className="border p-2 w-full" onChange={e => setSymptoms(e.target.value)} />
      <input type="number" placeholder="Fever °C" className="border p-2 w-full mt-2" onChange={e => setVitals({ ...vitals, fever: +e.target.value })} />
      <label className="flex items-center mt-2"><input type="checkbox" onChange={e => setVitals({ ...vitals, chestPain: e.target.checked })} /> Chest pain</label>
      <button onClick={triage} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Get Advice</button>
      {result && (
        <div className={`mt-4 p-3 rounded text-white ${result.urgency === 'URGENT' ? 'bg-red-600' : result.urgency === 'MODERATE' ? 'bg-orange-500' : 'bg-green-600'}`}>
          <p>{result.advice}</p>
          {result.urgency === 'URGENT' && <a href="/urgent" className="underline">Refer Now</a>}
        </div>
      )}
    </main>
  );
}
