export enum Sexe {
    M = 'M',
    F = 'F'
}

export enum Role {
    ADMIN = 'ADMIN',
    INTENDANT = 'INTENDANT',
    EDUCATEUR = 'EDUCATEUR'
}

export enum StatutInscription {
    EN_COURS = 'EN_COURS',
    COMPLETE = 'COMPLETE',
    VALIDEE_INTENDANT = 'VALIDEE_INTENDANT',
    VALIDEE_EDUCATEUR = 'VALIDEE_EDUCATEUR',
    FINALISEE = 'FINALISEE'
}

export enum Qualite {
    BE = 'BE',
    DEMI_BOURSE = 'DEMI_BOURSE',
    NON_BOURSIER = 'NON_BOURSIER'
}

export enum Niveau {
    SIXIEME = 'SIXIEME',
    CINQUIEME = 'CINQUIEME',
    QUATRIEME = 'QUATRIEME',
    TROISIEME = 'TROISIEME',
    SECONDE = 'SECONDE',
    PREMIERE = 'PREMIERE',
    TERMINALE = 'TERMINALE'
}

export enum TypeParent {
    PERE = 'PERE',
    MERE = 'MERE'
}

export interface Utilisateur {
    id: number;
    nom: string;
    prenoms: string;
    email: string;
    role: Role;
    actif: boolean;
}

export interface Classe {
    id: number;
    nom: string;
    niveau: Niveau;
    anneeScolaire: string;
    capaciteMax: number;
}

export interface Parent {
    id?: number;
    type: TypeParent;
    nomComplet: string;
    profession: string;
    residence: string;
    contact: string;
}

export interface Tuteur {
    id?: number;
    nomComplet: string;
    profession: string;
    domicile: string;
    contact: string;
}

export interface Eleve {
    id?: number;
    nom: string;
    prenoms: string;
    dateNaissance: string;
    lieuNaissance: string;
    numeroActeNaissance: string;
    etabliA: string;
    matricule?: string;
    sexe: Sexe;
    nationalite: string;
    adressePostale: string;
    telephone: string;
    photoUrl?: string;
    // ✅ AJOUTS ICI
    parents?: Parent[];
    tuteur?: Tuteur;
    inscriptions?: Inscription[];
}

export interface Inscription {
    id?: number;
    anneeScolaire: string;
    dateInscription: string;
    statut: StatutInscription;
    qualite: Qualite;
    lv2: string;
    etablissementOrigine: string;
    classeOrigine: string;
    fraisPaye: boolean;
    ficheEnLigne: boolean;
    acteNaissanceFourni: boolean;
    ficheAffectation: boolean;
    bulletinTrimestre: boolean;
    valideParIntendant?: Utilisateur;
    valideParEducateur?: Utilisateur;
    eleve: Eleve;
    classe: Classe;
}
