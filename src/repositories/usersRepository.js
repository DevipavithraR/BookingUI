import { apiClient } from "../api/apiClients";
import {
  API_RESOURCE_CONSTANTS,
  API_URL_MAP,
  HTTP_METHODS,
} from "../utils/constants";

class Repository {
  constructor() {
    this.apiClient = apiClient;
    this.apiEP = API_RESOURCE_CONSTANTS.USERS;
  }
  async fetchAllLoginHistories() {
    return this.apiClient.apiCall(
      "usersRepository:fetchAllLoginHistories",
      API_URL_MAP.COMMON.URL_WITH_ANY(
        this.apiEP,
        API_RESOURCE_CONSTANTS.ACTIVE
      ),
      HTTP_METHODS.GET
    );
  }

  async fetchUserLoginHistory(id) {
    return this.apiClient.apiCall(
      "usersRepository:fetchUserLoginHistory",
      API_URL_MAP.COMMON.URL_WITH_ID_ANY(
        this.apiEP,
        id,
        API_RESOURCE_CONSTANTS.LOGIN_HISTORY
      ),
      HTTP_METHODS.GET
    );
  }

  async logout() {
    return this.apiClient.apiCall(
      "usersRepository:logout",
      API_URL_MAP.COMMON.URL_WITH_ANY(
        this.apiEP,
        API_RESOURCE_CONSTANTS.LOGOUT
      ),
      HTTP_METHODS.POST,
      {}
    );
  }
}

export const repository = new Repository();
