import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from  '@angular/common/http';
 import {Equipements} from '../../models/equipement/equipements';
 import{Enroller} from '../../models/enroller/enroller';
 import {Localisation} from '../../models/localisation/localisation';
 import { Plugins } from '@capacitor/core';
 import { LoadingController,AlertController } from '@ionic/angular';
 import { CameraResultType } from '@capacitor/core';
 import {ModelPossibleDoublons} from '../../models/model-possible-doublons';
 import { Observable } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DataEnrolement } from 'src/app/models/data-enrolement';
import { DataContribInfo } from 'src/app/models/infos/data-contrib-info';
import { DataEnrolementComplet } from 'src/app/models/enrolement/data-enrolement-complet';


const { Camera } = Plugins;

import { AES256 } from '@ionic-native/aes-256/ngx';
//const { Geolocation } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class EnrollementService {
arcticle:any;
statusAuthentification:boolean=false;

url_base:String="http://5.196.34.217:8081/WebServiceKLP/";//"http://localhost:8080/webservice/"; 
url_test:String="http://5.196.34.217:8081/WebServiceKLP/";//"http://localhost:8080/webservice/";   

// url_base:String="http://5.196.58.102:8081/WebServiceKLP/";//"http://localhost:8080/webservice/";// 
// url_test:String="http://5.196.58.102:8081/WebServiceKLP/";//"http://localhost:8080/webservice/";// "http://51.254.49.161:8081/WebServiceKLP/";//"http://localhost:8080/webservice/";

//Les données venantes de la base de donnée
public secteurAgent:string="";
public zoneAgent:string="";
public profilAgent:String="";
public ages:String;
public statusAgent:String="";
public status:String="";
public typeActivite:String="";
public natureActivite:String="";
public equipementsList:String="";
public statusEquipement:String="";
public choixPaiementMobileList:String="";
public listBanque:String="";
public fonctionContri:String="";
public userNameAgent:String="";
public idsecteurAgent:String="";
public precisionEquipement:String="";

public longitude:number;
public EquipementsRefIdString:String="";

public listEquipementRefId=new Array<String>();
public latitude:number;

public listDoublonsContribuable=new Array<ModelPossibleDoublons>();

dataEnrolementModify=new DataContribInfo();
public listEquipements:Array<Equipements>;

public taxesTypeActivite:String='';
public taxesNatureActivite:String='';
public taxesEquipement:String='';

public zoneId:number;
public deptId:number;

public statustypact:String;
public statusnatact:String;
public statusequip:String;
public statusChoixEquipement:String='ko';

public loadingCtrl:any;
public agentId:number;
public afficherBluetooth:boolean=true;

public listSecteur=new Array<String>();

statusEnrolement:boolean;
statusEnrolementExist:boolean;
secteurAgentDefault:String;
klpnum:string='';
ctrId:number;
public loadingEnrolement:Boolean=false;

public securekey:string="";
public secure4:string="";
public dataencrypted:string="";
public datadecrypted:string="";
public securekeyencrypted:string="";
public secure4encrypted:string="";

/**
 * 
 * contact:String,identifica:String,localisation:String,activite:String,
    taxes:String,equip:String,paiement:String,agent:String
 */
public contactEnrol:String="";
public identificaEnrol:String="";
public localisationEnrol:String="";
public activiteEnrol:String="";
public taxesEnrol:String="";
public paiementEnrol:String="";
public agentEnrol:String="";
public equipEnrol:String="";
test1={
  username:"amada@125",
  password:'Bonjour45ssz'
}

public zone:String;
public secteur:String;
public nature_activite:String;
public type_activite:String;

