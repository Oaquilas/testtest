import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertController, LoadingController, ToastController, ActionSheetController, ModalController } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { NavController } from '@ionic/angular';
import { environement } from '../models/environement';
import { DataPaymentModel } from '../models/payment/data-payment-model';
import { DataContribInfo } from '../models/infos/data-contrib-info';
import { EchTransFisc } from '../models/payment/ech-trans-fisc';
import { EchTransFiscD } from '../models/payment/ech-trans-fisc-d';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OrangeModalPage } from '../orange-modal/orange-modal.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import {ServiceKlispayService }from '../service-klispay.service';
import { EnrollementService }from '../service/enrollement/enrollement.service';
import { AgentmodalPage } from '../agentmodal/agentmodal.page';
import { ConfirmPaiement } from '../models/tem/confirm-paiement';
import { PaiementRetour } from '../models/tem/paiement-retour';
import { ConfirmpaiementRetour } from '../models/tem/confirmpaiement-retour';
import { OTP } from '../models/tem/otp';
import {DatePipe} from '@angular/common';
import { LoadingCustom } from '../customLoadinf/loading-custom';
import { CheckLoadingService } from '../check-loading.service';

// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';



@Component({
  selector: 'app-contribdetail',
  templateUrl: './contribdetail.page.html',
  styleUrls: ['./contribdetail.page.scss'],
})
export class ContribdetailPage implements OnInit, OnDestroy {
///////////////////////
total: number = 0;
solde: number = 0;
// myTot: number = 0;
// mySol: number = 0;
// reperEch: number = 0;
//////////////////////
// montant donnée par le contrib pour le paeiment
// mntApaye: number;

/////////////// stockage temporaire des tableau pour echéancfiscdetail et transechfiscdet
 // warD: any;
 // peaceD: any;
/////////////// stockage temporaire des tableau pour echéancfisc et transechfisc pour les repercutions
// warmnt: any = [];
// peacemnt: any = [];
/////////////// tockage temporaire des tableau pour echéancfisc detail et transechfisc detail pour les repercutions des details
// warmntD: any = [];
// peacemntD: any = [];
/////////////// ***** classes pour regrouper les tableaux echéancesfiscale et transaction fiscale ****/////////////////
// transactEch = new Array<EchTransFisc>();
// transactEchD = new Array<EchTransFiscD>();

// slide options
slideOpts = {
initialSlide: 1,
speed: 1000,
autoplay: {
  delay: 500,
}
};
// sanitize url
urlSafe: SafeResourceUrl;

//
transOrderId: string;
transAmount: number = 0;
transPayToken: string;
//
transactionId: string;
//
// btnTxn: boolean = true;
  btnMontant: boolean = false;
  btnPayer: boolean = true;
  btnImprimer: boolean = true;
  divOtp: boolean = false;
  btnMode: boolean = false;
 // btnNouveau: boolean = false;
//
idtxn: string;
//
hideMe = [];
//
transHideMe;
//
code: number;
// infos contrib avec nav params
contribParams: any;
//
contribPayment = new DataPaymentModel();
//
dataScan: any;

dateimpr = new Date();
/***************model de ticket de paeiment******************* */
mnt1: number;
nina: string = '';
btqnum: string ='';
provnum: string = '';
klpnum: string ='';

/*********************************************************** */

//////
mod1: any;
mod2: any;
mod3: any;
mod4: any;
mod5: any;
mod6: any;
mod7: any;
mod8: any;
/////
agentUsername: string;
agentZone: string;
agentSecteur: string
// loader time out vars
loadingGetTransactId: boolean = false;
loadingGetTransactIdProd: boolean = false;
loadingTemOtp : boolean = false;
loadingTemPaiement : boolean = false;
loadingloadContribData: boolean = false;
loadingSaveDatabase: boolean = false;

///////////////////////////////////////////////////////////////////
// TEM DOMAIN
temOtp = new OTP();
//
temOtpRetour = new PaiementRetour();
//
temConfirmPaiement = new ConfirmPaiement();
//
temConfirmPaiementRetour = new ConfirmpaiementRetour();
//
temOtpCode: string;
//
otpVal: string;
///////
idContrib: string = '';
klpnump: string = '';
numklp: string = '';
ctrid: number = 0 ;
//////////
customAlertReturn?:any;
//////////////
loader = new LoadingCustom();
///////////////
transition: any;
///////////////
retryCounterOrange: number = 0;
retryCounterDB: number = 0;
retryCounterTemOtp: number =0;
retryCounterTemConfirm: number = 0;
////////////////////////////////////////////////////////////////////
  constructor(private activedRoute: ActivatedRoute,
              private actionSheet: ActionSheetController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private navCtrl: NavController,
              private http: HttpClient,
              public  sanitizer: DomSanitizer,
              private modalController: ModalController,
              private route: ActivatedRoute,
              private router: Router,
              private barcodeScanner: BarcodeScanner,
              private service:ServiceKlispayService,
              private bluetoothSerial:BluetoothSerial,
              private serviceEnrollement: EnrollementService,
              private datePipe: DatePipe,
              private idservice: CheckLoadingService) {
//////////////////////////////////////// Chargement des données de la base ///////////////////////////////////////////////
          // chargement des informations dur l'agent
         this.loadDataAgent(this.serviceEnrollement.agentId).subscribe(  (data) =>{
          console.log(data['usrname']);
          this.agentUsername = data['usrname'];
              },
          error =>{
          console.log('infos agent non chargé',error)
          });
        //////////////////////////////

        // tester la durée du loading
        this.loadingloadContribData=true;
        setTimeout(() => {
        // console.log("10s........................................................");
          if(this.loadingloadContribData == true){
           this.loadingCtrl.dismiss();
            this.loadingloadContribData = false;
            // alert
            this.RetryLoadDataContrib();
          }
        }, 60000);
       
        this.retryCounterDB = 0;
        this.retryCounterOrange = 0;
        this.retryCounterTemOtp =0;
        this.retryCounterTemConfirm = 0;
      // recuperation d'un id en arrivant sur la page
          const id = this.activedRoute.snapshot.paramMap.get('id');
       /*
        //  this.idservice.previousId = id;
          if(+(id) == this.idservice.previousId){
              // loading Controller
              this.loadingCtrl.dismiss();
              console.log('cest le meme id vvvvvvvv', id +'******'+this.idservice.previousId);
          }else{
            // nothing
            console.log('c est pas le meme id  xxxxxxx', id +'******'+this.idservice.previousId);
            this.loadingCtrl.dismiss();
          }
       */
          // chargement des datas infos payment du contrib
          this.loadData(id).subscribe( async (data: DataPaymentModel) => {
        //// enlever le loading si on souscrit avant 15s
          this.loadingloadContribData = false;
   ////////////////////////// ***************   TOUT COMMENCE ICI *************** ///////////////////////
          /// the begin of all here
          this.contribPayment = data;
          this.contribPayment.transactModelPayment.transact.agentid=this.serviceEnrollement.agentId;
        ///////////////////////////////////////////////////
          this.agentZone = this.serviceEnrollement.zoneAgent;
          this.agentSecteur = this.serviceEnrollement.agentSecteurRequest;
          // this.contribPayment.transactModelPayment.transact.montant
          // console.log('bbbbbbbb',this.contribPayment.transactModelPayment.transact.montant);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
          if(data == null || undefined){
            this.presentAlert('Problème d identificiation des données du Paiement! Réessayez la recherche');
          }
          else if (data.situationFiscale.echfiscPaymentModels.length == 0 && data.transactModelPayment.transactEchFiscPaymentModelList.length == 0){
            //
            this.btnPayer = true;
            this.btnMontant = true;
            this.btnImprimer = true;
            this.divOtp =  true;
            this.btnMode = true;
            /////
            this.presentAlert('Ce contribuable a soldé toutes ses échéances!');
          }else {
            //  rien du tout
          }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
         // initialisation pour le radio button
         switch(this.contribPayment.transactModelPayment.transact.modpref){
          case 'ORANGE MONEY T':{
            this.mod1 = true;
            break;
          }
          case 'PAY EXPRESS':{
            this.mod2 = true;
            break;
          }
          case 'MOBICASH':{
            this.mod3 = true;
            break;
          }
          case 'WIZALL':{
            this.mod4 = true;
            break;
          }
          case 'UBA':{
            this.mod5 = true;
            break;
          }
          case 'TEM':{
            this.mod6 = true;
            break;
          }
          case 'DEFAUT':{
            this.mod7 = true;
            this.divOtp = true;
            this.btnPayer = false;
            break;
          }
          case 'ORANGE MONEY':{
            this.mod8 = true;
            break;
          }
        }
          console.log('contribuablePayment:', data);
          // initialisation de la var global total
          this.total = this.contribPayment.transactModelPayment.transact.montant;
          // initialisation de la var global du solde
          this.solde = this.total - this.contribPayment.transactModelPayment.transact.montant;
          this.contribPayment.transactModelPayment.transact.solde=this.solde;
          //  affichage du solde
          console.log('solde global ', this.solde, 'et total', this.total);
          // initialisation du tableau hideMe avec la longueur du tableau de transacEcheance
          this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList.forEach( () => {
             // initialisation du tableau hideMe avec la longueur du tableau de transacEcheance
          this.hideMe.push(this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList.length);
          });
      /////////////////////// Param depuis la page de recherche //////////////////////////////////////////////////////////////////

          this.route.queryParams.subscribe(params => {
          if (params && params.special) {
            this.contribParams = JSON.parse(params['special']);
            console.log('Contrib data with params', this.contribParams);
            this.klpnump = this.contribParams['klpnump'];
            this.numklp = this.contribParams['klpnum'];
            this.ctrid = this.contribParams['ctrid'];
            this.idContrib = this.numklp;
           // console.log('iiiiiiddddddd ccccoooonnntttrrriibbb',this.idContrib);
           // console.log(' id  klispay contrib numberrrrrrrrrrrrrrrrr', this.contribParams['klpnum']);
            // console.log('mmmmmmmmmmmdddddddddddrrrrrrr', this.contribParams['klpnump']+' / '+this.contribParams['klpnum']);
            // ticket generation function
            // this.paymentTicket();
            //
            // initialisation des contibuables qui n ont pas de numero de telephone
        //    if (this.contribParams.contact.telephonel == null || this.contribParams.contact.telephonel === undefined ) {
        //      this.contribParams.contact.telephonel = 'n° tel';
        //    }
          }
        });
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
               // toast message dismiss
                    // this.presentAlert('Chargement effectué avec succès');
                    // alert('Chargement effectué avec succès');
                     // this.presentToast('Chargement effectué avec succès', 'primary');
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// afficher l'identifiiant du contribuable en fonction de l'id captiver num provisoire ou num klispay
/*if(id.charAt(2) == 'x' || id.charAt(2) == 'X'){
  this.idContrib = this.contribParams['klpnump'];
}else{
  this.idContrib = this.contribParams['klpnum'];
} */
/////////////////////////////////////
// loading Controller
this.loadingCtrl.dismiss();
///////////////////////////////////////
this.customAlertReturn.dismiss();
/////////////////////////////////////////////



 },
 async error => {
  this.loadingCtrl.dismiss();
  console.log('erreur chargement du constructeur', error);
  if (error.status == 0) {
 // loading controller depart

              // alert('Echec du chargement serveur indisponible');
              this.presentAlert('Echec du chargement serveur indisponible');
             // this.presentToast('Echec du chargement serveur indisponible', 'danger');

  }
});
/////////////////////////////// in constructor ////////////////////////////////////
       //   this.sendContribPaymentToServer(this.contribPayment);


}

////////////////////////////////////////////////////////////////////////////////////
ngOnInit(): void {
  // console.log('je minlise');
  /*
  let id = this.activedRoute.snapshot.paramMap.get('id');
  if(+(id) == this.idservice.previousId){
    // loading Controller
    this.loadingCtrl.dismiss();
    console.log('cest le meme id vvvvvvvv', id +'******'+this.idservice.previousId);
}else{
  // nothing
  console.log('c est pas le meme id  xxxxxxx', id +'******'+this.idservice.previousId);
  this.loadingCtrl.dismiss();
}
  */
  //let id = this.activedRoute.snapshot.paramMap.get('id');
  //this.idservice.previousId = id;
  }
///////////////////////////////////////////////////////////////////////////
ngOnDestroy(): void {
  //Called once, before the instance is destroyed.
  // console.log('je me suis desabonner');
 // let id = this.activedRoute.snapshot.paramMap.get('id');
 // this.idservice.previousId = +(id);
 // console.log('previous id', this.idservice.previousId +'*********'+'current id'+(id));
  // this.contribPayment
}
 /////////////////////////////////////////////////////////////////////
   // prendre les données depuis la base de données
   loadData(id: string): Observable <DataPaymentModel> {
    // console.log('mon test ', id);
     ///////
     const url = `${environement.api_url_klpnum}contrid=${id}&klpnum=${''}&klpnump=${''}&nameSecteur=${this.serviceEnrollement.agentSecteurRequest}&numequip=${''}`;
     // console.log('mon url: ',url);
     return this.http.get <DataPaymentModel>(url);

   /* if(id.charAt(2) == 'x' || id.charAt(2) == 'X'){
       // chargement des information du paiement du contrib
    // console.log('numero provisoire.........');
     const url = `${environement.api_url_klpnum}${''}&klpnump=${id}&nameSecteur=${this.serviceEnrollement.agentSecteurRequest}&numequip=${''}`;
     // console.log('mon url: ',url);
     return this.http.get <DataPaymentModel>(url);
    }else{
      // console.log('autre numero ');
      this.idContrib = this.numklp;
     // chargement des information du paiement du contrib
     const url = `${environement.api_url_klpnum}${id}&klpnump=${''}&nameSecteur=${this.serviceEnrollement.agentSecteurRequest}&numequip=${''}`;
     return this.http.get <DataPaymentModel>(url);
    }  */
   }
 ///////////////////////////////////////////////////////////////////
 ////////////////////////////////////////////////////////////
async RetryLoadDataContrib() {
  let alert = await this.alertCtrl.create({
    header: 'Alerte',
    message: 'Problème de connexion! veuillez reprendre la recherche',
    buttons: [
      {
        text: 'OK',
        handler: data => {
          console.log('OK');
        }
      }
    ]
  });
  alert.present();
}
///////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
   // prendre les données depuis la base de données
   loadDataAgent(id: number) {
    // chargement des information du paiement du contrib
    const url = `${environement.api_url_agent}${id}`;
    return this.http.get(url);
  }
///////////////////////////////////////////////////////////////////

//////////////////////////////////////// All FunCtions ////////////////////////////
//////////////////////////////////
segmentChanged($event) {
  console.log('event : ', $event);
}

////////////////////////////////////////////////////////////////
getTransEchFisc(index: number): number {
  return this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList[index].transactEchFisc.montant;
}
///////////////////////////////////////////////////////////////
getTransactEchfiscDetail(j: number, i: number) : number{
  return this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList[i].
  transactEchFiscDPaymentModels[j].transactEchFiscD.montant;
}
////////////////////////////////////////////////////////////////
goTo($event) {
  console.log('recherche', $event);
}

///////////////////////////
async loadingEnrolementContrib()
{
  this.customAlertReturn=await this.loadingCtrl.create({
    message: 'Enrolement en cours!!'
  });
  return await this.customAlertReturn.present();
}
///////////////////////////////////////////////
//////////////////////////
scan() {
  this.dataScan = null;
  this.barcodeScanner.scan().then( async barcodeData => {
    console.log('Barcode data', barcodeData);
    if(barcodeData.text !== '') {
      //////////////////////////////////////
      /////// Afficher un loading Controller
      let loading =  await this.loadingCtrl.create({
            message: 'Patientez...',
        });
      await loading.present();
           /////////////////////
      //////////////////////////////////////
      let klpNum =barcodeData.text.split(',');
      this.dataScan = klpNum[0];
      ////////////////////////////////////// debut des differents test sur le resultat du scan
      // test si cest le numero klispay ou numero provisoire
       if(klpNum[0].charAt(2) == 'x' || klpNum[0].charAt(2) == 'X'){
        ////////////////////////// si c'est le numero klispay provisoire
        // changer le message du loading
        loading.message = 'recherche avec n°provisoire en cours...';
        ///// on charge les datas et on verifie
        this.loadDataSearch(this.nina, this.klpnum, this.btqnum, this.dataScan).subscribe( res => {
          console.log('verification de la liste');
          console.log('longueur', res.length);
          if (res.length == 0) {
          // loading controller dismiss
            loading.dismiss();
            console.log('n°provisoire non identifié!');
          //  this.presentToast('NINA non identifié!', 'warning');
            this.presentAlert('n°provisoire non identifié!');
          }else {
              // loading controller dismiss
           //  loading.dismiss();
             // go to the page
             this.showList(this.nina, this.klpnum, this.btqnum, klpNum[0]);
               // this.presentToast('ID identifié avec succès', 'dark');
           //  this.presentAlert('ID identifié avec succès');
          }
        }, err => {
         // loading controller dismiss
          loading.dismiss();
          console.log('erreur', err);
          if (err.status == 0) {
            console.log('Erreur Serveur!');
            this.presentAlert('Erreur Serveur!');
          }
        });
        /////////////////////////
       // this.showList(this.nina, this.klpnum, this.btqnum, klpNum[0]);
      }else if(klpNum[0] == '' || klpNum[0] == null){
        /////////////////////////////////
        loading.dismiss();
        console.log('QrCode ne contient pas de numero ni provisoire ni klispay identifié');
      //  this.presentToast('NINA non identifié!', 'warning');
        this.presentAlert('N° non identifié!');
      }
      else{
        // changer le message du loading
        loading.message = 'recherche avec n°KlisPay en cours...';
        ///// sinon si c'est le numéro klispay on refait le même test
        this.loadDataSearch(this.nina, klpNum[0].toUpperCase(), this.btqnum, this.provnum).subscribe( res => {
          console.log('verification de la liste');
          console.log('longueur', res.length);
          if (res.length == 0) {
         // loading controller dismiss
           loading.dismiss();
            console.log('n°klispay non identifié!');
          //  this.presentToast('NINA non identifié!', 'warning');
            this.presentAlert('n°KlisPay non identifié!');
          }else {
              // loading controller dismiss
           //  loading.dismiss();
             // go to the page
             this.showList(this.nina, klpNum[0].toUpperCase(), this.btqnum, this.provnum);
               // this.presentToast('ID identifié avec succès', 'dark');
           //  this.presentAlert('ID identifié avec succès');
          }
        }, err => {
          // loading controller dismiss
          loading.dismiss();
          console.log('erreur', err);
          if (err.status == 0) {
            console.log('Erreur Serveur!');
            this.presentAlert('Erreur Serveur!');
          }
        });
        // this.showList(this.nina, klpNum[0], this.btqnum, this.provnum);
      }
    }else {
     /// nothing
    }
  }).catch(err => {
    // loading controller dismiss
    this.loadingCtrl.dismiss();
    console.log('Error scan', err);
  });
}
////////////////////////////////////////////////////////////////
///////////////////////////////////////////////
//////////////// chercher un contrib avec son numKLP
/*
async chercherNumNina() {
  let alert = await this.alertCtrl.create({
    header: 'Recherche par Nina',
    inputs: [
      {
        type: 'text',
        name: 'numNina',
       // value: 'ML1-' + this.contrib.codeKlpnum +'-',
        placeholder: 'Entrer le Numero NINA'
      },
    ],
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
        handler: (data) => {
            console.log('Annuler');
        }
      },
      {
        text: 'Chercher',
        handler: (data) => {
          // valeur de l'input
          let num = data.numNina;
          if (num !== '') {
            // aler sur la page de search contrib
           //  this.showNina(num);
          } else {
            console.log('erreur de recherche ID manquant');
            this.presentToast('Erreur! veuiller donner un ID', 'danger', 1500);
          }
        }
      }
    ]
  });
  alert.present();
}
*/
///////////////////////////////////////////////////////////////////
        // details recherche sur un contrib
showList(nina: string, klpnum: string, btqnum: string , provnum: string) {

            let params = {
              nina: nina,
              klpnum: klpnum,
              btqnum: btqnum,
              provnum: provnum
            };
              //
            let navigationExtras: NavigationExtras = {
                queryParams: {
                  special: JSON.stringify(params)
                }
              };
            this.navCtrl.navigateRoot(['contribsearch'], navigationExtras);

         //  this.navCtrl.navigateForward('/contribsearch/', navigationExtras);
}
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
   // prendre les données depuis la base de données
   loadDataSearch(nina: string, klpnum: string, btqnum: string, provnum: string): Observable <DataContribInfo[]> {
    const url = `${environement.api_url_nina}klpnum=${klpnum}&klpnump=${provnum}&orgnum=${btqnum}&piecenumero=${nina}&secteur=${this.serviceEnrollement.agentSecteurRequest}`;
    console.log('alhamdolilaaaahhh', url)
    return this.http.get <DataContribInfo[]>(url);
  }
//////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
/*
async chercherNumKlp() {
  let alert = await this.alertCtrl.create({
    header: 'Recherche par n° klispay',
    inputs: [
      {
        type: 'text',
        name: 'numKlp',
       // value: 'ML1-' + this.contrib.codeKlpnum +'-',
        placeholder: 'Saisir le n° klispay'
      },
    ],
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
        handler: (data) => {
            console.log('Annuler');
        }
      },
      {
        text: 'Chercher',
        handler: (data) => {
          // valeur de l'input
          let num = data.numKlp;
          const url = `${environement.api_url_klpnum}${num}`;
          // si l'entrer de l'input n'est pas vide
          if (num !== '') {
            return this.http.get <DataPaymentModel>(url).subscribe(
              async (dat: DataPaymentModel) => {
              console.log('result', dat);
                // Affichier un loading Controller
              let loading =  await this.loadingCtrl.create({
                  message: 'Recherche...',
                });
              await loading.present();
              // go to the page
              this.navCtrl.navigateForward('/contribdetail/' + num);

              /*
                  // si klpnum est null c'est a dire pas l'id n'est pas correct
              if (dat.klpnum == null) {
                   console.log('valeur de klpnum', dat.klpnum);
                   this.presentToast('Erreur! ID non valid ou Introuvable', 'danger', 1500);
                 } else {
                    // initialisation des contibuables qui n ont pas de numero de telephone
              if (dat.contact.telephonel == null || dat.contact.telephonel === undefined ) {
                       dat.contact.telephonel = 'n° tel';
                    }
               //

               // loading controller dismiss
              setTimeout(() => {
                loading.dismiss();
                this.presentToast('ID identifié avec succès', 'dark', 1500);
              }, 1000);
            });
          } else {
            console.log('erreur de recherche ID manquant');
            this.presentToast('Erreur! veuiller donner un ID', 'danger', 1500);
          }
        }
      }
    ]
  });
  alert.present();
}
*/
////////////////////////////////////////////////////////////
async RetryGetTransactId() {
  let alert = await this.alertCtrl.create({
    header: 'Alerte',
    message: 'Problème de connexion! veuillez réessayer',
    buttons: [
      {
        text: 'Abandonner',
        handler: data => {
          console.log('Abondonner');
        }
      },
      {
        text: 'Réessayer',
        handler: (data) => {
          // reesayer
          this.getTransactionIdTest();
        }
      }
    ]
  });
  alert.present();
}
//////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
async RetryGetTransactIdProd() {
  let alert = await this.alertCtrl.create({
    header: 'Alerte',
    message: 'Problème de connexion! veuillez réessayer',
    buttons: [
      {
        text: 'Réessayer',
        handler: (data) => {
          this.retryCounterOrange += 1;
          // reesayer
          this.getTransactionIdProd();
        }
      }
    ]
  });
  alert.present();
}
//////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
async RetryGetTransactIdProdfinal() {
  let alert = await this.alertCtrl.create({
    header: 'Alerte',
    message: 'Problème de connexion! veuillez réessayer',
    buttons: [
      {
        text: 'Abandonner',
        handler: data => {
          console.log('Abondonner');
        }
      },
      {
        text: 'Réessayer',
        handler: (data) => {
          // reesayer
          this.getTransactionIdProd();
        }
      }
    ]
  });
  alert.present();
}
//////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
async RetryTemOtpRequest() {
  let alert = await this.alertCtrl.create({
    header: 'Alerte',
    message: 'Problème de connexion! veuillez réessayer',
    buttons: [
      {
        text: 'Réessayer',
        handler: (data) => {
          this.retryCounterTemOtp += 1; 
          // reesayer
          this.temOtpRequest();
        }
      }
    ]
  });
  alert.present();
}
//////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
async RetryTemOtpRequestFinal() {
  let alert = await this.alertCtrl.create({
    header: 'Alerte',
    message: 'Problème de connexion! veuillez réessayer',
    buttons: [
      {
        text: 'Abandonner',
        handler: data => {
          console.log('Abondonner');
        }
      },
      {
        text: 'Réessayer',
        handler: (data) => {
          // reesayer
          this.temOtpRequest();
        }
      }
    ]
  });
  alert.present();
}
//////////////////////////////////////////////////////////////////
  async RetrySaveDatabase(){
  let alert = await this.alertCtrl.create({
    header: 'Alerte',
    message: 'Problème de connexion! veuillez réessayer',
    buttons: [
      {
        text: 'Réessayer',
        handler: (data) => {
          this.retryCounterDB += 1;
          // reesayer
          this.sendContribPaymentToServer(this.contribPayment);
        }
      }
    ]
  });
  alert.present();
}
////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
async RetrySaveDatabaseFinal(){
  let alert = await this.alertCtrl.create({
    header: 'Alerte',
    message: 'Problème de connexion! veuillez réessayer',
    buttons: [
      {
        text: 'Abandonner',
        handler: data => {
          console.log('Abondonner');
        }
      },
      {
        text: 'Réessayer',
        handler: (data) => {
          // reesayer
          this.sendContribPaymentToServer(this.contribPayment);
        }
      }
    ]
  });
  alert.present();
}
////////////////////////////////////////////////////////////
async RetryTemConfirmPaiement() {
  let alert = await this.alertCtrl.create({
    header: 'Alerte',
    message: 'Problème de connexion! veuillez réessayer',
    buttons: [
      {
        text: 'Réessayer',
        handler: (data) => {
          this.retryCounterTemConfirm += 1;
          // reesayer
          this.temPaiementConfirm();
        }
      }
    ]
  });
  alert.present();
}
//////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
async RetryTemConfirmPaiementFinal() {
  let alert = await this.alertCtrl.create({
    header: 'Alerte',
    message: 'Problème de connexion! veuillez réessayer',
    buttons: [
      {
        text: 'Abandonner',
        handler: data => {
          console.log('Abondonner');
        }
      },
      {
        text: 'Réessayer',
        handler: (data) => {
          // reesayer
          this.temPaiementConfirm();
        }
      }
    ]
  });
  alert.present();
}
//////////////////////////////////////////////////////////////////

/////////////////////////////// Modifier un numero de téléphone pour le paiement du contrib  ///////////////////////////////////
async modifierNumTel() {
  let alert = await this.alertCtrl.create({
    header: 'Modifier le Numéro',
    inputs: [
      {
        type: 'number',
        name: 'numtel',
        placeholder: 'saisir le n° tel',
      },
    ],
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
        handler: data => {
          console.log('Annuler');
        }
      },
      {
        text: 'Appliquer',
        handler: (data) => {
          let tel = data.numtel ;
          console.log('phone number', data.numtel );
          if (tel !== '') {
            this.contribPayment.transactModelPayment.transact.modpay = data.numtel;
            console.log('Numero contrib changé');
            // this.presentToast('Numero tel du contribuable a changé', 'warning');
           // this.presentAlert('Numero tel du contribuable a changé');
         } else {
          console.log('Entrer un numero');
         // this.presentToast('Entrer un numero', 'danger');
         this.presentAlert('Entrer un numero');
         }
        }
      }
    ]
  });   
  alert.present();
}
//////////////////////////////////////////////////////////////////
async modifierMontant() {

  let alert = await this.alertCtrl.create({
    header: 'Modifier le Montant',
    inputs: [
      {
        type: 'number',
        name: 'mnt',
        placeholder: 'Saisissez le montant',
      },
    ],
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
        handler: data => {
          console.log('Annuler');
        }
      },
      {
        text: 'Appliquer',
        handler: async (data) => {
          //let mnt = data.mnt ;
         // console.log('montant', mnt);
          if (data.mnt !== '') {
            // Affichier un loading Controller
            let loading =  await this.loadingCtrl.create({
             message: 'CHARGEMENT...',
        });
            await loading.present();
 //////////////////////////// ***************************/////////////////////////////////////////
            this.contribPayment.transactModelPayment.transact.montant = data.mnt;
            this.solde = this.total - this.contribPayment.transactModelPayment.transact.montant;
            this.contribPayment.transactModelPayment.transact.solde=this.solde;
            this.repartitionTransact(this.contribPayment.transactModelPayment.transact.montant);
            this.repartitionTransactDetail();
            // this.paymentTicket();
 ////////////////////////////////////////////////////////////////////////////////////////////////
               loading.dismiss();
                // affichage d'un toast message
              // this.presentToast('Montant modifié et répercuté avec Succès', 'warning');
            //  this.presentAlert('Montant modifié et répercuté avec Succès');
        /////////////////////////////// end if //////////////////////////
         } else {
           // sinon dans le cas inverse.
          console.log('Veuillez indiquer un montant valide!');
         // this.presentToast('Veuillez indiquer un montant valide', 'danger');
         this.presentAlert('Veuillez indiquer un montant valide');
         }
        }
      }
    ]
  });
  alert.present();
}
/////////////////////////////////////////////////////////////
async modifierIdContrib() {
  let alert = await this.alertCtrl.create({
    header: 'Modifier ID',
    inputs: [
      {
        type: 'text',
        name: 'idContrib',
        placeholder: 'saisissez le nouveau ID',
      },
    ],
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
        handler: data => {
          console.log('Annuler');
        }
      },
      {
        text: 'Appliquer',
        handler: (data) => {
          const idcontrib = data.idContrib ;
          console.log('id Contribuable', idcontrib );
          if (idcontrib !== '') {
          //  this.contribParams.klpnum = idcontrib;
            console.log('ID contribuable Modifié');
          //  this.presentToast('ID contribuable modifié', 'warning');
          //  this.presentAlert('ID contribuable modifié');
         } else {
          console.log('Entrer un ID valide');
       //   this.presentToast('Entrer un ID valide', 'danger');
          this.presentAlert('Entrer un ID valide');
         }
        }
      }
    ]
  });
  alert.present();
}

