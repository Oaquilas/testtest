
 import { LoadingController,AlertController } from '@ionic/angular';
export class LoadingCustom {
    public loading= new LoadingController();

    constructor()
        { }

       async  showloading(data:string)
        {
            let hideFooterTimeout = setTimeout( () => {
                this.loading.dismiss();
                }, 60000);

            let loadingcust=this.loading.create({
                message: data
              });
              return (await loadingcust).present();

        }
}