public macAddress:string="";//00:12:12:12:33:33
public agentSecteurRequest: string = '';
///
justify_center ='\x1B\x61\x01';
justify_left ='\x1B\x61\x00';
justify_bold ='\x1b\x45\x01';
justify_size_middle ='\x1d\x21\x00';

  constructor(private httpclient:HttpClient,
    private loading:LoadingController,
    private geolocalisation:Geolocation,
    private bluetooth:BluetoothSerial,
    private alertctrl:AlertController,
    private aes256:AES256,
    private nativeStorage:NativeStorage) {

     }
  public authentifier (username:String,password:String):Promise<any> {
    return this.httpclient.get(this.url_base+'Authentifier?username='+username+'&password='+password).toPromise().then(data=>{
      if(data['status']=="ok")
      {
        this.status='ok';
        this.ages=data['ages'];
        this.profilAgent=data['profil'];
        this.zoneAgent=data['zone'];
        this.idsecteurAgent=data['idSecteurAgent'];
        this.agentSecteurRequest =  data['secteurAgent'];
        this.precisionEquipement=data['precision'];
        console.log(this.precisionEquipement);
        this.secteurAgent=data['secteur'];
        this.secteurAgentDefault=data['secteurAgent'];
        this.securekey=data['securekey'];
        this.secure4=data['secure4'];
        console.log('Secteur Agent '+this.secteurAgentDefault);
        this.listSecteur=this.secteurAgent.split(',');
        this.listSecteur.pop();

        //this.status=data['status'];

        this.typeActivite=data['typeactivite'];
        this.natureActivite=data['natureactivite'];

        this.equipementsList=data['equipement'];
        this.statusEquipement=data['statusequipement'];

        this.choixPaiementMobileList=data['paiementmobile'];
        this.listBanque=data['listbanques'];

        this.fonctionContri=data['fonctions'];
        this.zoneId=parseInt(data['zoneid']);
        this.deptId=parseInt(data['deptid']);
        this.EquipementsRefIdString=data['equipementId'];

        this.agentId=data["idAgent"];

        this.listEquipementRefId=this.EquipementsRefIdString.split(',');

      }
      else
      {
        console.log('test adama '+data);
        this.status='ko';
      }
  
    }).catch(
      data=>{console.log("test failled "+ data);}
    )
    
  }


  async initialiserAES()
  {
    this.secure4encrypted=await this.aes256.generateSecureIV(this.secure4);
    this.securekeyencrypted=await this.aes256.generateSecureKey(this.securekey);
  }

  async encrypteddata(data:string)
  {
    await this.aes256.encrypt(this.securekeyencrypted,this.secure4encrypted,data).then(data=>{
      this.dataencrypted=data;
    })
  }

  async decrypteddata(data:string)
  {
   await this.aes256.decrypt(this.securekeyencrypted,this.secure4encrypted,data).then(data=>{
      this.datadecrypted=data;
    })
  }


  
  //Récupérer les différentes taxes à laquelle le contribuable est soumis au contribuable

  getTaxes(typeActivite:String,natureActivite:String,equipement:String):Promise<any>{

    console.log("type selected "+typeActivite+"  nature selected"+natureActivite);
    return this.httpclient.get(this.url_test+"calculertaxes?typeactivite="+typeActivite+"&natureactivite="+natureActivite+"&equipement="+equipement+"&zone="+this.zoneId+"&dept="+this.deptId).toPromise().then(
      data=>{
        
        if(data["status"]=="ok")
        {
          this.statusnatact=data['statusnatact'];
          this.statustypact=data['statustypact'];
          this.statusequip=data['statuseq'];


        if(data["statustypact"]=="ok")
        {
           this.taxesTypeActivite=data["taxestypact"];
           console.log("taxes type service "+this.taxesTypeActivite);
        }
        if(data["statuseq"]=="ok")
        {
          this.taxesEquipement=data["taxesequip"];
          console.log("taxes equipement service"+this.taxesEquipement);
        }
        if(data["statusnatact"]=="ok")
        {
          this.taxesNatureActivite=data["taxesnatact"];
          console.log("taxes nature service "+this.taxesNatureActivite);
        }

      }
      else
      {
          this.statusnatact='ko';
          this.statustypact='ko';
          this.statusequip='ko';
      }

        //console.log(JSON.stringify(data));
      },
     ).catch(erreur=>{
       alert("ECHEC CONNECTION !");
       console.log('Erreur '+erreur);
     });
  }

 

   getCurrentPosition():Promise<any> {
  
  return this.geolocalisation.getCurrentPosition().then((resp) => {
   this.latitude=resp.coords.latitude
    this.longitude=resp.coords.longitude
 }).catch((error) => {
   console.log('Error getting location', error);
 });

    console.log('Current '+this.longitude+ ' '+this.latitude );
  }

  getKlpnum():Promise<any>
  {
    return this.httpclient.get(this.url_base+'getKlpnum?ctrId='+this.ctrId).toPromise().then(data=>{
      if(data['status']=='ok')
      {
        this.klpnum=data['klpnum'];
        console.log('numero klispay '+this.klpnum);
      }
      
    }).catch(error=>{
      alert('ECHEC RECUPERATION DU NUMERO KLISPAY.')

    })
  }

  getEnroler(contact:String,identifica:String,localisation:String,activite:String,
    taxes:String,equip:String,paiement:String,agent:String,img:String,dataequip:String):Promise<any>
  {
    /*this.contactEnrol=contact;
    this.identificaEnrol=identifica;
    this.localisationEnrol=localisation;
    this.activiteEnrol=activite;
    this.taxesEnrol=taxes;
    this.equipEnrol=equip;
    this.paiementEnrol=paiement;
    this.agentEnrol=agent;*/

   /* let body=new HttpParams();
   body.append("identification",identifica.toString());
   body.append("contact",contact.toString());
   body.append("localisation",localisation.toString());*/
    return this.httpclient.post(this.url_base+'enroler?'+'identification='+identifica+
    '&contact='+contact+'&localisation='+localisation
    +'&activite='+activite+
    '&taxes='+taxes
    +'&equipement='+equip
    +'&paiementprefere='+paiement
    +'&agent='+agent+'&deleteEquip='+dataequip,img).toPromise().then(data=>{

      if(data['status']=='ok'){
        this.statusEnrolement=true;
        this.statusEnrolementExist=false;
        this.ctrId=Number(data['klpnum']);
        
        
      }
      else if(data['status']=='exist')
      {
        this.statusEnrolement=false;
        this.statusEnrolementExist=true;
        let nombre=data['nombre'];
        let msg="message";
        
        for (let index = 0; index < parseInt(nombre); index++) {
         let doublonsContribuable=new ModelPossibleDoublons();
          let datareturn=data[msg+index];
          let data11=datareturn.split(',');
            doublonsContribuable.rsoc=data11[0];
          doublonsContribuable.secteur=data11[1];

          doublonsContribuable.zone=data11[2];
          doublonsContribuable.klpnum=data11[3];

          doublonsContribuable.nina=data11[4];
          
          this.listDoublonsContribuable.push(doublonsContribuable);
          
        }
        console.log(this.listDoublonsContribuable);
        
        //alert('CE CONTRIBUABLE EXISTE DEJA DANS LA BASE DE DONNEES');
      }

      else if(data['status']=='ko')
      {
        this.statusEnrolement=false;
        this.statusEnrolementExist=false;
        alert(data['msg']);
      }
      else
      {
        this.statusEnrolement=false;
        this.statusEnrolementExist=false;
      }

    }).catch(data=>{

      this.statusEnrolement=false;
      this.statusEnrolementExist=false;
      let dataJson=JSON.parse(data);
      alert(JSON.stringify(data));
      
    /*console.log("status  "+data['status']);
      console.log("echec get enroler "+JSON.stringify(data))*/
    });

  }

 
