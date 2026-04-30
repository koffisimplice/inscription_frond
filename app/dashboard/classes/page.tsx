'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { Classe, Niveau } from '../../../lib/types';

const NIVEAU_LABELS: Record<Niveau, string> = {
    [Niveau.SIXIEME]: '6ème',
    [Niveau.CINQUIEME]: '5ème',
    [Niveau.QUATRIEME]: '4ème',
    [Niveau.TROISIEME]: '3ème',
    [Niveau.SECONDE]: '2nde',
    [Niveau.PREMIERE]: '1ère',
    [Niveau.TERMINALE]: 'Terminale',
};

export default function ClassesPage() {
    const [classes, setClasses] = useState<Classe[]>([]);
    const [chargement, setChargement] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newClasse, setNewClasse] = useState({
        nom: '', niveau: Niveau.SIXIEME, anneeScolaire: '2024-2025', capaciteMax: 50
    });

    const fetchClasses = async () => {
        try {
            const res = await api.get('/classes');
            setClasses(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => { fetchClasses(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/classes', newClasse);
            setShowModal(false);
            setNewClasse({ nom: '', niveau: Niveau.SIXIEME, anneeScolaire: '2024-2025', capaciteMax: 50 });
            fetchClasses();
        } catch (err) {
            alert("Erreur lors de la création");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">Architecture Scolaire</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Gestion des divisions et effectifs</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-8 py-4 rounded-[22px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-200 hover:scale-105 active:scale-95 transition-all"
                >
                    + Nouvelle Classe
                </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {chargement ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin shadow-lg shadow-emerald-200" />
                        <p className="text-slate-300 font-black uppercase text-[10px] tracking-[0.4em]">Synchronisation...</p>
                    </div>
                ) : classes.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium italic text-sm">Aucune classe créée pour le moment.</p>
                    </div>
                ) : (
                    classes.map((classe) => (
                        <div key={classe.id} className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-50 shadow-xl shadow-slate-200/30 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500 group overflow-hidden relative border-b-4 border-transparent hover:border-amber-400">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/5 to-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-amber-500/10 transition-colors duration-700" />
                            <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">{classe.nom}</h3>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-1">{classe.anneeScolaire}</p>
                                </div>
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 rounded-[20px] flex items-center justify-center text-xl md:text-2xl shadow-inner group-hover:bg-gradient-to-br group-hover:from-amber-400 group-hover:to-orange-500 group-hover:text-white transition-all duration-500 border border-slate-100 group-hover:border-transparent">🏫</div>
                            </div>

                            <div className="space-y-5 relative z-10">
                                <div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                                        <span className="text-slate-400">Effectif Actuel</span>
                                        <span className="text-amber-600">0 / {classe.capaciteMax}</span>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50">
                                        <div className="h-full w-[2%] bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-4 border-t border-slate-50">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Niveau</span>
                                    <span className="text-[11px] font-black text-slate-800 uppercase bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                        {NIVEAU_LABELS[classe.niveau] || classe.niveau}
                                    </span>
                                </div>
                            </div>

                            <button className="w-full mt-5 md:mt-6 py-3 md:py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] hover:bg-[#020617] hover:text-white transition-all duration-500 active:scale-95 shadow-sm border border-slate-100 hover:border-transparent">
                                Explorer la liste →
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Nouvelle Classe */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-[#020617]/70 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => !saving && setShowModal(false)}
                    />
                    <div className="relative z-10 w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-amber-400" />
                        <div className="p-8 md:p-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl border border-emerald-100">🏫</div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Nouvelle Classe</h2>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Créer une division</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors font-black text-sm"
                                >✕</button>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nom de la classe</label>
                                    <input
                                        required
                                        placeholder="Ex: 2NDE A"
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm uppercase"
                                        value={newClasse.nom}
                                        onChange={(e) => setNewClasse({ ...newClasse, nom: e.target.value.toUpperCase() })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Niveau</label>
                                        <select
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 shadow-sm"
                                            value={newClasse.niveau}
                                            onChange={(e) => setNewClasse({ ...newClasse, niveau: e.target.value as Niveau })}
                                        >
                                            {Object.entries(NIVEAU_LABELS).map(([key, label]) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Effectif Max</label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 shadow-sm"
                                            value={newClasse.capaciteMax}
                                            onChange={(e) => setNewClasse({ ...newClasse, capaciteMax: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Création...</span>
                                            </>
                                        ) : '✓ Créer la classe'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
