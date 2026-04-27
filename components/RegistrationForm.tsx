'use client';
import { useState, useEffect, useRef } from 'react';
import api from '../lib/api';
import { 
    Eleve, Inscription, Parent, Tuteur, Sexe, Qualite, TypeParent, Classe, StatutInscription, Role 
} from '../lib/types';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { getUser } from '../lib/auth';

export default function RegistrationForm({ initialData, isEdit = false }: { initialData?: any, isEdit?: boolean }) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [classes, setClasses] = useState<Classe[]>([]);
    const [chargement, setChargement] = useState(false);
    const [user] = useState(getUser());

    // Camera & Mobile state
    const [showCamera, setShowCamera] = useState(false);
    const [showQrCode, setShowQrCode] = useState(false);
    const [mobileUrl, setMobileUrl] = useState('');
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [formData, setFormData] = useState({
        eleve: {
            id: undefined, nom: '', prenoms: '', dateNaissance: '', lieuNaissance: '',
            numeroActeNaissance: '', dateActeNaissance: '', etabliA: '',
            matricule: '', sexe: Sexe.M, nationalite: 'IVOIRIENNE',
            adressePostale: '', telephone: '', photoUrl: '',
        },
        parents: [
            { id: undefined, type: TypeParent.PERE, nomComplet: '', profession: '', residence: '', contact: '' },
            { id: undefined, type: TypeParent.MERE, nomComplet: '', profession: '', residence: '', contact: '' },
        ],
        tuteur: { id: undefined, nomComplet: '', profession: '', domicile: '', contact: '' },
        inscription: {
            id: undefined, anneeScolaire: '2024-2025', qualite: Qualite.NON_BOURSIER,
            lv2: 'ALLEMAND', etablissementOrigine: '', classeOrigine: '', classeId: '',
            fraisPaye: false, ficheEnLigne: false, acteNaissanceFourni: false,
            ficheAffectation: false, bulletinTrimestre: false, statut: StatutInscription.EN_COURS
        }
    });

    useEffect(() => {
        if (initialData && initialData.eleve) {
            setFormData({
                eleve: {
                    id: initialData.eleve.id,
                    nom: initialData.eleve.nom || '',
                    prenoms: initialData.eleve.prenoms || '',
                    dateNaissance: initialData.eleve.dateNaissance || '',
                    lieuNaissance: initialData.eleve.lieuNaissance || '',
                    numeroActeNaissance: initialData.eleve.numeroActeNaissance || '',
                    dateActeNaissance: initialData.eleve.dateActeNaissance || '',
                    etabliA: initialData.eleve.etabliA || '',
                    matricule: initialData.eleve.matricule || '',
                    sexe: initialData.eleve.sexe || Sexe.M,
                    nationalite: initialData.eleve.nationalite || 'IVOIRIENNE',
                    adressePostale: initialData.eleve.adressePostale || '',
                    telephone: initialData.eleve.telephone || '',
                    photoUrl: initialData.eleve.photoUrl || '',
                },
                parents: (initialData.eleve.parents && initialData.eleve.parents.length > 0) ? initialData.eleve.parents : [
                    { type: TypeParent.PERE, nomComplet: '', profession: '', residence: '', contact: '' },
                    { type: TypeParent.MERE, nomComplet: '', profession: '', residence: '', contact: '' },
                ],
                tuteur: initialData.eleve.tuteur || { nomComplet: '', profession: '', domicile: '', contact: '' },
                inscription: { 
                    id: initialData.id,
                    anneeScolaire: initialData.anneeScolaire || '2024-2025',
                    qualite: initialData.qualite || Qualite.NON_BOURSIER,
                    lv2: initialData.lv2 || 'ALLEMAND',
                    etablissementOrigine: initialData.etablissementOrigine || '',
                    classeOrigine: initialData.classeOrigine || '',
                    classeId: initialData.classe?.id?.toString() || '',
                    fraisPaye: initialData.fraisPaye || false,
                    ficheEnLigne: initialData.ficheEnLigne || false,
                    acteNaissanceFourni: initialData.acteNaissanceFourni || false,
                    ficheAffectation: initialData.ficheAffectation || false,
                    bulletinTrimestre: initialData.bulletinTrimestre || false,
                    statut: initialData.statut || StatutInscription.EN_COURS
                }
            });
        }
    }, [initialData]);

    useEffect(() => {
        api.get('/classes').then(res => setClasses(res.data)).catch(() => {
            setClasses([{ id: 1, nom: '6ème 1', niveau: 'SIXIEME' } as any]);
        });
        return () => { cleanUpResources(); };
    }, []);

    const cleanUpResources = () => {
        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
        }
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
    };

    const goToStep = (newStep: number) => {
        cleanUpResources();
        setShowCamera(false);
        setShowQrCode(false);
        setStep(newStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleChangeEleve = (e: any) => {
        const { name, value, type } = e.target;
        const finalValue = (type !== 'date' && type !== 'file') ? value.toUpperCase() : value;
        setFormData(prev => ({ ...prev, eleve: { ...prev.eleve, [name]: finalValue } }));
    };

    const handleChangeParent = (index: number, field: string, value: string) => {
        const newParents = [...formData.parents];
        newParents[index] = { ...newParents[index], [field]: value.toUpperCase() };
        setFormData(prev => ({ ...prev, parents: newParents }));
    };

    const handleChangeTuteur = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, tuteur: { ...prev.tuteur, [field]: value.toUpperCase() } }));
    };

    const handleChangeInscription = (field: string, value: any) => {
        const finalValue = (typeof value === 'string' && field !== 'classeId') ? value.toUpperCase() : value;
        setFormData(prev => ({ ...prev, inscription: { ...prev.inscription, [field]: finalValue } }));
    };

    const handleFileUpload = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData(prev => ({ ...prev, eleve: { ...prev.eleve, photoUrl: reader.result as string } }));
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        setShowCamera(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch { setShowCamera(false); alert("Caméra indisponible"); }
    };

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            ctx?.drawImage(videoRef.current, 0, 0);
            setFormData(prev => ({ ...prev, eleve: { ...prev.eleve, photoUrl: canvasRef.current?.toDataURL('image/jpeg') || '' } }));
            stopCamera();
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
        setShowCamera(false);
    };

    const startMobilePhotoSession = () => {
        const sessionId = Math.random().toString(36).substring(2, 10);
        setMobileUrl(`${window.location.protocol}//${window.location.host}/mobile/camera/${sessionId}`);
        setShowQrCode(true);
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        
        pollingIntervalRef.current = setInterval(async () => {
            try {
                const res = await fetch(`/api/photo-session?sessionId=${sessionId}`);
                const data = await res.json();
                if (data.photoUrl) {
                    setFormData(prev => ({ ...prev, eleve: { ...prev.eleve, photoUrl: data.photoUrl } }));
                    setShowQrCode(false);
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                        pollingIntervalRef.current = null;
                    }
                }
            } catch {}
        }, 2000);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        // En mode édition, on autorise la soumission depuis n'importe quelle étape
        if (!isEdit && step !== 5) return;
        
        setChargement(true);
        try {
            const { id: insId, classeId, ...insData } = formData.inscription;
            
            if (!classeId) {
                alert("⚠️ La classe est obligatoire (Étape 4).");
                setStep(4);
                setChargement(false);
                return;
            }

            // NETTOYAGE DU PAYLOAD : Convertir les chaînes vides en null pour les dates
            const eleveClean = {
                ...formData.eleve,
                dateNaissance: formData.eleve.dateNaissance || null,
                dateActeNaissance: formData.eleve.dateActeNaissance || null
            };

            const payload = {
                ...eleveClean,
                parents: formData.parents,
                tuteur: formData.tuteur,
                inscriptions: [{ 
                    id: insId, 
                    ...insData, 
                    classe: { id: parseInt(classeId) } 
                }]
            };
            
            if (isEdit && formData.eleve.id) {
                await api.put(`/eleves/${formData.eleve.id}`, payload);
                alert("✅ Modifications enregistrées avec succès !");
                router.push(`/dashboard/inscriptions/${insId}`);
            } else {
                const res = await api.post('/eleves', payload);
                alert("✅ Inscription réussie !");
                router.push(`/dashboard/inscriptions/${res.data.inscriptions[0].id}`);
            }
        } catch (err: any) { 
            console.error("Erreur API:", err.response?.data);
            alert("❌ Erreur lors de l'enregistrement. Vérifiez que le matricule n'existe pas déjà et que les champs obligatoires sont remplis.");
        }
        finally { setChargement(false); }
    };

    return (
        <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 mb-10">
            {/* Header */}
            <div className="bg-[#f8fafc] p-6 md:p-10 text-slate-900 relative border-b border-slate-100">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-[100px]" />
                <div className="relative z-10">
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none">
                        {isEdit ? 'Modifier' : 'Nouvelle'} <span className="text-emerald-600 italic font-serif">Inscription</span>
                    </h2>
                </div>
                
                <div className="flex gap-3 mt-8 overflow-x-auto pb-2 scrollbar-hide relative z-10">
                    {[1, 2, 3, 4, 5].map(i => (
                        <button key={`tab-head-${i}`} type="button" onClick={() => goToStep(i)} className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shrink-0 ${step === i ? 'bg-emerald-600 text-white shadow-xl scale-105' : 'bg-white text-slate-400 border border-slate-200'}`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center ${step === i ? 'bg-white text-emerald-600' : 'bg-slate-100'}`}>{i}</span>
                            ÉTAPE {i}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-12 space-y-12 bg-[#fcfdfe]">
                {step === 1 && (
                    <div key="step-container-1" className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="lg:col-span-8 space-y-10">
                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                                <h3 className="text-xl font-black text-slate-800 uppercase flex items-center gap-4">
                                    <span className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-lg shadow-sm border border-emerald-100">👤</span>
                                    Identité de l'élève
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                    <FormInput label="NOM DE FAMILLE" name="nom" value={formData.eleve.nom} onChange={handleChangeEleve} placeholder="Ex: KOFFI" />
                                    <FormInput label="PRÉNOMS" name="prenoms" value={formData.eleve.prenoms} onChange={handleChangeEleve} placeholder="Ex: JEAN PHILIPPE" />
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Genre / Sexe</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button type="button" onClick={() => setFormData({...formData, eleve: {...formData.eleve, sexe: Sexe.M}})} className={`py-4 rounded-2xl font-bold text-xs transition-all border-2 ${formData.eleve.sexe === Sexe.M ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'}`}>MASCULIN</button>
                                            <button type="button" onClick={() => setFormData({...formData, eleve: {...formData.eleve, sexe: Sexe.F}})} className={`py-4 rounded-2xl font-bold text-xs transition-all border-2 ${formData.eleve.sexe === Sexe.F ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'}`}>FÉMININ</button>
                                        </div>
                                    </div>
                                    <FormInput label="NATIONALITÉ" name="nationalite" value={formData.eleve.nationalite} onChange={handleChangeEleve} />
                                    <FormInput label="MATRICULE (Si connu)" name="matricule" value={formData.eleve.matricule} onChange={handleChangeEleve} placeholder="Laissez vide si nouveau" />
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                                <h3 className="text-xl font-black text-slate-800 uppercase flex items-center gap-4">
                                    <span className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-lg shadow-sm border border-blue-100">📅</span>
                                    Naissance & Acte civil
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                    <FormInput label="DATE DE NAISSANCE" name="dateNaissance" type="date" value={formData.eleve.dateNaissance} onChange={handleChangeEleve} />
                                    <FormInput label="LIEU DE NAISSANCE" name="lieuNaissance" value={formData.eleve.lieuNaissance} onChange={handleChangeEleve} placeholder="Ex: ABIDJAN-COCODY" />
                                    <FormInput label="ACTE DE NAISSANCE N°" name="numeroActeNaissance" value={formData.eleve.numeroActeNaissance} onChange={handleChangeEleve} />
                                    <FormInput label="DÉLIVRÉ LE" name="dateActeNaissance" type="date" value={formData.eleve.dateActeNaissance} onChange={handleChangeEleve} />
                                    <FormInput label="FAIT À (S/P)" name="etabliA" value={formData.eleve.etabliA} onChange={handleChangeEleve} placeholder="Ex: MAIRIE DE COCODY" />
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                                <h3 className="text-xl font-black text-slate-800 uppercase flex items-center gap-4">
                                    <span className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-lg shadow-sm border border-amber-100">📞</span>
                                    Coordonnées
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                    <FormInput label="TÉLÉPHONE" name="telephone" value={formData.eleve.telephone} onChange={handleChangeEleve} placeholder="Ex: 01 02 03 04 05" />
                                    <FormInput label="ADRESSE POSTALE" name="adressePostale" value={formData.eleve.adressePostale} onChange={handleChangeEleve} />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="sticky top-8 space-y-8">
                                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Photo d'identité</h3>
                                    <div className="w-full aspect-[3/4] max-w-[240px] rounded-[32px] bg-slate-50 border-4 border-dashed border-slate-100 flex items-center justify-center relative overflow-hidden shadow-inner transition-all hover:border-emerald-200">
                                        {formData.eleve.photoUrl ? (
                                            <img src={formData.eleve.photoUrl} className="absolute inset-0 w-full h-full object-cover" alt="Elève" />
                                        ) : (
                                            <div className="text-center p-6"><span className="text-6xl mb-4 block text-slate-200">👤</span><p className="text-[10px] font-black text-slate-300 uppercase">Aucune photo</p></div>
                                        )}
                                        {showCamera && (
                                            <div className="absolute inset-0 z-20 bg-black">
                                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                                <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-3 px-4">
                                                    <button type="button" onClick={takePhoto} className="w-full bg-emerald-600 text-white py-3 rounded-xl shadow-2xl font-black text-xs uppercase">Capturer</button>
                                                    <button type="button" onClick={stopCamera} className="text-white text-[10px] uppercase font-black opacity-60 hover:opacity-100">Annuler</button>
                                                </div>
                                            </div>
                                        )}
                                        {showQrCode && (
                                            <div className="absolute inset-0 z-20 bg-white/95 flex flex-col items-center justify-center p-4 text-center animate-in zoom-in-95">
                                                <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-100 mb-4"><QRCodeSVG value={mobileUrl} size={140} /></div>
                                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest animate-pulse leading-tight">Scannez pour<br/>capturer</p>
                                                <button type="button" onClick={() => setShowQrCode(false)} className="text-rose-500 mt-4 text-[9px] font-black uppercase hover:underline tracking-widest">Annuler</button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 w-full gap-3 mt-8">
                                        <button type="button" onClick={startMobilePhotoSession} className="w-full py-4 bg-blue-50 text-blue-600 rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all">📱 Smartphone</button>
                                        <button type="button" onClick={startCamera} className="w-full py-4 bg-slate-900 text-white rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all">💻 Webcam</button>
                                        <label className="w-full py-4 bg-white border border-slate-200 rounded-[20px] font-black text-[10px] uppercase text-center cursor-pointer hover:bg-slate-50 transition-all">📁 Fichier<input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} /></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div key="step-container-2" className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right duration-500">
                        {formData.parents.map((p, i) => (
                            <div key={`parent-box-${i}`} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
                                <h3 className="text-xl font-black text-slate-800 uppercase flex items-center gap-4">
                                    <span className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl border border-amber-100 shadow-sm">{p.type === TypeParent.PERE ? '👨' : '👩'}</span>
                                    {p.type}
                                </h3>
                                <div className="space-y-6 flex-grow">
                                    <FormInput label="NOM COMPLET" value={p.nomComplet} onChange={(e: any) => handleChangeParent(i, 'nomComplet', e.target.value)} placeholder="NOM ET PRÉNOMS" />
                                    <FormInput label="PROFESSION" value={p.profession} onChange={(e: any) => handleChangeParent(i, 'profession', e.target.value)} />
                                    <FormInput label="CONTACT / TÉLÉPHONE" value={p.contact} onChange={(e: any) => handleChangeParent(i, 'contact', e.target.value)} />
                                    <FormInput label="RÉSIDENCE" value={p.residence} onChange={(e: any) => handleChangeParent(i, 'residence', e.target.value)} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {step === 3 && (
                    <div key="step-container-3" className="max-w-3xl mx-auto animate-in slide-in-from-right duration-500">
                        <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                            <h3 className="text-xl font-black text-slate-800 uppercase flex items-center gap-4">
                                <span className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl border border-blue-100 shadow-sm">🏠</span>
                                Tuteur Légal
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2">
                                    <FormInput label="NOM COMPLET" value={formData.tuteur.nomComplet} onChange={(e: any) => handleChangeTuteur('nomComplet', e.target.value)} placeholder="NOM ET PRÉNOMS" />
                                </div>
                                <FormInput label="PROFESSION" value={formData.tuteur.profession} onChange={(e: any) => handleChangeTuteur('profession', e.target.value)} />
                                <FormInput label="CONTACT" value={formData.tuteur.contact} onChange={(e: any) => handleChangeTuteur('contact', e.target.value)} />
                                <div className="md:col-span-2">
                                    <FormInput label="DOMICILE" value={formData.tuteur.domicile} onChange={(e: any) => handleChangeTuteur('domicile', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div key="step-container-4" className="max-w-4xl mx-auto animate-in slide-in-from-right duration-500">
                        <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-10">
                            <h3 className="text-xl font-black text-slate-800 uppercase flex items-center gap-4">
                                <span className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl border border-emerald-100 shadow-sm">📄</span>
                                Données Scolaires
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">CLASSE DEMANDÉE</label>
                                    <select value={formData.inscription.classeId} onChange={(e) => handleChangeInscription('classeId', e.target.value)} className="form-input-premium">
                                        <option value="">-- SÉLECTIONNER --</option>
                                        {classes.map(c => <option key={`opt-c-${c.id}`} value={c.id}>{c.nom}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">QUALITÉ</label>
                                    <select value={formData.inscription.qualite} onChange={(e) => handleChangeInscription('qualite', e.target.value as Qualite)} className="form-input-premium">
                                        <option value={Qualite.NON_BOURSIER}>NON BOURSIER (NB)</option>
                                        <option value={Qualite.DEMI_BOURSE}>DEMI-BOURSE (1/2 B)</option>
                                        <option value={Qualite.BE}>BOURSE ENTIÈRE (BE)</option>
                                    </select>
                                </div>
                                <FormInput label="LV2" value={formData.inscription.lv2} onChange={(e: any) => handleChangeInscription('lv2', e.target.value)} />
                                <FormInput label="ÉTABLISSEMENT D'ORIGINE" value={formData.inscription.etablissementOrigine} onChange={(e: any) => handleChangeInscription('etablissementOrigine', e.target.value)} />
                                <div className="md:col-span-2">
                                    <FormInput label="CLASSE D'ORIGINE" value={formData.inscription.classeOrigine} onChange={(e: any) => handleChangeInscription('classeOrigine', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div key="step-container-5" className="max-w-4xl mx-auto animate-in slide-in-from-right duration-500 space-y-8">
                        <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-10">
                            <h3 className="text-xl font-black text-slate-800 uppercase flex items-center gap-4">
                                <span className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl border border-amber-100 shadow-sm">💰</span>
                                Paiement & Statut
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">FRAIS D'INSCRIPTION</label>
                                    <button type="button" onClick={() => handleChangeInscription('fraisPaye', !formData.inscription.fraisPaye)} className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${formData.inscription.fraisPaye ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                        <span className="font-bold">Frais de scolarité</span>
                                        <div className={`w-12 h-6 rounded-full relative ${formData.inscription.fraisPaye ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.inscription.fraisPaye ? 'right-1' : 'left-1'}`} />
                                        </div>
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">STATUT DU DOSSIER</label>
                                    <select value={formData.inscription.statut} onChange={(e) => handleChangeInscription('statut', e.target.value as StatutInscription)} className="form-input-premium">
                                        <option value={StatutInscription.EN_COURS}>EN COURS</option>
                                        <option value={StatutInscription.VALIDEE_INTENDANT}>VALIDÉE PAR INTENDANT</option>
                                        <option value={StatutInscription.VALIDEE_EDUCATEUR}>VALIDÉE PAR ÉDUCATEUR</option>
                                        <option value={StatutInscription.FINALISEE}>FINALISÉE</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-10">
                            <h3 className="text-xl font-black text-slate-800 uppercase flex items-center gap-4">
                                <span className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl border border-blue-100 shadow-sm">📄</span>
                                Pièces du Dossier
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DocToggle label="Fiche en ligne" active={formData.inscription.ficheEnLigne} onClick={() => handleChangeInscription('ficheEnLigne', !formData.inscription.ficheEnLigne)} />
                                <DocToggle label="Acte de Naissance" active={formData.inscription.acteNaissanceFourni} onClick={() => handleChangeInscription('acteNaissanceFourni', !formData.inscription.acteNaissanceFourni)} />
                                <DocToggle label="Fiche Affectation" active={formData.inscription.ficheAffectation} onClick={() => handleChangeInscription('ficheAffectation', !formData.inscription.ficheAffectation)} />
                                <DocToggle label="Bulletins" active={formData.inscription.bulletinTrimestre} onClick={() => handleChangeInscription('bulletinTrimestre', !formData.inscription.bulletinTrimestre)} />
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-100 pt-16">
                    <div className="flex gap-4 w-full md:w-auto">
                        {step > 1 && (
                            <button key="btn-prev" type="button" onClick={() => goToStep(step - 1)} className="px-10 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all active:scale-95">
                                ← Retour
                            </button>
                        )}
                        {isEdit && (
                            <button 
                                key="btn-quick-save" 
                                type="button" 
                                onClick={(e) => { setStep(5); setTimeout(() => handleSubmit(e as any), 100); }} 
                                className="px-8 py-4 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 flex items-center gap-2"
                            >
                                💾 Sauvegarder & Quitter
                            </button>
                        )}
                    </div>
                    
                    {step < 5 ? (
                        <button key="btn-next" type="button" onClick={() => goToStep(step + 1)} className="w-full md:w-auto px-12 py-4 bg-[#064e3b] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-100 hover:scale-[1.02] active:scale-95 transition-all">
                            Continuer vers l'étape {step + 1} →
                        </button>
                    ) : (
                        <button key="btn-submit" type="submit" disabled={chargement} className="w-full md:w-auto px-16 py-5 bg-gradient-to-r from-[#0d9488] to-[#10b981] text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-teal-100 hover:scale-[1.02] active:scale-95 transition-all border-b-4 border-[#0f766e]">
                            {chargement ? 'Enregistrement...' : isEdit ? '💾 Confirmer les modifications' : '🚀 Finaliser l\'inscription'}
                        </button>
                    )}
                </div>
            </form>

            <style jsx>{`
                .form-input-premium {
                    width: 100%;
                    background: #f8fafc;
                    border: 2px solid #f8fafc;
                    border-radius: 1rem;
                    padding: 1rem 1.5rem;
                    outline: none;
                    font-weight: 700;
                    color: #334155;
                    transition: all 0.3s ease;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    text-transform: uppercase;
                }
                .form-input-premium:focus {
                    border-color: #10b981;
                    background: #ffffff;
                }
                .form-input-premium::placeholder {
                    color: #cbd5e1;
                    text-transform: none;
                }
            `}</style>
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}

function FormInput({ label, onChange, value, ...props }: any) {
    const handleValueChange = (e: any) => {
        let val = e.target.value;
        
        // Restriction : Uniquement des lettres pour les noms, prénoms, lieux, etc.
        if (props.name === 'nom' || props.name === 'prenoms' || props.name === 'lieuNaissance' || props.name === 'etabliA' || props.name === 'nationalite') {
            val = val.replace(/[0-9]/g, ''); 
        }
        
        // Restriction : Uniquement des chiffres pour le téléphone
        if (props.name === 'telephone' || label.includes('CONTACT') || label.includes('TÉLÉPHONE')) {
            val = val.replace(/[^0-9]/g, '');
        }

        if (e.target.type !== 'date' && e.target.type !== 'file') {
            e.target.value = val.toUpperCase();
        } else {
            e.target.value = val;
        }
        
        if (onChange) onChange(e);
    };

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 leading-none">
                {label}
            </label>
            <input 
                {...props} 
                value={value ?? ''}
                onChange={handleValueChange}
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm uppercase"
            />
        </div>
    );
}

function DocToggle({ label, active, onClick }: any) {
    return (
        <button type="button" onClick={onClick} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${active ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            <div className={`w-10 h-5 rounded-full relative ${active ? 'bg-blue-500' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'right-1' : 'left-1'}`} />
            </div>
        </button>
    );
}
