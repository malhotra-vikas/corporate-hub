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
}
