import { Injectable } from '@angular/core';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
@Injectable({
  providedIn: 'root'
})
export class ServiceKlispayService {
  macAddress:string="00:12:12:12:33:33";
  afficherBluetooth:boolean=false;
  constructor(private bluetooth:BluetoothSerial,
    private nativeStorage:NativeStorage) { }


    
disconnectBluetooth()
{
  this.bluetooth.disconnect().then(data=>{
    console.log("deconnecté ble")
  }).catch(data=>{
    console.log("erreur deconnection ")
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
  this.bluetooth.connect(this.macAddress).subscribe(data=>{
    this.afficherBluetooth=false;
    console.log("connect "+JSON.stringify(data));
    
  })
  /*this.nativeStorage.getItem('bluetooth').then(data=>{
    this.macAddress=data;
    this.bluetooth.connect(this.macAddress).subscribe(data=>{
      this.afficherBluetooth=false;
      
    })
  }).catch(data=>{
    console.log("erreur storage "+JSON.stringify(data));
  })*/
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

    // alert('qrcode '+JSON.stringify(data))
  }).catch(data1=>{
    alert('qrcode false '+JSON.stringify(data1))
  })
}
}
