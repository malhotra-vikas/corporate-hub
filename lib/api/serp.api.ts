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

}
