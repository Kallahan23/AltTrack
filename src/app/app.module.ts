import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';

import { ComponentsModule } from '../components/components.module';
import { DelayedLoadingAnimationComponent } from '../components/delayed-loading-animation/delayed-loading-animation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CoinGatewayServiceProvider } from '../providers/coin-gateway-service/coin-gateway-service';

@NgModule({
    declarations: [
        MyApp,
        HomePage
    ],
    imports: [
        BrowserModule,
        HttpModule,
        ComponentsModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({
            name: "altTrackSettings"
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage
    ],
    providers: [
        DelayedLoadingAnimationComponent,
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        CoinGatewayServiceProvider
    ]
})
export class AppModule {}
