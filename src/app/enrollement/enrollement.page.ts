import { Component, OnInit,ChangeDetectorRef} from '@angular/core';

import {Enroller} from '../models/enroller/enroller'
import { Identification } from '../models/identification';
import { Localisation } from '../models/localisation/localisation';
import { Contact } from '../models/contact/contact';
import { Taxes } from '../models/taxes/taxes';
import {EnrollementService} from '../service/enrollement/enrollement.service'
import { Equipements } from '../models/equipement/equipements';
import { DataContribInfo } from '../models/infos/data-contrib-info';
import { Router,ActivatedRoute } from '@angular/router';
import { HttpClient } from  '@angular/common/http';

import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { NavController,AlertController, ModalController  } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoadingController } from '@ionic/angular';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ImpImpression } from '../EntityImpression/imp-impression';
import { ImpTaxe } from '../EntityImpression/imp-taxe';
import { ImpEquipement } from '../EntityImpression/imp-equipement';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { File } from '@ionic-native/file/ngx';
//import { Camera,CameraOptions  } from '@ionic-native/camera/ngx';
import { DataEnrolement } from '../models/data-enrolement';
import { ChoixEquipementsPage } from '../choix-equipements/choix-equipements.page';
import { DataEnrolementComplet } from '../models/enrolement/data-enrolement-complet';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { LoadingCustom } from '../customLoadinf/loading-custom';


//const { Camera } = Plugins;


@Component({
  selector: 'app-enrollement',
  templateUrl: './enrollement.page.html',
  styleUrls: ['./enrollement.page.scss'],
})
export class EnrollementPage implements OnInit {
//Delimiteur 

delimiteurVirgule:String=',';
delimiteurPointVirgule:String=';'

//Photo

photo: SafeResourceUrl;
macPrinter:string="";
myPhoto:String;
photoFile=new FormData();
retrievedImage:any;
base64Data:any;
genererTaxesStatus:boolean=false;
//Les données pour enroller 
 data_enroller=new Enroller();
 data_localisation=new Localisation();
 data_identification=new Identification();
 data_contact=new Contact();
 data_taxes1=new Taxes();
 data_taxes2=new Taxes();
dataEnrolement=new DataEnrolement();
dataEnrolementModify =new DataEnrolementComplet();
 //data_taxes11=new Taxes();
  data_taxes=[] as Taxes[];//new Array<Taxes>();
 data_equipements=[] as Equipements[];//new Array<Equipements>();


 ligneTaxesTypeActivite:String="";
 contenuTaxesTypeActivite:Array<String>;

 ligneTaxesNatureActivite:String="";
 contenuNatureActivite:Array<String>;

 public possibleSecteurAgent=new Array<String>();
 public orgnum:String="";


 ages:Array<String>;
 fonctions:Array<String>;

 activites:Array<String>;

 natures:Array<String>;

 moyen_paiements:Array<String>=[];

 banques:Array<String>=[];
 equipementList:Array <String>;
 statusEquipement:Array<String>;

 equipementContribuable:String;
 listdeleteEquipements:String="";
 listdeleteTaxes:String="";

//Les données à envoyer au serveur 
dataSendToServerContact:String;
dataSendToServerIdentification:String;
dataSendToServerLocalisation:String;
dataSendToServerActivite:String;
dataSendToServerEquipements:String;
dataSendToServerPaiementPrefere:String;
dataSendToServerTaxe:String;
dataEquipeDelete:String="";




//Les variables qui permettent de fermer ou ouvir chaque partie
contenu_identification:boolean;
contenu_localisation:boolean;
contenu_contact:boolean;
contenu_activite:boolean;
contenu_equipement:boolean;
contenu_taxes:boolean;
contenu_paiement_prefere:boolean;
currency:any;
indexEnterPage:number=0;

equipementServeur:any;
public customAlertReturn:any;


//Les données parsées 

identificationString:String='';
localisationString:String='';
contactString:String='';
activiteString:String='';
equipementsString:String='';
taxesString:String='';
paiementPrefereString:String='';
loadingReturn:any;

loadingGeolocalisation:any;
 INPUT_REGEX :string= `[a-zA-Z]`;


//Statut des données à saisir 

statutIdentification:boolean=false;
statutLocalisation:boolean=false;
statutContact:boolean=false;
statutActivite:boolean=false;
statutEquipement:boolean=false;
statutTaxes:boolean=false;
statutPaiementPrefere:boolean=false;

loadGeolocalisationEnCours:boolean=false;


//Photos

public tus = false;
private counter = 0;
public error: string;
private loading: any;
//
tappFirstTaxe:boolean=false;

//Bluetooth

nameBluetooth:any;

corps: string;
global: string;
entete: string;
 justify_center = '\x1B\x61\x01';
  justify_left   = '\x1B\x61\x00';
piedPage: string = '--------------------\r'
 + '\r'+'CONSERVER PRECISEMENT CE TICKET\r'
+'LA MAIRIE DE BAMAKO VOUS REMERCIE \r';





//Impression
dataTicket=new ImpImpression();
retourLigne:String='\r';
espaceElementTickect:String='\n';
espace:String=' ';
statusResearchBluetooth:boolean=true;
generationTaxe:boolean=false;
afficherBluetooth:Boolean=true;

load= new LoadingCustom();
//

loadingEnrolStatus:boolean=false;
etatEnrol:number=0;
  constructor(public service:EnrollementService,
    private router:Router,
    public activateRouter:ActivatedRoute,
    private sanitizer: DomSanitizer,
    private nactrl:NavController,
    private alertctrl:AlertController,
    private loadingCtrl: LoadingController,
    private http:HttpClient,
    private bluetoothSerial:BluetoothSerial,
    private storage:NativeStorage,
    private file:File,
    private barcodeScanner: BarcodeScanner,
   // private camera:Camera,
   private modalController: ModalController,
    private readonly changeDetectorRef: ChangeDetectorRef) 



  {

   

   
   

    this.data_localisation.secteur=this.service.secteurAgentDefault;
    //console.log(' Secteur agent '+this.data_localisation.secteur);
    this.activateRouter.queryParams.subscribe(params => {
     
      let equipem=new Equipements();
     
     if(this.service.statusChoixEquipement=='ok')
     {

     
      if(this.indexEnterPage >0)
      {

          this.service.statusChoixEquipement='ko';
        
          this.currency = JSON.parse(params["currency"]);
    
           equipem.libl=this.currency['libl'];
            equipem.status=this.currency['status'];
            equipem.numeroMairie=this.currency['numeroMairie'];
            equipem.precision=this.currency['precision'];
            equipem.id=this.currency['id'];
            
            
            this.genererTaxesStatus=false;
            console.log(equipem);
            this.data_equipements.push(equipem);
  
      
      }
    }
       
    
  });

   }

   
  ngOnInit() {

    this.indexEnterPage=1;

    //Les données de test pour la maquette
    this.data_localisation.secteur="";
   this.data_taxes1.libl="ticket de marche";
    this.data_taxes1.nature="kiosque";
    this.data_taxes1.montant=145296;

    this.data_taxes2.libl="ticket de marche";
    this.data_taxes2.nature="kiosque";
    this.data_taxes2.montant=145296;

    //Récuperation des données 
    this.recupereInformation();
    this.recupereActivite();

    //this.recupereEquipement();
    //this.recupereStatusEquipement();

    this.recuperePaiementMobile();
    this.recupereListBanque();
     
    this.recupereFonction();

    this.data_localisation.secteur=this.service.secteurAgentDefault;


     this.service.getCurrentPosition().then(data=>{
      this.data_contact.lagitude=this.service.latitude;
      this.data_contact.longitude=this.service.longitude;
     });

    
  }




