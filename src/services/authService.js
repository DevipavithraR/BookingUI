import { repository } from "../repositories/authRepository";
import { dispatch } from "../store/store";
import { ReduxStorageManager } from "../store/reduxStorageManager";
import { API_URL_MAP } from "../utils/constants";

class Service {
  constructor() {
    this.repository = repository;
  }

  // response contains { success, data?, message}
  //in any method, if you want to do any business logic with data... do it and replace in response.data if needed before return response...
  async login(data) {
    const response = await this.repository.login(data);
    if (response.success && response.data) {
      const { user, token } = response.data;
      // Store session
      ReduxStorageManager.setSessionData({ user, token });
    } else {
      ReduxStorageManager.setSessionData({});
    }
    return response;
  }

  async logout() {
    // ReduxStorageManager.logout();
    // Clear Redux state (redux-persist will wipe storage too)
    dispatch({ type: API_URL_MAP.USERS.LOGOUT() });
  }
}

export const service = new Service();
