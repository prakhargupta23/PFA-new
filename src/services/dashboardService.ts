import axios from "axios";
export const getDashboardData = async (month: number, year: number) => {
  const response = await axios.post(
    "http://localhost:7071/api/get-dashboard-data",
    {
      month,
      year
    }
  );

  return response.data;
};
