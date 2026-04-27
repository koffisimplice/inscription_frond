'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { Classe, Niveau } from '../../../lib/types';

export default function ClassesPage() {
    const [classes, setClasses] = useState<Classe[]>([]);
    const [chargement, setChargement] = useState(true);
    const [showForm, setShowForm] = useState(false);
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
        try {
            await api.post('/classes', newClasse);
            setShowForm(false);
            setNewClasse({ nom: '', niveau: Niveau.SIXIEME, anneeScolaire: '2024-2025', capaciteMax: 50 });
            fetchClasses();
        } catch (err) {
            alert("Erreur lors de la création");
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase text-shadow">Architecture Scolaire</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Gestion des divisions et effectifs</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-[22px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-purple-200 hover:scale-105 active:scale-95 transition-all"
                >
                    {showForm ? '✖️ Annuler' : '+ Nouvelle Classe'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-10 rounded-[48px] border-2 border-purple-100 shadow-2xl animate-in slide-in-from-top-8 duration-500">
                    <h2 className="text-xl font-black text-slate-900 uppercase mb-8 flex items-center gap-4">
                        <span className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-lg shadow-sm">🏫</span>
                        Définir une nouvelle division
                    </h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Nom de la classe</label>
                            <input required className="form-input-premium" placeholder="EX: 2NDE A" value={newClasse.nom} onChange={(e) => setNewClasse({...newClasse, nom: e.target.value.toUpperCase()})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Niveau</label>
                            <select className="form-input-premium" value={newClasse.niveau} onChange={(e) => setNewClasse({...newClasse, niveau: e.target.value as Niveau})}>
                                {Object.values(Niveau).map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Effectif Max</label>
                            <input type="number" className="form-input-premium" value={newClasse.capaciteMax} onChange={(e) => setNewClasse({...newClasse, capaciteMax: parseInt(e.target.value)})} />
                        </div>
                        <button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:shadow-emerald-200 transition-all active:scale-95 border-b-4 border-emerald-900">Enregistrer</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {chargement ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin shadow-lg shadow-amber-200" />
                        <p className="text-slate-300 font-black uppercase text-[10px] tracking-[0.4em]">Synchronisation du réseau...</p>
                    </div>
                ) : (
                    classes.map((classe) => (
                        <div key={classe.id} className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-xl shadow-slate-200/30 hover:-translate-y-2 transition-all duration-500 group overflow-hidden relative border-b-4 border-transparent hover:border-amber-400">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/5 to-purple-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-amber-500/10 transition-colors duration-700" />
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{classe.nom}</h3>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-1">{classe.anneeScolaire}</p>
                                </div>
                                <div className="w-14 h-14 bg-slate-50 rounded-[20px] flex items-center justify-center text-2xl shadow-inner group-hover:bg-gradient-to-br group-hover:from-amber-400 group-hover:to-orange-500 group-hover:text-white transition-all duration-500 border border-slate-100 group-hover:border-transparent">🏫</div>
                            </div>
                            
                            <div className="space-y-6 relative z-10">
                                <div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                                        <span className="text-slate-400">Effectif Actuel</span>
                                        <span className="text-purple-600">0 / {classe.capaciteMax}</span>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50">
                                        <div className="h-full w-[2%] bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-4 border-t border-slate-50">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Niveau Académique</span>
                                    <span className="text-[11px] font-black text-slate-800 uppercase bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{classe.niveau}</span>
                                </div>
                            </div>
                            
                            <button className="w-full mt-6 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] hover:bg-[#020617] hover:text-white transition-all duration-500 active:scale-95 shadow-sm border border-slate-100 hover:border-transparent">
                                Explorer la liste →
                            </button>
                        </div>
                    ))
                )}
            </div>

            <style jsx>{`
                .form-input-premium {
                    width: 100%;
                    background: #fcfdfe;
                    border: 2px solid #f1f5f9;
                    border-radius: 1.5rem;
                    padding: 1.1rem 1.75rem;
                    font-size: 0.95rem;
                    font-weight: 800;
                    color: #0f172a;
                    outline: none;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .form-input-premium:focus {
                    border-color: #f59e0b;
                    background: #ffffff;
                    box-shadow: 0 20px 40px -10px rgba(245, 158, 11, 0.2);
                    transform: translateY(-3px);
                }
            `}</style>
        </div>
    );
}
