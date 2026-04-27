'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { setToken, setUser } from '../../lib/auth';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', motDePasse: '' });
    const [erreur, setErreur] = useState('');
    const [chargement, setChargement] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setChargement(true);
        setErreur('');
        try {
            const response = await api.post('/auth/login', form);
            setToken(response.data.token);
            setUser(response.data.user);
            router.push('/dashboard');
        } catch (err) {
            setErreur('IDENTIFIANTS INVALIDES');
        } finally {
            setChargement(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans selection:bg-emerald-100">
            {/* Background Decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-emerald-500/10 blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-amber-500/10 blur-[120px]" />
            </div>

            <div className="w-full max-w-[480px] bg-white rounded-[48px] shadow-2xl shadow-emerald-900/10 p-10 md:p-14 relative z-10 border border-white overflow-hidden group">
                
                {/* Visual Accent Bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-amber-400" />
                
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-4xl mb-6 mx-auto shadow-inner transition-transform group-hover:rotate-12 duration-500">
                        🎓
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Lycée Moderne</h1>
                    <p className="text-emerald-600 font-serif italic text-4xl leading-none">d'Andé</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 max-w-[340px] mx-auto">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 leading-none">Adresse Email</label>
                        <div className="relative">
                            <input 
                                type="email" 
                                required
                                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
                                placeholder="ADMIN@ECOLE.CI"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 leading-none">Mot de passe</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 pr-14 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
                                placeholder="••••••••"
                                value={form.motDePasse}
                                onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-xl opacity-20 hover:opacity-100 transition-opacity"
                            >
                                {showPassword ? "👁️" : "🙈"}
                            </button>
                        </div>
                    </div>

                    {erreur && (
                        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-[10px] font-black uppercase text-center border border-rose-100 animate-shake">
                            {erreur}
                        </div>
                    )}

                    <button 
                        disabled={chargement}
                        className="w-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 border-b-4 border-emerald-900"
                    >
                        {chargement ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>CHARGEMENT...</span>
                            </div>
                        ) : "OUVRIR MA SESSION →"}
                    </button>
                </form>

                <div className="mt-20 text-center">
                    <p className="text-slate-300 text-[9px] font-black uppercase tracking-[0.4em] leading-none mb-1">
                        SISTÈME DE GESTION NUMÉRIQUE
                    </p>
                    <p className="text-slate-200 text-[8px] font-bold uppercase tracking-[0.2em]">
                        © 2024 LYCÉE MODERNE D'ANDÉ
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake { animation: shake 0.4s ease-in-out; }
            `}</style>
        </div>
    );
}
