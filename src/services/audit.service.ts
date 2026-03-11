import { config } from "../shared/constants/config";
import { fetchWrapper } from "../helpers/fetch-wrapper";

const API_URL = config.apiUrl;

type RowData = Record<string, unknown>;

export interface AuditFinalData {
  auditdata?: RowData[];
  selectedMonthYear?: string;
  division?: string;
  [key: string]: unknown;
}

interface AuditUploadPayload {
  auditdata: RowData[];
  selectedMonthYear: string | null;
  division: string | null;
}

const normalizeRows = (rows: unknown): RowData[] => {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.filter((row): row is RowData => !!row && typeof row === "object");
};

const buildUploadPayload = (finalData: AuditFinalData): AuditUploadPayload => ({
  auditdata: normalizeRows(finalData.auditdata),
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
 * Submit parsed Audit Excel data to the backend.
 * @param finalData - The parsed data from auditUtils.parseAuditExcelFile
 * @returns Backend response
 */
export const submitAuditData = async (finalData: AuditFinalData) => {
  try {
    const payload = buildUploadPayload(finalData);

    if (payload.auditdata.length === 0) {
      throw new Error("No data found to upload. Please check the selected Excel file.");
    }
    console.log("Payload:", payload);
    // Assuming endpoint exists or will exist similar to zonal data
    const response = await fetchWrapper.post(`${API_URL}/api/upload-audit-data`, payload);
    console.log("Audit upload Response:", response);
    return response;
  } catch (error: any) {
    console.error("Error submitting Audit data:", error?.response?.data ?? error.message);
    throw error;
  }
};

export const getAuditMonths = async () => {
  console.log("getAuditMonths called");
  const response = await fetchWrapper.get(
    `${config.apiUrl}/api/get-audit-months`);
  // If response contains a data property (legacy or wrapper), return it, otherwise return response
  return response?.data ?? response;
}


export const getAuditData = async () => {
  console.log("getAuditData called");
  const response = await fetchWrapper.get(
    `${config.apiUrl}/api/get-audit-data`);
  // If response contains a data property (legacy or wrapper), return it, otherwise return response
  return response?.data ?? response;
}

export const auditService = {
  submitAuditData,
  getAuditMonths,
  getAuditData,
};
