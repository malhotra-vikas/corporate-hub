import { CreateUserDto } from "@/dto/createUser.dto";
import BaseApi from "./_baseApi";
import { LoginDto } from "@/dto/login.dto";
import { VerifyUserDto } from "@/dto/verifyUser.dto";

export default class SerpApi extends BaseApi {



  baseUrl: string = "serp/";
  getUniqueFieldValues: any;
  constructor() {
    super();
  }

  async getCompanyDetails(param: { companyTicker: string, exchange: string }) {
    const queryString = `ticker=${param.companyTicker}&exchange=${param.exchange}`;

    const companyDetails = await SerpApi.get(
      `${this.baseUrl}getAllCompanyDataForTicker?${queryString}`,
    );
    return companyDetails;
  }

  async getCompanyDataViaFinancialModeling(ticker: string) {
    const queryString = `ticker=${ticker}`;

    const companyDetails = await SerpApi.get(
      `${this.baseUrl}getCompanyDataViaFinancialModeling?${queryString}`,
    );

    console.log("IN getCompanyDataViaFinancialModeling companyDetails is ", companyDetails)
    return companyDetails;
  }


  async getTrendingNews() {

    const news = await SerpApi.get(
      `${this.baseUrl}getTrendingNews`,
    );

    console.log("IN getTrendingNews news is ", news)
    return news;

  }

  async getCompanyTrackerNews(companyName: string, companyTicker: string) {
    // Construct the query string using the comma-separated tickers
    const queryString = `companyTicker=${companyTicker}&companyName=${companyName}`;

    console.log("IN getCompanyIndustryNews queryString is ", queryString)

    const news = await SerpApi.get(
      `${this.baseUrl}getCompanyTrackerNews?${queryString}`,
    );

    console.log("IN getCompanyTrackerNews news is ", news)
    return news;
}


  async getCompanyIndustryNews(companyIndustry: string) {

    // Construct the query string using the comma-separated tickers
    const queryString = `companyIndustry=${companyIndustry}`;

    //console.log("IN getCompanyIndustryNews queryString is ", queryString)

    const news = await SerpApi.get(
      `${this.baseUrl}getCompanyIndustryNews?${queryString}`,
    );

    //console.log("IN getCompanyIndustryNews news is ", news)
    return news;


  }

  async getCompanyCompetitorNews(competitorNames: any) {

    // Construct the query string using the comma-separated tickers
    const queryString = `tickers=${competitorNames}`;

    console.log("IN getCompanyCompetitorNews queryString is ", queryString)

    const news = await SerpApi.get(
      `${this.baseUrl}getCompanyCompetitorNews?${queryString}`,
    );

    console.log("IN getCompanyCompetitorNews news is ", news)
    return news;

  }

  async getCompanyCompetitorDataViaFinancialModeling(interestTickers: any) {

    // Convert the array of tickers into a comma-separated string
    const tickersString = interestTickers.join(',');

    // Construct the query string using the comma-separated tickers
    const queryString = `tickers=${tickersString}`;

    console.log("IN getCompanyCompetitorDataViaFinancialModeling queryString is ", queryString)

    const competitorsDetails = await SerpApi.get(
      `${this.baseUrl}getCompanyCompetitorDataViaFinancialModeling?${queryString}`,
    );

    console.log("IN getCompanyCompetitorDataViaFinancialModeling companyDetails is ", competitorsDetails)
    return competitorsDetails;
  }

}
