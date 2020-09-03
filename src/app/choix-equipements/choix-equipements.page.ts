import { Component, OnInit } from '@angular/core';
import {Equipements} from '../models/equipement/equipements';
import {EnrollementService} from '../service/enrollement/enrollement.service';
import { Router,NavigationExtras } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { async } from 'rxjs/internal/scheduler/async';


@Component({
  selector: 'app-choix-equipements',
  templateUrl: './choix-equipements.page.html',
  styleUrls: ['./choix-equipements.page.scss'],
})
export class ChoixEquipementsPage implements OnInit {
 
  equipementChoisi=new Equipements();
  equipementChoisi1=new Equipements();
  listEquipement=new Array<Equipements>();
  listStringEquipements=Array<String>();
  listStringStatusEquipement=Array<String>(); 
  listStringPrecision=Array<String>();
  private status:String='ko';

  constructor(public serviceEnrollement:EnrollementService,
              public router:Router,public navctrl:NavController,
              private modalController: ModalController) {
               
                this.recupereListEquipement();
                this.recupereListStatus();
    
   }

  ngOnInit() {
    
    this.listStringPrecision=this.serviceEnrollement.precisionEquipement.split(',');
    let sizetableau=this.listStringPrecision.length;
    this.listStringPrecision.splice(sizetableau-1,1)
    if(this.serviceEnrollement!=null)
    {
      this.listEquipement=this.serviceEnrollement.listEquipements;
    
      
    }
   
    this.equipementChoisi.libl="KIQUE";
    this.equipementChoisi.numeroMairie="12AV";
    this.equipementChoisi.precision='12';
    this.listEquipement=[this.equipementChoisi];
    
    this.recupereListEquipement();
    this.recupereListStatus();
    


  }

  async returnPageEnrol()
  {
    let navigationExtras: NavigationExtras;
    console.log(this.equipementChoisi1);
    console.log(this.serviceEnrollement.listEquipementRefId);
    if(this.equipementChoisi1.status !=null && this.equipementChoisi1.status !='')
    {
      if(1/*this.equipementChoisi1.libl!="ETALE"*/)
      {

      if(this.equipementChoisi1.numeroMairie !=null && this.equipementChoisi1.numeroMairie !='')
      {
       
        for (let index = 0; index < this.listStringEquipements.length; index++)
         {
          console.log(this.listStringEquipements[index]+"  "+this.equipementChoisi1.libl)
          if(this.listStringEquipements[index]==this.equipementChoisi1.libl)
          {
            
            this.equipementChoisi1.id=Number(this.serviceEnrollement.listEquipementRefId[index]);
            console.log( this.equipementChoisi1.id)
            break;
          }

        }
        if(1 /*this.equipementChoisi1.libl !=null && this.equipementChoisi1.status !=null*/ )
        {
          this.serviceEnrollement.statusChoixEquipement='ok';
          navigationExtras = {
            queryParams: {
                currency: JSON.stringify(this.equipementChoisi1),
                  }
        };
        this.navctrl.navigateForward(['enrollement'], navigationExtras);
     //  await this.modalController.dismiss(JSON.stringify(this.equipementChoisi1));
     // console.log('code de retour', this.returnCode);
        }
        else 
        {
          alert("VEUILLEZ CHOISIR UN EQUIPEMENT");
          this.serviceEnrollement.statusChoixEquipement='ko';
          
          
        }
    
        
      }
      else
      {
        alert("VEUILLEZ SAISIR LE NUMERO DE L'EQUIPEMENT");
      }
    }
    
    }
    else
    {
      alert("VEUILLEZ SELECTIONNEZ UN STATUT POUR L'EQUIPEMENT")
    }
    
    //this.router.navigate(['/enrollement']);
  }


  recupereListEquipement()
  {

    this.listStringEquipements=this.serviceEnrollement.equipementsList.split(',');
    this.listStringEquipements.pop();
    console.log(this.listStringEquipements);
   let equipem=new Equipements();
   if(this.listStringEquipements!=null && this.listStringEquipements.length>=1)
   {

 
     for (let index = 0; index < (this.listStringEquipements.length-1); index++) {
    
       if(this.listStringEquipements[index] !='' && this.listStringEquipements[index]!=null)
       {
        equipem.libl= this.listStringEquipements[index];
        if(equipem.libl!=null)
        {
          this.listEquipement.push(equipem);
        }
       
       }
     
       
     }

    }
  }
  recupereListStatus()
  {
    console.log('status '+this.serviceEnrollement.statusEquipement);
    this.listStringStatusEquipement=this.serviceEnrollement.statusEquipement.split(',');
    this.listStringStatusEquipement.pop();
    for (let index = 0; index < this.listStringStatusEquipement.length; index++) {
      console.log ('status '+this.listStringStatusEquipement[index]);
      
    }
    
  }

  async retourEnrolement()
  {
   this.router.navigate(['/enrollement']);
    //  await this.modalController.dismiss();
     // console.log('code de retour', this.returnCode);
  }

}
