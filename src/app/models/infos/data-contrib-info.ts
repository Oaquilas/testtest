import { Identification } from './identification';
import { Localisation } from './localisation';
import { Contact } from './contact';
import { Activite } from './activite';
import { PaiementPrefere } from './paiement-prefere';

export class DataContribInfo {
    klpnum: string;
    ctrid: number;
    agentUsername: string;
    identification=new Identification();
    localisation=new Localisation();
    contact=new Contact();
    activite=new Activite();
    paiementPrefere=new PaiementPrefere();
    codeKlpnum: string;
    constructor(){}
}