  enrollerContribuable(){
          //this.calculerTaxes();
    

      //Initialiser les string
      if(this.etatEnrol==0 || this.etatEnrol==2)
      {
      this.taxesString='';
      this.equipementsString='';
      if(this.generationTaxe==true)
      {
        //this.loadingEnrolementContrib();
        this.load.showloading("Enrolement en cours!!");
        
      // this.service.getCurrentPosition().then(data=>{
        if(this.data_contact.lagitude==null || this.data_contact.lagitude<=0)
        {
          this.data_contact.lagitude=0.0;
        }
        if(this.data_contact.longitude==null || this.data_contact.longitude<=0)
        {
          this.data_contact.longitude=0.0;
        }
        //this.data_contact.lagitude=this.service.latitude;
        //this.data_contact.longitude=this.service.longitude;

        this.myPhoto="AAAA";
        this.loadGeolocalisationEnCours=false;

        this.parserIdentification();
        if(this.statutIdentification==true)
        {
          this.parserLocalisation();
          if(this.statutLocalisation==true)
          {
            this.parserContact();
            if(this.statutContact==true)
            {
              this.parserActivite();
              if(this.statutActivite==true)
              {
                this.parserEquipements();
                if(1)
                {
                  this.parserTaxes();
                  if(1)
                  {
                    this.parserPaiementPrefere();
                    if( this.statutPaiementPrefere==true)
                    {
                      var agent=this.data_localisation.zone+","+this.data_localisation.secteur+','+this.service.agentId+',';//this.service.zoneId;
                      
                      
                      this.initialiserEquipementTicket();
                      this.initialiserDataTicket();
                      this.initialiserTaxeTicket();
                      this.initialiserTicket();
                      this.loadingEnrolStatus=true;
                      let hideFooterTimeout = setTimeout( () => {
                        this.load.loading.dismiss();
                        }, 60000);
                     // this.initialiserDataEnrolement(agent)
                    /* console.log(this.taxesString)
                     console.log(this.equipementsString)*/
                      this.service.getEnroler(this.contactString,this.identificationString,this.localisationString,this.activiteString,
                          this.taxesString,this.equipementsString,this.paiementPrefereString,agent,this.myPhoto, this.dataEquipeDelete).then(
                            data=>{
                              
                              this.loadingEnrolStatus=false;
                              //this.generationTaxe=false;
                              //Loading alert enrolement
                                
                             
                              
                             if (this.service.statusEnrolement==true)
                              {
                                this.etatEnrol=1;
                               // this.service.getKlpnum().then(data=>{
                                  //Tester le print
                                  this.etatEnrol=2;
                                 this.addEquipement(this.data_equipements);
                                 this.addTaxeimprim(this.data_taxes);
                                 this.parserDataTicket();
                                
                                 this.bluetoothSerial.write(this.entete+this.corps+this.piedPage).then(data=>{
                                 this.printQrCode(this.data_contact.klpnum);
                                 alert('ENROLEMENT EFFECTUE AVEC SUCCES.');
                                 this.initialiserStrings();
                                 this.initialiserElementUI();

                                /* if(this.customAlertReturn!=null)
                                 {
                                 this.customAlertReturn.dismiss();
                                 }*/
                                 this.load.loading.dismiss();
                                 }).catch(error=>{
                                    alert('ENROLEMENT EFFECTUE AVEC SUCCES.');
                                    /*if(this.customAlertReturn!=null)
                                    {
                                    this.customAlertReturn.dismiss();
                                    }*/
                                    this.load.loading.dismiss()
                                   
                                 })
       
                         /*       }).catch(error=>{
                                  alert('ECHEC DE RECUPERATION DE NUMERO KLISPAY.')
                                })*/
                                 
                              }
                              else if(this.service.statusEnrolement==false)
                              {
                                if(this.service.statusEnrolementExist==false){
                                  this.load.loading.dismiss();
                                /* if(this.customAlertReturn!=null)
                                 {
                                  this.customAlertReturn.dismiss();
                                 } */
                                  //alert("ERREUR ENROLEMENT.");
                                }
                                else if(this.service.statusEnrolementExist==true)
                                {
                                  this.router.navigate(['/doublons-contribuable']);
                                }
                                
                              }
                            }
                          
                          ).catch(
                            data=>{
                              this.loadingEnrolStatus=false;
                              this.load.loading.dismiss();
                              /*if(this.customAlertReturn!=null)
                              {
                                this.customAlertReturn.dismiss();
                               }*/
                                alert("ERREUR ENROLEMENT");
                                
                             /* if (this.service.statusEnrolement==true)
                              {
                                 //Tester le print
                                 this.initialiserTaxeTicket();
                                 this.initialiserEquipementTicket();
                                 this.initialiserDataTicket();
                                 this.initialiserTicket();
                              
  
                                //alert('ENROLEMENT EFFECTUE AVEC SUCCES.');
                                this.initialiserStrings();
                                this.initialiserElementUI();
                              }
                              else if(this.service.statusEnrolement==false)
                              {
                                alert("ERREUR ENROLEMENT.");
                              }*/
                            
                                console.log('ko test '+JSON.stringify(data));
                            }
                          )   
  
  
  
                    }
                    else
                    {
                      this.load.loading.dismiss();
                     /* if(this.customAlertReturn!=null)
                      {
                        this.customAlertReturn.dismiss();
                      }*/
                      
                    }
                    {
  
                    }
                  }
                }
              }
              else
              {
                this.load.loading.dismiss();
                /*if(this.customAlertReturn!=null)
                {
                  this.customAlertReturn.dismiss();
                }*/
                
              }
            }
            else
            {
              this.load.loading.dismiss();
              /* if(this.customAlertReturn!=null)
              {
              this.customAlertReturn.dismiss();
            }*/

            }
          }
          else
          {
            this.load.loading.dismiss();
           /*  if(this.customAlertReturn!=null)
                {
            this.customAlertReturn.dismiss();}*/
          }
        }
        else
        {
          this.load.loading.dismiss();
        /*  if(this.customAlertReturn!=null)
         {
          this.customAlertReturn.dismiss();
        }*/
        }
      
      
      /* }).catch(data=>{
        if(this.customAlertReturn!=null)
       {
        this.customAlertReturn.dismiss();         
      }
         alert("VEUILLEZ ACTIVER LA GEOLOCALISATION.");
         
       });  */
     
        
      }
    else
    {
     /* if(this.customAlertReturn!=null)
      {
      this.customAlertReturn.dismiss();
      }*/
      this.load.loading.dismiss();
      alert("VEUILLEZ GENERER LA TAXE.");
    }
  }

  else if(this.etatEnrol==1)
  {
    this.etape2Enrol();
  }

  }


  //Gestion des 7 parties différentes de l'enrollement
 
    tappIdentification(){
      this.tappsEnrollement(1);
     

    }

    tappLocalisation(){
      if(this.data_contact.lagitude==0  ||this.data_contact.longitude==0 || this.data_contact.lagitude==null || this.data_contact.longitude==null)
     { 
       this.loadingGeolocalisationFct();
      let hideFooterTimeout = setTimeout( () => {
        if(this.loadGeolocalisationEnCours==true)
        {
          this.loadingGeolocalisation.dismiss();
          this.loadGeolocalisationEnCours=false;
          this.tappsEnrollement(2);
        }
        }, 60);
      this.service.getCurrentPosition().then(data=>{
        this.data_contact.lagitude=this.service.latitude;
        this.data_contact.longitude=this.service.longitude;
        this.loadGeolocalisationEnCours=false;
        this.loadingGeolocalisation.dismiss();
        this.tappsEnrollement(2);
       }).catch(data=>{

         alert("Veuillez activer votre géolocalisation!");
         
       });

      }
      else
      {
       
         this.tappsEnrollement(2);
  
      }
      

      
    }

