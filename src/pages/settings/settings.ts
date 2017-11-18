import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AppState } from '../../app/app.global';

/**
* Generated class for the SettingsPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
})
export class SettingsPage {

    darkThemeSelected: boolean;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private storage: Storage,
        public global: AppState
    ) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SettingsPage');
        this.storage.get("theme")
        .then(theme => {
            if (theme === "dark-theme") {
                this.darkThemeSelected = true;
            }
        });
    }

    changeTheme() {
        if (this.darkThemeSelected) {
            this.global.set('theme', "dark-theme");
            this.storage.set("theme", "dark-theme");

        } else {
            this.global.set('theme', "light-theme");
            this.storage.set("theme", "light-theme");
        }
    }



}
