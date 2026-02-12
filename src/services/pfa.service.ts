import axios from "axios";
import { config } from "../shared/constants/config";
import { fetchWrapper } from "../helpers/fetch-wrapper";

const API_URL = config.apiUrl;

export interface PfaFinalData {
  zonaldata?: any[];
  unitdata?: any[];
  workingExpenditure?: any[];
  planHead?: any[];
  [key: string]: any;
}

/**
 * Submit parsed PFA Excel data to the backend.
 * @param finalData - The parsed data from pfaUtils.parseExcelFile (finalData)
 * @returns Backend response
 */
export const submitPfaData = (finalData: PfaFinalData) => {
  try {
    console.log("finalData", finalData);
    const response = fetchWrapper.post(`${config.apiUrl}/api/upload-zonal-data`, finalData);
    console.log("response", response);
    return response;
  } catch (error: any) {
    console.error("Error submitting PFA data:", error?.response?.data ?? error.message);
    throw error;
  }
};

export const pfaService = {
  submitPfaData,
};
