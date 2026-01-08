import { createApiClient, setStorageManager } from "arffy-react-api-library";
import {
  BACKEND_SERVER_URL,
  API_WHITELIST_URLS,
  AUTH_REQUIRED_MSG,
  INSUFFICIENT_PERM_MSG,
  UNSUPPORTED_HTTP_METHOD_MSG,
  HTTP_METHODS,
  UNDEFINED,
  BLOB,
  CONTENT_TYPE,
  API_NOT_FOUND,
} from "../utils/constants";
import { ReduxStorageManager } from "../store/reduxStorageManager";

// Helper function to check if the payload is a FormData object
function isFormData(data) {
  // We check for FormData in the global scope to ensure compatibility
  return typeof FormData !== UNDEFINED && data instanceof FormData;
}

class ApiClient {
  constructor() {
    this.client = createApiClient(BACKEND_SERVER_URL, API_WHITELIST_URLS);
    setStorageManager(ReduxStorageManager);
    // some changes
  }
  async get(endpoint, config = {}) {
    const res = await this.client.get(endpoint, config);
    return res.data;
  }

  async getBlob(endpoint, config = {}) {
    const res = await this.client.get(endpoint, {
      ...config,
      responseType: BLOB,
    });
    return res;
  }

  // Modify the post method to handle FormData headers
  async post(endpoint, data, config = {}) {
    let finalConfig = config;

    if (isFormData(data)) {
      // IMPORTANT: Copy the config to avoid mutation side effects
      finalConfig = { ...config };

      // 1. Ensure headers object exists
      finalConfig.headers = {
        ...finalConfig.headers,
      };

      // 2. Set Content-Type to undefined. This is the TRICK to force the browser
      //    to correctly set the 'multipart/form-data; boundary=...' header.
      finalConfig.headers[CONTENT_TYPE] = undefined;
    }

    const res = await this.client.post(endpoint, data, finalConfig);
    return res.data;
  }

  async put(endpoint, data, config = {}) {
    const res = await this.client.put(endpoint, data, config);
    return res.data;
  }
  async delete(endpoint, config = {}) {
    const res = await this.client.delete(endpoint, config);
    return res.data;
  }
  apiCall = async (identity, url, method, data = null) => {
    try {
      let response;
      switch (method) {
        case HTTP_METHODS.GET:
          response = await this.get(url);
          break;
        case HTTP_METHODS.POST:
          console.log("post: ", data);
          response = await this.post(url, data);
          break;
        case HTTP_METHODS.PUT:
          response = await this.put(url, data);
          break;
        case HTTP_METHODS.DELETE:
          response = await this.delete(url);
          break;
      }

      if (response) {
        return response;
      } else {
        console.log(`${UNSUPPORTED_HTTP_METHOD_MSG} ${method}`);
        return {
          success: false,
          message: `${UNSUPPORTED_HTTP_METHOD_MSG} ${method}`,
        };
      }
    } catch (error) {
      // Return standardized error shape
      console.log(`${identity}:`, error);
      let message = error.message || NETWORK_ERROR;
      if (error.response) {
        if (error.response.status === 404) {
          message = API_NOT_FOUND;
        } else if (error.response.status === 401) {
          message = AUTH_REQUIRED_MSG;
        } else if (error.response.status === 403) {
          message = INSUFFICIENT_PERM_MSG;
        } else if (error.response.data && error.response.data.message) {
          message = error.response.data.message;
        }
      }
      return { success: false, message: message };
    }
  };
}
export const apiClient = new ApiClient();