    tappContact(){

      this.tappsEnrollement(3);   
    }
    tappActivite(){
      this.tappsEnrollement(4);
      
    }
    tappEquipement(){
      this.tappsEnrollement(5);

      console.log("equipement select "+this.equipementContribuable);
      
    }
    tappTaxes(){
     if(this.contenu_taxes==false && this.tappFirstTaxe==false)
     {
      this.calculerTaxes();
     } 
        
      this.tappsEnrollement(6);
     
      
    }

    tappPaiement(){
      this.tappsEnrollement(7);
      
    }

    tappsEnrollement(data:number){
      if(data==1)
      {
        this.contenu_identification=!this.contenu_identification;
        this.contenu_activite=false;
        this.contenu_contact=false;
        this.contenu_equipement=false;
        this.contenu_paiement_prefere=false;
        this.contenu_taxes=false;
        this.contenu_localisation=false;
      }
      if(data==2)
      {
        this.contenu_identification=false;
        this.contenu_activite=false;
        this.contenu_contact=false;
        this.contenu_equipement=false;
        this.contenu_paiement_prefere=false;
        this.contenu_taxes=false;
        this.contenu_localisation=!this.contenu_localisation;
      }
      if(data==3)
      {
        this.contenu_identification=false;
        this.contenu_activite=false;
        this.contenu_contact=!this.contenu_contact;
        this.contenu_equipement=false;
        this.contenu_paiement_prefere=false;
        this.contenu_taxes=false;
        this.contenu_localisation=false;
      }
      if(data==4)
      {
        this.contenu_identification=false;
        this.contenu_activite=!this.contenu_activite;
        this.contenu_contact=false;
        this.contenu_equipement=false;
        this.contenu_paiement_prefere=false;
        this.contenu_taxes=false;
        this.contenu_localisation=false;
      }
      if(data==5)
      {
        this.contenu_identification=false;
        this.contenu_activite=false;
        this.contenu_contact=false;
        this.contenu_equipement=!this.contenu_equipement;
        this.contenu_paiement_prefere=false;
        this.contenu_taxes=false;
        this.contenu_localisation=false;
      }
      if(data==6)
      {
        
        this.contenu_identification=false;
        this.contenu_activite=false;
        this.contenu_contact=false;
        this.contenu_equipement=false;
        this.contenu_paiement_prefere=false;
        this.contenu_taxes=!this.contenu_taxes;
        this.contenu_localisation=false;
      }
      if(data==7)
      {
        this.contenu_identification=false;
        this.contenu_activite=false;
        this.contenu_contact=false;
        this.contenu_equipement=false;
        this.contenu_paiement_prefere=!this.contenu_paiement_prefere;
        this.contenu_taxes=false;
        this.contenu_localisation=false;
      }
   
    }

    recupereInformation(){
      //this.data_localisation.secteur=this.service.secteurAgent;

      this.data_localisation.zone=this.service.zoneAgent;
      if(this.service.ages!=null && this.service.ages!='')
      {
        this.ages=this.service.ages.split(',');
         //La dernière ligne est une chaîne vide donc on le supprime.C'est pareil pour les autres.
      this.ages.pop();
      }
      
     

      this.possibleSecteurAgent=this.service.listSecteur;
    }

    recupereActivite(){
     // console.log(this.service.natureActivite+' '+this.service.typeActivite);
      if(this.service.typeActivite!=null && this.service.typeActivite!='')
      {
        this.activites=this.service.typeActivite.split(',');
        this.activites.pop();
      }
      if(this.service.natureActivite!=null && this.service.natureActivite!='')
      {
        this.natures=this.service.natureActivite.split(',');
        this.natures.pop();
      }
      
      
      //Pareil
      
     
    }

    recupereEquipement()
    {
      
      if(this.service.equipementsList!=null && this.service.equipementsList!='')
      {
        this.equipementServeur=this.service.equipementsList.split(',');
        for (let index = 0; index < (this.equipementServeur.length-1); index++) 
        {
           const element = this.equipementServeur[index].split('.');
          
        }
       
        //Pareil
        this.equipementList.pop();

      }
     
    }

    recupereStatusEquipement()
    {
      if(this.service.statusEquipement !=null && this.service.statusEquipement!='')
      {
        this.statusEquipement=this.service.statusEquipement.split(',');
        //Pareil
        this.statusEquipement.pop();
      }
     
    }
    
    recuperePaiementMobile()
    {
      if(this.service.choixPaiementMobileList!=null && this.service.choixPaiementMobileList!='')
      {
        this.moyen_paiements=this.service.choixPaiementMobileList.split(',');
      this.moyen_paiements.pop();
      }
      
    }

    recupereListBanque()
    {
      if(this.service.listBanque!=null && this.service.listBanque!='')
      {
        this.banques=this.service.listBanque.split(',');
      this.banques.pop();
      }
      
    }

    recupereFonction()
    {
      if(this.service.fonctionContri!=null && this.service.fonctionContri!='')
      {
        this.fonctions=this.service.fonctionContri.split(',');
       this.fonctions.pop();
      }
      
    }

    getListTaxesFromDataBase()
    {
     // if(this.service.taxesNatureActivite != ""){
       let table:any;
         console.log('test get list 1 '+this.service.taxesNatureActivite);
         table=this.service.taxesNatureActivite.split(';');
         //console.log('Test getlist '+table[0]);
        this.ligneTaxesNatureActivite=table[0];
         this.contenuNatureActivite=this.ligneTaxesNatureActivite.split(',');

         this.data_taxes1.libl=this.contenuNatureActivite[0];
         this.data_taxes1.nature=this.contenuNatureActivite[1];
         this.data_taxes1.frequence=this.contenuNatureActivite[2];
         this.data_taxes1.montant=Number(this.contenuNatureActivite[3]);
  
    
    }

    async navigateToNewEquipement(){
      this.router.navigate(['choix-equipements']);
     
    }

    parserIdentification()
    {
      if(this.data_identification.status=="PERSONNE PHYSIQUE" )
      {
        if(this.data_contact.prenoms!=null && this.data_contact.prenoms!="" && this.data_contact.nom!=null
        && this.data_contact.nom!="")
        {
          this.data_identification.raison_sociale=this.data_contact.nom +" "+this.data_contact.prenoms;
        }

        if(this.data_identification.raison_sociale!=null && this.data_identification.raison_sociale!=""
        && this.data_identification.status !=null && this.data_identification.status!="" )
        {

        if(this.data_identification.nif==null || this.data_identification.nif=="")
        {
          this.data_identification.nif="nif";
        }
        this.identificationString=this.data_identification.raison_sociale.toUpperCase()+','+this.data_identification.nif.toUpperCase()+','+this.data_identification.status.toUpperCase()+',';
        this.statutIdentification=true;
      }
      }

    else if(this.data_identification.status=="PERSONNE MORALE")
    {
      if(this.data_identification.nif!=null && this.data_identification.nif!="")
     
      {
        if(this.data_identification.raison_sociale==null && this.data_identification.raison_sociale=="")
        {
          this.data_identification.raison_sociale="AAAA";
        }
        
        this.identificationString=this.data_identification.raison_sociale.toUpperCase()+','+this.data_identification.nif.toUpperCase()+','+this.data_identification.status.toUpperCase()+',';
        this.statutIdentification=true;
      }
      else
      {
        alert("VEUILLEZ REMPLIR LE CHAMP NIF DANS LE BANDEAU IDENTIFICATION");
        this.statutIdentification=false;
      }
    }
      else
      {
        alert("VEUILLEZ REMPLIR LES CHAMPS RAISON SOCIALE ET STATUT");
        this.statutIdentification=false;
      }
      
    }

