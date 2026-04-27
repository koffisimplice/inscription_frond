'use client';
import { useEffect, useState, use } from 'react';
import api from '../../../../lib/api';
import { getUser } from '../../../../lib/auth';
import { Inscription, Role, StatutInscription, Qualite } from '../../../../lib/types';
import Link from 'next/link';
import FicheInscription from '../../../../components/FicheInscription';
import { useSearchParams, useRouter } from 'next/navigation';

export default function InscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const router = useRouter();
    const isPrintModeRequested = searchParams.get('print') === 'true';

    const [inscription, setInscription] = useState<Inscription | null>(null);
    const [editData, setEditData] = useState<Partial<Inscription>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [user] = useState(getUser());
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [modeImpression, setModeImpression] = useState(false);

    const fetchDetail = async () => {
        try {
            const res = await api.get(`/inscriptions/${id}`);
            setInscription(res.data);
            setEditData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDetail(); }, [id]);

    const handlePrint = () => {
        setModeImpression(true);
        setTimeout(() => {
            window.print();
            setModeImpression(false);
        }, 500);
    };

    const handleSave = async () => {
        if (!inscription) return;
        setActionLoading(true);
        try {
            const res = await api.put(`/inscriptions/${id}`, { ...inscription, ...editData });
            setInscription(res.data);
            setIsEditing(false);
        } catch (err) {
            alert("Erreur lors de la sauvegarde");
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggle = async (field: keyof Inscription) => {
        if (!inscription) return;
        setActionLoading(true);
        try {
            const updated = { ...inscription, [field]: !inscription[field] };
            
            if (user?.role === Role.INTENDANT && field === 'fraisPaye') {
                updated.statut = updated.fraisPaye ? StatutInscription.VALIDEE_INTENDANT : StatutInscription.EN_COURS;
            }
            
            await api.put(`/inscriptions/${id}`, updated);
            setInscription(updated);
            setEditData(updated);
        } catch (err) {
            alert("Erreur lors de la mise à jour");
        } finally {
            setActionLoading(false);
        }
    };

    const handleFinaliser = async () => {
        if (!inscription) return;
        if (!inscription.fraisPaye) {
            alert("⚠️ Les frais d'inscription doivent être payés avant de finaliser.");
            return;
        }
        setActionLoading(true);
        try {
            const updated = { ...inscription, statut: StatutInscription.FINALISEE };
            await api.put(`/inscriptions/${id}`, updated);
            setInscription(updated);
            alert("🎉 Dossier finalisé avec succès !");
        } catch (err) {
            alert("Erreur lors de la finalisation");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Analyse du dossier...</p>
        </div>
    );

    if (!inscription) return <div className="p-8 text-center text-rose-500 font-bold uppercase tracking-widest bg-rose-50 rounded-3xl border border-rose-100">⚠️ Dossier Introuvable</div>;

    if (modeImpression) return <FicheInscription inscription={inscription} />;

    const isIntendant = user?.role === Role.INTENDANT || user?.role === Role.ADMIN;
    const isEducateur = user?.role === Role.EDUCATEUR || user?.role === Role.ADMIN;

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-700">
            
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-6 w-full md:w-auto">
                    <Link href="/dashboard/inscriptions" className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90 text-xl font-bold">←</Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2">
                            Dossier #00{inscription.id}
                        </h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Année Scolaire {inscription.anneeScolaire}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link 
                        href={`/dashboard/inscriptions/${inscription.id}/edit`}
                        className="flex-1 md:flex-none px-8 py-3.5 bg-blue-50 text-blue-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 text-center"
                    >
                        ✏️ Modifier le dossier
                    </Link>
                    <button onClick={handlePrint} className="flex-1 md:flex-none px-8 py-3.5 bg-slate-100 text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-slate-200 hover:bg-slate-200 transition-all shadow-sm active:scale-95">🖨️ Imprimer</button>
                    <div className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border ${inscription.statut === StatutInscription.FINALISEE ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                        {inscription.statut?.replace(/_/g, ' ')}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative group transition-all hover:shadow-2xl">
                        <div className="pt-12 pb-10 px-10">
                            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                                <div className="p-2 bg-white rounded-3xl shadow-xl border border-slate-50 transition-transform group-hover:scale-105 duration-500 shrink-0">
                                    <div className="w-32 h-40 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100">
                                        {inscription.eleve?.photoUrl ? (
                                            <img src={inscription.eleve.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                                        ) : <span className="text-5xl grayscale opacity-20">👤</span>}
                                    </div>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-1">{inscription.eleve?.nom}</h2>
                                            <p className="text-xl font-bold text-emerald-600/70 uppercase">{inscription.eleve?.prenoms}</p>
                                        </div>
                                        <span className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Mat: {inscription.eleve?.matricule || 'N/A'}</span>
                                    </div>

                                    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-slate-50 pt-8">
                                        <InfoItem label="Né(e) le" value={inscription.eleve?.dateNaissance ? new Date(inscription.eleve.dateNaissance).toLocaleDateString() : 'N/A'} />
                                        <InfoItem label="Lieu" value={inscription.eleve?.lieuNaissance} />
                                        <InfoItem label="Sexe" value={inscription.eleve?.sexe} />
                                        <InfoItem label="Classe" value={inscription.classe?.nom} />
                                        <InfoItem label="Qualité" value={inscription.qualite?.replace(/_/g, ' ')} />
                                        <InfoItem label="LV2" value={inscription.lv2} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 transition-all hover:shadow-2xl">
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-10 flex items-center gap-4">
                            <span className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-lg shadow-sm border border-emerald-100">🏠</span>
                            Contacts & Famille
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            <ContactItem icon="📞" label="Téléphone Élève" value={inscription.eleve?.telephone || 'Non renseigné'} />
                            <ContactItem icon="📍" label="Adresse Postale" value={inscription.eleve?.adressePostale || 'N/A'} />
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 transition-all hover:shadow-2xl">
                        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-8">Contrôle Intendance</h3>
                        <button
                            onClick={() => handleToggle('fraisPaye')}
                            disabled={!isIntendant || actionLoading}
                            className={`w-full group flex flex-col p-6 rounded-[32px] border-2 transition-all active:scale-95 ${
                                inscription.fraisPaye 
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                                    : 'bg-[#fcfdfe] border-slate-100 text-slate-400 grayscale hover:grayscale-0 hover:border-emerald-200'
                            }`}
                        >
                            <div className="flex justify-between items-center w-full mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-colors ${inscription.fraisPaye ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300 group-hover:bg-emerald-100 group-hover:text-emerald-500'}`}>💰</div>
                                <div className={`w-12 h-6 rounded-full relative transition-all duration-500 ${inscription.fraisPaye ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-500 ${inscription.fraisPaye ? 'right-1' : 'left-1'}`} />
                                </div>
                            </div>
                            <span className="font-black uppercase text-[10px] tracking-widest text-left">Frais d'inscription</span>
                            <p className="text-[9px] font-bold opacity-60 text-left mt-1">Validation des frais de scolarité</p>
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 transition-all hover:shadow-2xl">
                        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-8">Contrôle Éducateur</h3>
                        <div className="space-y-3">
                            <DocSwitch label="Fiche en ligne" active={inscription.ficheEnLigne} onClick={() => handleToggle('ficheEnLigne')} disabled={!isEducateur || actionLoading} />
                            <DocSwitch label="Acte de Naissance" active={inscription.acteNaissanceFourni} onClick={() => handleToggle('acteNaissanceFourni')} disabled={!isEducateur || actionLoading} />
                            <DocSwitch label="Fiche affectation" active={inscription.ficheAffectation} onClick={() => handleToggle('ficheAffectation')} disabled={!isEducateur || actionLoading} />
                            <DocSwitch label="Bulletin Trimestre" active={inscription.bulletinTrimestre} onClick={() => handleToggle('bulletinTrimestre')} disabled={!isEducateur || actionLoading} />
                        </div>
                        
                        {isEducateur && inscription.fraisPaye && inscription.statut !== StatutInscription.FINALISEE && (
                            <button 
                                onClick={handleFinaliser}
                                disabled={actionLoading}
                                className="w-full mt-10 bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 border-b-4 border-emerald-900 disabled:opacity-50"
                            >
                                {actionLoading ? 'Finalisation...' : '🔥 Finaliser le dossier'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value }: any) {
    return (
        <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{value || '---'}</p>
        </div>
    );
}

function ContactItem({ icon, label, value }: any) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl shadow-sm border border-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">{icon}</div>
            <div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{value}</p>
            </div>
        </div>
    );
}

function DocSwitch({ label, active, onClick, disabled }: any) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full flex items-center justify-between p-4 rounded-[20px] border transition-all active:scale-98 group ${
                active ? 'bg-blue-50 border-blue-100 text-blue-900' : 'bg-[#fcfdfe] border-slate-50 text-slate-300 hover:border-slate-200'
            }`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-300'}`}>✓</div>
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <div className={`w-8 h-4 rounded-full relative transition-all duration-500 ${active ? 'bg-blue-600 shadow-md shadow-blue-200' : 'bg-slate-200'}`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-500 ${active ? 'right-0.5' : 'left-0.5'}`} />
            </div>
        </button>
    );
}
