import { Component } from '@angular/core'
import { NavController, MenuController, ModalController } from 'ionic-angular'
import { Storage } from '@ionic/storage'
import { Observable, Subscription } from 'rxjs/Rx'

import { SettingsPage } from '../settings/settings'

import { CoinGatewayServiceProvider } from '../../providers/coin-gateway-service/coin-gateway-service'

import { DelayedLoadingAnimationComponent } from '../../components/delayed-loading-animation/delayed-loading-animation'

import { AppState } from '../../app/app.global'

import { Coin } from '../../entities/coin'

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    // cryptoCurrencies: Coin[] = [
    //     { name: "Bitcoin", code: "BTC", coinmarketcap_id: "bitcoin" },
    //     { name: "Bitcoin Cash", code: "BCH", coinmarketcap_id: "bitcoin-cash" },
    //     { name: "Bitcoin Gold", code: "BTG", coinmarketcap_id: "bitcoin-gold" },
    //     { name: "Ethereum", code: "ETH", coinmarketcap_id: "ethereum" },
    //     { name: "Ethereum Classic", code: "ETC", coinmarketcap_id: "ethereum-classic" },
    //     { name: "Miota", code: "IOTA", coinmarketcap_id: "iota" },
    //     { name: "Ripple", code: "XRP", coinmarketcap_id: "ripple" },
    //     { name: "Litecoin", code: "LTC", coinmarketcap_id: "litecoin" },
    //     { name: "Dogecoin", code: "DOGE", coinmarketcap_id: "dogecoin" },
    // ]

    cryptoCurrencies: Coin[]

    timerSubscription: Subscription
    currentCrypto: Coin
    latestPrice: number

    constructor(
        public navCtrl: NavController,
        private storage: Storage,
        private menuCtrl: MenuController,
        private modalCtrl: ModalController,
        private loader: DelayedLoadingAnimationComponent,
        private coinService: CoinGatewayServiceProvider,
        public global: AppState
    ) {
        this.setDefaults()
        this.getAllCoins()
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad HomePage')
        this.menuCtrl.enable(true, "left")
        this.menuCtrl.open("left")
    }

    ionViewDidLeave() {
        this.timerSubscription.unsubscribe()
    }

    setDefaults() {
        this.storage.get("defaultsSet")
        .then(status => {
            if (!status) {
                this.storage.set("defaultsSet", true)
                this.storage.set("theme", "light-theme")
                this.storage.set("baseCurrency", "AUD")
                .then(() => {
                    this.setSubscriptions()
                })
            } else {
                this.storage.get("theme")
                .then(theme => {
                    this.global.set("theme", theme)
                    this.setSubscriptions()
                })
            }
        })
    }

    setSubscriptions() {
        let timer = Observable.timer(20, 60000) // Interval set for 60 seconds (60000 ms)
        this.timerSubscription = timer.subscribe(t => this.getCurrentPrice())
    }

    getCurrentPrice() {
        if (this.currentCrypto) {
            this.storage.get("baseCurrency")
            .then(baseCurrency => {
                if (baseCurrency) {
                    this.latestPrice = 0
                    this.loader.start(200)
                    this.coinService.getMarketTick(this.currentCrypto, baseCurrency)
                    .then(price => {
                        this.latestPrice = price
                        this.loader.finish()
                        console.log(price)
                    })
                }
            })
        }
    }

    changeCoin(coin) {
        if (this.currentCrypto != coin) {
            this.currentCrypto = coin
            this.getCurrentPrice()
        }
    }

    getAllCoins() {
        this.storage.get("baseCurrency")
        .then(baseCurrency => {
            if (baseCurrency) {
                this.loader.start(200)
                this.coinService.getAllCoins(baseCurrency)
                .then(coins => {
                    let tempCoins: Coin[] = []
                    coins.forEach(coin => {
                        let newCoin: Coin = {
                            name: coin.name,
                            code: coin.symbol,
                            rank: coin.rank,
                            coinmarketcap_id: coin.id
                        }
                        tempCoins.push(newCoin)
                    })
                    this.cryptoCurrencies = tempCoins
                    this.loader.finish()
                })
            }
        })
    }

    openSettings(event) {
        let modal = this.modalCtrl.create(SettingsPage)
        modal.onDidDismiss(data => {
            this.getCurrentPrice()
        })
        modal.present({
            ev: event
        })
    }

}
