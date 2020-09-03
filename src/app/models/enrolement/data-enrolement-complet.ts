import { DataContribInfo } from '../infos/data-contrib-info';
import { Equipements } from '../equipement/equipements';
import { Taxes } from '../taxes/taxes';
import { Identification } from '../infos/identification';
//import { Identification } from './identification';
import { Localisation } from '../infos/localisation';
import { Contact } from '../infos/contact';
import { Activite } from '../infos/activite';
import { PaiementPrefere } from '../infos/paiement-prefere';

export class DataEnrolementComplet {
  // dataenrolement=new DataContribInfo();
    ctrbid:number;
    ctid:number;
    klpnum: string;
    agentUsername: string;
    identification=new Identification();
    localisation=new Localisation();
    contact=new Contact();
    activite=new Activite();
    paiementPrefere=new PaiementPrefere();
    codeKlpnum: string;
    equipements=new Array<Equipements>();
    taxes=new Array<Taxes>();
    constructor(){}
}
