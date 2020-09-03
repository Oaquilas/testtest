import {Contact} from '../contact/contact';
import {Identification} from '../identification';
import {Localisation} from '../localisation/localisation';
import {Taxes} from '../taxes/taxes';
import {Equipements} from '../equipement/equipements';

export class Enroller {
    localisation:Localisation;
    identification:Identification;
    contact:Contact;
    activite:String;
    nature:String;
    moyen_paiement:String;
    ref_paiement_mobile:number;
    banque_paiement:String;
    ref_banque:String;
    equipement:Array<Equipements>;
    taxes:Array<Taxes>;
    
   constructor()
   {

   } 

}
