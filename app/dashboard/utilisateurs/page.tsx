'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { Utilisateur, Role } from '../../../lib/types';

const ROLE_LABELS: Record<Role, string> = {
    [Role.ADMIN]: 'Administrateur',
    [Role.INTENDANT]: 'Intendant',
    [Role.EDUCATEUR]: 'Éducateur',
};

const ROLE_COLORS: Record<Role, string> = {
    [Role.ADMIN]: 'text-amber-600',
    [Role.INTENDANT]: 'text-teal-600',
    [Role.EDUCATEUR]: 'text-emerald-600',
};

export default function UtilisateursPage() {
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
    const [chargement, setChargement] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [erreur, setErreur] = useState('');
    const [succes, setSucces] = useState('');

    const [form, setForm] = useState({
        nom: '',
        prenoms: '',
        email: '',
        motDePasse: '',
        role: Role.EDUCATEUR,
    });

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

    useEffect(() => {
        fetchUsers();
    }, []);

    const openModal = () => {
        setForm({ nom: '', prenoms: '', email: '', motDePasse: '', role: Role.EDUCATEUR });
        setErreur('');
        setSucces('');
        setShowModal(true);
    };

    const closeModal = () => {
        if (saving) return;
        setShowModal(false);
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        const upper = (name !== 'email' && name !== 'motDePasse' && name !== 'role')
            ? value.toUpperCase()
            : value;
        setForm(prev => ({ ...prev, [name]: upper }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErreur('');
        setSaving(true);
        try {
            await api.post('/utilisateurs', form);
            setSucces('Collaborateur créé avec succès !');
            await fetchUsers();
            setTimeout(() => {
                setShowModal(false);
                setSucces('');
            }, 1200);
        } catch (err: any) {
            setErreur(err.response?.data?.message || 'Erreur lors de la création.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Équipe Administrative</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Gestion des accès et privilèges</p>
                </div>
                <button
                    onClick={openModal}
                    className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-8 py-4 rounded-[22px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-200 hover:scale-105 active:scale-95 transition-all"
                >
                    + Nouveau Collaborateur
                </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {chargement ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin shadow-lg shadow-emerald-200" />
                        <p className="text-slate-300 font-black uppercase text-[10px] tracking-[0.4em]">Accès au registre...</p>
                    </div>
                ) : utilisateurs.length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-4">
                        <span className="text-6xl">👤</span>
                        <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">Aucun collaborateur trouvé</p>
                    </div>
                ) : (
                    utilisateurs.map((u) => (
                        <div key={u.id} className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-xl shadow-slate-200/40 group hover:-translate-y-2 transition-all duration-500 overflow-hidden relative border-b-4 border-transparent hover:border-emerald-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/10 transition-colors duration-700" />

                            <div className="flex items-center gap-6 mb-8 relative z-10">
                                <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:rotate-6 transition-transform duration-500 uppercase">
                                    {u.nom[0]}{u.prenoms[0]}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none mb-2">{u.nom}</h3>
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${ROLE_COLORS[u.role]}`}>
                                        {ROLE_LABELS[u.role] || u.role}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-colors group-hover:bg-white group-hover:border-emerald-100">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 leading-none">Identifiant Email</p>
                                    <p className="text-xs font-bold text-slate-600 truncate">{u.email}</p>
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full ${u.actif ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{u.actif ? 'Compte Actif' : 'Désactivé'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Nouveau Collaborateur */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-[#020617]/70 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={closeModal}
                    />

                    {/* Modal Card */}
                    <div className="relative z-10 w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Accent bar */}
                        <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />

                        <div className="p-10">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl border border-emerald-100">👤</div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Nouveau Collaborateur</h2>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Créer un compte d'accès</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors font-black text-sm"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <ModalInput label="NOM" name="nom" value={form.nom} onChange={handleChange} placeholder="Ex: KOFFI" required />
                                    <ModalInput label="PRÉNOMS" name="prenoms" value={form.prenoms} onChange={handleChange} placeholder="Ex: JEAN" required />
                                </div>
                                <ModalInput label="ADRESSE EMAIL" name="email" type="email" value={form.email} onChange={handleChange} placeholder="prenom.nom@ecole.ci" required />
                                <ModalInput label="MOT DE PASSE" name="motDePasse" type="password" value={form.motDePasse} onChange={handleChange} placeholder="••••••••" required />

                                {/* Role Selector */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Rôle / Fonction</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {Object.values(Role).map(role => (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => setForm(prev => ({ ...prev, role }))}
                                                className={`py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider transition-all border-2 ${
                                                    form.role === role
                                                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                                                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                                                }`}
                                            >
                                                {ROLE_LABELS[role]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Error / Success */}
                                {erreur && (
                                    <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-wider text-center p-3 rounded-2xl">
                                        {erreur}
                                    </div>
                                )}
                                {succes && (
                                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider text-center p-3 rounded-2xl">
                                        ✅ {succes}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
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
                                        ) : '✓ Créer le compte'}
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

function ModalInput({ label, ...props }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 leading-none">{label}</label>
            <input
                {...props}
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
            />
        </div>
    );
}
