import { Component, OnInit } from '@angular/core';
import { ModelPossibleDoublons } from '../models/model-possible-doublons';

import {EnrollementService} from '../service/enrollement/enrollement.service';

import { Router,NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-doublons-contribuable',
  templateUrl: './doublons-contribuable.page.html',
  styleUrls: ['./doublons-contribuable.page.scss'],
})
export class DoublonsContribuablePage implements OnInit {
listDoublonsContrbi=new Array<ModelPossibleDoublons>();
  constructor(private service:EnrollementService,private router:Router) {
    this.listDoublonsContrbi=this.service.listDoublonsContribuable;
   }

  ngOnInit() {
    this.listDoublonsContrbi=this.service.listDoublonsContribuable;
  }

  selectElement(i)
  {
    alert(this.listDoublonsContrbi[i].klpnum);
  }

  returnEnrolement()
  {
    this.router.navigate(['/enrollement']);
  }

}
