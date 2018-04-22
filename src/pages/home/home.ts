import { Component } from '@angular/core';
import { NavController, MenuController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable, Subscription } from 'rxjs/Rx';

import { SettingsPage } from '../settings/settings';

import { CoinGatewayServiceProvider } from '../../providers/coin-gateway-service/coin-gateway-service';

import { DelayedLoadingAnimationComponent } from '../../components/delayed-loading-animation/delayed-loading-animation';

import { AppState } from '../../app/app.global';

import { Coin } from '../../entities/coin';
import { Portfolio } from '../../entities/portfolio';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    cryptoCurrencies: Coin[];

    timerSubscription: Subscription;
    currentCrypto: Coin;
    latestPrice: number;

    portfolios: Portfolio[];
    portfolioCoinsBought: number;
    portfolioAmountInvested: number;

    constructor(
        public navCtrl: NavController,
        private storage: Storage,
        private menuCtrl: MenuController,
        private modalCtrl: ModalController,
        private loader: DelayedLoadingAnimationComponent,
        private coinService: CoinGatewayServiceProvider,
        public global: AppState
    ) {
        this.configureSettings();
        this.getPortfolios();
        this.getAllCoins();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad HomePage');
        this.menuCtrl.enable(true, "left");
        this.menuCtrl.open("left");
    }

    ionViewDidLeave() {
        this.timerSubscription.unsubscribe();
    }

    configureSettings() {
        this.storage.get("defaultsSet")
        .then(defaultsSet => {
            if (!defaultsSet) {
                this.storage.set("defaultsSet", true)
                .then(() => {
                    this.storage.set("theme", "light-theme")
                    .then((theme) => {
                        this.storage.set("baseCurrency", "AUD")
                        .then((base) => {
                            this.global.set("theme", theme);
                            this.global.set("baseCurrency", base);
                            this.setSubscriptions();
                        })
                    })
                })
            } else {
                this.storage.get("theme")
                .then(theme => {
                    this.global.set("theme", theme);

                    this.storage.get("baseCurrency")
                    .then(base => {
                        this.global.set("baseCurrency", base);

                        this.setSubscriptions();
                    })
                })
            }
        })
    }

    setSubscriptions() {
        let timer = Observable.timer(20, 60000); // Interval set for 60 seconds (60000 ms)
        this.timerSubscription = timer.subscribe(t => this.getCurrentPrice());
    }

    getCurrentPrice() {
        if (this.currentCrypto) {
            let baseCurrency = this.global.get("baseCurrency");
            if (baseCurrency) {
                this.latestPrice = 0;
                this.loader.start(200);
                this.coinService.getMarketTick(this.currentCrypto, baseCurrency)
                .then(price => {
                    this.latestPrice = price;
                    this.loader.finish();
                    console.log(price);
                })
            } else {
                console.log("Warning: no base currency set.");
            }
        }
    }

    changeCoin(coin) {
        if (this.currentCrypto != coin) {
            // this.updatePortfolio();
            this.currentCrypto = coin;
            this.getCurrentPrice();
            this.changePortfolio(this.currentCrypto.code);
        }
    }

    getAllCoins() {
        let baseCurrency = this.global.get("baseCurrency");
        if (baseCurrency) {
            this.loader.start(200);
            this.coinService.getAllCoins(baseCurrency)
            .then(coins => {
                let tempCoins: Coin[] = [];
                coins.forEach(coin => {
                    let newCoin: Coin = {
                        name: coin.name,
                        code: coin.symbol,
                        rank: coin.rank,
                        coinmarketcap_id: coin.id
                    };
                    tempCoins.push(newCoin);
                })
                this.cryptoCurrencies = tempCoins;
                this.loader.finish();
            })
        } else {
            console.log("Warning: no base currency set.");
        }
    }

    openSettings(event) {
        let modal = this.modalCtrl.create(SettingsPage)
        modal.onDidDismiss(data => {
            this.getCurrentPrice();
        });
        modal.present({
            ev: event
        });
    }

    getPortfolios() {
        this.storage.get("portfolios")
        .then(portfolios => {
            if (portfolios) {
                this.portfolios = portfolios;
            }
        })
    }

    updatePortfolio() {
        if (this.currentCrypto && this.portfolioCoinsBought && this.portfolioAmountInvested && this.portfolioCoinsBought + this.portfolioAmountInvested > 0) {
            let newPortfolio: Portfolio = {
                code: this.currentCrypto.code,
                coinsBought: this.portfolioCoinsBought,
                amountInvested: this.portfolioAmountInvested
            };
            if (this.portfolios) {
                let exists = false;
                let existsAt = 0;
                this.portfolios.forEach((portfolio, index) => {
                    if (portfolio.code === newPortfolio.code) {
                        exists = true;
                        existsAt = index;
                    }
                });
                if (exists) {
                    this.portfolios[existsAt] = newPortfolio;
                } else {
                    this.portfolios.push(newPortfolio);
                }
            } else {
                this.portfolios = [ newPortfolio ];
            }
            this.storage.set("portfolios", this.portfolios);
        }
    }

    changePortfolio(coinCode: string) {
        if (this.portfolios) {
            let exists = false;
            this.portfolios.forEach(portfolio => {
                if (portfolio.code === coinCode) {
                    exists = true;
                    this.portfolioCoinsBought = portfolio.coinsBought;
                    this.portfolioAmountInvested = portfolio.amountInvested;
                }
            });
            if (!exists) {
                this.portfolioCoinsBought = null;
                this.portfolioAmountInvested = null;
            }
        } else {
            this.portfolioCoinsBought = null;
            this.portfolioAmountInvested = null;
        }
    }

    clearCurrentPortfolio() {
        let index = this.portfolios.findIndex(portfolio => {
            return portfolio.code === this.currentCrypto.code;
        });
        if (index > -1) {
            this.portfolios.splice(index);
            this.portfolioCoinsBought = null;
            this.portfolioAmountInvested = null;
            this.storage.set("portfolios", this.portfolios);
        }
    }

}
