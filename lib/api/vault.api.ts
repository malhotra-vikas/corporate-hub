import { UpdateFileDto } from "@/dto/updateFile.dto";
import BaseApi from "./_baseApi";
import { FileCreationDto } from "@/dto/docFileCreation.dto";
import { CreateFileDto } from "@/dto/createFile.dto";

export default class VaultApi extends BaseApi {
  baseUrl: string = "vault/";
  getUniqueFieldValues: any;
  constructor() {
    super();
  }

  async uploadDocuments(dto: FormData) {
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
