
import axios from "axios";
import { config } from "../shared/constants/config";
import { fetchWrapper } from "../helpers/fetch-wrapper";

export const dashboardService = {
  getUploadDashboardData,
  getOweUploadDashboardData,
  getDashboardData,
  getCapexData
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
  console.log("getting dashboard data")
  const response = await axios.post(
    `${config.apiUrl}/api/get-dashboard-data`,
    {
      month,
      year
    }
  );
  console.log("get dashboard data response", response.data);

  return response.data;
};

async function getCapexData() {
  console.log("getting capex data")
  const response = await fetchWrapper.get(
    `${config.apiUrl}/api/get-capex-data`
  );
  console.log("get capex data response", response.data);
  return response.data;
}
