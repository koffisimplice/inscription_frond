import { NextResponse } from 'next/server';

// Stockage temporaire en mémoire des photos (Boîte aux lettres)
const photoSessions = new Map<string, string>();

export async function POST(req: Request) {
    try {
        const { sessionId, photoUrl } = await req.json();
        
        if (!sessionId || !photoUrl) {
            return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
        }
        
        // Stocke la photo pendant 5 minutes maximum
        photoSessions.set(sessionId, photoUrl);
        setTimeout(() => photoSessions.delete(sessionId), 5 * 60 * 1000);
        
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
        return NextResponse.json({ error: 'Session ID requis' }, { status: 400 });
    }
    
    const photoUrl = photoSessions.get(sessionId);
    
    if (photoUrl) {
        // La photo a été récupérée, on vide la boîte aux lettres
        photoSessions.delete(sessionId);
        return NextResponse.json({ photoUrl });
    }
    
    return NextResponse.json({ photoUrl: null });
}
