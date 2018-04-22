import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';

import { ComponentsModule } from '../components/components.module';
import { DelayedLoadingAnimationComponent } from '../components/delayed-loading-animation/delayed-loading-animation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { CoinGatewayServiceProvider } from '../providers/coin-gateway-service/coin-gateway-service';

import { AppState } from './app.global';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        SettingsPage
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ComponentsModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({
            name: "altTrackSettings"
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        SettingsPage
    ],
    providers: [
        AppState,
        DelayedLoadingAnimationComponent,
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        CoinGatewayServiceProvider
    ]
})
export class AppModule {}
