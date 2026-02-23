import { fetchWrapper } from "../helpers/fetch-wrapper";
import { config } from "../shared/constants/config";
export const dashboardService = {
  getDashboardData,
};

async function getDashboardData(month: number, year: number) {
  return fetchWrapper.post(`${config.apiUrl}/api/get-dashboard-data`, {
    month,
    year,
  });
}

// import axios from "axios";
// export const getDashboardData = async (month: number, year: number) => {
//   const response = await axios.post(
//     "http://localhost:7071/api/get-dashboard-data",
//     {
//       month,
//       year
//     }
//   );

//   return response.data;
// };
