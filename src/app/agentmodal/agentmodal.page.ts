import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-agentmodal',
  templateUrl: './agentmodal.page.html',
  styleUrls: ['./agentmodal.page.scss'],
})
export class AgentmodalPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }
//////////////////////////////
async closeModalAgent() {
  await this.modalController.dismiss();
 // console.log('code de retour', this.returnCode);
}
}
