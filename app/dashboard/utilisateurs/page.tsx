'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { Utilisateur, Role } from '../../../lib/types';

export default function UtilisateursPage() {
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/utilisateurs');
                setUtilisateurs(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setChargement(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase text-shadow">Équipe Administrative</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Gestion des accès et privilèges</p>
                </div>
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-[22px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-purple-200 hover:scale-105 active:scale-95 transition-all">
                    + Nouveau Collaborateur
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {chargement ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin shadow-lg shadow-amber-200" />
                        <p className="text-slate-300 font-black uppercase text-[10px] tracking-[0.4em]">Accès au registre...</p>
                    </div>
                ) : (
                    utilisateurs.map((u) => (
                        <div key={u.id} className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-xl shadow-slate-200/40 group hover:-translate-y-2 transition-all duration-500 overflow-hidden relative border-b-4 border-transparent hover:border-purple-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-purple-500/10 transition-colors duration-700" />
                            
                            <div className="flex items-center gap-6 mb-8 relative z-10">
                                <div className="w-16 h-16 rounded-[24px] bg-[#0f172a] flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:rotate-6 transition-transform duration-500 uppercase border border-white/10">
                                    {u.nom[0]}{u.prenoms[0]}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none mb-2">{u.nom}</h3>
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{u.role}</p>
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-colors group-hover:bg-white group-hover:border-purple-100">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 leading-none">Identifiant Email</p>
                                    <p className="text-xs font-bold text-slate-600 truncate">{u.email}</p>
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full ${u.actif ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{u.actif ? 'Compte Actif' : 'Désactivé'}</span>
                                    </div>
                                    <button className="text-[10px] font-black text-purple-600 uppercase tracking-widest hover:underline transition-all">Gérer l'accès</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
