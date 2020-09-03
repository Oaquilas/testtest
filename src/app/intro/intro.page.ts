import { Component, OnInit } from '@angular/core';
import { HomePage } from '../home/home.page';
import {AlertController, LoadingController, ToastController, ActionSheetController, ModalController, NavController  } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import {EnrollementService }from '../service/enrollement/enrollement.service';
import { AgentmodalPage } from '../agentmodal/agentmodal.page';
  import { from } from 'rxjs';
@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  // slide options
slideOpts = {
  initialSlide: 1,
  speed: 1000,
  autoplay: {
    delay: 500,
  }
  };

  //
  subscribe: any;
  //
  code: any;
  //
  //
  constructor(private toastCtrl: ToastController,
              private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              public platform: Platform,
              private service:EnrollementService,
              private modalController: ModalController,
              private alertCtrl: AlertController) {

                this.service.ConfigurePrinter();
             /*
                this.subscribe = this.platform.backButton.subscribeWithPriority(666,() =>{

                  if(this.constructor.name == 'IntroPage'){
                    if(window.confirm("Voulez vous quitter l'application ?")) {
                      navigator["app"].exitApp();
                    }
                  }

                });
                */
               }

goToPaiement() {
  this.navCtrl.navigateRoot('home');
  }
goToEnrollemnt(){
  this.navCtrl.navigateRoot('enrollement');
  // console.log('enrolement');
}
goToEticketing(){
  this.navCtrl.navigateRoot('eticketing');
}

  ngOnInit() {
  }
////////////////////////////////////////////
  async exitApp(){
  let alert = await this.alertCtrl.create({
    header: 'Alert',
    message: 'êtes vous sûr de vouloir quitter KLISPAY ?',
    buttons: [
      {
        text: 'Non',
        role: 'cancel',
        handler: (data) => {
            console.log('Annuler');
        }
      },
      {
        text: 'Oui',
        handler: (data) => {
          navigator["app"].exitApp();
        }
      }
    ]
  });
  alert.present();
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
///////////////////////////////////////////////////////////////////////////////////////
 


}
