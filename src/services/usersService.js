import { repository } from "../repositories/usersRepository";
import { ReduxStorageManager } from "../store/reduxStorageManager";
import { API_URL_MAP } from "../utils/constants";
import { transformLHApiData } from "../utils/transformApiData";

class Service {
  constructor() {
    this.repository = repository;
  }
  async fetchAllLoginHistories() {
    const response = await this.repository.fetchAllLoginHistories();
    if (response.success && response.data) {
      response.data = transformLHApiData(response.data);
    }
    return response;
  }

  async fetchUserLoginHistory(id) {
    const response = await this.repository.fetchUserLoginHistory(id);
    if (response.success && response.data) {
      console.log(response.data);
      response.data = transformLHApiData(response.data);
      console.log(response.data);
    }
    return response;
  }

  async logout() {
    const response = await this.repository.logout();
    if (response.success) {
      ReduxStorageManager.logout();
    }
    return response;
  }
}

export const service = new Service();
