import { config } from "../shared/constants/config";
import { fetchWrapper } from "../helpers/fetch-wrapper";

const API_URL = config.apiUrl;

type RowData = Record<string, unknown>;

export interface OweFinalData {
  grossEarnings?: RowData[];
  workingExpenses?: RowData[];
  selectedMonthYear?: string;
  division?: string;
  [key: string]: unknown;
}

interface OweUploadPayload {
  grossEarnings: RowData[];
  workingExpenses: RowData[];
  selectedMonthYear: string | null;
  division: string | null;
}

/**
 * Ensures only valid row objects are sent
 */
const normalizeRows = (rows: unknown): RowData[] => {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.filter(
    (row): row is RowData => !!row && typeof row === "object"
  );
};

/**
 * Build clean upload payload
 */
const buildUploadPayload = (finalData: OweFinalData): OweUploadPayload => ({
  grossEarnings: normalizeRows(finalData.grossEarnings),
  workingExpenses: normalizeRows(finalData.workingExpenses),

  selectedMonthYear:
    typeof finalData.selectedMonthYear === "string" &&
    finalData.selectedMonthYear.trim()
      ? finalData.selectedMonthYear.trim()
      : null,

  division:
    typeof finalData.division === "string" &&
    finalData.division.trim()
      ? finalData.division.trim()
      : null,
});

/**
 * Submit parsed OWE Excel data to backend
 * @param finalData - Parsed result from oweUtils.parseFinancialExcel
 * @returns Backend response
 */
export const submitOweData = async (finalData: OweFinalData) => {
  try {
    const payload = buildUploadPayload(finalData);

    if (
      payload.grossEarnings.length === 0 &&
      payload.workingExpenses.length === 0
    ) {
      throw new Error(
        "No Gross Earnings or Working Expenses data found to upload."
      );
    }

    const response = await fetchWrapper.post(
      `${API_URL}/api/upload-owe-data`,
      payload
    );

    return response;
  } catch (error: any) {
    console.error(
      "Error submitting OWE data:",
      error?.response?.data ?? error.message
    );
    throw error;
  }
};

export const oweService = {
  submitOweData,
};
