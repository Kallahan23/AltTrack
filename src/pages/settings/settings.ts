import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular'
import { Storage } from '@ionic/storage'

import { AppState } from '../../app/app.global'

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

    darkThemeSelected: boolean

    baseCurrencies = [
        "AUD",
        "USD",
        "BTC"
    ]
    baseSelected: string

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
            })
        })
    }

    changeTheme() {
        if (this.darkThemeSelected) {
            this.global.set("theme", "dark-theme")
            this.storage.set("theme", "dark-theme")

        } else {
            this.global.set("theme", "light-theme")
            this.storage.set("theme", "light-theme")
        }
    }

    changeBase(base: string) {
        this.global.set("baseCurrency", base)
        this.storage.set("baseCurrency", base)
    }

    dismiss() {
        this.viewCtrl.dismiss()
    }

}
