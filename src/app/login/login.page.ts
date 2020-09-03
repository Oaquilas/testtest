import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {EnrollementService} from '../service/enrollement/enrollement.service';
// import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { LoadingController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Enrolement } from '../models/tem/enrolement';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ConfirmPaiement } from '../models/tem/confirm-paiement';
import { OTP } from '../models/tem/otp';

declare var window: any;
declare let DatecsPrinter:any;
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})


export class LoginPage implements OnInit {
username:String="";
password:String="";
loadingCtrl:any;
loadingActif:boolean=false;
//////
// inscription
temEnrolement = new Enrolement();
// initier paiement
temInitPaiement = new OTP();
// confirm paiement
temConfirmPaiement = new ConfirmPaiement();

constructor(private router:Router,private service:EnrollementService,
  private loading:LoadingController,
  private navCtrl: NavController,
  private http: HttpClient) {
  this.username="";
  this.password="";
//var window:any;
 //this.service.getCurrentPosition();
 //this.service.disconnectBluetooth();
 }

  ngOnInit() {
    this.service.initialiserAES();
    this.service.disconnectBluetooth();
    this.service.getCurrentPosition();
   /* window.DatecsPrinter.listBluetoothDevices(
      function (success) {
        console.log(" "+ success)
        //resolve(success);
      },
      function (error) {
        console.log("Error ")
        //reject(error);
      }); */

       }

  authentifier()
  {
    this.presentLoadingWithOptions();

    let hideFooterTimeout = setTimeout( () => {
      if(this.loadingActif==true)
      {
        this.loadingCtrl.dismiss();
        alert("PROBLEME DE CONNECTION. VEUILLEZ VERIFIER VOTRE CONNEXION INTERNET.");
      }
      else
      {
        if(this.loadingActif!=null)
        {
          this.loadingCtrl.dismiss();
        }
      }
      }, 20000);

      
   this.service.authentifier(this.username,this.password).then(data=>{
          if(this.loadingCtrl!=null)
          {

          this.loadingCtrl.dismiss(); }
           this.loadingActif=false;
         
        if(this.service.status=='ok'){
          this.service.status=='ko';
          this.username='';
          this.password='';
          this.navCtrl.navigateRoot(['/intro']);
        }
        else
        {
          alert('Login OU MOT DE PASSE INCORRECT.Veuillez vérifier vos identifiants!');
        }
    }).catch(
      data=>{
        this.loadingCtrl.dismiss();
        alert("VEUILLEZ VERIFIER VOTRE CONNECTION INTERNET");
      }
    )
  }


  async presentLoadingWithOptions() {
    this.loadingActif=true;
    this.loadingCtrl = await this.loading.create({
     message: 'Connexion en cours',
   }); 
   return await this.loadingCtrl.present();
 }

 test111(){
   this.service.returnKlp().then(data=>{console.log('adama')})
 }
 






}
