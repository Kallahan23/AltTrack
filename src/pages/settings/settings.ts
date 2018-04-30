import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AppState } from '../../app/app.global';

import { StatusBar } from '@ionic-native/status-bar';

import { Portfolio } from '../../entities/portfolio';

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

    baseCurrencies = [
        "AUD",
        "USD",
        "BTC"
    ];
    baseSelected: string;

    portfolioEnable: boolean;
    portfolios: Portfolio[];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private storage: Storage,
        private alertCtrl: AlertController,
        public global: AppState,
        public statusBar: StatusBar,
        public platform: Platform
    ) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SettingsPage');
        // TODO concurrent promises more efficient

        this.storage.get("theme")
        .then(theme => {
            if (theme === "dark-theme") {
                this.darkThemeSelected = true;
            }

            this.storage.get("baseCurrency")
            .then(baseCurrency => {
                if (baseCurrency) {
                    this.baseSelected = baseCurrency;
                }

                this.storage.get("portfolios")
                .then(portfolios => {
                    if (portfolios) {
                        this.portfolios = portfolios;
                    }

                    this.storage.get("portfolioEnable")
                    .then(portfolioEnable => {
                        if (portfolioEnable) {
                            this.portfolioEnable = portfolioEnable;
                        }
                    });
                });
            });
        });
    }

    clearPortfolio(index: number) {
        let alert = this.alertCtrl.create({
            title: "Delete Portfolio",
            subTitle: "Are you sure you want to delete this coin?",
            buttons: [
                {
                    text: "Yes",
                    handler: data => {
                        console.log("Deleting: ", this.portfolios[index]);
                        this.portfolios.splice(index, 1);
                        this.storage.set("portfolios", this.portfolios);
                    }
                },
                {
                    text: "No",
                    role: "cancel",
                    handler: data => {
                        console.log("Cancel clicked");
                    }
                }
            ]
        });
        alert.present();
    }

    changeTheme() {
        if (this.darkThemeSelected) {
            this.global.set("theme", "dark-theme");
            this.storage.set("theme", "dark-theme");
            if (this.platform.is("cordova")) {
                this.statusBar.backgroundColorByHexString('24172F');
            }

        } else {
            this.global.set("theme", "light-theme");
            this.storage.set("theme", "light-theme");
            if (this.platform.is("cordova")) {
                this.statusBar.backgroundColorByHexString('488aff');
            }
        }
    }

    changeBase(base: string) {
        this.global.set("baseCurrency", base);
        this.storage.set("baseCurrency", base);
    }

    togglePortfolio() {
        this.global.set("portfolioEnable", this.portfolioEnable);
        this.storage.set("portfolioEnable", this.portfolioEnable);
    }

    dismiss() {
        this.navCtrl.pop();
    }

}