    parserLocalisation(){

     if (this.data_localisation.secteur !="")

     {
       if(this.dataEnrolementModify.ctrbid===undefined)
       {
        this.localisationString=this.data_localisation.zone.toUpperCase() +','+ 
       this.data_localisation.secteur.toUpperCase()+this.delimiteurVirgule+
       this.data_contact.lagitude.toString()+
       this.delimiteurVirgule+this.data_contact.longitude.toString()+
       this.delimiteurVirgule;
      }
       else
       {
        this.localisationString=this.data_localisation.zone.toUpperCase() +','+ 
        this.data_localisation.secteur.toUpperCase()+this.delimiteurVirgule+
        this.data_contact.lagitude.toString()+
        this.delimiteurVirgule+this.data_contact.longitude.toString()+
        this.delimiteurVirgule+this.dataEnrolementModify.ctrbid.toString()+this.delimiteurVirgule+this.dataEnrolementModify.ctid+this.delimiteurVirgule;
        
      }

       this.statutLocalisation=true;
      // console.log("long  "+ this.data_contact.lagitude.toString()+this.data_contact.longitude.toString());

     }
     else
     {
       alert("VEUILLEZ SELECTIONNER UN SECTEUR ");
       this.statutLocalisation=false;
     }
     
     
      
    }

    parserContact()
    {
      if(this.data_identification.status=="PERSONNE PHYSIQUE")
      {
       
        this.data_identification.raison_sociale=this.data_contact.nom.toUpperCase()+' '+this.data_contact.prenoms.toUpperCase();

      }
      
      if(this.data_identification.status=="PERSONNE PHYSIQUE" || this.data_identification.status=="PERSONNE MORALE")
     {

      if(this.data_contact.prenoms !=null && this.data_contact.prenoms !="")
      {
        if(this.data_contact.nom!="" && this.data_contact.nom!=null)
        {
         if(this.data_contact.klpnum!="" && this.data_contact.klpnum!=null)
         {

          if(this.data_contact.nina!=null && this.data_contact.nina !="")
          {
            if(this.data_contact.fonction!=null && this.data_contact.fonction!="")
            { 
      
              if(this.data_contact.telephone ==null || this.data_contact.telephone < 99999)
              {
                this.statutContact=false;
                alert("VEUILLEZ CHOISIR UN NUMERO DE TELEPHONE DANS LE BANDEAU CONTACT");
                //this.data_contact.telephone=70000000;
              }

              else
              {
                if(this.myPhoto==null || this.myPhoto=='' )
                {
                  if(this.customAlertReturn!=null)
                  {
                    this.customAlertReturn.dismiss();
                  }
                  this.alertPhoto();
                 
                }
                else
                {

                if(this.data_contact.age==null || this.data_contact.age=="" )
                {
                  this.data_contact.age="AAAA";
                }
                if(this.data_contact.adresse==null || this.data_contact.adresse=="" )
                {
                  this.data_contact.adresse="AAAA";
                }

                this.contactString=this.data_contact.prenoms.toUpperCase()+','+this.data_contact.nom.toUpperCase()+this.delimiteurVirgule+this.data_contact.nina.toUpperCase()
                +this.delimiteurVirgule+this.data_contact.telephone.toString()
                +this.delimiteurVirgule+this.data_contact.age+this.delimiteurVirgule+
                this.data_contact.fonction+this.delimiteurVirgule+this.data_contact.klpnum+this.delimiteurVirgule+this.data_contact.adresse+this.delimiteurVirgule;
                
                this.statutContact=true;
              }
      
            }
            }
            else
            {
              alert("VEUILLEZ REMPLIR LE CHAMP FONCTION DANS LE BANDEAU CONTACT");
              this.statutContact=false;
            }
          }
        
          else
          {
            alert("VEUILLEZ REMPLIR LE CHAMP NINA DANS LE BANDEAU CONTACT");
            this.statutContact=false;
          }
          }
          else
          {
            alert("VEUILLEZ REMPLIR LE CHAMP KLPNUMP DANS LE BANDEAU IDENTIFICATION");
            this.customAlertReturn.dismiss();
            this.statutContact=false;
          }
        }
        else
        {
          alert("VEUILLEZ REMPLIR LE CHAMP NOM DANS LE BANDEAU CONTACT");
          this.statutContact=false;
        }

      }
      else
      {
        alert("VEUILLEZ REMPLIR LE CHAMP PRENOMS DANS LE BANDEAU CONTACT");
        this.statutContact=false;
      }
    }

    }

  

    parserActivite()
    {
      if(this.data_enroller.activite !=null 
        && this.data_enroller.activite !="")

      {
        if(this.data_enroller.nature!=null
          && this.data_enroller.nature!="")
        {
          this.activiteString=this.data_enroller.activite+','+this.data_enroller.nature+this.delimiteurVirgule;
          this.statutActivite=true;
        }
        else
        {
          alert("VEUILLEZ REMPLIR LE CHAMP NATURE D'ACTIVITE DANS LE BANDEAU ACTIVITE");
          this.statutActivite=false;
        }
       
      }
      else
      {
        alert("VEUILLEZ REMPLIR LE CHAMP TYPE D'ACTIVITE DANS LE BANDEAU ACTIVITE");
        this.statutActivite=false;
      }
      
    }
    
    parserEquipementsTaxes()
    {
      console.log('taille equipement '+this.data_equipements.length);

      for (let index = 0; index < this.data_equipements.length; index++) {
       
        if(this.data_equipements[index].eqpmid===undefined)
        {
        this.equipementsString=this.equipementsString+''
        +this.data_equipements[index].libl+this.delimiteurVirgule
        +this.data_equipements[index].id.toString() + this.delimiteurVirgule
        +this.data_equipements[index].status+this.delimiteurVirgule
        +this.data_equipements[index].numeroMairie+
        this.delimiteurVirgule+
        this.data_equipements[index].precision+
        this.delimiteurVirgule+this.delimiteurPointVirgule;
      }
      
        
   
      }
      //console.log('parser equipement '+this.equipementsString);
      
    }



    parserEquipements()
    {
      console.log('taille equipement '+this.data_equipements.length);

      for (let index = 0; index < this.data_equipements.length; index++) {
        if(this.data_equipements[index].eqpmid===undefined)
        {
        
        this.equipementsString=this.equipementsString+''
        +this.data_equipements[index].libl+this.delimiteurVirgule
        +this.data_equipements[index].id.toString() + this.delimiteurVirgule
        +this.data_equipements[index].status+this.delimiteurVirgule
        +this.data_equipements[index].numeroMairie+
        this.delimiteurVirgule+
        this.data_equipements[index].precision+
        this.delimiteurVirgule+this.delimiteurPointVirgule;
      }
        else{
          this.equipementsString=this.equipementsString+''
          +this.data_equipements[index].libl+this.delimiteurVirgule
          +this.data_equipements[index].id.toString() + this.delimiteurVirgule
          +this.data_equipements[index].status+this.delimiteurVirgule
          +this.data_equipements[index].numeroMairie+
          this.delimiteurVirgule+
          this.data_equipements[index].precision+
          this.delimiteurVirgule+this.data_equipements[index].eqpmid+this.delimiteurVirgule+this.delimiteurPointVirgule;
            
        }
        
   
      }
      //console.log('parser equipement '+this.equipementsString);
      
    }

