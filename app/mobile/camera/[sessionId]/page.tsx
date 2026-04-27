'use client';
import { useEffect, useRef, useState, use } from 'react';

export default function MobileCameraPage({ params }: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = use(params);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [erreur, setErreur] = useState('');
    const [statut, setStatut] = useState('Démarrage...');
    const [cameraDisponible, setCameraDisponible] = useState(true);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } 
                });
                if (videoRef.current) videoRef.current.srcObject = stream;
                setStatut('');
                setCameraDisponible(true);
            } catch {
                setCameraDisponible(false);
                setStatut('');
            }
        };
        startCamera();
        return () => {
            if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const sendPhoto = async (photoUrl: string) => {
        setStatut('Envoi en cours...');
        try {
            const res = await fetch('/api/photo-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, photoUrl })
            });
            if (res.ok) {
                setStatut('✅ Photo envoyée !');
                // On efface le message après 2 secondes pour permettre d'en reprendre une
                setTimeout(() => setStatut(''), 2000);
            } else {
                setErreur("Erreur d'envoi");
                setTimeout(() => setErreur(''), 3000);
            }
        } catch {
            setErreur("Erreur réseau");
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => sendPhoto(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const takePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const context = canvasRef.current.getContext('2d');
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context?.drawImage(videoRef.current, 0, 0);
        sendPhoto(canvasRef.current.toDataURL('image/jpeg', 0.8));
    };

    return (
        <div className="min-h-screen bg-black flex flex-col font-sans text-white">
            <header className="p-4 text-center bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
                <h1 className="font-bold text-sm">📸 Lycée Andé</h1>
                <span className="text-[10px] text-zinc-500 uppercase">Multi-envoi actif</span>
            </header>

            <main className="flex-1 relative flex items-center justify-center overflow-hidden">
                {cameraDisponible ? (
                    <>
                        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                            <div className="w-48 h-64 border-2 border-white/30 rounded-full border-dashed"></div>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-8 space-y-6">
                        <label className="block w-full bg-blue-600 text-white font-black py-5 px-6 rounded-3xl shadow-2xl active:scale-95 transition-transform cursor-pointer uppercase text-sm">
                            Prendre une photo
                            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
                        </label>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Vous pouvez envoyer plusieurs photos</p>
                    </div>
                )}
                
                {statut && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-xl animate-bounce z-50 whitespace-nowrap">
                        {statut}
                    </div>
                )}

                {erreur && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-xl z-50">
                        {erreur}
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
            </main>

            <footer className="p-8 bg-zinc-900 flex flex-col items-center gap-4">
                {cameraDisponible && (
                    <button onClick={takePhoto} className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform">
                        <div className="w-16 h-16 rounded-full border-2 border-zinc-800"></div>
                    </button>
                )}
                <p className="text-[10px] text-zinc-500 uppercase font-black">Prenez la photo de l'élève</p>
            </footer>
        </div>
    );
}
