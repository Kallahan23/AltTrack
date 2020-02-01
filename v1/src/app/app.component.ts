import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AppState } from './app.global';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = HomePage;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public global: AppState, public storage: Storage) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            if (platform.is("cordova")) {

                splashScreen.hide();

                // TODO this isn't nice
                this.storage.get("theme")
                .then(theme => {
                    if (theme === "dark-theme") {
                        statusBar.backgroundColorByHexString('24172F');
                    } else {
                        statusBar.backgroundColorByHexString('488aff');
                    }
                });
            }
        });
    }

}