    parserTaxes()
    {
      if(this.data_taxes.length >=1)
      {
        for (let index = 0; index < this.data_taxes.length; index++) {

       if(this.data_taxes[index].txid===undefined)
       {
        
        this.taxesString=this.taxesString+''+this.data_taxes[index].refid+
        this.delimiteurVirgule+this.data_taxes[index].typd+this.delimiteurVirgule+this.data_taxes[index].libl+','+this.data_taxes[index].frequence+this.delimiteurVirgule+this.data_taxes[index].montant+this.delimiteurVirgule+this.delimiteurPointVirgule;
        
      }

       else
       {
        this.taxesString=this.taxesString+''+this.data_taxes[index].refid+
        this.delimiteurVirgule+this.data_taxes[index].typd+this.delimiteurVirgule+this.data_taxes[index].libl+','+this.data_taxes[index].frequence+this.delimiteurVirgule+this.data_taxes[index].montant+this.delimiteurVirgule+this.data_taxes[index].txid+this.delimiteurVirgule+this.delimiteurPointVirgule;
        
       }
         
        }
      }
      else
      {
        alert("ATTENTION CONTRIBUABLE SANS TAXE!!!!!")
      }
      
    
        if(this.listdeleteEquipements!='' && this.listdeleteTaxes!='')
        {
          this.dataEquipeDelete='';
          this.dataEquipeDelete=this.listdeleteEquipements.toString()+this.delimiteurPointVirgule+this.listdeleteTaxes.toString();
        }

        console.log(this.taxesString);
      
    }
    parserPaiementPrefere()
   
    {

      if(this.data_enroller.moyen_paiement==null || this.data_enroller.moyen_paiement=='')
      {
        //this.data_enroller.moyen_paiement='AAAA';
        this.statutPaiementPrefere=false;
        alert("VEUILLEZ CHOISIR UN MOYEN DE PAIEMENT ");
      }
      else
      {
        if(this.data_enroller.ref_paiement_mobile==null || this.data_enroller.ref_paiement_mobile<111111)
          {
            //this.data_enroller.ref_paiement_mobile=70000000;
            this.statutPaiementPrefere=false;
            alert("VEUILLEZ RENSEIGNER UN NUMERO DE TELEPHONE POUR LE PAIEMENT MOBILE")
          }
        else
        {
        this.statutPaiementPrefere=true;
        if(this.data_enroller.banque_paiement==null || this.data_enroller.banque_paiement==''){

          this.data_enroller.banque_paiement='AAAA';
          if(this.data_enroller.ref_banque==null || this.data_enroller.ref_banque=='')
          {
            this.data_enroller.ref_banque='70000000';
            this.paiementPrefereString=this.data_enroller.moyen_paiement+','+this.data_enroller.ref_paiement_mobile
            +this.delimiteurVirgule+this.data_enroller.banque_paiement
            +this.delimiteurVirgule+this.data_enroller.ref_banque+this.delimiteurVirgule;
          }
          else
          {
            this.paiementPrefereString=this.data_enroller.moyen_paiement+','+this.data_enroller.ref_paiement_mobile
            +this.delimiteurVirgule+this.data_enroller.banque_paiement
            +this.delimiteurVirgule+this.data_enroller.ref_banque+this.delimiteurVirgule;
          }
        }
        else
        {
          if(this.data_enroller.ref_banque==null || this.data_enroller.ref_banque=='')
          {
            this.data_enroller.ref_banque='70000000';
          }
          else
          {
            this.paiementPrefereString=this.data_enroller.moyen_paiement+','+this.data_enroller.ref_paiement_mobile
            +this.delimiteurVirgule+this.data_enroller.banque_paiement
            +this.delimiteurVirgule+this.data_enroller.ref_banque+this.delimiteurVirgule;
          }
        }
      }
      }

      

    
     
     

    }


    calculerTaxes()
    {


      if(this.genererTaxesStatus==false)
      {

      //Initialiser les string à envoyer
      this.equipementsString='';

      //Initialiser le string de 
      this.taxesString='';

      

     
      //Reconstruire les string à envoyer
      //this.parserEquipements();
      this.parserEquipementsTaxes();
      for (let index = 0; index <= (this.data_taxes.length+1); index++) {
         
        this.data_taxes.pop()
        
       
      }

      if(this.data_enroller.activite!='' && this.data_enroller.activite!=null && this.data_enroller.nature!='' && this.data_enroller.nature!=null)
      {
        //this.dismisloadingGenerationTaxe();
       // this.loadingCalculerTaxes();
        this.load.showloading("Géneration de taxes en cours");
          console.log(''+this.data_enroller.nature +' '+this.data_enroller.activite);
        this.service.getTaxes(this.data_enroller.activite,this.data_enroller.nature,this.equipementsString).then(
          data=>{
          this.tappFirstTaxe=true;
          this.generationTaxe=true;  
          var dataTaxes;
          var element;
          var contenuTaxe;
  
         var data_tax=new Taxes();
          var size=this.data_taxes.length;
          size=size+1;
         
          for (let index = 0; index < size; index++) {
            
            this.data_taxes.splice(index,1);
           
              
          }

          this.taxesString='';

          this.dataEnrolementModify.taxes.forEach(element => {
            this.data_taxes.push(element);
          });

         if(this.service.taxesEquipement!='' && this.service.statusequip=='ok')
         {
           
          dataTaxes=this.service.taxesEquipement.split(';');
          
          for (let index = 0; index < dataTaxes.length; index++) {
 
           if(dataTaxes[index] !='' && dataTaxes[index] !=null)
           {
            let data_taxes11=new Taxes();
             var element1 = dataTaxes[index];
             var contenuTaxes=element1.split(',');
              
            data_taxes11.libl=contenuTaxes[1];
            data_taxes11.nature=contenuTaxes[2];
            data_taxes11.frequence=contenuTaxes[3];
            data_taxes11.montant=contenuTaxes[4];

            data_taxes11.refid=contenuTaxes[5];
            data_taxes11.typd=contenuTaxes[6];
            
            
            this.data_taxes.push(data_taxes11);
            

            
           }
 
            
          }
         

         }



         if(this.service.natureActivite !='' && this.service.statusnatact=='ok')
         {
          
           dataTaxes=this.service.taxesNatureActivite.split(';');
          
           for (let index = 0; index < dataTaxes.length; index++) {
  
            if(dataTaxes[index]!='' && dataTaxes[index] !=null)
            {
              element = dataTaxes[index];
              contenuTaxe=element.split(',');
      
             this.data_taxes1.libl=contenuTaxe[0];
             this.data_taxes1.nature=contenuTaxe[1];
             this.data_taxes1.frequence=contenuTaxe[2];
             this.data_taxes1.montant=contenuTaxe[3];
             this.data_taxes1.refid=contenuTaxe[4];
             this.data_taxes1.typd=contenuTaxe[5];

             this.data_taxes.push(this.data_taxes1);
             
             
  
            }
  
             
           }
         }




         if(this.service.taxesTypeActivite!='' && this.service.statustypact=='ok')
         {
          dataTaxes=this.service.taxesTypeActivite.split(';');
          
          for (let index = 0; index < dataTaxes.length; index++) {

                if(dataTaxes[index]!='' && dataTaxes!=null)
                {
                      element = dataTaxes[index];
                      contenuTaxe=element.split(',');
              
                    data_tax.libl=contenuTaxe[0];
                    data_tax.nature=contenuTaxe[1];
                    data_tax.frequence=contenuTaxe[2];
                    data_tax.montant=contenuTaxe[3];
                    data_tax.refid=contenuTaxe[4];
                    data_tax.typd=contenuTaxe[5];

                    this.data_taxes.push(data_tax);
              
                }

          
        }
   
         }

         if(this.service.taxesTypeActivite=='' && this.service.taxesNatureActivite=='' && this.service.taxesEquipement=='')
         {
           this.load.loading.dismiss();
         // this.loadingReturn.dismiss();
           alert("LE CONTRIBUABLE N'EST SOUMIS A AUCUNE TAXE");
         }

         this.load.loading.dismiss();
        // this.loadingReturn.dismiss();
       }
   
        );
  
      }

      else
      {
        alert("VEUILLEZ CHOISIR UN TYPE D'ACTIVITE ET UNE NATURE D'ACTIVITE");
      }
    }
    else
    {
      //this.dismisloadingGenerationTaxe();
    }
      
      
    }



