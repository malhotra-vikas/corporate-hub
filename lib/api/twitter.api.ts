import { TwitterDto } from "@/dto/twitter.dto";
import BaseApi from "./_baseApi";
import { date } from "yup";

export default class TwitterApi extends BaseApi {

  baseUrl: string = "twitter/";
  getUniqueFieldValues: any;
  constructor() {
    super();
  }

  async getTwitterAccountByUserId(userId: string) {
    const response = await TwitterApi.get(`${this.baseUrl}status`, {
      params: { userId: userId }, // Pass `_id` as a query param
    });
    return response.data;
  }


  async publishPost(post: string, userId: string) {
    const response = await TwitterApi.post(`${this.baseUrl}tweet`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: { 
        userId, // ✅ Ensure Twitter ID is sent
        content: post 
      }, // ✅ Fix: Pass as JSON body instead of query params
    });
    return response.data;
  }

  async getTweetsForUserAndCompany(userId: string) {
    const response = await TwitterApi.get(`${this.baseUrl}user-tweets`, {
      params: { userId: userId }, // Pass `_id` as a query param
    });
    return response.data;
  }

}
