import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable, Subscription } from 'rxjs/Rx';

import { CoinGatewayServiceProvider } from '../../providers/coin-gateway-service/coin-gateway-service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    cryptoCurrencies = [
        { name: "Ethereum", code: "ETH" },
        { name: "Bitcoin", code: "BTC" },
        // { name: "Miota", code: "MIOTA" }
    ]

    timerSubscription: Subscription;
    currentCrypto: string = "ETH";
    latestPrice: number;

    constructor(
        public navCtrl: NavController,
        private storage: Storage,
        private menuCtrl: MenuController,
        private coinService: CoinGatewayServiceProvider
    ) {
        this.setDefaults();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad HomePage');
        this.menuCtrl.enable(true, "left");
        this.menuCtrl.open("left");
    }

    setDefaults() {
        this.storage.get("defaultsSet")
        .then(status => {
            if (!status) {
                this.storage.set("defaultsSet", true);
                this.storage.set("myFiatCurrency", "AUD")
                .then(() => {
                    this.setSubscriptions();
                });
            } else {
                this.setSubscriptions();
            }
        });
    }

    setSubscriptions() {
        let timer = Observable.timer(20, 60000); // Interval set for 60 seconds (60000)
        this.timerSubscription = timer.subscribe(t => this.getCurrentPrice());
    }

    getCurrentPrice() {
        this.storage.get("myFiatCurrency")
        .then(fiat => {
            if (fiat) {
                this.coinService.getMarketTick(this.currentCrypto, fiat)
                .then(response => {
                    this.latestPrice = response["lastPrice"];
                });
            }
        });
    }

    changeCoin(coin) {
        this.currentCrypto = coin.code;
        this.getCurrentPrice();
    }

}