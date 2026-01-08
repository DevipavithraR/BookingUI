import { repository } from "../repositories/samplesRepository";
import {
  transformSampleApiData,
  transformSampleForAPI,
} from "../utils/transformApiData";

class Service {
  constructor() {
    this.repository = repository;
  }
  // response contains { success, data?, message}
  //in any method, if you want to do any business logic with data... do it and replace in response.data before return response...
  async getAll(from, to) {
    const response = await this.repository.getAll(from, to);
    if (response.success && response.data) {
      response.data = transformSampleApiData(response.data);
    }
    return response;
  }
  async create(data) {
    console.log("bfr: pur: ", data.pur_date);
    data = transformSampleForAPI(data);
    console.log("aftr: pur: ", data.pur_date);
    const response = await this.repository.create(data);
    // do anything if you want with data(response.data) before return
    return response;
  }
  async update(id, data) {
    data = transformSampleForAPI(data);
    const response = await this.repository.update(id, data);
    // do anything if you want with data(response.data) before return
    return response;
  }
  async delete(id) {
    const response = await this.repository.delete(id);
    // do anything if you want with data(response.data) before return
    return response;
  }
}

export const service = new Service();
