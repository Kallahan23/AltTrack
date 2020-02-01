import { Component } from '@angular/core';

import { LoadingController, Loading } from 'ionic-angular';

/**
 * Generated class for the DelayedLoadingAnimationComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
    selector: 'delayed-loading-animation',
    templateUrl: 'delayed-loading-animation.html'
})
export class DelayedLoadingAnimationComponent {

    loadingPresented: boolean;
    loading: Loading;
    loadingTimer: any;
    loadingOptions = {
        spinner: "crescent"
    };

    constructor(private loadingCtrl: LoadingController) {
        console.log('Hello DelayedLoadingAnimationComponent Component');
    }

    start(delay: number) {
        this.loading = this.loadingCtrl.create(this.loadingOptions);
        this.loadingPresented = false;
        this.loadingTimer = setTimeout(() => {
            this.loading.present();
            this.loadingPresented = true;
        }, delay);
    }

    finish() {
        if (this.loadingPresented) {
            this.loading.dismiss();
        } else {
            clearTimeout(this.loadingTimer);
        }
    }

}
