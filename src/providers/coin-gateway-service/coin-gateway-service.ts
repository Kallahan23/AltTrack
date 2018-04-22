import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { Coin } from '../../entities/coin';

/*
Generated class for the CoinGatewayServiceProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class CoinGatewayServiceProvider {

    private COINMARKETCAP_BASE_URL = "https://api.coinmarketcap.com"
    private COINMARKETCAP_TICKER_URL = "/v1/ticker/"

    constructor(private http: HttpClient) {
        console.log('Hello CoinGatewayServiceProvider Provider')
    }

    getMarketTick(crypto: Coin, base: string): Observable<number> {
        let api = this.COINMARKETCAP_BASE_URL + this.COINMARKETCAP_TICKER_URL + crypto.coinmarketcap_id + "/";

        let params = {
            "convert": base
        };

        return this.http.get<number>(api, { params: params }).pipe(
            map(response => Number(response[0]["price_".concat(base.toLowerCase())]) as number),
            catchError(this.handleError('getMarketTick', 0))
        )
    }

    getAllCoins(base: string): Observable<any[]> {
        let api = this.COINMARKETCAP_BASE_URL + this.COINMARKETCAP_TICKER_URL + "/";

        let params = {
            "convert": base,
            "limit": "100"
        };

        return this.http.get(api, { params: params }).pipe(
            catchError(this.handleError('getMarketTick', 0))
        )
    }

    /**
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

}
