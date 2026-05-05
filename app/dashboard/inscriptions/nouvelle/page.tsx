'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '../../../../lib/api';
import RegistrationForm from '../../../../components/RegistrationForm';

export default function NouvelleInscriptionPage() {
    const searchParams = useSearchParams();
    const editEleveId = searchParams.get('editEleveId');
    const [initialData, setInitialData] = useState<any>(null);
    const [loading, setLoading] = useState(!!editEleveId);

    useEffect(() => {
        if (editEleveId) {
            api.get(`/eleves/${editEleveId}`)
                .then(res => {
                    // On simule une structure d'inscription si on n'en a pas
                    const eleveData = res.data;
                    const lastInscription = eleveData.inscriptions && eleveData.inscriptions.length > 0 
                        ? eleveData.inscriptions[0] 
                        : { id: null, statut: 'EN_COURS' };

                    setInitialData({
                        ...lastInscription,
                        eleve: eleveData
                    });
                })
                .catch(err => console.error("Erreur chargement élève:", err))
                .finally(() => setLoading(false));
        }
    }, [editEleveId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <RegistrationForm initialData={initialData} isEdit={!!editEleveId} />
        </div>
    );
}
