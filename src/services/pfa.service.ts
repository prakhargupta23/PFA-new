import axios from "axios";
import { config } from "../shared/constants/config";

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
export const submitPfaData = async (finalData: PfaFinalData) => {
  try {
    const response = await axios.post(`${API_URL}/api/pfa-data`, finalData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error submitting PFA data:", error?.response?.data ?? error.message);
    throw error;
  }
};

export const pfaService = {
  submitPfaData,
};
