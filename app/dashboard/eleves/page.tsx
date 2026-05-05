'use client';
import { useEffect, useState, use } from 'react';
import api from '../../../lib/api';
import { Eleve } from '../../../lib/types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ElevesPage() {
    const searchParams = useSearchParams();
    const classeIdFilter = searchParams.get('classeId');
    const [eleves, setEleves] = useState<Eleve[]>([]);
    const [chargement, setChargement] = useState(true);
    const [recherche, setRecherche] = useState('');

    useEffect(() => {
        const fetchEleves = async () => {
            try {
                // Si on a un classeId, on peut filtrer côté API si le backend le supporte
                // ou filtrer côté client. Ici on récupère tout et on filtrera.
                const response = await api.get('/eleves');
                let data = Array.isArray(response.data) ? response.data : [];
                
                if (classeIdFilter) {
                    data = data.filter((e: any) => 
                        e.inscriptions && e.inscriptions.some((ins: any) => 
                            ins.classe && ins.classe.id.toString() === classeIdFilter
                        )
                    );
                }
                
                setEleves(data);
            } catch (error) {
                console.error(error);
                setEleves([]);
            } finally {
                setChargement(false);
            }
        };
        fetchEleves();
    }, [classeIdFilter]);

    const elevesFiltrés = eleves.filter(e =>
        (e?.nom || '').toLowerCase().includes(recherche.toLowerCase()) ||
        (e?.prenoms || '').toLowerCase().includes(recherche.toLowerCase()) ||
        (e?.matricule && e.matricule.toLowerCase().includes(recherche.toLowerCase()))
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">Base de Données Élèves</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Consultation et gestion permanente</p>
                </div>
                <div className="relative w-full md:w-96 group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl group-focus-within:scale-125 transition-transform duration-300">🔍</span>
                    <input
                        type="text"
                        placeholder="RECHERCHER UN NOM OU MATRICULE..."
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-emerald-500 focus:bg-white transition-all font-black text-[11px] uppercase tracking-wider text-slate-700 placeholder:text-slate-300"
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {chargement ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                        <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">Accès aux archives...</p>
                    </div>
                ) : elevesFiltrés.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium italic text-sm">Aucun élève ne correspond à votre recherche.</p>
                    </div>
                ) : (
                    elevesFiltrés.map((eleve) => (
                        <div key={eleve.id} className="bg-white rounded-[28px] md:rounded-[32px] border border-slate-50 shadow-xl shadow-slate-200/40 overflow-hidden hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500 group relative">
                            <div className="h-16 md:h-24 bg-gradient-to-br from-emerald-50 to-teal-50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 md:p-4">
                                    <span className="px-2 md:px-3 py-1 bg-white/80 backdrop-blur-sm text-emerald-700 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-sm border border-white">
                                        {eleve.sexe}
                                    </span>
                                </div>
                            </div>
                            <div className="px-4 md:px-6 pb-6 md:pb-8 text-center -mt-10 md:-mt-12 relative z-10">
                                <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-white p-1 mx-auto shadow-xl group-hover:scale-110 transition-transform duration-500 border border-slate-50">
                                    <div className="w-full h-full rounded-xl md:rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-100">
                                        {eleve.photoUrl ? (
                                            <img src={eleve.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                                        ) : <span className="text-2xl md:text-4xl grayscale opacity-20">👤</span>}
                                    </div>
                                </div>
                                <h3 className="mt-3 text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight line-clamp-1">{eleve.nom} {eleve.prenoms}</h3>
                                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">MAT: {eleve.matricule || 'N/A'}</p>

                                <div className="mt-4 md:mt-6 grid grid-cols-2 gap-2">
                                    <Link
                                        href={`/dashboard/eleves/${eleve.id}`}
                                        className="py-2 md:py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95 text-center"
                                    >
                                        Profil
                                    </Link>
                                    <Link
                                        href={`/dashboard/inscriptions/nouvelle?editEleveId=${eleve.id}`}
                                        className="py-2 md:py-2.5 bg-slate-50 text-slate-500 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-emerald-900 hover:text-white transition-all active:scale-95 text-center"
                                    >
                                        Éditer
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
