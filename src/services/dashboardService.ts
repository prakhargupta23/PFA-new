import axios from "axios";
import { config } from "../shared/constants/config";
export const getDashboardData = async (month: number, year: number) => {
  const response = await axios.get(
    `${config.apiUrl}/get-dashboard-data`,
    {
      params: {
        month,
        year
      }
    }
  );

  return response.data;
};