    async takePicture()
    {
    

      const image = await Plugins.Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });
  
      this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.webPath));
     // this.uploadAll(image.webPath);
     this.myPhoto=image.base64String;
     this.retrievedImage = 'data:image/jpeg;base64,' + this.myPhoto;

      /*const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.CAMERA,
      }
      

      
     this.camera.getPicture(options).then(imageData => {
      this.myPhoto = this.convertFileSrc(imageData);
      this.changeDetectorRef.detectChanges();
      this.changeDetectorRef.markForCheck();
      this.uploadPhoto(imageData);
    });*/
    }

   /* private convertFileSrc(url: string): string {
      if (!url) {
        return url;
      }
      if (url.startsWith('/')) {
        return window['WEBVIEW_SERVER_URL'] + '/_app_file_' + url;
      }
      if (url.startsWith('file://')) {
        return window['WEBVIEW_SERVER_URL'] + url.replace('file://', '/_app_file_');
      }
      if (url.startsWith('content://')) {
        return window['WEBVIEW_SERVER_URL'] + url.replace('content:/', '/_app_content_');
      }
      return url;
    }
  
    private async uploadPhoto(imageFileUri: any) {
      this.error = null;
      this.loading = await this.loadingCtrl.create({
        message: 'Uploading...'
      });
  
      this.loading.present();
  
      window['resolveLocalFileSystemURL'](imageFileUri,
        entry => {
          entry['file'](file => this.readFile(file));
        });
    }
  
    private readFile(file: any) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const formData = new FormData();
        const imgBlob = new Blob([reader.result], {type: file.type});
        formData.append('file', imgBlob, file.name);
        this.photoFile=formData;
       // console.log(this.photoFile);
        
        //this.postData(formData);
      };
      reader.readAsArrayBuffer(file);
    }*/

   private async uploadAll(webPath: string) 
   {
  
      const blob = await fetch(webPath).then(r => r.blob());
      
      
      const formData = new FormData();
      formData.append('file', blob, `filadama.jpeg`);

      console.log(formData.get('file'));

      //this.service.getEnroler(formData);
      this.photoFile=formData;
      
    }
    


    impression()
    {
    
      var indice=300;
      indice=1+indice;
      var id='000000'+Number(indice);
      this.calculerTaxes();

      let TIME_IN_MS = 5000;
      let hideFooterTimeout = setTimeout( () => {

        this.parserTaxes();
        this.parserEquipements();
 
        let dataprinter={
          nina:this.data_contact.nina,
          nif:this.data_identification.nif,
          nature:this.data_enroller.nature,
          type:this.data_enroller.activite,
          identifiant:id,
          taxes:this.taxesString,
          equipements:this.equipementsString,
        }
      let  navigationExtras = {
         queryParams: {
             currency: JSON.stringify(dataprinter),
         
               }
     };
     
          
         this.nactrl.navigateForward(['printerexample'], navigationExtras);

      }, TIME_IN_MS);

       
      
    }

    async supprimerEquipement(i)
    {
      let dataAlert=this.data_equipements[i].libl;
      const alert = await this.alertctrl.create({
        
        message: 'Voulez vous supprimer cet equipement: '+dataAlert+' ?',
        buttons: [
          {
            text: 'NON',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'OUI',
            handler: () => {
              if(this.data_equipements[i].eqpmid!=null && this.data_equipements[i].eqpmid >0)
              {
                this.listdeleteEquipements=this.data_equipements[i].eqpmid.toString()+this.delimiteurVirgule+this.listdeleteEquipements;
                if( this.data_taxes[i].txid!=null && this.data_taxes[i].txid>0 )
                {
                  this.listdeleteTaxes=this.data_taxes[i].txid.toString()+this.delimiteurVirgule+this.listdeleteTaxes;
                  this.data_taxes.splice(i,1);  
                }

              }
                    this.data_equipements.splice(i,1);
                    this.equipementsString='';
                    this.taxesString=''
                   
             
            }
          }
        ]
      });

      await alert.present();
      
    }


    async loadingCalculerTaxes()
    {
       this.loadingReturn=await this.loadingCtrl.create({
        message: 'Génération de taxes en cours'
      }); 

      return await this.loadingReturn.present();
    }

    async loadingEnrolement()
    {
      this.loadingReturn=await this.loadingCtrl.create({
        message: 'Génération de taxes en cours'
      }); 

      return await this.loadingReturn.present();

    }

    async loadingGeolocalisationFct()
    {
      this.loadGeolocalisationEnCours=true;
      this.loadingGeolocalisation= await this.loadingCtrl.create({
        message:'Géolocalisation en cours'
      });
    
      return await this.loadingGeolocalisation.present();
    }

    scanklpnump()
    {
      this.barcodeScanner.scan().then(data=>
        {
          if(data.text!=null)
          {
            this.data_contact.klpnum=data.text;
          }
        }).catch(
          data=>{
          alert("IMPOSSIBLE DE LIRE QRCODE");
        })
    }
  
    initialiserStrings()
    {
      this.equipementsString='';
      this.identificationString='';
      this.contactString='';
      this.localisationString='';
      this.paiementPrefereString='';
      this.activiteString='';
      this.taxesString='';
      this.data_localisation.secteur="";
    }

    initialiserElementUI()
    {
      let ininumber:number;
      this.listdeleteEquipements='';
      this.listdeleteTaxes='';
      this.dataEquipeDelete=''
      this.service.klpnum='';
      this.myPhoto='';
      //this.service.klpnum='';
      this.tappFirstTaxe=false;
      //Bandeau contact
      this.data_contact.lagitude=0;
      this.data_contact.longitude=0;
      this.data_contact.age='';
      this.data_contact.fonction='';
      this.data_contact.nina='';
      this.data_contact.telephone=ininumber;
      this.data_contact.nom='';
      this.data_contact.prenoms='';
      this.data_contact.adresse='';
      this.data_localisation.secteur="";
      this.data_contact.klpnum='';

      //Bandeau Identification

      this.data_identification.nif='';
      this.data_identification.raison_sociale='';
      this.data_identification.status='';

      //Bandeau Localisation

      this.data_localisation.secteur=this.service.secteurAgentDefault;

      //Bandeau Activite

      this.data_enroller.activite='';
      this.data_enroller.nature='';

    //Bandeau Equipement

    for (let index = 0; index <= this.data_equipements.length; index++) {
      this.data_equipements.splice(0);
        
    }

    //Bandeau Taxes

    for (let index = 0; index <= this.data_taxes.length; index++) {
      this.data_taxes.splice(0);
      
    }

    //Bandeau 

    this.data_enroller.banque_paiement='';
    this.data_enroller.ref_banque='';
    this.data_enroller.ref_paiement_mobile=ininumber;
    this.data_enroller.moyen_paiement='';
    this.generationTaxe=false;
 

    this.service.getCurrentPosition().then(data=>{
      this.data_contact.lagitude=this.service.latitude;
      this.data_contact.longitude=this.service.longitude;
      this.loadGeolocalisationEnCours=false;
     }).catch(data=>{

       alert("Veuillez activer votre géolocalisation!");
       
     });

    }

    async loadingEnrolementContrib()
    {
      this.customAlertReturn=await this.loadingCtrl.create({
        message: 'Enrolement en cours!!'
      });
      return await this.customAlertReturn.present();
    }

    researchBluetooth()
    {
      this.bluetoothSerial.discoverUnpaired().then((data)=>{
        this.nameBluetooth=data ;
        console.log(JSON.stringify(data));
         
          
        
      }).catch(data=>{
        alert("Erreur recherche bluetooth");
      })
    }

    connectBluetooth(i)
    {
      let dataconnect:any;
     // dataconnect=this.nameBluetooth[i];
      this.service.macAddress=this.nameBluetooth[i].address;
      console.log("adresse mac "+this.service.macAddress);
      this.service.storageNameBluetooth().then(data=>{
        this.service.connectBluetooth().catch(data=>{alert(JSON.stringify(data))})
      });

    
    }

    saveAddressBluetooth(data:string) {
      this.storage.setItem('bluetooth',data).then(data=>{
        alert(''+data);
      }).catch(error=>{
        alert('enregistrement erreur ');
      })

    }

  
  
  
   async getAddressBluetooth(data11:string) {
     return await this.storage.getItem('bluetooth').then(data=>{
        data11=JSON.stringify(data);
      }).catch(error=>{
        alert('Erreur mac bluetooth');
      });
    }


    initialiserTicket()
    {

      this.dataTicket.secteur=this.data_localisation.secteur;
      this.dataTicket.zone=this.data_localisation.zone;

      this.dataTicket.nom=this.data_contact.nom;
      this.dataTicket.prenom=this.data_contact.prenoms;

      this.dataTicket.nina=this.data_contact.nina;
      this.dataTicket.nif=this.data_identification.nif;

      this.dataTicket.typeActivite=this.data_enroller.activite;
      this.dataTicket.natureActivite=this.data_enroller.nature;

    }

    addTaxeimprim(data:any){

      for (let index = 0; index < data.length; index++) {
      
        let element1=new ImpTaxe();
        element1.nom= data[index].libl;
        element1.montant= data[index].montant;
        element1.freq=data[index].frequence;
        this.dataTicket.taxe.push(element1);
      }

  
    }

    addEquipement(data:any){

      for (let index = 0; index < data.length; index++) {
        let element2=new ImpEquipement();
        element2.nom=data[index].libl;
        element2.numMairie=data[index].numeroMairie;
        this.dataTicket.equipement.push(element2);
       
        
      }
     

    }

    parserDataTicket()
    {
            let dateimpr=new Date();
          this.entete=this.service.justify_size_middle+this.service.justify_bold+'**MAIRIE DU DISTRICT DE BAMAKO**\r' +this.justify_center+
            '---------------\r'+ 'DateHeure: '+ dateimpr.toUTCString()+'\r'
               +this.justify_center+'KLISPAY NTA-TECH\r' +this.justify_center+'Infos Contributeur\r'
            +this.justify_center +'---------------------'+this.retourLigne+this.espaceElementTickect ;

      this.corps=this.justify_left+'ZONE:'+this.dataTicket.zone+this.retourLigne+'SECTEUR: '+this.dataTicket.secteur+this.retourLigne+
      'NOM: '+this.dataTicket.nom.toLocaleUpperCase()+this.retourLigne+'PRENOM: '+this.dataTicket.prenom.toLocaleUpperCase()+this.retourLigne+
      'IDENTIFIANT:'+this.data_contact.klpnum+this.retourLigne+'NINA: '+this.dataTicket.nina+this.retourLigne+
      'NIF: '+this.dataTicket.nif+this.retourLigne+'TYPE ACTIVITE: '+this.dataTicket.typeActivite+this.retourLigne+'NATURE ACTIVITE '+
      this.dataTicket.natureActivite+this.retourLigne+this.espaceElementTickect;
      //Add Taxe
       for (let index = 0; index < this.dataTicket.taxe.length; index++) {
         this.corps=this.corps+this.retourLigne+'TAXE '+(index+1)+this.espace+this.dataTicket.taxe[index].nom+this.espace+
         this.dataTicket.taxe[index].montant+this.espace+this.dataTicket.taxe[index].freq;
         
       }
       this.corps=this.corps+this.espaceElementTickect;

       //Add Equipement

       for (let index = 0; index < this.dataTicket.equipement.length; index++) {
         
         this.corps=this.corps+this.retourLigne+'EQUIPEMENT '+(index+1)+this.espace+this.dataTicket.equipement[index].nom+
         this.espace+this.dataTicket.equipement[index].numMairie;
       }
       this.corps=this.corps+this.espaceElementTickect;
       

    }

    initialiserDataTicket(){
      this.corps='';
    }

    initialiserTaxeTicket()
    {
      for (let index = 0; index < this.dataTicket.taxe.length; index++) {
        this.dataTicket.taxe.splice(index,1);
        
      }
    }

    initialiserEquipementTicket()
    {
      for (let index = 0; index < this.dataTicket.equipement.length; index++) {
         this.dataTicket.equipement.splice(index,1);
        
      }
    }

