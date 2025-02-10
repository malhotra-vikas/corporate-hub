import { UpdateFileDto } from "@/dto/updateFile.dto";
import BaseApi from "./_baseApi";
import UserApi from "./user.api";

import { FileCreationDto } from "@/dto/docFileCreation.dto";
import { CreateFileDto } from "@/dto/createFile.dto";

export default class VaultApi extends BaseApi {
  
  baseUrl: string = "vault/";
  getUniqueFieldValues: any;
  constructor() {
    super();
  }

  async uploadComppanyHistoricDocuments(companyFilings: any, user_id: string) {


    console.log("IN UI companyFilings is ", JSON.stringify(companyFilings, null, 2)); // log the body

    const data = await VaultApi.post(
      `${this.baseUrl}upload-company-historic-files-to-vault?user_id=${user_id}`,
      companyFilings
    );
    return data;
  }

  async uploadDocuments(dto: FormData) {

    console.log("HI")
    // Log form data manually to inspect it (FormData cannot be logged directly)
    for (let [key, value] of dto.entries()) {
      console.log(`${key}: ${value}`);
    }

    const data = await VaultApi.post(
      `${this.baseUrl}upload-files-to-vault`,
      dto,
    );
    return data;
  }
  async getSpecificFiles(dto: { user_id: string }) {
    const data = await VaultApi.post(`${this.baseUrl}getSpecificFiles`, dto);
    return data;
  }

  async getFileByFileId(dto: { file_id: string }) {
    const data = await VaultApi.post(`${this.baseUrl}getFileByFileId`, dto);
    return data;
  }

  async fetchCompanyPastDocuments(dto: { ticker: string, fileType: string, duration: string }) {
    const data = await VaultApi.post(`${this.baseUrl}getSECFiles`, dto);
    return data;
  }

  async deleteFile(dto: { fileId: string }) {
    const data = await VaultApi.post(`${this.baseUrl}deleteFile`, dto);
    return data;
  }
  async bulkDelete(ids: string[]) {
    const data = await VaultApi.delete(`${this.baseUrl}bulkDelete`, ids);
    return data;
  }
  async updateFiles(dto: UpdateFileDto[]) {
    const data = await VaultApi.post(`${this.baseUrl}bulkUpdate`, dto);
    return data;
  }
  async textToWord(dto: FileCreationDto) {
    const data = await VaultApi.post(`${this.baseUrl}texttoWord`, dto);
    return data;
  }
  async getFileData(dto: {
    user_id: string;
    docType: string;
    fileId?: string;
  }) {
    const data = await VaultApi.post(`${this.baseUrl}pdfToText`, dto);
    return data;
  }
  async createFile(dto: CreateFileDto) {
    const data = await VaultApi.post(`${this.baseUrl}createFile`, dto);
    return data;
  }

  async createFileFromText(dto: CreateFileDto) {
    const data = await VaultApi.post(`${this.baseUrl}createFileFromText`, dto);
    return data;
  }
  
  async getPaginatedData(
    user_id: string,
    paginationNumber: number,
    pageNo: number,
  ) {
    const paginatedData = await VaultApi.post(`${this.baseUrl}paginatedData`, {
      user_id,
      paginationNumber,
      pageNo,
    });
    return paginatedData;
  }
}

// Utility function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


