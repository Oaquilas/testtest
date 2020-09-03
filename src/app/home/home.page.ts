import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertController, LoadingController, ToastController, ActionSheetController, ModalController } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { NavController } from '@ionic/angular';
import { environement } from '../models/environement';
import { DataPaymentModel } from '../models/payment/data-payment-model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { UpperCasePipe } from '@angular/common';
import { DataContribInfo } from '../models/infos/data-contrib-info';
import { EnrollementService } from '../service/enrollement/enrollement.service';
import { LoadingCustom } from '../customLoadinf/loading-custom';
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
///////////////////////
total: number = 0;
solde: number = 0;

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
counter: number = 0;
//
transOrderId: string;
transAmount: number = 0;
transPayToken: string;
//
transactionId: string;

//
idtxn: string;
//
hideMe = [];
//
code: number;
// infos contrib avec nav params
contribParams: any;
//
contribPayment = new DataPaymentModel();
//
dataScan: any;
//
nina: string ='';
btqnum: string ='';
provnum: string ='';
klpnum: string='';
//////////////////////

loader = new LoadingCustom();
/////////////////////////////
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
              private serviceEnrollement: EnrollementService,) {
//////////////////////////////////////// Chargement des données de la base ///////////////////////////////////////////////
        // recuperation d'un id
        // chargement des datas infos payment du contrib
      
      /*
        this.loadData().subscribe( async (data: DataPaymentModel) => {
         // Affichier un loading Controller
          let loading =  await this.loadingCtrl.create({
              message: 'CHARGEMENT...',
           });
          await loading.present();
          /// the begin of all here
          this.contribPayment = data;

        // this.contribPayment.transactModelPayment.transact.modpay
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////
          console.log('contribuablePayment:', data);
          // initialisation de la var global total
          this.total = this.contribPayment.transactModelPayment.transact.montant;
          // initialisation de la var global du solde
          this.solde = this.total - this.contribPayment.transactModelPayment.transact.montant;
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
            this.contribParams = JSON.parse(params.special);
            console.log('Contrib data with params', this.contribParams);
            // initialisation des contibuables qui n ont pas de numero de telephone
            if (this.contribParams.contact.telephonel == null || this.contribParams.contact.telephonel === undefined ) {
              this.contribParams.contact.telephonel = 'n° tel';
            }
          }
        });
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
               // toast message dismiss
          setTimeout(() => {
                     loading.dismiss();
                     this.presentToast('Chargement effectué avec succès', 'primary', 1500);
              }, 1000);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

 },
 async error => {
   let loading =  await this.loadingCtrl.create({
    message: 'CHARGEMENT...',
  });
   await loading.present();
   console.log('erreur chargement du constructeur', error);
   if (error.status == 0) {
  // loading controller depart
    setTimeout(() => {
               loading.dismiss();
               this.presentToast('Bienvenue dans le paiement KLISPAY, Veuillez lancer une recherche  pour commencer','primary', 3000);
             }, 2000);
   }
 });

 */
/////////////////////////////// in constructor ////////////////////////////////////
        //  this.sendContribPaymentToServer(this.contribPayment);


}

////////////////////////////////////////////////////////////////////////////////////
  ngOnInit() {

  }
 /////////////////////////////////////////////////////////////////////
   // prendre les données depuis la base de données
   loadData(): Observable <DataPaymentModel> {
     // chargement des information du paiement du contrib
     const url = `${environement.api_url_klpnum}`;
     return this.http.get <DataPaymentModel>(url);
   }
 ///////////////////////////////////////////////////////////////////

//////////////////////////////////////// All FunCtions ////////////////////////////
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
         //   console.log('naviguuuuuuer avec numero preovisoire a partir de home', provnum);
         //   console.log('naviguuuuuuer avec numero klispay a partir de home', klpnum);
          this.router.navigate(['contribsearch'], navigationExtras);

       //  this.navCtrl.navigateForward('/contribsearch/', navigationExtras);
}
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
 // prendre les données depuis la base de données
 loadDataSearch(nina: string, klpnum: string, btqnum: string, provnum: string): Observable <DataContribInfo[]> {
  const url = `${environement.api_url_nina}klpnum=${klpnum}&klpnump=${provnum}&orgnum=${btqnum}&piecenumero=${nina}&secteur=${this.serviceEnrollement.agentSecteurRequest}`;
  return this.http.get <DataContribInfo[]>(url);
}
//////////////////////////////////////////////////////////////////////

/////////////////////////////// Modifier un numero de téléphone pour le paiement du contrib  ///////////////////////////////////
//////////////////////////////////////////////////////////////
// toast controller
async presentToast(message: string, color: string, duration: number) {
  const toast = await this.toastCtrl.create({
    message: message,
    duration: duration,
    color: color,
    position: 'top'
 });
  toast.present();
 }

////////////////////////////
goToContrib() {
   this.navCtrl.navigateForward('home');
}
///////////////////////////////////////////////////////////////////
/////////// page de paiement Orange Money via Modal KLP ////////////
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
//////////////////////////////////////////////////
  async quit() {
    this.navCtrl.navigateRoot('intro');
    /*
    let alert = await this.alertCtrl.create({
      header: 'Alert',
      message: 'Voulez vous quitter le paiement KLISPAY?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Annulation');
          }
        },
        {
          text: 'Continuer',
          handler: async (data) => {
            this.navCtrl.navigateRoot('intro');
        }
        }
      ]
    });
    alert.present();   */  
  }
  ///////////////////////////////////////////////////////////////////////////
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




}
