import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  //
  showSplash = true;
  //
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
     // this.splashScreen.hide();
      //
      timer(8000).subscribe(()=>this.showSplash = false);
    });
  }
     // click vers la page Details
     showDetails(detTitle: string) {
      this.navCtrl.navigateForward('/details/'+detTitle);
      console.log('detTitle', detTitle);
    }

    // aller vers la route indiquer dans goto
    goTo(route: string) {
    console.log('route', route);
    this.navCtrl.navigateForward(`${route}`);
    }
}
