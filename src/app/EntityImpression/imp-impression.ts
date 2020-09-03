import { ImpTaxe } from './imp-taxe';
import { ImpEquipement } from './imp-equipement';

export class ImpImpression {
    public secteur:String;
     public zone:String;
     public nina:String;
    public  nom:String;
     public prenom:String;
     public nif:String;
     public natureActivite:String;
     public typeActivite:String;
    public taxe=new Array<ImpTaxe>();
    public equipement=new Array<ImpEquipement>();
    constructor(){}
}
