'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { Inscription, StatutInscription } from '../../../lib/types';
import Link from 'next/link';

export default function InscriptionsPage() {
    const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
    const [chargement, setChargement] = useState(true);

    const fetchInscriptions = async () => {
        try {
            const response = await api.get('/inscriptions');
            setInscriptions(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Erreur", error);
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => {
        fetchInscriptions();
        const handleFocus = () => fetchInscriptions();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const handleSupprimer = async (id: number) => {
        if (confirm("🚨 Êtes-vous sûr de vouloir supprimer cette inscription ? Cette action est irréversible.")) {
            try {
                await api.delete(`/inscriptions/${id}`);
                setInscriptions(inscriptions.filter(ins => ins.id !== id));
            } catch (err) {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    const getStatutStyle = (statut: StatutInscription) => {
        switch (statut) {
            case StatutInscription.EN_COURS: return 'bg-amber-50 text-amber-600 ring-amber-100';
            case StatutInscription.VALIDEE_INTENDANT: return 'bg-teal-50 text-teal-600 ring-teal-100';
            case StatutInscription.VALIDEE_EDUCATEUR: return 'bg-emerald-50 text-emerald-600 ring-emerald-100';
            case StatutInscription.FINALISEE: return 'bg-emerald-100 text-emerald-700 ring-emerald-200';
            default: return 'bg-slate-50 text-slate-600 ring-slate-100';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">Dossiers d'Inscription</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Gestion et suivi des inscriptions pour l'année 2024-2025.</p>
                </div>
                <Link
                    href="/dashboard/inscriptions/nouvelle"
                    className="w-full md:w-auto bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 active:scale-95"
                >
                    <span className="text-lg">+</span> Nouveau Dossier
                </Link>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Élève</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Classe</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Statut</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Paiement</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {chargement ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Chargement des dossiers...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : inscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center text-slate-400 font-medium italic">
                                        Aucun dossier trouvé pour le moment.
                                    </td>
                                </tr>
                            ) : (
                                inscriptions.map((ins) => (
                                    <tr key={ins.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 font-black text-sm border-2 border-white shadow-sm">
                                                    {ins.eleve?.nom?.[0]}{ins.eleve?.prenoms?.[0]}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{ins.eleve?.nom} {ins.eleve?.prenoms}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Mat: {ins.eleve?.matricule || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-[11px] font-black uppercase tracking-tight">
                                                {ins.classe?.nom || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider ring-1 ${getStatutStyle(ins.statut)}`}>
                                                {ins.statut?.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {ins.fraisPaye ? (
                                                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> Payé
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> En attente
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center gap-3">
                                                <Link href={`/dashboard/inscriptions/${ins.id}?print=true`} className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100" title="Imprimer">🖨️</Link>
                                                <Link href={`/dashboard/inscriptions/${ins.id}`} className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all shadow-sm border border-teal-100" title="Modifier">✏️</Link>
                                                <button onClick={() => handleSupprimer(ins.id!)} className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100" title="Supprimer">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden space-y-4">
                {chargement ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Chargement...</p>
                    </div>
                ) : inscriptions.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 font-medium italic bg-white rounded-[32px] border border-dashed border-slate-200">
                        Aucun dossier trouvé.
                    </div>
                ) : (
                    inscriptions.map((ins) => (
                        <div key={ins.id} className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-5 space-y-4">
                            {/* Row 1: Avatar + Name + Class */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 font-black text-sm shrink-0">
                                    {ins.eleve?.nom?.[0]}{ins.eleve?.prenoms?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">{ins.eleve?.nom} {ins.eleve?.prenoms}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ins.classe?.nom || 'N/A'}</p>
                                </div>
                                <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider ring-1 shrink-0 ${getStatutStyle(ins.statut)}`}>
                                    {ins.statut?.replace(/_/g, ' ')}
                                </span>
                            </div>
                            {/* Row 2: Payment + Actions */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                {ins.fraisPaye ? (
                                    <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Payé
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase">
                                        <span className="w-2 h-2 rounded-full bg-rose-500" /> En attente
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Link href={`/dashboard/inscriptions/${ins.id}?print=true`} className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all text-sm">🖨️</Link>
                                    <Link href={`/dashboard/inscriptions/${ins.id}`} className="w-9 h-9 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all text-sm">✏️</Link>
                                    <button onClick={() => handleSupprimer(ins.id!)} className="w-9 h-9 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all text-sm">🗑️</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