printQrcode1()
{
 // let freee="adamadiarratest"
    const justify_center = '\x1B\x61\x01';
      const justify_left   = '\x1B\x61\x00';
      const qr_model       = '\x33';          // 31 or 32
      const qr_size        = '\x08';          // size
      const qr_eclevel     = '\x33';          // error correction level (30, 31, 32, 33 - higher)
      const qr_data        ='adamadiarraadamadiarraadamadiarraadamadiarraadamadiarraadamadiarra';
      const qr_pL          =String.fromCharCode((qr_data.length + 3) % 256);
      const qr_pH          =String.fromCharCode((qr_data.length + 3) / 256);
    this.bluetoothSerial.write(justify_center+justify_center +
      '\x1D\x28\x6B\x04\x00\x31\x41' + qr_model + '\x00' +        
      '\x1D\x28\x6B\x03\x00\x31\x43' + qr_size +                  
      '\x1D\x28\x6B\x03\x00\x31\x45' + qr_eclevel +               
      '\x1D\x28\x6B' + qr_pL + qr_pH + '\x31\x50\x30' + qr_data + 
      '\x1D\x28\x6B\x03\x00\x31\x51\x30' +                        
      '\n\n\n' +
      justify_left).then(data=>{
       
        //alert('qrcode '+JSON.stringify(data))
      }).catch(data1=>{
        alert('qrcode false '+JSON.stringify(data1))
      })

}

    printQrCode(data111:String) {
      
      //this.service.encrypteddata(this.data_contact.klpnum.toString()).then(
       // data=>{
         this.service.klpnum=this.data_contact.klpnum.toString();
          const justify_center = '\x1B\x61\x01';
          const justify_left   = '\x1B\x61\x00';
          const qr_model       = '\x33';          // 31 or 32
          const qr_size        = '\x08';          // size
          const qr_eclevel     = '\x33';          // error correction level (30, 31, 32, 33 - higher)
          const qr_data        = this.data_contact.klpnum;
          const qr_pL          =String.fromCharCode((qr_data.length + 3) % 256);
          const qr_pH          =String.fromCharCode((qr_data.length + 3) / 256);
        this.bluetoothSerial.write(justify_center+justify_center +
          '\x1D\x28\x6B\x04\x00\x31\x41' + qr_model + '\x00' +        
          '\x1D\x28\x6B\x03\x00\x31\x43' + qr_size +                  
          '\x1D\x28\x6B\x03\x00\x31\x45' + qr_eclevel +               
          '\x1D\x28\x6B' + qr_pL + qr_pH + '\x31\x50\x30' + qr_data + 
          '\x1D\x28\x6B\x03\x00\x31\x51\x30' +                        
          '\n\n\n' +
          justify_left).then(data=>{
            
            //alert('qrcode '+JSON.stringify(data))
          }).catch(data1=>{
            alert('qrcode false '+JSON.stringify(data1))
          })
     /*   }
      ).catch(data=>{
        alert("ERREUR CRYPTAGE");
      });*/
     
    
    }

    rechercherContribuable()
    {

    }
    
    async chercherContrib()
    {
      const alert = await this.alertctrl.create({
        
        header: 'information',
        message: 'Chercher un contribuable',
        inputs: [
          {
            name: 'klpnum',
            type: 'text',
            placeholder: 'Entrer le n° klispay'
          },
          {
            name: 'nina',
            type: 'text',
            placeholder: 'Entrer le n° NINA'
          },
          {
            name: 'orgnum',
            type: 'text',
            placeholder: 'Entrer le n° Equipement'
          },
          {
            name: 'klpnump',
            type: 'text',
            placeholder: 'Entrer le n° klispay Provisoire'
          }
        ],
        buttons: [
          {
            text: 'NON',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'CHERCHER',
            handler: (data) => {
              
              this.orgnum=data.orgnum;

              this.addDataContrib(data.klpnum,data.nina,data.orgnum,data.klpnump);
          
            }
          }
        ]
      });
    
      await alert.present();
    }

    getPicture()
    {
      this.http.get("http://5.196.34.217:8081/WebServiceKLP/getPicture?klpnum=ML4-M1SEG-3").toPromise().then(data=>
        {
          this.base64Data=data['datas'];
        }).catch(data=>{
          console.log(data)
        })
      this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
    }

    addDataContrib(klpnum:String, nina:String,orgnum:String,klpnump:String)
    {
      this.load.showloading("Recherche en cours!!!");
      console.log("test entrée ");
      this.genererTaxesStatus=true;
      this.generationTaxe=true;
      this.service.getContribByOrgnum(orgnum,nina,klpnum,klpnump).subscribe(data=>{
        this.dataEnrolementModify=data;
       
        //console.log(this.dataEnrolementModify["dataEnrolement"]);
        this.data_contact.nom=this.dataEnrolementModify.contact.nom;
        this.data_contact.prenoms=this.dataEnrolementModify.contact.prenoms;
        this.data_contact.age=this.dataEnrolementModify.contact.age;
        this.data_contact.fonction=this.dataEnrolementModify.contact.fonction;
        this.data_contact.nina=this.dataEnrolementModify.contact.nina;
        this.data_contact.telephone=Number(this.dataEnrolementModify.contact.telephonel);
        this.data_localisation.latitude=this.dataEnrolementModify.localisation.latitude;
        //this.data_localisation.longitude=this.dataEnrolementModify.localisation.longitude;
        //this.data_localisation.latitude=this.dataEnrolementModify.localisation.latitude;
        //this.data_localisation.secteur=this.dataEnrolementModify.localisation.secteur;
        
       // this.data_localisation.zone=this.dataEnrolementModify.localisation.zone;
      if(this.dataEnrolementModify.identification.nif!=null)
      {
        this.data_identification.nif=this.dataEnrolementModify.identification.nif;
      }
      this.data_identification.raison_sociale=this.dataEnrolementModify.identification.raisonSociale;
      this.data_identification.status=this.dataEnrolementModify.identification.personePhysiqueOuMorale;
      this.data_enroller.nature=this.dataEnrolementModify.activite.natureActivite;
      this.data_enroller.activite=this.dataEnrolementModify.activite.typeActivite;
      this.data_enroller.ref_paiement_mobile=Number(this.dataEnrolementModify.paiementPrefere.ref);
      this.data_enroller.moyen_paiement=this.dataEnrolementModify.paiementPrefere.moyen;

      if(this.dataEnrolementModify.equipements!=null)
      {
        
        this.dataEnrolementModify.equipements.forEach(element => {
          this.data_equipements.push(element);
        });
      }
      if(this.dataEnrolementModify.taxes!=null)
      {
        
        this.dataEnrolementModify.taxes.forEach(element => {
          this.data_taxes.push(element);
        });
      }
      /*console.log(this.data_equipements);
      console.log(this.data_taxes);
      console.log("test sortie ")*/
       // data_contact
      })
      
     this.load.loading.dismiss();
    }

    annulerContribuable()
    {
      this.initialiserStrings();
      this.initialiserElementUI();
    }
   

    imprimerContribuable()
    {
      
      //this.parserDataTicket();
      console.log('imprimer '+this.entete+this.corps+this.piedPage );
      if(this.corps!='')
      {
      this.bluetoothSerial.write(this.entete+this.corps+this.piedPage).then(data=>{
       
        this.printQrCode(this.service.klpnum);
      }).catch(error=>{
        alert('error '+JSON.stringify(error));
      })
    }
    else
    {
      alert("VEUILLEZ REESSAYER L\'ENROLEMENT");
    }
    }
