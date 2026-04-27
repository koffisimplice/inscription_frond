'use client';
import { Inscription, TypeParent, Sexe, Qualite } from '../lib/types';

interface Props {
    inscription: Inscription;
}

export default function FicheInscription({ inscription }: Props) {
    const { eleve, classe } = inscription || {};
    const parents = eleve?.parents || [];
    const pere = parents.find((p: any) => p.type === TypeParent.PERE);
    const mere = parents.find((p: any) => p.type === TypeParent.MERE);
    const tuteur = eleve?.tuteur;

    const matriculeDigits = (eleve?.matricule || '').padEnd(10, ' ').split('');
    const classOrigineDigits = (inscription?.classeOrigine || '').padEnd(2, ' ').split('').slice(0, 2);

    const dateAujourdhui = new Date().toLocaleDateString('fr-FR');

    return (
        <div className="fiche-container bg-white text-black font-serif text-[10pt] leading-[1.2] max-w-[21cm] mx-auto print:p-0 print:m-0">
            {/* Top Header Section */}
            <div className="flex justify-between items-start mb-4">
                <div className="text-center text-[7.5pt] w-[45%] leading-tight">
                    <p className="font-bold uppercase">Ministère de l'Éducation Nationale<br />et de l'Alphabétisation</p>
                    <div className="w-16 h-[0.5pt] bg-black mx-auto my-1"></div>
                    <p className="font-bold text-[6.5pt] uppercase text-center">Direction Régionale de l'Éducation Nationale<br />et de l'Alphabétisation de Bongouanou</p>
                    <div className="w-12 h-[0.5pt] bg-black mx-auto my-1"></div>
                    <p className="font-bold text-[9.5pt] mt-1">LYCÉE MODERNE D'ANDÉ</p>
                    <p className="text-[6.5pt]">BP 108 KOTOBI Tél: 0748119608<br />Email: lycande2014@gmail.com</p>
                </div>

                <div className="flex flex-col items-center flex-1 pt-2">
                    <div className="border-2 border-black p-2 text-center font-bold text-[12pt] leading-tight w-[180px]">
                        FICHE D'INSCRIPTION<br />ET DE<br />REINSCRIPTION
                    </div>
                </div>

                <div className="flex flex-col items-end w-[25%]">
                    <p className="font-bold text-[9pt] mb-1 text-right whitespace-nowrap">Année Scolaire {inscription?.anneeScolaire || '2024-2025'}</p>
                    <div className="border border-black w-20 h-24 flex items-center justify-center text-gray-400 text-[8pt] overflow-hidden bg-gray-50 relative">
                        {eleve?.photoUrl ? (
                            <img src={eleve.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-bold opacity-30">Photo</span>
                        )}
                    </div>
                </div>
            </div>

            {/* (1) IDENTIFICATION DE L'ELEVE */}
            <div className="mb-3">
                <h3 className="font-bold underline mb-1 text-[10pt] uppercase tracking-tighter">(1) IDENTIFICATION DE L'ELEVE</h3>
                <div className="space-y-0.5">
                    <div className="flex gap-2">
                        <span className="font-bold shrink-0">Nom :</span>
                        <span className="border-b border-dotted border-black flex-1 font-medium text-center uppercase">{eleve?.nom}</span>
                        <span className="font-bold shrink-0 ml-4">Prénoms :</span>
                        <span className="border-b border-dotted border-black flex-1 font-medium text-center uppercase">{eleve?.prenoms}</span>
                    </div>

                    <div className="flex gap-2">
                        <span className="font-bold shrink-0">Né(e) le :</span>
                        <span className="border-b border-dotted border-black w-28 font-medium text-center">{eleve?.dateNaissance ? new Date(eleve.dateNaissance).toLocaleDateString() : ''}</span>
                        <span className="font-bold shrink-0">à :</span>
                        <span className="border-b border-dotted border-black flex-1 font-medium text-center uppercase">{eleve?.lieuNaissance}</span>
                        <span className="font-bold shrink-0">S/P :</span>
                        <span className="border-b border-dotted border-black w-28 font-medium text-center uppercase">{eleve?.etabliA}</span>
                    </div>

                    <div className="flex gap-2">
                        <span className="font-bold shrink-0">Acte de Naissance N°</span>
                        <span className="border-b border-dotted border-black w-20 font-medium text-center uppercase">{eleve?.numeroActeNaissance}</span>
                        <span className="font-bold shrink-0">du</span>
                        <span className="border-b border-dotted border-black w-24 font-medium text-center uppercase">
                            {/* @ts-ignore */}
                            {eleve?.dateActeNaissance ? new Date(eleve.dateActeNaissance).toLocaleDateString() : ''}
                        </span>
                        <span className="font-bold shrink-0">Établi à</span>
                        <span className="border-b border-dotted border-black flex-1 font-medium text-center uppercase">{eleve?.etabliA}</span>
                    </div>

                    <div className="flex items-center gap-4 py-0.5">
                        <span className="font-bold shrink-0">Matricule :</span>
                        <div className="flex border-l border-t border-black">
                            {matriculeDigits.map((d, i) => (
                                <div key={i} className="w-5 h-5 border-r border-b border-black flex items-center justify-center font-bold text-[9pt]">
                                    {d !== ' ' ? d : ''}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 ml-6">
                            <span className="font-bold italic text-[9pt]">Sexe (1) : M</span>
                            <div className="w-4 h-4 border border-black flex items-center justify-center font-bold bg-white text-[8pt]">
                                {eleve?.sexe === Sexe.M ? 'X' : ''}
                            </div>
                            <span className="font-bold italic ml-2 text-[9pt]">F</span>
                            <div className="w-4 h-4 border border-black flex items-center justify-center font-bold bg-white text-[8pt]">
                                {eleve?.sexe === Sexe.F ? 'X' : ''}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <span className="font-bold shrink-0">Nationalité :</span>
                        <span className="border-b border-dotted border-black flex-1 font-medium text-center uppercase">{eleve?.nationalite}</span>
                    </div>

                    <div className="flex gap-2">
                        <span className="font-bold shrink-0">Adresse postale :</span>
                        <span className="border-b border-dotted border-black flex-1 font-medium text-center uppercase">{eleve?.adressePostale}</span>
                        <span className="font-bold shrink-0 ml-4">Cel :</span>
                        <span className="border-b border-dotted border-black w-40 font-medium text-center uppercase">{eleve?.telephone}</span>
                    </div>

                    <div className="flex gap-2">
                        <span className="font-bold shrink-0">Etablissement d'origine :</span>
                        <span className="border-b border-dotted border-black flex-1 font-medium text-center uppercase">{inscription?.etablissementOrigine}</span>
                        <div className="flex items-center gap-1 ml-2">
                            <span className="font-bold shrink-0 text-[9pt]">Classe d'origine</span>
                            {classOrigineDigits.map((d, i) => (
                                <div key={i} className="w-5 h-5 border border-black flex items-center justify-center font-bold bg-white text-[8pt]">
                                    {d !== ' ' ? d : ''}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <span className="font-bold shrink-0">Classe à suivre :</span>
                        <span className="border-b border-dotted border-black w-40 font-medium text-center uppercase">{classe?.nom}</span>
                        <span className="font-bold shrink-0 ml-4">LV2 (à préciser) :</span>
                        <span className="border-b border-dotted border-black flex-1 font-medium text-center uppercase">{inscription?.lv2}</span>
                    </div>

                    <div className="flex items-center gap-6 pt-1">
                        <div className="flex items-center gap-1">
                            <span className="font-bold italic text-[9.5pt]">Qualité :</span>
                            <span className="ml-2 font-bold text-[9.5pt]">BE :</span>
                            <div className="w-8 h-4 border border-black flex items-center justify-center font-bold bg-white text-[9pt]">
                                {inscription?.qualite === Qualite.BE ? 'X' : ''}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-[9.5pt]">½ B :</span>
                            <div className="w-8 h-4 border border-black flex items-center justify-center font-bold bg-white text-[9pt]">
                                {inscription?.qualite === Qualite.DEMI_BOURSE ? 'X' : ''}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-[9.5pt]">NB :</span>
                            <div className="w-8 h-4 border border-black flex items-center justify-center font-bold bg-white text-[9pt]">
                                {inscription?.qualite === Qualite.NON_BOURSIER ? 'X' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* (2) IDENTIFICATION DES PARENTS */}
            <div className="mb-3">
                <h3 className="font-bold underline mb-1 text-[10pt] uppercase tracking-tighter">(2) IDENTIFICATION DES PARENTS</h3>
                <div className="space-y-0.5">
                    <div className="flex gap-2">
                        <span className="font-bold shrink-0 italic">Nom et Prénoms du Père :</span>
                        <span className="border-b border-dotted border-black flex-1 font-medium text-center uppercase">{pere?.nomComplet}</span>
                        <span className="font-bold shrink-0 ml-4 italic">Profession :</span>
                        <span className="border-b border-dotted border-black w-40 font-medium text-center uppercase">{pere?.profession}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-bold shrink-0 italic">Résidence :</span>
                        <span className="border-b border-dotted border-black flex-1 font-medium text-center uppercase">{pere?.residence}</span>
                        <span className="font-bold shrink-0 ml-4 italic">Contact :</span>
                        <span className="border-b border-dotted border-black w-40 font-medium text-center uppercase">{pere?.contact}</span>
                    </div>

                    <div className="flex gap-2 pt-1">
                        <span className="font-bold shrink-0 italic">Nom et Prénoms de la Mère :</span>
                        <span className="border-b border-dotted border-black flex-1 font-medium text-center uppercase">{mere?.nomComplet}</span>
                        <span className="font-bold shrink-0 ml-4 italic">Profession :</span>
                        <span className="border-b border-dotted border-black w-40 font-medium text-center uppercase">{mere?.profession}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-bold shrink-0 italic">Résidence :</span>
                        <span className="border-b border-dotted border-black flex-1 font-medium text-center uppercase">{mere?.residence}</span>
                        <span className="font-bold shrink-0 ml-4 italic">Contact :</span>
                        <span className="border-b border-dotted border-black w-40 font-medium text-center uppercase">{mere?.contact}</span>
                    </div>
                </div>
            </div>

            {/* (3) TUTEUR */}
            <div className="mb-3">
                <h3 className="font-bold underline mb-1 text-[10pt] uppercase tracking-tighter">(3) TUTEUR OU CORRESPONDANT A ANDE</h3>
                <div className="space-y-0.5">
                    <div className="flex gap-2">
                        <span className="font-bold shrink-0 italic">Nom et Prénoms :</span>
                        <span className="border-b border-dotted border-black flex-1 font-medium text-center uppercase">{tuteur?.nomComplet}</span>
                        <span className="font-bold shrink-0 ml-4 italic">Profession :</span>
                        <span className="border-b border-dotted border-black w-40 font-medium text-center uppercase">{tuteur?.profession}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-bold shrink-0 italic">Domicile :</span>
                        <span className="border-b border-dotted border-black flex-1 font-medium text-center uppercase">{tuteur?.domicile}</span>
                        <span className="font-bold shrink-0 ml-4 italic">Contact :</span>
                        <span className="border-b border-dotted border-black w-40 font-medium text-center uppercase">{tuteur?.contact}</span>
                    </div>
                    <p className="text-center font-bold italic text-[8.5pt] mt-0.5">
                        (Joindre la photocopie de la CNI ou de la Carte Consulaire (CC) du tuteur)
                    </p>
                    <div className="flex flex-col items-end mt-0.5 pr-8">
                        <p className="italic text-[9.5pt]">Andé, le {dateAujourdhui}</p>
                        <p className="font-bold text-[10.5pt] mt-1 underline mr-8 whitespace-nowrap">Signature du parent ou du tuteur</p>
                    </div>
                </div>
            </div>

            {/* Control Tables */}
            <div className="mt-1 border-[1.5pt] border-black">
                <div className="flex border-b-[1.5pt] border-black">
                    <div className="w-[65%] p-1.5 border-r-[1.5pt] border-black">
                        <div className="border-[1.5pt] border-black inline-block px-3 py-0.5 mb-2 font-bold text-[9.5pt] uppercase">
                            CONTROLE DE L'INTENDANT
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <span className="italic font-bold text-[9pt]">Frais Macaron & activités socio-culturelles et sportives (1000F)</span>
                            <div className="w-7 h-7 border-[1.5pt] border-black flex items-center justify-center font-bold text-[11pt] bg-white">
                                {inscription?.fraisPaye ? 'X' : ''}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 p-1.5 text-center flex flex-col items-center justify-center">
                        <span className="font-bold underline italic text-[9.5pt]">Visa de l'Intendant</span>
                    </div>
                </div>

                <div className="flex">
                    <div className="w-[65%] p-1.5 border-r-[1.5pt] border-black">
                        <div className="border-[1.5pt] border-black inline-block px-3 py-0.5 mb-1.5 font-bold text-[9.5pt] uppercase">
                            CONTROLE DE L'ÉDUCATEUR DE NIVEAU
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-1 pr-2">
                            <div className="flex items-center justify-between">
                                <span className="italic text-[8.5pt]">Fiche d'inscription en ligne</span>
                                <div className="w-6 h-6 border-[1.5pt] border-black flex items-center justify-center font-bold bg-white text-[9pt]">
                                    {inscription?.ficheEnLigne ? 'X' : ''}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="italic text-[8.5pt]">Acte de Naissance</span>
                                <div className="w-6 h-6 border-[1.5pt] border-black flex items-center justify-center font-bold bg-white text-[9pt]">
                                    {inscription?.acteNaissanceFourni ? 'X' : ''}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="italic text-[8.5pt]">Fiche d'affectation ou d'orientation</span>
                                <div className="w-6 h-6 border-[1.5pt] border-black flex items-center justify-center font-bold bg-white text-[9pt]">
                                    {inscription?.ficheAffectation ? 'X' : ''}
                                </div>
                            </div>
                            <div />
                            <div className="flex items-center justify-between col-span-1">
                                <span className="italic text-[8.5pt] leading-tight">Fiche de transfert et le Bulletin de 3<sup>ème</sup> trimestre 23-24</span>
                                <div className="w-6 h-6 border-[1.5pt] border-black flex items-center justify-center font-bold ml-1 bg-white text-[9pt]">
                                    {inscription?.bulletinTrimestre ? 'X' : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <div className="border-b-[1.5pt] border-black p-1 text-center">
                            <span className="font-bold underline italic text-[8.5pt]">Visa de la saisie d'inscription</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-end items-center pb-1">
                            <p className="text-[8.5pt] italic">Andé, le {dateAujourdhui}</p>
                        </div>
                    </div>
                </div>

                <div className="flex border-t-[1.5pt] border-black">
                    <div className="w-[65%] border-r-[1.5pt] border-black p-1.5 h-20">
                        <span className="font-bold underline italic text-[9.5pt]">Visa de l'Éducateur</span>
                    </div>
                    <div className="flex-1 p-1.5 text-center h-20 flex flex-col items-center">
                        <span className="font-bold underline italic text-[9.5pt]">Signature du parent ou de l'élève</span>
                        <p className="text-[8pt] italic mt-auto">Andé, le {dateAujourdhui}</p>
                    </div>
                </div>
            </div>

            <p className="text-center italic text-[7.5pt] mt-1 font-bold">
                (1) = Cocher la case correspondante
            </p>

            <style jsx>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    :global(aside), :global(header), :global(button) {
                        display: none !important;
                    }
                    :global(main) {
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .fiche-container {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 210mm;
                        height: 297mm;
                        padding: 10mm 15mm;
                        box-sizing: border-box;
                        background: white !important;
                    }
                }
                .fiche-container {
                    font-family: "Times New Roman", Times, serif;
                }
            `}</style>
        </div>
    );
}
