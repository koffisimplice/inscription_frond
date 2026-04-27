'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../lib/auth';

export default function RootPage() {
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (isAuthenticated()) {
                router.replace('/dashboard');
            } else {
                router.replace('/login');
            }
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_40px_rgba(16,185,129,0.2)]" />
                <p className="text-emerald-500/60 font-black uppercase text-[10px] tracking-[0.4em] animate-pulse text-center">
                    Lycée d'Andé<br/>
                    <span className="text-[8px] opacity-50">Chargement du système...</span>
                </p>
            </div>
        </div>
    );
}
