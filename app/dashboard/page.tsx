'use client';
import { useEffect, useState } from 'react';
import { getUser } from '../../lib/auth';
import { Role, Utilisateur } from '../../lib/types';
import Link from 'next/link';

export default function DashboardHome() {
    const [user, setUser] = useState<Utilisateur | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setUser(getUser());
        setLoading(false);
    }, []);

    if (loading || !user) return null;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Tableau de Bord</h1>
                <Link href="/dashboard/inscriptions/nouvelle" className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg active:scale-95">
                    + Ouvrir un Nouveau Dossier
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard title="Inscriptions Globales" value="124" icon="📝" color="emerald" />
                <StatCard title="Paiements Confirmés" value="86" icon="💰" color="emerald" sub="38 en attente" />
                <StatCard title="Dossiers Finalisés" value="42" icon="✅" color="emerald" sub="34% du total" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Recent Activity */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Flux d'Activité</h3>
                        <Link href="/dashboard/inscriptions" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Consulter tout →</Link>
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-5 p-4 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-sm text-emerald-600">👤</div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">KOUASSI KOFFI</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Inscrit en 6ème 1 • Il y a 10 min</p>
                                </div>
                                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-wider">Initialisé</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Raccourcis de Gestion</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                        <QuickAction label="Répertoire Élèves" href="/dashboard/eleves" icon="🎓" />
                        <QuickAction label="Liste des Classes" href="/dashboard/classes" icon="🏫" />
                        <QuickAction label="Gestion Personnel" href="/dashboard/utilisateurs" icon="👤" />
                        <QuickAction label="Paramètres Système" href="#" icon="⚙️" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, sub }: any) {
    return (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-[20px] bg-slate-50 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm">{icon}</div>
                {sub && <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-wider border border-amber-100">{sub}</span>}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
        </div>
    );
}

function QuickAction({ label, href, icon }: any) {
    return (
        <Link href={href} className="flex flex-col items-center justify-center p-8 bg-[#fcfdfe] rounded-[32px] hover:bg-emerald-600 hover:text-white transition-all duration-500 group border border-slate-100 hover:border-transparent hover:shadow-2xl hover:shadow-emerald-200 active:scale-95">
            <span className="text-3xl mb-4 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-500">{icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-center">{label}</span>
        </Link>
    );
}
