'use client';
import { useEffect, useState, use } from 'react';
import api from '../../../../lib/api';
import { Eleve } from '../../../../lib/types';
import Link from 'next/link';

export default function EleveDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [eleve, setEleve] = useState<Eleve | null>(null);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        const fetchEleve = async () => {
            try {
                const res = await api.get(`/eleves/${id}`);
                setEleve(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setChargement(false);
            }
        };
        fetchEleve();
    }, [id]);

    if (chargement) return <div className="p-8 text-center text-gray-500 text-sm">Chargement du profil...</div>;
    if (!eleve) return <div className="p-8 text-center text-red-500">Élève non trouvé.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/eleves" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                    ←
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Profil de l'Élève</h1>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="pt-12 pb-8 px-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        <div className="p-1 bg-white rounded-2xl shadow-lg border border-slate-100 shrink-0">
                            <div className="w-32 h-32 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border-2 border-white">
                                {eleve.photoUrl ? (
                                    <img src={eleve.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl text-slate-200">👤</span>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left w-full">
                            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{eleve.nom}</h2>
                                    <p className="text-xl font-bold text-emerald-600/70 uppercase">{eleve.prenoms}</p>
                                    <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                                        <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                                            Matricule: {eleve.matricule || 'N/A'}
                                        </span>
                                        <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200">
                                            Sexe: {eleve.sexe}
                                        </span>
                                    </div>
                                </div>
                                <Link 
                                    href={`/dashboard/inscriptions/${eleve.inscriptions && eleve.inscriptions[0] ? eleve.inscriptions[0].id : id}/edit`}
                                    className="bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center gap-2"
                                >
                                    ✏️ Modifier le profil
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-50 pt-12">
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Informations Personnelles</h3>
                            <div className="grid grid-cols-2 gap-y-4">
                                <span className="text-sm text-gray-500 font-medium">Né(e) le</span>
                                <span className="text-sm font-bold text-gray-800">{new Date(eleve.dateNaissance).toLocaleDateString()}</span>
                                <span className="text-sm text-gray-500 font-medium">Lieu de naissance</span>
                                <span className="text-sm font-bold text-gray-800">{eleve.lieuNaissance}</span>
                                <span className="text-sm text-gray-500 font-medium">Nationalité</span>
                                <span className="text-sm font-bold text-gray-800">{eleve.nationalite}</span>
                                <span className="text-sm text-gray-500 font-medium">Téléphone</span>
                                <span className="text-sm font-bold text-gray-800">{eleve.telephone || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Adresse & Contact</h3>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-sm text-gray-500 font-medium mb-1 uppercase text-[10px] tracking-widest">Adresse Postale</p>
                                <p className="text-sm font-bold text-gray-800 italic">{eleve.adressePostale || 'Aucune adresse renseignée'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
