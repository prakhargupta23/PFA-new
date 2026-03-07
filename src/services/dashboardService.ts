
import axios from "axios";
import { config } from "../shared/constants/config";

export const dashboardService = {
  getUploadDashboardData,
  getOweUploadDashboardData,
  getDashboardData
}

async function getUploadDashboardData() {
  const response = await axios.get(
    `${config.apiUrl}/api/get-zonal-months`,
    // {
    //   params: { month, year }
    // }
  );
  console.log("dashboard data", response.data);
  return response.data;
};

async function getOweUploadDashboardData() {
  const response = await axios.get(
    `${config.apiUrl}/api/get-gross-earnings-months`,
  );
  console.log("owe dashboard data", response.data);
  return response.data;
};


// import axios from "axios";
async function getDashboardData(month: number, year: number) {
  const response = await axios.post(
    `${config.apiUrl}/api/get-dashboard-data`,
    {
      month,
      year
    }
  );

  return response.data;
};
