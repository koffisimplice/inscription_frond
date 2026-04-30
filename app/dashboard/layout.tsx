'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getUser, logout, isAuthenticated } from '../../lib/auth';
import { Role, Utilisateur } from '../../lib/types';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<Utilisateur | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const currentUser = getUser();
        const authStatus = isAuthenticated();
        
        if (typeof window !== 'undefined') {
            if (!authStatus || !currentUser) {
                router.replace('/login');
            } else {
                setUser(currentUser);
                setLoading(false);
            }
        }
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050a09]">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_40px_rgba(16,185,129,0.2)]" />
                    <p className="text-emerald-500/60 font-black uppercase text-[10px] tracking-[0.4em] animate-pulse">Lycée d'Andé • Initialisation</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const navItems = [
        { name: 'Tableau de Bord', href: '/dashboard', icon: '📊', roles: [Role.ADMIN, Role.INTENDANT, Role.EDUCATEUR] },
        { name: 'Dossiers Inscriptions', href: '/dashboard/inscriptions', icon: '📝', roles: [Role.ADMIN, Role.INTENDANT, Role.EDUCATEUR] },
        { name: 'Répertoire Élèves', href: '/dashboard/eleves', icon: '🎓', roles: [Role.ADMIN, Role.EDUCATEUR] },
        { name: 'Liste des Classes', href: '/dashboard/classes', icon: '🏫', roles: [Role.ADMIN] },
        { name: 'Gestion des Utilisateurs', href: '/dashboard/utilisateurs', icon: '👤', roles: [Role.ADMIN] },
    ];

    const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

    return (
        <div className="min-h-screen bg-[#f8fafc] flex overflow-hidden font-sans">
            
            {/* Sidebar - Changed to Emerald Black */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-72 bg-[#050a09] text-white p-6 transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 border-r border-white/5
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Brand */}
                    <div className="flex items-center gap-4 px-2 mb-12">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-emerald-900/40 rotate-3">🎓</div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight leading-none uppercase bg-gradient-to-r from-emerald-200 to-teal-400 bg-clip-text text-transparent">Lycée Andé</h1>
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mt-1 block">Espace Management</span>
                        </div>
                    </div>

                    {/* Navigation - Changed active from Purple to Emerald */}
                    <nav className="flex-1 space-y-3">
                        {filteredNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`
                                    flex items-center gap-4 px-5 py-4 rounded-[22px] transition-all duration-500 group relative overflow-hidden
                                    ${pathname === item.href 
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 shadow-xl shadow-emerald-900/40 text-white translate-x-2' 
                                        : 'text-slate-500 hover:bg-white/5 hover:text-white'}
                                `}
                            >
                                <span className={`text-xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 ${pathname === item.href ? 'scale-110' : ''}`}>
                                    {item.icon}
                                </span>
                                <span className="font-black text-[11px] uppercase tracking-wider">{item.name}</span>
                                {pathname === item.href && <div className="absolute right-0 w-1.5 h-8 bg-amber-400 rounded-l-full" />}
                            </Link>
                        ))}
                    </nav>

                    {/* User Profile Card */}
                    <div className="mt-auto pt-8">
                        <div className="bg-gradient-to-br from-[#0a1513] to-[#050a09] p-5 rounded-[32px] border border-white/5 mb-4 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 blur-2xl" />
                            <div className="flex items-center gap-4 mb-5 relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-emerald-950 font-black text-sm shadow-lg uppercase">
                                    {user.nom[0]}{user.prenoms[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black truncate uppercase tracking-tight text-emerald-200">{user.nom}</p>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{user.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="w-full py-3.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 border border-rose-500/10 relative z-10"
                            >
                                Se Déconnecter
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md z-30 lg:hidden animate-in fade-in duration-500"
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative min-w-0">
                {/* Header / Top Bar styled with color */}
                <header className="h-16 md:h-20 bg-gradient-to-r from-[#064e3b] to-[#0d9488] border-b border-emerald-900/50 flex items-center justify-between px-4 md:px-12 z-20 sticky top-0 shadow-lg shadow-emerald-950/20 gap-4">
                    {/* Left: Mobile toggle + breadcrumb */}
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden shrink-0 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center text-lg font-bold transition-colors active:scale-95"
                            aria-label="Menu"
                        >
                            {isSidebarOpen ? '✕' : '☰'}
                        </button>
                        <h2 className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.2em] truncate">
                            <span className="hidden sm:inline">Tableau de Bord / </span>
                            <span className="text-white">{navItems.find(item => item.href === pathname)?.name || 'Accueil'}</span>
                        </h2>
                    </div>
                    {/* Right: Status badges (desktop only) */}
                    <div className="hidden md:flex items-center gap-6 shrink-0">
                        <div className="flex flex-col items-end leading-none">
                            <span className="text-[9px] font-black text-emerald-100/50 uppercase tracking-widest mb-1.5">Session 24-25</span>
                            <div className="px-3 py-1 bg-amber-400 rounded-full font-black text-[10px] text-[#064e3b] uppercase tracking-tighter shadow-lg shadow-amber-900/20">En cours</div>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
                            <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Service Actif</span>
                        </div>
                    </div>
                </header>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth no-print">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
