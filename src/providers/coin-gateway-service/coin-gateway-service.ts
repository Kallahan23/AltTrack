import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/*
Generated class for the CoinGatewayServiceProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class CoinGatewayServiceProvider {

    CRYPTOCOMPARE_BASE_URL = "https://min-api.cryptocompare.com/data";
    CRYPTOCOMPARE_PRICE_PATH = "/price";


    COINSPOT_BASE_URL = "https://www.coinspot.com.au/pubapi";
    COINSPOT_LATEST_PATH = "/latest";

    BTCMARKETS_BASE_URL = "https://api.btcmarkets.net";
    BTCMARKETS_MARKET_PATH = "/market";
    BTCMARKETS_TICK_PATH = "/tick";

    constructor(public http: Http) {
        console.log('Hello CoinGatewayServiceProvider Provider');
    }

    getMarketTick(crypto: string, fiat: string): Promise<number> {
        switch (crypto) {
            case "BTC":
            case "BCH":
            case "LTC":
            case "ETC":
            case "XRP":
            case "ETH": {
                let api = this.BTCMARKETS_BASE_URL + this.BTCMARKETS_MARKET_PATH + "/" + crypto + "/" + fiat + this.BTCMARKETS_TICK_PATH;
                return this.http.get(api)
                .toPromise()
                .then(response => response.json()["lastPrice"] as number)
                .catch(this.handleError);
            }
            case "DOGE": {
                let api = this.COINSPOT_BASE_URL + this.COINSPOT_LATEST_PATH;
                return this.http.get(api)
                .toPromise()
                .then(response => response.json()["prices"]["doge"]["last"] as number)
                .catch(this.handleError);
            }
            case "IOTA": {
                let api = this.CRYPTOCOMPARE_BASE_URL + this.CRYPTOCOMPARE_PRICE_PATH;
                let params: URLSearchParams = new URLSearchParams();
                params.set("fsym", crypto);
                params.set("tsyms", fiat);
                return this.http.get(api, {
                    search: params
                })
                .toPromise()
                .then(response => response.json()[fiat] as number)
                .catch(this.handleError);
            }
        }
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
