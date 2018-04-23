import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular'
import { Storage } from '@ionic/storage'

import { AppState } from '../../app/app.global'

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

    portfolios: Portfolio[];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private storage: Storage,
        public global: AppState
    ) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SettingsPage')
        // TODO concurrent promises more efficient

        this.storage.get("theme")
        .then(theme => {
            if (theme === "dark-theme") {
                this.darkThemeSelected = true
            }

            this.storage.get("baseCurrency")
            .then(baseCurrency => {
                if (baseCurrency) {
                    this.baseSelected = baseCurrency
                }

                this.storage.get("portfolios")
                .then(portfolios => {
                    if (portfolios) {
                        this.portfolios = portfolios;
                        console.log(this.portfolios)
                    }
                })
            })
        })
    }

    clearPortfolio(index: number) {
        console.log("Deleting: ", this.portfolios[index]);
        this.portfolios.splice(index, 1);
        this.storage.set("portfolios", this.portfolios);
    }

    changeTheme() {
        if (this.darkThemeSelected) {
            this.global.set("theme", "dark-theme");
            this.storage.set("theme", "dark-theme");

        } else {
            this.global.set("theme", "light-theme");
            this.storage.set("theme", "light-theme");
        }
    }

    changeBase(base: string) {
        this.global.set("baseCurrency", base);
        this.storage.set("baseCurrency", base);
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
