import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertController, LoadingController, ToastController, ActionSheetController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { environement } from '../models/environement';
import { DataContribInfo } from '../models/infos/data-contrib-info';
import { EnrollementService } from '../service/enrollement/enrollement.service';
import { LoadingCustom } from '../customLoadinf/loading-custom';

@Component({
  selector: 'app-contribsearch',
  templateUrl: './contribsearch.page.html',
  styleUrls: ['./contribsearch.page.scss'],
})
export class ContribsearchPage implements OnInit {
  /////////////// variables /////////////////////////////////
  // tableau de contrib avec nina
  contribNina: DataContribInfo[];
  //
  nina: string;
  klpnum: string;
  btqnum: string;
  provnum: string;
  special: string;
/////
loadingSearchData: boolean = false;
////
loader = new LoadingCustom();
/////
  constructor(
              private activedRoute: ActivatedRoute,
              private http: HttpClient,
              private toastCtrl: ToastController,
              public navCtrl: NavController,
              private router: Router,
              private loadingCtrl: LoadingController,
              private serviceEnrollement: EnrollementService,
              private alertCtrl: AlertController
              ) {

                  this.activedRoute.queryParams.subscribe(  async data => {
                  this.special = JSON.parse(data['special']);
                  console.log('params envoye', this.special);
                  this.nina = this.special['nina'];
                  this.klpnum = this.special['klpnum'];
                  this.btqnum = this.special['btqnum'];
                  this.provnum = this.special['provnum'];
            /////////////////////////
                  console.log('params nina', this.nina);
                  console.log('params klpnum', this.klpnum);
                  console.log('params btqnum', this.btqnum);
                  console.log('params provnum', this.provnum);
            ///////////////////////
        // tester la durée du loading
 /*
        this.loadingSearchData=true;
        setTimeout(() => {
        // console.log(".........fofofofofofofofofofofofofofofooooooo.......................................");
          if(this.loadingSearchData == true){
           this.loadingCtrl.dismiss();
            this.loadingSearchData = false;
            // alert
         //   console.log('boooooooooooooooooooooooooooooooooooooobbbbooobobboobo')
            this.RetrySearchData();
          }
        }, 60000);
         //////////////////////////////
 */
              // recuperation d'un nina
             // const nina = this.activedRoute.snapshot.paramMap.get('nina');
                 // console.log('nina:', this.nina, this.klpnum);
                  this.loadData(this.nina, this.klpnum, this.btqnum, this.provnum).subscribe( res => {
                    //// enlever le loading si on souscrit avant 15s
                //  this.loadingSearchData = false;
                  this.contribNina = res;
                  console.log('liste de contrib avec NINA', this.contribNina);
                  console.log('longueur', res.length);
                  /*
                  if (data.length == 0) {
                    console.log('NINA non identifié!');
                  //  this.presentToast('NINA non identifié!', 'warning');
                    this.presentAlert('NINA non identifié!');
                    this.navCtrl.back();
                  }
                  */
                 this.loadingCtrl.dismiss();
                },
                error => {
                  this.loadingCtrl.dismiss();
                  console.log('erreur', error);
                  this.presentAlert(JSON.stringify(error));
                  if (error.status == 0) {
                    console.log('Erreur connexion');
                   // this.presentToast('Verifier votre connexion Internet!', 'warning');
                    this.presentAlert('Problème de connexion au serveur');
                   // this.navCtrl.back();
                  }
                });

                },
                 error => {
                  this.loadingCtrl.dismiss();
                  console.log('erreur chargement du constructeur', error);
                  if (error.status == 0) {
                 // loading controller depart
                  this.presentAlert('Echec chargement serveur indisponible');
                  }
                });
              }

  async ngOnInit() {
   // this.loadingCtrl.dismiss();

      if(this.contribNina !== null) {
         // loading controller depart
         // loading.dismiss();
      }
  }
///////////////////////////////////////////////////////////////////////////////
   // prendre les données depuis la base de données
   loadData(nina: string, klpnum: string, btqnum: string, provnum: string): Observable <DataContribInfo[]> {
    const url = `${environement.api_url_nina}klpnum=${klpnum}&klpnump=${provnum}&orgnum=${btqnum}&piecenumero=${nina}&secteur=${this.serviceEnrollement.agentSecteurRequest}`;
    return this.http.get <DataContribInfo[]>(url);
  }
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
goTo($event) {
  console.log('recherche', $event);
}

///////////////////////////////////////////////////////////////////
// details sur un article
  async showDetails(i: number) {

   let loading =  await this.loadingCtrl.create({
    message: 'CHARGEMENT...',
  });
  await loading.present();

 // this.loader.showloading('CHARGEMENT...');

  let contribParams = {
    klpnum: this.contribNina[i].klpnum,
    ctrid: this.contribNina[i].ctrid,
    agentUsername: this.contribNina[i].agentUsername,
    identification: this.contribNina[i].identification,
    localisation: this.contribNina[i].localisation,
    contact: this.contribNina[i].contact,
    activite: this.contribNina[i].activite,
    paiementPrefere: this.contribNina[i].paiementPrefere,
    codeKlpnum: this.contribNina[i].codeKlpnum,
    klpnump: this.provnum
  };
    //
  let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(contribParams)
      }
    };
  ///////////////////////////
   // console.log('', this.provnum +' / '+ this.btqnum+' / '+ this.nina+' / '+ this.klpnum);
   this.navCtrl.navigateRoot(['contribdetail/' + this.contribNina[i].ctrid], navigationExtras);
 /* if(this.provnum !== ''){
  //  console.log('prooooooooooviiiiiiiiiiiiiisoooooooooiiiiiiire exiistt', this.provnum);
  //  console.log('kkkkkkkk avec aquilas',this.klpnum);
  //  console.log('zzzzzzzzzzzzzz avec ongoiba', this.contribNina[i].klpnum);
    this.navCtrl.navigateRoot(['contribdetail/' + this.provnum], navigationExtras);
  }else{
  //  console.log('ooooooooooooollalalalalala',this.contribNina[i].klpnum );
  //  console.log('pooooooolooooooouuuuuulooooouuuuu',this.klpnum );
    this.navCtrl.navigateRoot(['contribdetail/' + this.contribNina[i].klpnum], navigationExtras);
  } */
  // this.navCtrl.navigateForward('/contribdetail/'+this.contribNina[i].codeKlpnum);
}
///////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////
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
async RetrySearchData() {
  let alert = await this.alertCtrl.create({
    header: 'Alerte',
    message: 'Erreur connexion! veuillez reprendre la recherche',
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


}
