import * as XLSX from "xlsx";

export const fileToBase64 = (file: File): Promise<string> => {
  console.log("fileToBase64 converting");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const monthMap: any = {
  January: "01",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  August: "08",
  September: "09",
  October: "10",
  November: "11",
  December: "12",
};

export const allMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const parseAuditExcelFile = async (
  buffer: ArrayBuffer,
  division: string,
  month: string,
  year: string,
  data: any[]
) => {
  try {
    // load workbook & pick the sheets
    const workbook: XLSX.WorkBook = XLSX.read(new Uint8Array(buffer), { type: "array" });
    console.log("Audit Workbook Sheets:", workbook.Sheets);

    // Initial draft: Assuming same structure as CAPEX for now as placeholders
    const sheetNames: { [key: string]: string } = {
      AuditData: "Audit data",
      // AuditSummary: "Audit summary",
    };
    console.log("Audit Sheet Names:", sheetNames);

    const sheets: { [key: string]: XLSX.WorkSheet } = Object.keys(sheetNames).reduce(
      (acc: { [key: string]: XLSX.WorkSheet }, key: string) => {
        const sheetName = sheetNames[key].trim();
        const sheetKeys = Object.keys(workbook.Sheets);

        const matchedSheetKey =
          sheetKeys.find(
            (sheetKey) =>
              sheetKey.trim().toLowerCase() === sheetName.toLowerCase()
          ) ||
          sheetKeys.find((sheetKey) =>
            sheetKey.trim().toLowerCase().includes(sheetName.toLowerCase())
          );

        if (matchedSheetKey && workbook.Sheets[matchedSheetKey]) {
          acc[key] = workbook.Sheets[matchedSheetKey];
        }

        return acc;
      },
      {}
    );

    const formattedDate = getAuditMonthYear(month, year);
    const selectedMonthYear = formattedDate;

    // detect “Thousand” or “Crore”
    const detectFigureUnit = (sheet: XLSX.WorkSheet): string | null => {
      for (const addr of Object.keys(sheet)) {
        if (addr.startsWith("!")) continue;
        const v = sheet[addr].v;
        if (typeof v === "string") {
          const lc = v.toLowerCase();
          if (lc.includes("thousand")) return "Thousand";
          if (lc.includes("crore")) return "Crore";
        }
      }
      return null;
    };

    // unified parser: alpha-keys + drop “total” rows and below
    const parseSheetWithAlphaKeys = (sheet: XLSX.WorkSheet | undefined): any[] => {
      if (!sheet) return [];
      const ref = sheet["!ref"] || "";
      if (!ref) return [];

      const { s, e } = XLSX.utils.decode_range(ref);

      // find first numeric row
      let startRow: number | null = null;
      for (let r = s.r; r <= e.r; r++) {
        for (let c = s.c; c <= e.c; c++) {
          const cell = sheet[XLSX.utils.encode_cell({ r, c })];
          if (cell && typeof cell.v === "number") {
            startRow = r;
            break;
          }
        }
        if (startRow !== null) break;
      }

      if (startRow === null) return [];

      const rows: any[] = [];
      for (let r = startRow; r <= e.r; r++) {
        const rowData: Record<string, any> = {};
        let isEmpty = true;

        for (let c = s.c; c <= e.c; c++) {
          const addr = XLSX.utils.encode_cell({ r, c });
          const cellValue = sheet[addr]?.v;
          if (cellValue != null && cellValue !== "") isEmpty = false;
          rowData[String.fromCharCode(97 + (c - s.c))] = cellValue ?? null;
        }

        if (isEmpty) break;
        rows.push(rowData);
      }

      return rows;
    };

    // assemble finalData
    const finalData = {
      auditdata: sheets.AuditData
        ? parseSheetWithAlphaKeys(sheets.AuditData).map((row) => ({
          division,
          date: formattedDate,
          figure: detectFigureUnit(sheets.AuditData),
          index: row.a,
          unit: row.b,
          typeOfAuditObj: row.c,
          openingBalance: row.d,
          accretion: row.e,
          clearanceOld: row.f,
          clearanceNew: row.g,
          closingBalance: row.h,
          lessThanOneYearOld: row.i,
          moreThanOneYearOld: row.j,
          total: row.k,
        })) : [],
      // auditsummary: sheets.AuditSummary
      //   ? parseSheetWithAlphaKeys(sheets.AuditSummary).map((row) => ({
      //     division,
      //     date: formattedDate,
      //     figure: detectFigureUnit(sheets.AuditSummary),
      //     colA: row.a,
      //     colB: row.b,
      //     colC: row.c,
      //     colD: row.d,
      //     colE: row.e,
      //     colF: row.f,
      //     colG: row.h,
      //   })) : [],
      selectedMonthYear,
      division,
    };

    return { finalData };
  } catch (error: any) {
    console.error("Error parsing Audit Excel file:", error.message);
    return { finalData: {} };
  }
};

// Convert month to "MM/YYYY" format
export const getAuditMonthYear = (month: string, year: any) => {
  const localMonthMap: { [key: string]: string } = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };
  return `${localMonthMap[month]}/${year}`;
};