returnKlp():Promise<any>
{
 return this.httpclient.get('http://51.254.49.161:8081/WebServiceKLP/getContribByKlpnum?klpnum=ML1-GSOG-30').toPromise().then(
    data=>{
      let test1=data['identification'];
      console.log(test1['raisonSociale']);
    }
  )
}

disconnectBluetooth()
{
  this.bluetooth.disconnect().then(data=>{
    console.log("deconnecté ble")
  }).catch(data=>{
    console.log("erreur deconnection ")
  })

}

printQrCode(qrcodedata:string)
{
  const justify_center = '\x1B\x61\x01';
  const justify_left   = '\x1B\x61\x00';
  const qr_model       = '\x33';          // 31 or 32
  const qr_size        = '\x08';          // size
  const qr_eclevel     = '\x33';          // error correction level (30, 31, 32, 33 - higher)
  const qr_data        =qrcodedata.toString();
  const qr_pL          =String.fromCharCode((qr_data.length + 3) % 256);
  const qr_pH          =String.fromCharCode((qr_data.length + 3) / 256);
 this.bluetooth.write(justify_center+justify_center +
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

connectBluetooth():Promise<any>{
 return this.bluetooth.connect(this.macAddress).toPromise().then(
   data=>{
   this.afficherBluetooth=false;
  console.log("Etat service "+this.afficherBluetooth);}
 ).catch(data=>{
   
  this.afficherBluetooth=false;
  console.log("Etat service "+this.afficherBluetooth);
   console.log("erreur connection bluetooth");
 })
}

async activeBluetooth()
{
  return await this.bluetooth.enable();
}
async storageNameBluetooth()
{
  if(this.macAddress!=null && this.macAddress.length >4 && this.macAddress!="")
  {
   return await   this.nativeStorage.setItem('bluetooth',this.macAddress).then(data=>{
    }).catch(error=>{
      alert('enregistrement erreur ');
    })
  }

  else
  {
    alert("ADRESSE MAC VIDE");
  }
 
}

async getStorageNameBluetooth()
{
  return await this.nativeStorage.getItem('bluetooth').then(data=>{
    this.macAddress=data;
    console.log("test enregistrement "+this.macAddress+" "+JSON.stringify(data))
  });
}


ConfigurePrinter(){
  this.nativeStorage.getItem('bluetooth').then(data=>{
    this.macAddress=data;
    this.bluetooth.connect(this.macAddress).subscribe(data=>{
      this.afficherBluetooth=false;
      
    })
  })
}

test(){
  this.httpclient.get("http://localhost:8080/webservice/getContribByKlpnum?klpnum=ML2-M1N-5&nameSecteur=MARCHE 1 - SECTEUR 1 TEST ").toPromise().then(
    data=>{
      console.log(JSON.stringify(data))
    }
  )
}



getContribByOrgnum(orgnum:String,nina:String,klpnum:String,klpnump:String): Observable <DataEnrolementComplet> 
{
 console.log(this.idsecteurAgent);
  return this.httpclient.get<DataEnrolementComplet>(this.url_base+"getContribByOrgnum?orgnum="+orgnum+"&sectid="+Number(this.idsecteurAgent)+"&nina="
  +nina+"&klpnum="+klpnum+"&klpnump="+klpnump);
  
}





}
