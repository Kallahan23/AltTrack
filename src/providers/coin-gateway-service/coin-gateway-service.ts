import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
Generated class for the CoinGatewayServiceProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class CoinGatewayServiceProvider {

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
        }
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