initialiserDataEnrolement(agent11:string)
{
  this.dataEnrolement.contact=this.contactString;
  this.dataEnrolement.activite=this.activiteString;
  this.dataEnrolement.identification=this.identificationString;
  this.dataEnrolement.localisation=this.localisationString;
  this.dataEnrolement.taxes=this.taxesString;
  this.dataEnrolement.agent=agent11;
  this.dataEnrolement.paiementprefere=this.paiementPrefereString;
  //this.dataEnrolement.file=this.photoFile;

}

etape2Enrol()
{
  this.service.getKlpnum().then(data=>{
    //Tester le print
    this.etatEnrol=2;
   this.addEquipement(this.data_equipements);
   this.addTaxeimprim(this.data_taxes);
   this.parserDataTicket();
   this.bluetoothSerial.write(this.entete+this.corps+this.piedPage).then(data=>{
   this.printQrCode(this.service.klpnum);
   alert('ENROLEMENT EFFECTUE AVEC SUCCES.');
   }).catch(error=>{
      alert('ENROLEMENT EFFECTUE AVEC SUCCES.');
     //alert('error '+JSON.stringify(error));
   })


  
 
  this.initialiserStrings();
  this.initialiserElementUI();
  }).catch(error=>{
    alert('ECHEC DE RECUPERATION DE NUMERO KLISPAY.')
  })
}

    retournerContribuable()
    {
     this.router.navigate(['/intro']);
    }

    testprinter(){
      this.printQrCode("adamadiarraaquilasongoiba");
   /*
   //
      BTPrinter.printText(null,null, justify_center +
         '\x1D\x28\x6B\x04\x00\x31\x41' + qr_model + '\x00' +        // Select the model
         '\x1D\x28\x6B\x03\x00\x31\x43' + qr_size +                  // Size of the model
         '\x1D\x28\x6B\x03\x00\x31\x45' + qr_eclevel +               // Set n for error correction
         '\x1D\x28\x6B' + qr_pL + qr_pH + '\x31\x50\x30' + qr_data + // Store data
         '\x1D\x28\x6B\x03\x00\x31\x51\x30' +                        // Print
         '\n\n\n' +
         justify_left,'1','0');
      this.bluetoothSerial.write(data.buffer).then(data=>{
        
      }).catch(error=>{
        alert("Erreur printer");
      })
  
      */
    }

  async dismisLoadingEnrolemen()
{
  const alert = await this.alertctrl.create({
        
    message: 'Problème de l\'internet\n.Voulez vous reessayer? ',
    buttons: [
      {
        text: 'NON',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          //console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'REESSAYER',
        handler: () => {

          this.customtimeout();
        /*  if(this.etatEnrol==0)
          {
            this.enrollerContribuable()
          }
          else if(this.etatEnrol==1)
          {
            this.etape2Enrol();
          }*/

          
      
        }
      }
    ]
  });

  await alert.present();
}

customtimeout()
{
  let hideFooterTimeout = setTimeout( () => {
   
      if(this.customAlertReturn!=null)
      {
        this.customAlertReturn.dismiss();

      }

    }, 60000);
}


async alertPhoto()
{
  const alert = await this.alertctrl.create({
        
    message: 'VOULEZ VOUS PRENDRE LA PHOTO ? ',
    buttons: [
      {
        text: 'NON',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          this.myPhoto="AAAA";
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'OUI',
        handler: () => {

        }
      }
    ]
  });

  await alert.present();
}

     stringToBytes(string):ArrayBufferLike { 
      var array = new Uint8Array(string.length);

      for (var i = 0, l = string.length; i < l; i++) {
          array[i] = string.charCodeAt(i);
       }
       return array.buffer;
   }

  dismisloadingGenerationTaxe()
  {
    setTimeout(() => {
     if(this.loadingReturn!=null)
     {
        this.loadingReturn.dismiss();
     } 
    }, 10000);
  }
    
}
