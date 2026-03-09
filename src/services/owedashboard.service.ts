import { fetchWrapper } from "../helpers/fetch-wrapper";
import { config } from "../shared/constants/config";

const toSelectedMonthYear = (month: number, year: number): string => {
  const mm = String(month).padStart(2, "0");
  return `${mm}/${year}`;
};

export const oweService = {
  getOweData,
};

async function getOweData() {
  console.log("getOweData called");
  const response = await fetchWrapper.get(
    `${config.apiUrl}/api/get-owe-data`);
  console.log("owe data", response.data);
  return response.data;
}

