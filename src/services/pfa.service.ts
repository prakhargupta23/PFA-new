import { config } from "../shared/constants/config";
import { fetchWrapper } from "../helpers/fetch-wrapper";

const API_URL = config.apiUrl;

type RowData = Record<string, unknown>;

export interface PfaFinalData {
  zonaldata?: RowData[];
  unitdata?: RowData[];
  selectedMonthYear?: string;
  division?: string;
  [key: string]: unknown;
}

interface ZonalUploadPayload {
  zonaldata: RowData[];
  unitdata: RowData[];
  selectedMonthYear: string | null;
  division: string | null;
}

const normalizeRows = (rows: unknown): RowData[] => {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.filter((row): row is RowData => !!row && typeof row === "object");
};

const buildUploadPayload = (finalData: PfaFinalData): ZonalUploadPayload => ({
  zonaldata: normalizeRows(finalData.zonaldata),
  unitdata: normalizeRows(finalData.unitdata),
  selectedMonthYear:
    typeof finalData.selectedMonthYear === "string" && finalData.selectedMonthYear.trim()
      ? finalData.selectedMonthYear.trim()
      : null,
  division:
    typeof finalData.division === "string" && finalData.division.trim()
      ? finalData.division.trim()
      : null,
});

/**
 * Submit parsed PFA Excel data to the backend.
 * @param finalData - The parsed data from pfaUtils.parseExcelFile (finalData)
 * @returns Backend response
 */
export const submitPfaData = async (finalData: PfaFinalData) => {
  try {
    const payload = buildUploadPayload(finalData);

    if (payload.zonaldata.length === 0 && payload.unitdata.length === 0) {
      throw new Error("No data found to upload. Please check the selected Excel file.");
    }

    const response = await fetchWrapper.post(`${API_URL}/api/upload-zonal-data`, payload);
    return response;
  } catch (error: any) {
    console.error("Error submitting PFA data:", error?.response?.data ?? error.message);
    throw error;
  }
};

export const pfaService = {
  submitPfaData,
};
