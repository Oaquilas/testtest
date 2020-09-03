import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-orange-modal',
  templateUrl: './orange-modal.page.html',
  styleUrls: ['./orange-modal.page.scss'],
})
export class OrangeModalPage implements OnInit {
// sanitize url
urlSafe: SafeResourceUrl;
returnCode: number = 1;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

 async closeModalOrange() {
    await this.modalController.dismiss(this.returnCode);
    console.log('code de retour', this.returnCode);
  }


}
