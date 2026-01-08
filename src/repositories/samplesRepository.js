import { apiClient } from "../api/apiClients";
import {
  API_RESOURCE_CONSTANTS,
  API_URL_MAP,
  date_formats,
  HTTP_METHODS,
} from "../utils/constants";

class Repository {
  constructor() {
    this.apiClient = apiClient;
    this.apiEP = API_RESOURCE_CONSTANTS.SAMPLES;
  }

  async create(data) {
    return this.apiClient.apiCall(
      "samplesRepository:create",
      API_URL_MAP.COMMON.URL(this.apiEP),
      HTTP_METHODS.POST,
      data
    );
  }
  async getAll(from, to) {
    return this.apiClient.apiCall(
      "samplesRepository:getAll",
      API_URL_MAP.COMMON.URL_WITH_DATE(this.apiEP, from, to),
      HTTP_METHODS.GET
    );
  }
  async getById(id) {
    return this.apiClient.apiCall(
      "samplesRepository:getById",
      API_URL_MAP.COMMON.URL_WITH_ID(this.apiEP, id),
      HTTP_METHODS.GET
    );
  }
  async update(id, data) {
    return this.apiClient.apiCall(
      "samplesRepository:update",
      API_URL_MAP.COMMON.URL_WITH_ID(this.apiEP, id),
      HTTP_METHODS.PUT,
      data
    );
  }

  async delete(id) {
    return this.apiClient.apiCall(
      "samplesRepository:delete",
      API_URL_MAP.COMMON.URL_WITH_ID(id),
      HTTP_METHODS.DELETE
    );
  }
}

export const repository = new Repository();
