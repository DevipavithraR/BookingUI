import React from "react";
import MainPanel from "../components/Dashboard/MainContentArea/MainPanel";
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-screen">
      {/* <Sidebar /> */}
      <MainPanel />
    </div>
  );
};

export default DashboardLayout;