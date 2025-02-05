import { CreateUserDto } from "@/dto/createUser.dto";
import BaseApi from "./_baseApi";
import { LoginDto } from "@/dto/login.dto";
import { VerifyUserDto } from "@/dto/verifyUser.dto";

export default class UserApi extends BaseApi {

  baseUrl: string = "users/";
  getUniqueFieldValues: any;
  constructor() {
    super();
  }

  async login(dto: LoginDto) {
    const data = await UserApi.post(`${this.baseUrl}login`, dto);
    return data;
  }

  async getBuyerQualifications(email: string) {
    const data = await UserApi.get(`${this.baseUrl}getUserByEmail/${email}`);
    return data;
  }

  async updateBuyerQualifications(payload: any) {
    const data = await UserApi.post(
      `${this.baseUrl}update-buyer-qualifications`,
      payload,
    );
    return data;
  }

  async getAllBuyer() {
    const data = await UserApi.get(`${this.baseUrl}getAllBuyer`);
    return data;
  }

  async approveBuyer(payload: any) {
    const data = await UserApi.post(`${this.baseUrl}approve`, payload);
    return data;
  }

  async resetPassword(payload: VerifyUserDto) {
    const { password, keycloak_id, username } = payload;
    const query = `new_password=${password}&keycloak_id=${keycloak_id}&username=${username}`;
    const data = await UserApi.get(`${this.baseUrl}reset-password?${query}`);
    return data;
  }

  async createUser(dto: CreateUserDto) {
    const data = await UserApi.post(`${this.baseUrl}create-user`, dto);
    return data;
  }

  async verifyUser(payload: { userId: string }) {
    const data = await UserApi.post(`${this.baseUrl}verify`, payload);
    return data;
  }
  async getAllClient() {
    const data = await UserApi.get(`${this.baseUrl}getAllClient`);
    return data?.data;
  }
  async getClientByEmail(email: string) {
    const data = await UserApi.get(`${this.baseUrl}getUserByEmail/${email}`);
    return data?.data;
  }
  async disableUser(payload: { _id: string; is_disabled: string }) {
    const data = await UserApi.post(`${this.baseUrl}disableUser`, payload);
    return data;
  }
  async updateUser(payload: CreateUserDto) {
    const data = await UserApi.post(`${this.baseUrl}update-user`, payload);
    return data;
  }

  async updateUserByEmail(payload: CreateUserDto) {
    const data = await UserApi.post(`${this.baseUrl}update-user-by-email`, payload);
    return data;
  }  

  async updateAdminInstruction(payload: {
    user_id: string;
    PRchatInstruction: string;
    ECSchatInstruction: string;
    QnAchatInstruction: string;
  }) {
    const data = await UserApi.post(`${this.baseUrl}adminInstruction`, payload);
    return data;
  }
  async getAdminInstruction() {
    const data = await UserApi.get(`${this.baseUrl}getAdminInstruction`);
    return data;
  }
  async getAccessToken(body: { refresh_token: string }) {
    const data = await UserApi.post(`${this.baseUrl}refreshToken`, body);
    return data;
  }

  async getPaginatedData(param: { paginationNumber: number; pageNo: number }) {
    const queryString = `paginationNumber=${param.paginationNumber}&pageNo=${param.pageNo}`;

    const paginatedData = await UserApi.get(
      `${this.baseUrl}getAllClients?${queryString}`,
    );
    return paginatedData;
  }

  async getAllCompanies() {
    const data = await UserApi.get(`${this.baseUrl}getAllCompanies`);
    return data;
  }
}
