'use client';
import { useEffect, useState, use } from 'react';
import api from '../../../../../lib/api';
import RegistrationForm from '../../../../../components/RegistrationForm';
import { Inscription } from '../../../../../lib/types';
import Link from 'next/link';

export default function EditInscriptionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [inscription, setInscription] = useState<Inscription | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await api.get(`/inscriptions/${id}`);
                setInscription(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Chargement du dossier...</p>
        </div>
    );

    if (!inscription) return <div className="p-8 text-center text-rose-500 font-bold uppercase tracking-widest bg-rose-50 rounded-3xl border border-rose-100">⚠️ Dossier Introuvable</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center gap-6">
                <Link href={`/dashboard/inscriptions/${id}`} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90 text-xl font-bold">←</Link>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
                        Modification du Dossier
                    </h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Élève: {inscription.eleve?.nom || ''} {inscription.eleve?.prenoms || ''}</p>
                </div>
            </div>

            <RegistrationForm initialData={inscription} isEdit={true} />
        </div>
    );
}
