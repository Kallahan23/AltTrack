import { Injectable } from '@angular/core'
import { Http, URLSearchParams } from '@angular/http'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'

import { Coin } from '../../entities/coin'

/*
Generated class for the CoinGatewayServiceProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class CoinGatewayServiceProvider {

    CRYPTOCOMPARE_BASE_URL = "https://min-api.cryptocompare.com/data"
    CRYPTOCOMPARE_PRICE_PATH = "/price"

    COINSPOT_BASE_URL = "https://www.coinspot.com.au/pubapi"
    COINSPOT_LATEST_PATH = "/latest"

    BTCMARKETS_BASE_URL = "https://api.btcmarkets.net"
    BTCMARKETS_MARKET_PATH = "/market"
    BTCMARKETS_TICK_PATH = "/tick"

    COINMARKETCAP_BASE_URL = "https://api.coinmarketcap.com"
    COINMARKETCAP_TICKER_URL = "/v1/ticker/"

    constructor(public http: Http) {
        console.log('Hello CoinGatewayServiceProvider Provider')
    }

    getMarketTick(crypto: Coin, base: string): Promise<number> {
        let api = this.COINMARKETCAP_BASE_URL + this.COINMARKETCAP_TICKER_URL + crypto.coinmarketcap_id + "/"
        let params: URLSearchParams = new URLSearchParams()
        params.set("convert", base)
        return this.http.get(api, {
            search: params
        })
        .toPromise()
        .then(response => Number(response.json()[0]["price_".concat(base.toLowerCase())]) as number)
        .catch(this.handleError)

        /********** Old Code ********/
        /*switch (crypto.code) {
            // BTC Markets
            case "BTC":
            case "BCH":
            case "LTC":
            case "ETC":
            case "XRP":
            case "ETH": {
                let api = this.BTCMARKETS_BASE_URL + this.BTCMARKETS_MARKET_PATH + "/" + crypto.code + "/" + base + this.BTCMARKETS_TICK_PATH
                return this.http.get(api)
                .toPromise()
                .then(response => response.json()["lastPrice"] as number)
                .catch(this.handleError)
            }
            // Coinspot
            case "DOGE": {
                let api = this.COINSPOT_BASE_URL + this.COINSPOT_LATEST_PATH
                return this.http.get(api)
                .toPromise()
                .then(response => Number(response.json()["prices"]["doge"]["last"]) as number)
                .catch(this.handleError)
            }
            // Coin Market Cap
            case "BTG":
            case "IOTA": {
                let api = this.COINMARKETCAP_BASE_URL + this.COINMARKETCAP_TICKER_URL + "/" + crypto.coinmarketcap_id
                let params: URLSearchParams = new URLSearchParams()
                params.set("convert", base)
                return this.http.get(api, {
                    search: params
                })
                .toPromise()
                .then(response => Number(response.json()[0]["price_".concat(base.toLowerCase())]) as number)
                .catch(this.handleError)
            }
        }*/
    }

    getAllCoins(base: string): Promise<any[]> {
        let api = this.COINMARKETCAP_BASE_URL + this.COINMARKETCAP_TICKER_URL + "/"
        let params: URLSearchParams = new URLSearchParams()
        params.set("convert", base)
        params.set("limit", "50")
        return this.http.get(api, {
            search: params
        })
        .toPromise()
        .then(response => response.json())
        .catch(this.handleError)
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error) // for demo purposes only
        return Promise.reject(error.message || error)
    }

}
