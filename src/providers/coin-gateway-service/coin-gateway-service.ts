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

    BTCMARKETS_BASE_URL = "https://api.btcmarkets.net";
    BTCMARKETS_MARKET_PATH = "/market";
    BTCMARKETS_TICK_PATH = "/tick";

    constructor(public http: Http) {
        console.log('Hello CoinGatewayServiceProvider Provider');
    }

    getMarketTick(crypto: string, fiat: string): Promise<any[]> {
        switch (crypto) {
            case "BTC":
            case "ETH": {
                let api = this.BTCMARKETS_BASE_URL + this.BTCMARKETS_MARKET_PATH + "/" + crypto + "/" + fiat + this.BTCMARKETS_TICK_PATH;
                console.log(api);
                return this.http.get(api)
                .toPromise()
                .then(response => response.json() as any[])
                .catch(this.handleError);
            }
            case "MIOTA":
        }
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
