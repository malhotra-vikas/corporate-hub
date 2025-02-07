import BaseApi from "./_baseApi";

export default class EarningsApi extends BaseApi {

  baseUrl: string = "earnings/";
  getUniqueFieldValues: any;
  constructor() {
    super();
  }


  async getEarningsForInterestsTickers(interestTickers: string) {
    const queryString = `tickers=${interestTickers}`;

    const earnings = await EarningsApi.get(
      `${this.baseUrl}getEarningsForInterestsTickers?${queryString}`,
    );

    console.log("IN getEarningsForInterestsTickers interestTickers is ", interestTickers)
    return earnings;
  }

  async addNewEarningsTicker(interestTicker: string) {
    const queryString = `ticker=${interestTicker}`;

    const earnings = await EarningsApi.get(
      `${this.baseUrl}addNewEarningsTicker?${queryString}`,
    );

    console.log("IN addNewEarningsTicker new interestTicker is ", interestTicker)
    return earnings;
  }  
}