//////////////////////////////////////////////////////////////
// toast controller
async presentToast(message: string, color: string) {
  const toast = await this.toastCtrl.create({
    message: message,
    color: color,
    position: 'top',
    buttons: [
       {
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('fermeture');
       }
      }
    ]
 });
  toast.present();
 }
 ///////////////////////////////////////////////////////////////////////////////
 async presentAlert(msg: string) {
  const alert = await this.alertCtrl.create({
    cssClass: 'my-alert-class',
    header: 'Alert',
    message: msg,
    buttons: ['OK']
  });
  await alert.present();
}
 //////////////////////////////////////////////////////////////////////////////

 async orangeMoneyPostTest(): Promise<void> {

   // Affichier un loading Controller
   let loading =   await this.loadingCtrl.create({
     message: 'En Cours...',
   });
   loading.present();

  // statically append
   const headers = new HttpHeaders({
    'Authorization': 'Bearer tr4k7mur8pJnwrgb09CkV0YBsMdk',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  // dynamic append
  // headers.append('Accept', 'application/json');
 // headers.append('Content-Type', 'application/json' );

 // mise à jour de l entete headers en cas de changement du token.
 // const headers = new HttpHeaders().set('Authorization', 'Bearer my-token')
 // Date.now();

  // let order_id = this.contribPayment?.transactModelPayment?.transact.klptransid;
  // let amount = this.contribPayment.transactModelPayment.transact.montant;
   let postData = {
    'merchant_key': '8a588f7e',
    'currency': 'OUV',
    'order_id': this.contribPayment?.transactModelPayment?.transact.klptransid,
    'amount': this.contribPayment.transactModelPayment.transact.montant,
    'return_url': 'http://myvirtualshop.webnode.es',
    'cancel_url': 'http://myvirtualshop.webnode.es/txncncld/',
    'notif_url': 'http://www.merchant-example2.org/notif',
    'lang': 'fr',
    'reference': 'KLISPAY'
  };

   this.http.post<any>('https://api.orange.com/orange-money-webpay/dev/v1/webpayment', postData, { headers })
    .subscribe(async (data) => {
      //
     //  this.btnTxn = false;
      // this.btnPayer = true;
     //  this.btnImprimer = false;
     //  this.btnNouveau = true;
     // window.open(data.payment_url);

       this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(data.payment_url);
      // let pay_token = data.pay_token;
       //
       this.openModalOrangeTest();
      //
       this.transPayToken = data.pay_token;
       this.transAmount = this.contribPayment.transactModelPayment.transact.montant;
       this.transOrderId = this.contribPayment?.transactModelPayment?.transact.klptransid;
       //
       this.getTransactInfoTest(this.contribPayment?.transactModelPayment?.transact.klptransid,
                            this.contribPayment.transactModelPayment.transact.montant, data.pay_token );

       // toast message

               loading.dismiss();
            //   this.presentToast('Continuez le Paiement en glissant vers le haut', 'dark');
           //    this.presentAlert('Continuez le Paiement en glissant vers le haut');

     },
     async error => {
       // toast message
      setTimeout(() => {
        loading.dismiss();
        console.log('type error', error.error);
        if (error.error.code === 1204) {
        //  this.presentToast('Alerte! Ce ID existe déja ', 'warning');
          this.presentAlert('Alerte! Ce ID existe déja ');
        } else if (error.status == 0) {
        //  this.presentToast('Erreur! serveur Indisponible', 'danger');
          this.presentAlert('Erreur! serveur Indisponible');
        }
        console.log('Error', error);
     }, 1000);

    });
}

////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

async orangeMoneyPostProd(): Promise<void> {

  // Affichier un loading Controller
  let loading =   await this.loadingCtrl.create({
    message: 'En Cours...',
  });
  loading.present();

 // statically append
  const headers = new HttpHeaders({
   'Authorization': 'Bearer XkeLeNazGnZT2RXY7iNxWOpNqaX7',  // changer ici
   'Content-Type': 'application/json',
   'Accept': 'application/json',
 });

 // dynamic append
 // headers.append('Accept', 'application/json');
// headers.append('Content-Type', 'application/json' );

// mise à jour de l entete headers en cas de changement du token.
// const headers = new HttpHeaders().set('Authorization', 'Bearer my-token')
// Date.now();

 // let order_id = this.contribPayment?.transactModelPayment?.transact.klptransid;
 // let amount = this.contribPayment.transactModelPayment.transact.montant;
  let postData = {
   'merchant_key': 'eb9fb187',
   'currency': 'XOF',     // changer ici
   'order_id': this.contribPayment?.transactModelPayment?.transact.klptransid,
   'amount': this.contribPayment.transactModelPayment.transact.montant,
   'return_url': 'http://myvirtualshop.webnode.es',
   'cancel_url': 'http://myvirtualshop.webnode.es/txncncld/',
   'notif_url': 'http://www.merchant-example2.org/notif',
   'lang': 'fr',
   'reference': 'KLISPAY'
 };

  this.http.post<any>('https://api.orange.com/orange-money-webpay/ml/v1/webpayment', postData, { headers })
   .subscribe(async (data) => {
     //
    // window.open(data.payment_url);

      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(data.payment_url);
     // let pay_token = data.pay_token;
      //
      this.openModalOrangeProd();
     //
      this.transPayToken = data.pay_token;
      this.transAmount = this.contribPayment.transactModelPayment.transact.montant;
      this.transOrderId = this.contribPayment?.transactModelPayment?.transact.klptransid;
      //
      this.getTransactInfoProd(this.contribPayment?.transactModelPayment?.transact.klptransid,
                           this.contribPayment.transactModelPayment.transact.montant, data.pay_token );

      // toast message

              loading.dismiss();
            //  this.presentToast('Continuez le Paiement en glissant vers le haut', 'dark');
         //   this.presentAlert('Continuez le Paiement en glissant vers le haut');

    },
    async error => {
      // toast message
       loading.dismiss();
       console.log('type error', error.error);
       if (error.error.code === 1204) {
        // this.presentToast('Alerte! Ce ID existe déja ', 'warning');
         this.presentAlert('Alerte! Ce ID existe déja');
       } else if (error.status == 0) {
      //   this.presentToast('Erreur! serveur Indisponible', 'danger');
         this.presentAlert('Erreur! serveur Indisponible');
       }
       console.log('Error', error);
   });
}
////////////////////////////////////////////////////////////////////

 getTransactInfoTest(orderid: string, amount: number, paytoken: string) {
  // statically append
  const headers = new HttpHeaders({
    'Authorization': 'Bearer tr4k7mur8pJnwrgb09CkV0YBsMdk',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  let postParam = {
      'order_id': orderid,
      'amount': amount,
      'pay_token': paytoken
  };

  this.http.post<any>('https://api.orange.com/orange-money-webpay/dev/v1/transactionstatus', postParam, { headers })
    .subscribe(data => {
      console.log('Infos transaction', data);
     },
     error => {
      console.log('Error Infos Transaction', error);
    });
}

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

getTransactInfoProd(orderid: string, amount: number, paytoken: string) {
  // statically append
  const headers = new HttpHeaders({
    'Authorization': 'Bearer XkeLeNazGnZT2RXY7iNxWOpNqaX7', // changer ici
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });
  let postParam = {
      'order_id': orderid,
      'amount': amount,
      'pay_token': paytoken
  };

  this.http.post<any>('https://api.orange.com/orange-money-webpay/ml/v1/transactionstatus', postParam, { headers })
    .subscribe(data => {
      console.log('Infos transaction', data);
     },
     error => {
      console.log('Error Infos Transaction', error);
    });
}

////////////////////////////////////////////////////////////////////////////
async getTransactionIdTest() {
    // Affichier un loading Controller
  let loading =  await this.loadingCtrl.create({
        message: 'Patientez...',
        });
  await loading.present();

  const headers = new HttpHeaders({
    'Authorization': 'Bearer tr4k7mur8pJnwrgb09CkV0YBsMdk',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  let postParam = {
      'order_id': this.transOrderId,
      'amount': this.transAmount,
      'pay_token': this.transPayToken
  };
  // loading ctrl 
  this.loadingGetTransactId=true;
  setTimeout(() => {
   // console.log("15s.......................................");
    if(this.loadingGetTransactId == true){
      loading.dismiss();
      this.loadingGetTransactId = false;
      // alert
      this.RetryGetTransactId();
    }
  }, 60000);
  this.http.post<any>('https://api.orange.com/orange-money-webpay/dev/v1/transactionstatus', postParam, { headers })
    .subscribe(async data => {
      console.log('Infos sur la transaction', data);
    //  loading.dismiss();
      //
      loading.dismiss();
      this.loadingGetTransactId = false;
      if (data.txnid == '') {
        // alert saisi id transaction
        // this.setTxnId();
        // toast message
          //  this.presentToast('Etat de la transaction: ' + data.status, 'warning');
        /////  checker l 'etat de la transaction
          //    this.presentAlert('Etat de la transaction: ' + data.status);
      }
      // sinon reception transaction id
      else {
      //
      this.btnPayer = true;
      this.btnMontant = true;
      this.btnImprimer = false;
      // this.btnNouveau = false;
      //
      this.contribPayment.transactModelPayment.transact.modptransid = data.txnid;
      //
      this.transactionId = data.txnid;
      //
     // this.contribPayment.transactModelPayment.transact.solde = this.solde;
      ////
       console.log(this.contribPayment);
       // impression ticket
     // this.impression();
      // enregistrement dans la base du model payment
      this.sendContribPaymentToServer(this.contribPayment);
      // toast message
     // this.presentToast('Etat de la transaction: ' + data.status, 'success');
     //this.presentAlert('Etat de la transaction: ' + data.status);

     /* setTimeout(() => {
        loading.dismiss();
      }, 1000);*/
      }
     },
     error => {
       console.log("Test conso...............");
       this.presentAlert(JSON.stringify(error));
      // toast message
     /* setTimeout(() => {
        loading.dismiss();
        console.log('Error sur la  Transaction', error);
      }, 1000); */
    });
}
////////////////////////////////////////////////////////////////////////////
async getTransactionIdProd() {
  // Affichier un loading Controller
let loading =  await this.loadingCtrl.create({
      message: 'Patientez...',
      });
await loading.present();

const headers = new HttpHeaders({
  'Authorization': 'Bearer XkeLeNazGnZT2RXY7iNxWOpNqaX7',  // changer ici
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

let postParam = {
    'order_id': this.transOrderId,
    'amount': this.transAmount,
    'pay_token': this.transPayToken
};
// loading ctrl 
this.loadingGetTransactIdProd=true;
setTimeout(() => {
 // console.log("10s........................................................");
  if(this.loadingGetTransactIdProd == true){
    loading.dismiss();
    this.loadingGetTransactIdProd = false;
    ////////////////////
    if(this.retryCounterOrange >= 3){
      this.RetryGetTransactIdProdfinal();
      // this.retryCounterOrange = 0;
    }else{
       // alert
    this.RetryGetTransactIdProd();
    }

  }
}, 60000);

this.http.post<any>('https://api.orange.com/orange-money-webpay/ml/v1/transactionstatus', postParam, { headers })
  .subscribe(async data => {
    //
    this.loadingGetTransactIdProd = false;
    this.retryCounterOrange = 0;
    //
    console.log('Infos sur la transaction', data);
    //
    if (data.txnid == '') {
      // alert saisi id transaction
      // this.setTxnId();
      // toast message

        //  this.presentToast('Etat de la transaction: ' + data.status, 'warning');
        // checker l'etat de la trasantion
        //  this.presentAlert('Etat de la transaction: ' + data.status);
    }
    // sinon reception transaction id
    else {
    //
    this.btnPayer = true;
    this.btnMontant = true;
    this.btnImprimer = false;
    // this.btnNouveau = false;
    //
    this.contribPayment.transactModelPayment.transact.modptransid = data.txnid;
    //
    this.transactionId = data.txnid;
    // this.contribPayment.transactModelPayment.transact.solde = this.solde;
      ////
    // console.log(this.contribPayment);
    // enregistrement dans la base du model payment
    this.sendContribPaymentToServer(this.contribPayment);
    // toast message
    // this.presentToast('Etat de la transaction: ' + data.status, 'success');
   // this.presentAlert('Etat de la transaction: ' + data.status);
 /*   setTimeout(() => {
      loading.dismiss();
    }, 1000); */
    }
   },
   error => {
    // toast message
      console.log('Error sur la  Transaction', error);
      this.presentAlert(JSON.stringify(error));
  });
}
/////////////////////////////////////////////////////////////////
goToContrib() {
   this.navCtrl.navigateRoot('home');
}
/////////////////////////////////////////////////////////////////
async alertRecherche() {
  let alert = await this.alertCtrl.create({
    header: 'Alerte',
    subHeader: 'Voulez vous quitter cette page?',
    message: 'Les modifications y apportées seront perdues !',
    buttons: [
      {
        text: 'Non',
        role: 'cancel',
        handler: data => {
          console.log('Annuler');
        }
      },
      {
        text: 'Oui',
        handler: (data) => {
          this.goToContrib();
          console.log('navigation vers la page nouveau');
          //
         // this.ngOnDestroy();
        }
      }
    ]
  });
  alert.present();
}
/////////////////////////////////////////////////////////////
/*
async setTxnId() {
  let alert = await this.alertCtrl.create({
    header: 'Entrez Id de la transaction',
    inputs: [
      {
        type: 'text',
        name: 'txnid',
        placeholder: 'saisissez l ID',
      },
    ],
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
        handler: data => {
          console.log('Annuler');
        }
      },
      {
        text: 'Appliquer',
        handler: (data) => {

          this.transactionId = data.txnid;
          console.log('id de la transaction', data.txnid );
          if (data.txnid !== '') {
               // dismiss page de paiement orange
          this.urlSafe = null;
          //
        //  this.btnTxn = true;
        //  this.btnPayer = true;
        //  this.btnImprimer = true;
        //  this.btnNouveau = false;

        //  this.presentToast('ID de la Transaction', 'warning');
          this.presentAlert('ID de la Transaction');
         } else {
          console.log('Entrer un ID valide');
         // this.presentToast('Entrer un ID valide', 'danger');
          this.presentAlert('Entrer un ID valide');
         }
        }
      }
    ]
  });
  alert.present();
}  */

/////////// page de paiement Orange Money test via Modal KLP ////////////
async openModalOrangeTest() {
  const modal = await this.modalController.create({
    component: OrangeModalPage,
    componentProps: {
      urlSafe: this.urlSafe
    }
   // cssClass: 'my-orange-modal-css'
  });
  modal.onWillDismiss().then( async dataRetour => {

    // trigger when about to close the modal
  this.code = dataRetour.data;
    // getting transaction ID
   this.getTransactionIdTest();

    // envoi des données payment models au serveur.
  // this.sendContribPaymentToServer(this.contribPayment);
    //
  });
  return await modal.present().then(_ => {
    // triggered when opening the modal
   // console.log('data Sending: ', this.code);
  });
}
/////////////////////////////////////////////////////////////////////////
/////////// page de paiement Orange Money production via Modal KLP ////////////
async openModalOrangeProd() {
  const modal = await this.modalController.create({
    component: OrangeModalPage,
    componentProps: {
      urlSafe: this.urlSafe
    }
   // cssClass: 'my-orange-modal-css'
  });
  modal.onWillDismiss().then( async dataRetour => {
    // trigger when about to close the modal
  this.code = dataRetour.data;
    // getting  prduction transaction ID
   this.getTransactionIdProd();
    // envoi des données payment models au serveur.
  // this.sendContribPaymentToServer(this.contribPayment);
  });
  return await modal.present().then(_ => {
    // triggered when opening the modal
    // console.log('data Sending: ', this.code);
  });
}
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
async recherche() {
  let alert = await this.alertCtrl.create({
    header: 'INFOS',
    message: 'Chercher un contribuable',
    inputs: [
      {
        name: 'klpnum',
        type: 'text',
        id: 'klpnum1',
        value: '',
        placeholder: 'Entrer le n° klis Pay'
      },
      {
        name: 'nina',
        type: 'text',
        id: 'nina1',
        value: '',
        placeholder: 'Entrer le n° NINA'
      },
      {
        name: 'btqnum',
        type: 'text',
        id: 'nbtq',
        value: '',
        placeholder: 'Entrer le n° Equipement'
      },
      {
        name: 'provnum',
        type: 'text',
        id: 'nprov',
        value: '',
        placeholder: 'Entrer le n° Provisoire'
      }
    ],
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
        handler: () => {
          console.log('Annulation');
        }
      },
      {
        text: 'OK',
        handler: async (data) => {
          console.log('val nina', data.nina);
          console.log('val klpnum', data.klpnum);
          console.log('val btqnum', data.btqnum);
          console.log('val provnum', data.provnum);
          // let nina = data.nina;

          //////////////////////// test different cas /////////////////////
          //// les 2 champs sont vides
          if (data.nina == '' && data.klpnum == '' && data.btqnum == '' && data.provnum == '') {
            //
            console.log('les 4 champs sont vide veuillez renseigner au moins un champs');
            //
          //  this.presentToast('Veuillez renseigner au moins un champs!!', 'danger');
            this.presentAlert('Veuillez renseigner au moins un champs!!');
          } ///// champs nina non vide et champs klispay vide /////////////////////////
          else if (data.nina !== '' && data.klpnum == '' && data.btqnum == '' && data.provnum == '') {
            console.log('appel Api recherche nina ');
           //
            // Affichier un loading Controller
            this.loader.showloading('Recherche avec n°Nina en cours...')
              this.loadDataSearch(data.nina.toUpperCase(), data.klpnum.toUpperCase(), data.btqnum.toUpperCase(), data.provnum.toUpperCase()).subscribe( res => {
                console.log('verification de la liste');
                console.log('longueur', res.length);
                if (res.length == 0) {
                  // loading controller dismiss
                  this.loader.loading.dismiss();
                  console.log('NINA non identifié!');
                //  this.presentToast('NINA non identifié!', 'warning');
                  this.presentAlert('NINA non identifié!');
                }else {
                    // loading controller dismiss
                  // loading.dismiss();
                   // go to the page
                   this.showList(data.nina.toUpperCase(), data.klpnum.toUpperCase(), data.btqnum.toUpperCase(), data.provnum.toUpperCase());
                  // this.presentToast('ID identifié avec succès', 'dark');
                //   this.presentAlert('ID identifié avec succès');
                }
              }, err => {
                console.log('erreur', err);
                if (err.status == 0) {
                      // loading controller dismiss
                  this.loader.loading.dismiss();
                  console.log('Erreur Serveur!');
                  this.presentAlert('Erreur Serveur !');
                }
              });
          }
          ////////////////// champs nina vide et champs non klispay vide   /////////////////////////
          else if (data.nina == '' && data.klpnum !== '' && data.btqnum == '' && data.provnum == '') {
            console.log('appel Api recherche klpnum ');
            //
           // Affichier un loading Controller
            this.loader.showloading('Recherche avec n°klispay en cours...');
            this.loadDataSearch(data.nina.toUpperCase(), data.klpnum.toUpperCase(), data.btqnum.toUpperCase(), data.provnum.toUpperCase()).subscribe( res => {
              console.log('verification de la liste');
              console.log('longueur', res.length);
              if (res.length == 0) {
                // loading controller dismiss
                this.loader.loading.dismiss();
                console.log('n°klisPay non identifié!');
              //  this.presentToast('NINA non identifié!', 'warning');
                this.presentAlert('n°klisPay non identifié!');
              }else {
                  // loading controller dismiss
                 // loading.dismiss();
                 // go to the page
                 this.showList(data.nina.toUpperCase(), data.klpnum.toUpperCase(), data.btqnum.toUpperCase(), data.provnum.toUpperCase());
                   // this.presentToast('ID identifié avec succès', 'dark');
               //  this.presentAlert('ID identifié avec succès');
              }
            }, err => {
              console.log('erreur', err);
              if (err.status == 0) {
                    // loading controller dismiss
               this.loader.loading.dismiss();
                console.log('Erreur Serveur!');
                this.presentAlert('Erreur Serveur!');
              }
            });
          }
          ////////////////// champs nina vide et champs non klispay vide   /////////////////////////
          else if (data.nina == '' && data.klpnum == '' && data.btqnum !== '' && data.provnum == '') {
            console.log('appel Api recherche N°boutique ');
            //
           // Affichier un loading Controller
            this.loader.showloading('Recherche avec n°boutique en cours...');
            this.loadDataSearch(data.nina.toUpperCase(), data.klpnum.toUpperCase(), data.btqnum, data.provnum.toUpperCase()).subscribe( res => {
              console.log('verification de la liste');
              console.log('longueur', res.length);
              if (res.length == 0) {
                // loading controller dismiss
                this.loader.loading.dismiss();
                console.log('n°boutique non identifié!');
              //  this.presentToast('NINA non identifié!', 'warning');
                this.presentAlert('n°boutique non identifié!');
              }else {
                  // loading controller dismiss
                // loading.dismiss();
                 // go to the page
                 this.showList(data.nina.toUpperCase(), data.klpnum.toUpperCase(), data.btqnum, data.provnum.toUpperCase());
                   // this.presentToast('ID identifié avec succès', 'dark');
               //  this.presentAlert('ID identifié avec succès');
              }
            }, err => {
              console.log('erreur', err);
              if (err.status == 0) {
                    // loading controller dismiss
                this.loader.loading.dismiss();
                console.log('Erreur Serveur!');
                this.presentAlert('Erreur Serveur!');
              }
            });

          }
          ////////////////// champs avec valeur   /////////////////////////
          else if (data.nina == '' && data.klpnum == '' && data.btqnum == '' && data.provnum !== '') {
            console.log('appel Api recherche N°Provisoire ');
            //
           // Affichier un loading Controller
            this.loader.showloading('Recherche avec n°provisoire en cours...');
            this.loadDataSearch(data.nina.toUpperCase(), data.klpnum.toUpperCase(), data.btqnum.toUpperCase(), data.provnum).subscribe( res => {
              console.log('verification de la liste');
              console.log('longueur', res.length);
              if (res.length == 0) {
                // loading controller dismiss
                this.loader.loading.dismiss();
                console.log('n°provisoire non identifié!');
              //  this.presentToast('NINA non identifié!', 'warning');
                this.presentAlert('n°provisoire non identifié!');
              }else {
                  // loading controller dismiss
               //  loading.dismiss();
                 // go to the page
                 this.showList(data.nina.toUpperCase(), data.klpnum.toUpperCase(), data.btqnum.toUpperCase(), data.provnum);
                   // this.presentToast('ID identifié avec succès', 'dark');
               //  this.presentAlert('ID identifié avec succès');
              }
            }, err => {
              console.log('erreur', err);
              if (err.status == 0) {
                    // loading controller dismiss
                this.loader.loading.dismiss();
                console.log('Erreur Serveur!');
                this.presentAlert('Erreur Serveur!');
              }
            });
          }

          /////////////////  tous les champs sont renseignés /////////////////////////
          else if (data.nina !== '' && data.klpnum !== '' && data.btqnum !== '' && data.provnum !== '') {
            console.log('appel Api special recherche avec tous les paramètres');
             // Affichier un loading Controller
            this.loader.showloading('Recherche avec tous les paramètres en cours....');
            this.loadDataSearch(data.nina.toUpperCase(), data.klpnum.toUpperCase(), data.btqnum.toUpperCase(), data.provnum.toUpperCase()).subscribe( res => {
              console.log('verification de la liste');
              console.log('longueur', res.length);
              if (res.length == 0) {
                // loading controller dismiss
                this.loader.loading.dismiss();
                console.log('ID Non identifié!');
              //  this.presentToast('NINA non identifié!', 'warning');
                this.presentAlert('ID non identifié!');
              }else {
                  // loading controller dismiss
                // loading.dismiss();
                 // go to the page
                 this.showList(data.nina.toUpperCase(), data.klpnum.toUpperCase(), data.btqnum.toUpperCase(), data.provnum.toUpperCase());
                   // this.presentToast('ID identifié avec succès', 'dark');
                // this.presentAlert('identifié avec succès');
              }
            }, err => {
              console.log('erreur', err);
              if (err.status == 0) {
                    // loading controller dismiss
                this.loader.loading.dismiss();
                console.log('Erreur Serveur!');
                this.presentAlert('Erreur Serveur !');
              }
            });
          }
      }
      }
    ]
  });
  alert.present();
}
///////////////////////////////////////////////////////////////////////////
repartitionTransactDetail()
{

  for (let i = 0; i < this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList.length; i++)
  {
    let val = 1;
    let reste = 0;
    let totalTransactEchfisc = this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList[i].transactEchFisc.montant;

    // 
    for (let j = 0; j < this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList[i].transactEchFiscDPaymentModels.length; j++)
    {   
      //this.mnt1 = this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList[i].transactEchFiscDPaymentModels[j].transactEchFiscD.montant;
         // console.log('hhhhhhh',this.mnt1);
      if ( totalTransactEchfisc < this.contribPayment.situationFiscale.echfiscPaymentModels[i].echfiscDPaymentModels[j].echfiscdet.mntecar && val != 0)
      {
        this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList[i].transactEchFiscDPaymentModels[j].transactEchFiscD.montant = totalTransactEchfisc;
        val = 0;
        reste = 0;
      }
      else if ( totalTransactEchfisc > this.contribPayment.situationFiscale.echfiscPaymentModels[i].echfiscDPaymentModels[j].echfiscdet.mntecar && val != 0)
      {
        val = this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList[i].transactEchFisc.montant - this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList[i].transactEchFiscDPaymentModels[j].transactEchFiscD.montant;
        this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList[i].transactEchFiscDPaymentModels[j].transactEchFiscD.montant = this.contribPayment.situationFiscale.echfiscPaymentModels[i].echfiscDPaymentModels[j].echfiscdet.mntecar;

        reste = val;
        totalTransactEchfisc = reste;
      }
      else if (totalTransactEchfisc == this.contribPayment.situationFiscale.echfiscPaymentModels[i].echfiscDPaymentModels[j].echfiscdet.mntecar && val != 0 )
      {
        reste = 0;
        val = 0;
        this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList[i].transactEchFiscDPaymentModels[j].transactEchFiscD.montant = this.contribPayment.situationFiscale.echfiscPaymentModels[i].echfiscDPaymentModels[j].echfiscdet.mntecar;


      }
      else if (val == 0)
      {
        this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList[i].transactEchFiscDPaymentModels[j].transactEchFiscD.montant = 0;
        reste = 0;
      }
    }
  }
}
/////////////////////////////////////////////////////////////////////
repartitionTransact(total: number)
{

  let totalcurrent = total;
  let reste = 0;
  let val = 1;
  for (let i = 0; i < this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList.length; i++)
  {
    console.log("test repartitionTransact "+this.contribPayment.situationFiscale.echfiscPaymentModels[i].echfisc.mntecar);

    if (this.contribPayment.situationFiscale.echfiscPaymentModels[i].echfisc.mntecar < totalcurrent && val != 0)
    {
      this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList[i].transactEchFisc.montant=this.contribPayment.situationFiscale.echfiscPaymentModels[i].echfisc.mntecar;
      reste = totalcurrent - this.contribPayment.situationFiscale.echfiscPaymentModels[i].echfisc.mntecar;
      val = reste;
      totalcurrent = reste;
    }
    else if ( this.contribPayment.situationFiscale.echfiscPaymentModels[i].echfisc.mntecar > totalcurrent && val != 0)
    {
      this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList[i].transactEchFisc.montant = totalcurrent;
      totalcurrent = 0;
      val = 0;
      reste = 0;
    }
    else if (this.contribPayment.situationFiscale.echfiscPaymentModels[i].echfisc.mntecar == totalcurrent && val != 0)
    {
      this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList[i].transactEchFisc.montant = this.contribPayment.situationFiscale.echfiscPaymentModels[i].echfisc.mntecar;
      reste = 0;
      val = 0;
      totalcurrent = 0;
    }
    else if (val == 0)
    {
       this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList[i].transactEchFisc.montant = 0;
       reste = 0;
     // val=0;
       totalcurrent = 0;
    }
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////
  async sendContribPaymentToServer(sendParams: DataPaymentModel) {
    // Affichier un loading Controller
    // this.loader.showloading('Enregistrement...');
// Affichier un loading Controller
      let loading =  await this.loadingCtrl.create({
        message: 'Enregistrement...',
        });
      await loading.present();

      // loading ctrl 
        this.loadingSaveDatabase=true;
        setTimeout(() => {
        // console.log("10s........................................................");
          if(this.loadingSaveDatabase == true){
            loading.dismiss();
            this.loadingSaveDatabase = false;
            // alert
            ////////////////////
            if(this.retryCounterDB >= 3){
              this.RetrySaveDatabaseFinal();
              // this.retryCounterOrange = 0;
            }else{
              // alert
            this.RetrySaveDatabase();
            }

          }
        }, 60000);

     const url: string = `${environement.api_url_pay}`;
      this.http.post(url, sendParams).subscribe( async data => {
              this.loadingSaveDatabase = false;
              this.retryCounterDB = 0;
           // loading controller dismiss
              this.loadingCtrl.dismiss();
             //
              this.impression();
             // this.presentToast('votre paiement a été effectué avec succes! KLISPAY vous remercie.', 'success');
              this.presentAlert('votre paiement a été effectué avec succes! KLISPAY vous remercie.');
        },
      error => {
          // loading controller dismiss
              this.loadingCtrl.dismiss();
            //  this.presentToast('Echec de sauvegrade du  Paiement!', 'warning');
              this.presentAlert('Echec de sauvegrade de la transaction!');
        });
}
//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
paymentTicket(){
  let bodyPage: string;
  let bodycorps: string ='';
  let dateEtHeure = this.datePipe.transform(new Date(),"dd/MM/yyyy,hh:mm:ss a");
 // let dateT = this.datePipe.transform(new Date(),"dd/MM/yyyy");
 // let bodybody: string = '';
  //
  let headerPage: string = this.serviceEnrollement.justify_bold+this.serviceEnrollement.justify_center
              +this.serviceEnrollement.justify_size_middle
              +'**MAIRIE DU DISTRICT DE BAMAKO**\n' + '********'+this.contribParams?.localisation?.zone+'********\n'
              +'-------------------------------\n'+ 'DateHeure: '+dateEtHeure+'\n'
             //  +'RECU N°: [Z-YYYYMMDD-NN-AAA-XX-S]\n'
               +'REF: '+this.contribPayment.transactModelPayment.transact.klptransid+'-'+this.agentUsername+'\n'
               +'Agent: '+this.agentUsername+'\n'
               +'--------------------------'
          //  console.log(headerPage);

   for(let i = 0; i< this.contribPayment.situationFiscale.echfiscPaymentModels.length; i++){
       bodycorps+= this.contribPayment.situationFiscale.echfiscPaymentModels[i].libl+
       '--'+this.contribPayment.situationFiscale.echfiscPaymentModels[i].echfisc.mntecar+
       '---'+this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList[i].transactEchFisc.montant+
       '\n'+'******';

      /* for(let j = 0; j< this.contribPayment.situationFiscale.echfiscPaymentModels[i].echfiscDPaymentModels.length; j++){
        //////////////
         bodybody += this.contribPayment.situationFiscale.echfiscPaymentModels[i].echfiscDPaymentModels[j].libl+
         '------'+this.contribPayment.situationFiscale.echfiscPaymentModels[i].echfiscDPaymentModels[j].echfiscdet.mntecar+
         '------'+this.contribPayment.transactModelPayment.transactEchFiscPaymentModelList[i].
         transactEchFiscDPaymentModels[j].transactEchFiscD.montant+'\n';
       }*/
   }
   // 
 // console.log(bodycorps,bodybody);
  //
   bodyPage ='\n'
   +'Contrib: '+this.contribParams?.klpnum+'-'+this.contribParams?.identification?.raisonSociale+'\n'
   +this.contribParams?.contact?.prenoms+'-'+this.contribParams?.contact?.nom+'\n'
   +'-------------------------------'+'\n'
   + '------------Echeances----------'+'\n'
   +bodycorps+'\n'
   +'TOTAL'+'------------------'+this.total+'\n'
   +'PAYER'+'------------------'+this.contribPayment.transactModelPayment.transact.montant+'\n'
   +'SOLDE'+'------------------'+this.solde+'\n'
   +'-------------------------------'+'\n'
   + '---------Infos Paiement-------'+'\n'
   +'MOYEN CHOISIT'+'-------'+this.contribPayment.transactModelPayment.transact.modpref+'\n'
   +'KlisPay ID'+'--'+this.contribPayment.transactModelPayment.transact.klptransid+'\n'
   +'ID OP.'+'---'+this.contribPayment.transactModelPayment.transact.modptransid+'\n';
  // console.log(bodyPage);
//
let footerPage: string = '\n'+'Je paie mes taxes, je developpe ma ville\n'
 +'**Powered by NTA-TECH Klis Pay**'+'\n'
 +'MAIRIE DE BAMAKO VOUS REMERCIE \n'
// + this.serviceEnrollement.justify_left +'**Qrcode**';
 // console.log(footerPage);
if(this.klpnump !== ''){
  /////////////////////
  this.bluetoothSerial.write(headerPage+bodyPage+footerPage).then( data=>{
    this.service.printQrCode(this.klpnump+','+ this.contribPayment.transactModelPayment.transact.klptransid );
   }).catch(data=>
    {
      alert(JSON.stringify(data));
    });
  //////////////////////
}else {
  ///////////////////
  this.bluetoothSerial.write(headerPage+bodyPage+footerPage).then( data=>{
    this.service.printQrCode(this.contribParams.klpnum+','+ this.contribPayment.transactModelPayment.transact.klptransid );
   }).catch(data=>
    {
      alert(JSON.stringify(data));
    });
  ///////////////////
}
//////////////////////
 console.log(headerPage+bodyPage+footerPage);
}
//////////////////////////////////////////////////////////////
impression() {
  this.paymentTicket();
}
/////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
async getMode() {
  ///////
  let listMode = this.serviceEnrollement.choixPaiementMobileList.split(',');
  console.log(listMode[0]);
  console.log(listMode[1]);
  console.log(listMode[2]);
  console.log(listMode[3]);
  console.log(listMode[4]);
  console.log(listMode[5]);
  console.log(listMode[6]);
  //
  let alert = await this.alertCtrl.create({
    header: 'Moyens de paiement',
    inputs: [
      {
        name: 'omt',
        type: 'radio',
        label: 'ORANGE MONEY T',
        value: 'ORANGE MONEY T',
        checked: this.mod1,
        handler: (dat) =>  {
          console.log(dat.checked); // will contain 'radiovalue'
          this.mod1 =  dat.checked;
          this.mod2 = !dat.checked;
          this.mod3 = !dat.checked;
          this.mod4 = !dat.checked;
          this.mod5 = !dat.checked;
          this.mod6 = !dat.checked;
          this.mod7 = !dat.checked;
          this.mod8 = !dat.checked;
        }
      },
      {
        name: 'omp',
        type: 'radio',
        label: 'ORANGE MONEY',
        value: 'ORANGE MONEY',
        checked: this.mod8,
        handler: (dat) =>  {
          console.log(dat.checked); // will contain 'radiovalue'
          this.mod1 = !dat.checked;
          this.mod2 = !dat.checked;
          this.mod3 = !dat.checked;
          this.mod4 = !dat.checked;
          this.mod5 = !dat.checked;
          this.mod6 = !dat.checked;
          this.mod7 = !dat.checked;
          this.mod8 =  dat.checked;
        }
      },
      {
        name: 'payexpress',
        type: 'radio',
        label: 'PAY EXPRESS',
        value: 'PAY EXPRESS',
        checked: this.mod2,
        handler: (dat) =>  {
          console.log(dat.checked); // will contain 'radiovalue'
          this.mod1 = !dat.checked;
          this.mod2 =  dat.checked;
          this.mod3 = !dat.checked;
          this.mod4 = !dat.checked;
          this.mod5 = !dat.checked;
          this.mod6 = !dat.checked;
          this.mod7 = !dat.checked;
          this.mod8 = !dat.checked;
        }
      },
      {
        name: 'mobicash',
        type: 'radio',
        label: 'MOBICASH',
        value: 'MOBICASH',
        checked: this.mod3,
        handler: (dat) =>  {
          console.log(dat.checked); // will contain 'radiovalue'
          this.mod1 = !dat.checked;
          this.mod2 = !dat.checked;
          this.mod3 =  dat.checked;
          this.mod4 = !dat.checked;
          this.mod5 = !dat.checked;
          this.mod6 = !dat.checked;
          this.mod7 = !dat.checked;
          this.mod8 = !dat.checked;
        }
      },
      {
        name: 'wizall',
        type: 'radio',
        label: 'WIZALL',
        value: 'WIZALL',
        checked: this.mod4,
        handler: (dat) =>  {
          console.log(dat.checked); // will contain 'radiovalue'
          this.mod1 = !dat.checked;
          this.mod2 = !dat.checked;
          this.mod3 = !dat.checked;
          this.mod4 =  dat.checked;
          this.mod5 = !dat.checked;
          this.mod6 = !dat.checked;
          this.mod7 = !dat.checked;
          this.mod8 = !dat.checked;
        }
      },
      {
        name: 'uba',
        type: 'radio',
        label: 'UBA',
        value: 'UBA',
        checked: this.mod5,
        handler: (dat) =>  {
          console.log(dat.checked); // will contain 'radiovalue'
          this.mod1 = !dat.checked;
          this.mod2 = !dat.checked;
          this.mod3 = !dat.checked;
          this.mod4 = !dat.checked;
          this.mod5 =  dat.checked;
          this.mod6 = !dat.checked;
          this.mod7 = !dat.checked;
          this.mod8 = !dat.checked;
        }
      },
      {
        name: 'tem',
        type: 'radio',
        label: 'TEM',
        value: 'TEM',
        checked: this.mod6,
        handler: (dat) =>  {
          console.log(dat.checked); // will contain 'radiovalue'
          this.mod1 = !dat.checked;
          this.mod2 = !dat.checked;
          this.mod3 = !dat.checked;
          this.mod4 = !dat.checked;
          this.mod5 = !dat.checked;
          this.mod6 =  dat.checked;
          this.mod7 = !dat.checked;
          this.mod8 = !dat.checked;
        }
      },
      {
        name: 'defaut',
        type: 'radio',
        label: 'DEFAUT',
        value: 'DEFAUT',
        checked: this.mod7,
        handler: (dat) =>  {
          console.log(dat.checked); // will contain 'radiovalue'

          this.mod1 = !dat.checked;
          this.mod2 = !dat.checked;
          this.mod3 = !dat.checked;
          this.mod4 = !dat.checked;
          this.mod5 = !dat.checked;
          this.mod6 = !dat.checked;
          this.mod7 =  dat.checked;
          this.mod8 = !dat.checked;
        }
      }
    ],
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
        handler: data => {
          console.log('Annuler');
        }
      },
      {
        text: 'OK',
        handler: async (data) => {
           // console.log('mode choisit', data);
            switch(data){
              case 'ORANGE MONEY T':{
                console.log('orange money test');
                this.contribPayment.transactModelPayment.transact.modpref = data;
                this.divOtp = false;
                this.btnPayer = true;
                break;
              }
              case 'ORANGE MONEY':{
                console.log('orange money prod');
                this.contribPayment.transactModelPayment.transact.modpref = data;
                this.divOtp = false;
                this.btnPayer = true;
                break;
              }
              case 'PAY EXPRESS':{
                console.log('pay express');
                this.contribPayment.transactModelPayment.transact.modpref = data;
                this.divOtp = false;
                this.btnPayer = true;
                break;
              }
              case 'MOBICASH':{
                console.log('Mobicash');
                this.contribPayment.transactModelPayment.transact.modpref = data;
                this.divOtp = false;
                this.btnPayer = true;
                break;
              }
              case 'WIZALL':{
                console.log('Wizall');
                this.contribPayment.transactModelPayment.transact.modpref = data;
                this.divOtp = false;
                this.btnPayer = true;
                break;
              }
              case 'UBA':{
                console.log('UBA');
                this.contribPayment.transactModelPayment.transact.modpref = data;
                this.divOtp = false;
                this.btnPayer = true;
                break;
              }
              case 'TEM':{
                console.log('Teliya Express money');
                this.contribPayment.transactModelPayment.transact.modpref = data;
                this.divOtp = false;
                this.btnPayer = true;
                break;
              }
              case 'DEFAUT':{
                console.log('Defaut');
                this.contribPayment.transactModelPayment.transact.modpref = data;
                this.btnPayer = false;
               // this.btnMontant = true;
                this.divOtp = true;
             //   this.btnImprimer = false;
                break;
              }
            }
        }
      }
    ]
  });
  alert.present();
}
////////////////////////////////////////////////////////////////////////
/////////////  generer l'order id en fonction de l'operateur //////////
 getOrderId(operateur: string){
     // mettre l'order Id en place
  const url = `${environement.api_url_orderId}operateur=${operateur}`;
  this.http.get<any>(url).subscribe( res =>{
    console.log('order ID',  res);
    this.contribPayment.transactModelPayment.transact.klptransid = res.msg;
  }, err =>{
      console.log(err);
  });
 }
///////////////////////////////////////////////////////////////////////
async payment() {
  ///////////
switch(this.contribPayment.transactModelPayment.transact.modpref){
  case 'ORANGE MONEY T':{
    console.log('orange money test');
    //// appel generation de order ID
    this.getOrderId('ORANGE MONEY');
    ///////
    let alert = await this.alertCtrl.create({
      header: 'Alerte',
      message: 'êtes vous sur de vouloir continuer avec '+this.contribPayment.transactModelPayment.transact.modpref,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Annuler');
          }
        },
        {
          text: 'Continuer',
          handler: (data) => {
            //
            this.orangeMoneyPostTest();
          }
        }
      ]
    });
    alert.present();
    break;
  }
  case 'ORANGE MONEY':{
    console.log('orange money prod');
    //// appel generation de order ID
    this.getOrderId('ORANGE MONEY');
    ///////
    let alert = await this.alertCtrl.create({
      header: 'Alerte',
      message: 'êtes vous sur de vouloir continuer avec '+this.contribPayment.transactModelPayment.transact.modpref,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Annuler');
          }
        },
        {
          text: 'Continuer',
          handler: (data) => {
            //
            this.orangeMoneyPostProd();
          }
        }
      ]
    });
    alert.present();
    break;
  }
  case 'PAY EXPRESS':{
    console.log('pay express');
    //// appel generation de order ID
    this.getOrderId('PE');
    ///////
  //  this.presentToast('Mode non disponible! choisissez un autre', 'warning');
    this.presentAlert('Mode non disponible! choisissez un autre');
    break;
  }
  case 'MOBICASH':{
    console.log('Mobicash');
    //// appel generation de order ID
    this.getOrderId('MOBI');
    ///////
   // this.presentToast('Mode non disponible! choisissez un autre', 'warning');
    this.presentAlert('Mode non disponible! choisissez un autre');
    break;
  }
  case 'WIZALL':{
    console.log('Wizall');
    //// appel generation de order ID
    this.getOrderId('WIZ');
    ///////
  //  this.presentToast('Mode non disponible! choisissez un autre', 'warning');
    this.presentAlert('Mode non disponible! choisissez un autre');
    break;
  }
  case 'UBA':{
    console.log('UBA');
    //// appel generation de order ID
    this.getOrderId('UBA');
    ///////
   // this.presentToast('Mode non disponible! choisissez un autre', 'warning');
    this.presentAlert('Mode non disponible! choisissez un autre');
    break;
  }
  case 'TEM':{
    console.log('Teliya Express money');
    //// appel generation de order ID
    this.getOrderId('TEM');
    ///////
  //  this.presentToast('Mode non disponible! choisissez un autre', 'warning');
  // this.presentAlert('Mode non disponible! choisissez un autre');
  let alert = await this.alertCtrl.create({
    header: 'Alerte',
    message: 'êtes vous sur de vouloir continuer avec '+this.contribPayment.transactModelPayment.transact.modpref,
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
        handler: () => {
          console.log('Annuler');
        }
      },
      {
        text: 'Continuer',
        handler: (data) => {
          //
          this.otpVal = (document.getElementById('otp') as HTMLInputElement).value;
          console.log('otp val', this.otpVal);
          if(this.otpVal == ''){
            this.presentAlert('Veuiller saisir le code OTP reçu par le contribuable!!!');
          } else{
               // paiement tem
          this.temPaiementConfirm();

     /*    this.btnPayer = true;
         this.btnMontant = true;
         this.btnImprimer = false;
         // this.btnNouveau = false;
         //
         this.contribPayment.transactModelPayment.transact.modptransid = this.contribPayment.transactModelPayment.transact.klptransid;
         //
         this.transactionId = this.contribPayment.transactModelPayment.transact.klptransid;
         console.log(this.contribPayment);
         //
         this.impression();
         // enregistrement dans la base du model payment
         this.sendContribPaymentToServer(this.contribPayment);  */
         //
         (document.getElementById('otp') as HTMLInputElement).value = '';
          }

        }
      }
    ]
  });
  alert.present();
    break;
  }
  case 'DEFAUT':{
    console.log('mode paiement Defaut');
    //// appel generation de order ID
    this.getOrderId('DEFAUT');
    ///////
    let alert = await this.alertCtrl.create({
      header: 'Alerte',
      message: 'êtes vous sur de vouloir continuer avec '+this.contribPayment.transactModelPayment.transact.modpref,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Annuler');
          }
        },
        {
          text: 'Continuer',
          handler: (data) => {
                        //
              this.btnPayer = true;
              this.btnMontant = true;
              this.btnImprimer = false;
              // this.btnNouveau = false;
              //
              this.contribPayment.transactModelPayment.transact.modptransid = this.contribPayment.transactModelPayment.transact.klptransid;
              //
              this.transactionId = this.contribPayment.transactModelPayment.transact.klptransid;
              console.log(this.contribPayment);
              // enregistrement dans la base du model payment
              this.sendContribPaymentToServer(this.contribPayment);
              // toast message
            //  this.presentToast('Etat de la transaction: ' + data.status, 'success',  2000);
          }
        }
      ]
    });
    alert.present();
    break;
  }
}
}
///////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////
async OTP() {
  //
switch(this.contribPayment.transactModelPayment.transact.modpref){
  case 'ORANGE MONEY T':{
    console.log('orange money test');
    let alert = await this.alertCtrl.create({
      header: 'Alerte',
      message: 'recuperer le code otp generer a partir du SandBox Simulator',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Annuler');
          }
        },
        {
          text: 'Continuer',
          handler: (data) => {
            // activer le button payer
            this.btnPayer = false;
          }
        }
      ]
    });
    alert.present();
    break;
  }
  case 'ORANGE MONEY':{
    console.log('orange money prod');
    let alert = await this.alertCtrl.create({
      header: 'Alerte',
      message: 'Faites saisir le code OTP reçu par le contribuable par #144#77#',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Annuler');
          }
        },
        {
          text: 'Continuer',
          handler: (data) => {
             // activer le button payer
             this.btnPayer = false;
          }
        }
      ]
    });
    alert.present();
    break;
  }
  case 'PAY EXPRESS':{
    console.log('pay express');
  //  this.presentToast('Mode non disponible! choisissez un autre', 'warning');
    this.presentAlert('Mode non disponible! choisissez un autre');
    break;
  }
  case 'MOBICASH':{
    console.log('Mobicash');
   // this.presentToast('Mode non disponible! choisissez un autre', 'warning');
    this.presentAlert('Mode non disponible! choisissez un autre');
    break;
  }
  case 'WIZALL':{
    console.log('Wizall');
  //  this.presentToast('Mode non disponible! choisissez un autre', 'warning');
    this.presentAlert('Mode non disponible! choisissez un autre');
    break;
  }
  case 'UBA':{
    console.log('UBA');
   // this.presentToast('Mode non disponible! choisissez un autre', 'warning');
    this.presentAlert('Mode non disponible! choisissez un autre');
    break;
  }
  case 'TEM':{
    console.log('Teliya Express money');
  //  this.presentToast('Mode non disponible! choisissez un autre', 'warning');
  // this.presentAlert('Mode non disponible! choisissez un autre');
  let alert = await this.alertCtrl.create({
    header: 'Alerte',
    message: 'Faites saisir le code OTP reçu par le contribuable',
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
        handler: () => {
          console.log('Annuler');
        }
      },
      {
        text: 'Continuer',
        handler: (data) => {
           // activer le button payer
           this.btnPayer = false;
           // API TEM d'envoi otp au contrib
            this.temOtpRequest();
        }
      }
    ]
  });
  alert.present();
    break;
  }
  case 'DEFAUT':{
    console.log('mode paiement Defaut');
    this.btnPayer = false;
   // this.btnMontant = false;
  /*  let alert = await this.alertCtrl.create({
      header: 'Alerte',
      message: 'Continuer en cliquer',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Annuler');
          }
        },
        {
          text: 'Continuer',
          handler: (data) => {
                        //
              this.btnPayer = false;
              this.btnMontant = true;
              this.btnImprimer = false;
              // this.btnNouveau = false;
          }
        }
      ]
    });
    alert.present();  */
    break;
  }
}
}
///////////////////////////////////////////////////////////////////////////////////////
async openModalAgent() {
  const modal = await this.modalController.create({
    component: AgentmodalPage,
    componentProps: {
     // urlSafe: this.urlSafe
    }
   // cssClass: 'my-orange-modal-css'
  });
  modal.onWillDismiss().then( async dataRetour => {
   // trigger when about to close the modal
  // this.code = dataRetour.data;

  });
  return await modal.present().then(_ => {
    // triggered when opening the modal
    console.log('data Sending: ', this.code);
  });
}
/////////////////  TEM     ////////////////////////////////
/////////////////////////////////////////////////////////////////////////
  async temOtpRequest(){
    // Affichier un loading Controller
    let loading =  await this.loadingCtrl.create({
      message: 'Envoi code OTP...',
      });
await loading.present();
  // statically append
  const headers = new HttpHeaders({
   // 'Authorization': 'Bearer tr4k7mur8pJnwrgb09CkV0YBsMdk',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  ///////////// model initialisation ////////////////
  this.temOtp.k = 'key';
 // this.temOtp.ida = this.agentUsername;
  this.temOtp.id = this.contribPayment.transactModelPayment.transact.klptransid;
  this.temOtp.tel = '+223'+this.contribPayment.transactModelPayment.transact.modpay;
  console.log('numerooooooooooo', this.temOtp.tel);
 // this.temOtp.tel = '+22377778898';
  this.temOtp.m = this.contribPayment.transactModelPayment.transact.montant;

  /////////// loading ctrl 
    this.loadingTemOtp=true;
    setTimeout(() => {
      // console.log("10s........................................................");
      if(this.loadingTemOtp == true){
        loading.dismiss();
        this.loadingTemOtp = false;
        // alert
        ////////////////////
        if(this.retryCounterTemOtp >= 3){
          this.RetryTemOtpRequestFinal();
          // this.retryCounterOrange = 0;
        }else{
          // alert
        this.RetryTemOtpRequest();
        }

      }
    }, 60000);
///////////
   this.http.post<any>(`${environement.api_url_temOtp}`, this.temOtp).subscribe(async (res) => {
            //  console.log('TEM OTP Response',res);
                  //
              loading.dismiss();
              this.loadingTemOtp = false;
              this.retryCounterTemOtp = 0;
              //
              this.temOtpRetour = res;
              this.temOtpCode = res.code;
             console.log('response code', this.temOtpCode);
              // autre traitement
              if(res.status == false){
                this.presentAlert(res.status_message);
              }else{
                // anoter operation
                this.presentAlert(res.status_message);
              }

           //  loading.dismiss();
            //   this.presentToast('Continuez le Paiement en glissant vers le haut', 'dark');
           //    this.presentAlert('Continuez le Paiement en glissant vers le haut');

     },
     async error => {
       // toast message
        console.log(' error', error);
        this.presentAlert(JSON.stringify(error));
         if (error.status == 0) {
        //  this.presentToast('Erreur! serveur Indisponible', 'danger');
          this.presentAlert('Problème de connexion! serveur Indisponible');
        }
       // console.log('Error', error);
    });
}
/////////////////////////////////////////////////////////////////////////
async temPaiementConfirm(){
  // Affichier un loading Controller
  let loading =  await this.loadingCtrl.create({
    message: 'Confirmation du paiement...',
    });
await loading.present();
// statically append
const headers = new HttpHeaders({
 // 'Authorization': 'Bearer tr4k7mur8pJnwrgb09CkV0YBsMdk',
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});
/////////////  model paeiment initialisation /////////////
this.temConfirmPaiement.k = 'key';
this.temConfirmPaiement.ida = this.agentUsername;
this.temConfirmPaiement.tel = '+223'+this.contribPayment.transactModelPayment.transact.modpay;
//  this.temConfirmPaiement.tel = '+22377778898';
this.temConfirmPaiement.m = this.contribPayment.transactModelPayment.transact.montant;
this.temConfirmPaiement.id = this.serviceEnrollement.klpnum;
// this.temConfirmPaiement.cc = this.temOtpCode;
this.temConfirmPaiement.cc = this.otpVal;
this.temConfirmPaiement.idp = this.contribPayment.transactModelPayment.transact.klptransid;

  /////////// loading ctrl 
  this.loadingTemPaiement=true;
  setTimeout(() => {
    // console.log("10s........................................................");
    if(this.loadingTemPaiement == true){
      loading.dismiss();
      this.loadingTemPaiement = false;
      // alert
      ////////////////////
      if(this.retryCounterTemConfirm >= 3){
        this.RetryTemConfirmPaiementFinal();
        // this.retryCounterOrange = 0;
      }else{
        // alert
        this.RetryTemConfirmPaiement();
      }

    }
  }, 60000);
///////////


 this.http.post<any>(`${environement.api_url_temConfirmPaiement}`, this.temConfirmPaiement)
  .subscribe(async (res) => {
            console.log('TEM paiement Response',res);
             //
             loading.dismiss();
             this.loadingTemPaiement = false;
             this.retryCounterTemConfirm = 0;
             //
            this.temConfirmPaiementRetour = res;
           // console.log('response', this.temConfirmPaiementRetour);
            if(res.status == false){
             this.presentAlert(res.status_message);
            }else{
              // anoter operation
             // this.presentAlert(res.status_message);
              console.log(res.status_message);
              this.btnPayer = true;
              this.btnMontant = true;
              this.btnImprimer = false;
              // this.btnNouveau = false;
              //
              this.contribPayment.transactModelPayment.transact.modptransid = this.contribPayment.transactModelPayment.transact.klptransid;
              //
              this.transactionId = this.contribPayment.transactModelPayment.transact.klptransid;
              console.log(this.contribPayment);
              // this.contribPayment.transactModelPayment.transact.solde = this.solde;
              ////
              //
             // this.impression();
              // enregistrement dans la base du model payment
              this.sendContribPaymentToServer(this.contribPayment);

            }

           //  loading.dismiss();
          //   this.presentToast('Continuez le Paiement en glissant vers le haut', 'dark');
         //    this.presentAlert('Continuez le Paiement en glissant vers le haut');

   },
   async error => {
     // toast message
      console.log('type error', error);
      this.presentAlert(JSON.stringify(error));
     // this.presentAlert('Problème de connexion! serveur Indisponible');
      if (error.status == 0) {
      //  this.presentToast('Erreur! serveur Indisponible', 'danger');
        this.presentAlert('Problème de connexion! serveur Indisponible');
      }
  });
}
/////////////////////////////////////////////////////////////////////////





}
