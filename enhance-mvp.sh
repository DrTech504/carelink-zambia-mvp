#!/usr/bin/env bash
set -euxo pipefail

# Install dependencies
npm install
npm install lib-jitsi-meet @flutterwave/react-flutterwave --save

# Generate patient booking + payment + video pages
mkdir -p pages/patient/book pages/patient/consult

# Doctor search page
cat > pages/patient/search.js << 'EOP'
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
export default function DoctorSearch() {
  const [doctors, setDoctors] = useState([]);
  const [q, setQ] = useState('');
  useEffect(() => {
    async function fetch() {
      let { data } = await supabase
        .from('users')
        .select('id,name,specialty,available_for_on_demand')
        .eq('role','doctor')
        .ilike('specialty','%'+q+'%');
      setDoctors(data || []);
    }
    fetch();
  }, [q]);
  return (
    <div className="p-4">
      <input
        className="border p-2 w-full mb-4"
        placeholder="Search by specialty or leave blank"
        value={q} onChange={e=>setQ(e.target.value)}
      />
      {doctors.map(d=>(
        <div key={d.id} className="border p-3 mb-3">
          <h2 className="text-xl">{d.name}</h2>
          <p>Specialty: {d.specialty||'General'}</p>
          <p>{d.available_for_on_demand?'🟢 Available now':'⚪️ Not on-demand'}</p>
          <a
            className="bg-blue-500 text-white px-4 py-2 rounded"
            href={\`/patient/book/\${d.id}\`}
          >Book Consultation</a>
        </div>
      ))}
    </div>
  );
}
EOP

# Booking page
cat > pages/patient/book/[doctorId].js << 'EOP'
import { useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { useFlutterwave, closePaymentModal } from '@flutterwave/react-flutterwave';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
export default function Book() {
  const { doctorId } = useRouter().query;
  const [type,setType] = useState('scheduled');
  const [scheduledFor,setScheduledFor] = useState('');
  const price = 200;
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY,
    tx_ref: Date.now().toString(),
    amount: price,
    currency: 'ZMW',
    payment_options: 'mobilemoney,card',
    customer: {
      email: supabase.auth.user().email,
      phonenumber: supabase.auth.user().phone,
      name: supabase.auth.user().name,
    },
    customizations: {
      title: 'CareLink Consultation',
      description: \`Consult with Dr \${doctorId}\`,
    },
  };
  const handlePayment = useFlutterwave(config);
  async function handleBooking() {
    const roomName = \`carelink-\${Date.now()}\`;
    await supabase.from('appointments').insert({
      patient_id: supabase.auth.user().id,
      doctor_id: doctorId,
      type,
      scheduled_for: type==='scheduled'? scheduledFor : null,
      room_name: roomName
    });
    handlePayment({
      callback: async (res)=>{
        if(res.status==='successful'){
          await supabase.from('appointments')
            .update({payment_status:'paid',status:'confirmed'})
            .eq('room_name',roomName);
          closePaymentModal();
          window.location.href = \`/patient/consult/\${roomName}\`;
        }
      },
      onClose: ()=>{}
    });
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Book Dr {doctorId}</h1>
      <label>
        <input type="radio" checked={type==='scheduled'} onChange={()=>setType('scheduled')} /> Schedule later
      </label>
      <label className="ml-4">
        <input type="radio" checked={type==='on_demand'} onChange={()=>setType('on_demand')} /> On-Demand
      </label>
      {type==='scheduled' && (
        <input
          type="datetime-local"
          className="border p-2 mt-2"
          value={scheduledFor}
          onChange={e=>setScheduledFor(e.target.value)}
        />
      )}
      <button
        onClick={handleBooking}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Pay K{price} &amp; Book
      </button>
    </div>
  );
}
EOP

# Video consultation page
cat > pages/patient/consult/[room].js << 'EOP'
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const Jitsi = dynamic(() => import('react-jitsi'), { ssr: false });
export default function Consult() {
  const { room } = useRouter().query;
  return (
    <div className="h-screen">
      <Jitsi
        domain={process.env.NEXT_PUBLIC_JITSI_SERVER.replace(/^https?:\/\//, '')}
        roomName={room}
        displayName={supabase.auth.user().name}
      />
    </div>
  );
}
EOP

# 4) Commit & Deploy
git add .
git commit -m "feat: add public booking, payment & video features"
git push origin main

# 5) Trigger Vercel deploy
npx vercel --prod
