import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
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

    filterQuery: string = "";

    cryptoCurrencies: Coin[];
    displayedCryptoCurrencies: Coin[];

    timerSubscription: Subscription;
    currentCrypto: Coin;
    latestPrice: number;

    portfolios: Portfolio[];
    portfolioCoinsOwned: number;
    portfolioAmountInvested: number;

    constructor(
        public navCtrl: NavController,
        private storage: Storage,
        private menuCtrl: MenuController,
        private loader: DelayedLoadingAnimationComponent,
        private coinService: CoinGatewayServiceProvider,
        public global: AppState
    ) {
        this.configureSettings();
        this.getAllCoins();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad HomePage');
        this.menuCtrl.enable(true, "left");
        this.menuCtrl.open("left");
    }

    ionViewDidEnter() {
        this.refreshPortfolios();
        this.getCurrentPrice();
        console.log("ionViewDidEnter HomePage");
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
                            this.storage.set("portfolioEnable", true)
                            .then((portfolioEnable) => {
                                this.global.set("theme", theme);
                                this.global.set("baseCurrency", base);
                                this.global.set("portfolioEnable", portfolioEnable);
                                this.setSubscriptions();
                            });
                        });
                    });
                });
            } else {
                this.storage.get("theme")
                .then(theme => {
                    this.global.set("theme", theme);

                    this.storage.get("baseCurrency")
                    .then(base => {
                        this.global.set("baseCurrency", base);

                        this.storage.get("portfolioEnable")
                        .then(portfolioEnable => {
                            this.global.set("portfolioEnable", base);

                            this.setSubscriptions();
                        });
                    });
                });
            }
        });
    }

    setSubscriptions() {
        let timer = Observable.timer(20, 300000); // Interval set for 5 minutes (300'000 ms)
        this.timerSubscription = timer.subscribe(t => this.getCurrentPrice());
    }

    filterItems(ev: any) {
        // Reset displayed coins
        this.displayedCryptoCurrencies = this.cryptoCurrencies;

        // Searchbar value
        let val = ev.target.value;

        // Filter
        if (val && val.trim() != '') {
            this.displayedCryptoCurrencies = this.displayedCryptoCurrencies.filter((item) => {
                return (item.name.concat(" ", item.code).toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }

    getCurrentPrice() {
        if (this.currentCrypto) {
            let baseCurrency = this.global.get("baseCurrency");
            if (baseCurrency) {
                this.latestPrice = 0;
                this.loader.start(200);
                this.coinService.getMarketTick(this.currentCrypto, baseCurrency)
                .subscribe(price => {
                    this.latestPrice = price;
                    this.loader.finish();
                    console.log(price);
                })
            } else {
                console.warn("Warning: no base currency set.");
            }
        }
    }

    changeCoin(coin: Coin) {
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
            .subscribe(coins => {
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
                this.displayedCryptoCurrencies = this.cryptoCurrencies = tempCoins;
                this.loader.finish();
            })
        } else {
            console.warn("Warning: no base currency set.");
        }
    }

    openSettings(ev: any) {
        this.navCtrl.push(SettingsPage);
    }

    // getPortfolios() {
    //     this.storage.get("portfolios")
    //     .then(portfolios => {
    //         if (portfolios) {
    //             this.portfolios = portfolios;
    //         }
    //     });
    // }

    refreshPortfolios() {
        this.storage.get("portfolios")
        .then(portfolios => {
            if (portfolios) {
                this.portfolios = portfolios;
                if (this.currentCrypto) {
                    this.changePortfolio(this.currentCrypto.code);
                }
            }
        });
    }

    updatePortfolio() {
        if (this.currentCrypto && this.portfolioCoinsOwned && this.portfolioAmountInvested && this.portfolioCoinsOwned + this.portfolioAmountInvested > 0) {
            let newPortfolio: Portfolio = {
                code: this.currentCrypto.code,
                coinsOwned: this.portfolioCoinsOwned,
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
                    this.portfolioCoinsOwned = portfolio.coinsOwned;
                    this.portfolioAmountInvested = portfolio.amountInvested;
                }
            });
            if (!exists) {
                this.portfolioCoinsOwned = null;
                this.portfolioAmountInvested = null;
            }
        } else {
            this.portfolioCoinsOwned = null;
            this.portfolioAmountInvested = null;
        }
    }

    breakEvenPoint(): number {
        if (this.portfolioAmountInvested && this.portfolioCoinsOwned) {
            return this.portfolioAmountInvested / this.portfolioCoinsOwned;
        } else {
            return 0;
        }
    }

    walletValue(): number {
        return this.latestPrice * this.portfolioCoinsOwned;
    }

    profit(): number {
        return this.walletValue() - this.portfolioAmountInvested;
    }

    performRefresh(refresher) {
        console.log('Begin async refresh');
        if (this.currentCrypto) {
            let baseCurrency = this.global.get("baseCurrency");
            if (baseCurrency) {
                this.latestPrice = 0;
                this.coinService.getMarketTick(this.currentCrypto, baseCurrency)
                .subscribe(price => {
                    this.latestPrice = price;
                    console.log('Finish async refresh', price);
                    refresher.complete();
                })
            } else {
                console.warn("Warning: no base currency set.");
                refresher.complete();
            }
        } else {
            console.warn("Warning: no currency selected.");
            refresher.complete();
        }
    }

}
