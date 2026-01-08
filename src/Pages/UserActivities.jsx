import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../store/slicers/themeSlice";
import { useToast } from "../components/Notifications/ToastDemo";
import NeonLoader from "../sub-components/loaders/LoadingUI";
import { service } from "../services/usersService";
import UserActivitiesSection from "../components/UserActivities/UserActivitiesSection";
import { LOADING_MSG } from "../utils/constants";

const Page = () => {
  const darkMode = useSelector(selectDarkMode);
  const toast = useToast(darkMode);
  const [data, setData] = useState([]);
  const [selectedLoginRecord, setSelectedLoginRecord] = useState(null);
  const [userLoginHistory, setUserLoginHistory] = useState([]);

  // Fetch all login histories
  const fetchAllLoginHistories = useCallback(async () => {
    const response = await service.fetchAllLoginHistories();
    if (response.success) {
      setData(response.data);
    } else {
      toast.error(response.message);
      setData([]);
    }
    return response;
  }, []);

  // Fetch specific user's login history
  const fetchUserLoginHistory = useCallback(async (userId) => {
    const response = await service.fetchUserLoginHistory(userId);
    if (response.success) {
      setUserLoginHistory(response.data);
    } else {
      toast.error(response.message);
      setUserLoginHistory([]);
    }
    return response;
  }, []);

  // Handle user selection
  const handleLoginRecordSelect = async (lr) => {
    setSelectedLoginRecord(lr);
    await fetchUserLoginHistory(lr.user.id);
  };

  // Reset to show all users
  const handleBackToActivities = () => {
    setSelectedLoginRecord(null);
    setUserLoginHistory([]);
  };

  // Initial data load
  useEffect(() => {
    fetchAllLoginHistories();
  }, [fetchAllLoginHistories]);

  if (!data) {
    return <NeonLoader text={LOADING_MSG} />;
  }

  return (
    <div className="px-1 lg:px-7 space-y-10 w-full">
      {data && (
        <UserActivitiesSection
          darkMode={darkMode}
          data={data}
          selectedLoginRecord={selectedLoginRecord}
          userLoginHistory={userLoginHistory}
          onRecordSelect={handleLoginRecordSelect}
          onBackClick={handleBackToActivities}
        />
      )}
    </div>
  );
};

export default Page;
