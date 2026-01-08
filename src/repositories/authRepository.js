import { apiClient } from "../api/apiClients";
import {
  API_RESOURCE_CONSTANTS,
  API_URL_MAP,
  HTTP_METHODS,
} from "../utils/constants";

class Repository {
  constructor() {
    this.apiClient = apiClient;
    this.apiEP = API_RESOURCE_CONSTANTS.AUTH;
  }

  async login(data) {
    return this.apiClient.apiCall(
      "authRepository:login",
      API_URL_MAP.COMMON.URL_WITH_ANY(this.apiEP, API_RESOURCE_CONSTANTS.LOGIN),
      HTTP_METHODS.POST,
      data
    );
  }
  async register(data) {
    return this.apiClient.apiCall(
      "authRepository:register",
      API_URL_MAP.COMMON.URL_WITH_ANY(
        this.apiEP,
        API_RESOURCE_CONSTANTS.REGISTER
      ),
      HTTP_METHODS.POST,
      data
    );
  }
}

export const repository = new Repository();
