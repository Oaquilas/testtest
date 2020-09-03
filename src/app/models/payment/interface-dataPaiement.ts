export interface DataPaiement {
    klpnum: string;
    agentUsername: string;
    identification: Identification;
    localisation: Localisation;
    contact: Contact;
    activite: Activite;
    paiementPrefere: PaiementPrefere;
    montantPayerContrib: number;
    echFiscModels: EchFiscModels[];
}


export interface Identification {
    raisonSociale: number;
    nif: string;
    personePhysiqueOuMorale: string;
}

export interface Localisation {
    zone: string;
    secteur: string;
    latitude: number;
    longitude: number;
}

export interface Contact {
    prenoms: string;
    nom: string;
    nina: string;
    telephonel: string;
    age: string;
    fonction: string;
    email: string;
}

export interface Activite {
    natureActivite: string;
    typeActivite: string;
}

export interface PaiementPrefere {
    moyen: string;
    ref: string;
    banque: string;
    ref_banque: string;
}

export interface EchFiscModels {
    montantApayer: number;
    montantPrevu: number;
    mois: number;
    idEchFisc: number;
    libl: string;
    echFiscDModels: EchFiscDModels[];
}

export interface EchFiscDModels {
    montantApayer: number;
    montantPrevu: number;
    mois: number;
    idEchFiscD: number;
    libl: string;
}
