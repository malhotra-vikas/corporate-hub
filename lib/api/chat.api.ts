import { NewChaDto, UpdateChaDto } from "@/dto/chat.dto";
import BaseApi from "./_baseApi";

export default class ChatApi extends BaseApi {
  baseUrl: string = "chat/";

  constructor() {
    super();
  }

  async newChat(dto: NewChaDto) {
    const data = await ChatApi.post(`${this.baseUrl}newChat`, dto);

    console.log("New chat created as ", data);
    return data;
  }
  async updateChat(dto: UpdateChaDto) {
    console.log("chat updateed with  as ", dto);

    const data = await ChatApi.post(`${this.baseUrl}updateChat`, dto);
    return data;
  }

  async getChatById(dto: { id: string }) {
    console.log("Called getChatById ", dto);
    const data = await ChatApi.get(`${this.baseUrl}chatById/${dto?.id}`);
    return data;
  }

  async getAllChat(dto: { id: string }) {
    console.log("Called getAllChat ", dto);

    const data = await ChatApi.get(`${this.baseUrl}getAllChatsbyId/${dto?.id}`);
    console.log("Returned chat threads are ", data);

    return data;
  }
}
