import * as XLSX from "xlsx";


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




export const parseExcelFile = async (
  buffer: ArrayBuffer,
  division: string,
  month: string,
  year: string,
  data: any[]
) => {
  try {
    // load workbook & pick the sheets
    const workbook: any = XLSX.read(new Uint8Array(buffer), { type: "array" });
    console.log("gggg", workbook.Sheets);

    // Define the expected sheet names
    const sheetNames: { [key: string]: string } = {
      Zonaldata: "Zonal data",
      Unitdata: "Unit data",
    };

    // const sheetNames: { [key: string]: string} = {

    // }
    console.log("sheet names start")
    // Create a new object with sheets that are found in workbook.Sheets using includes
    const sheets: { [key: string]: any } = Object.keys(sheetNames).reduce(
      (acc: { [key: string]: any }, key: string) => {
        const sheetName = sheetNames[key].trim(); // Trim the sheet name
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
    console.log("sheets", sheets)
    console.log("Available sheet keys:", Object.keys(workbook.Sheets))
    console.log("Expected sheet names:", Object.values(sheetNames))

    // date strings
    const formattedDate = getMonthYear(month, year);
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

        // Only skip if the row is empty
        if (isEmpty) break;

        rows.push(rowData);
      }

      return rows;
    };

    //   const finalData = {}
    console.log("parseSheetWithAlphaKeys(sheets.completionReports)", parseSheetWithAlphaKeys(sheets.completionReports))

    // assemble finalData
    const finalData = {
      zonaldata: sheets.Zonaldata
        ? parseSheetWithAlphaKeys(sheets.Zonaldata).map((row) => ({
          division,
          date: formattedDate,
          figure: detectFigureUnit(sheets.Zonaldata),
          index: row.a,
          planheadno: row.b,
          planheadname: row.c,
          fglastyear: row.d,
          actualforthemonthlastyear: row.e,
          actualforthemonththisyear: row.f,

          rgbopenline: row.g,
          rgbconst: row.h,
          rgbtotal: row.i,

          actualuptothemonthlastyearopenline: row.j,
          actualuptothemonthlastyearconst: row.k,
          actualuptothemonthlastyeartotal: row.l,

          actualforthemonthopenline: row.m,
          actualforthemonthconst: row.n,
          actualforthemonthtotal: row.o,

          actualforthemonthlastyearopenline: row.p,
          actualforthemonthlastyearconst: row.q,
          actualforthemonthlastyeartotal: row.r,
          //   missing s,t,u in the above, added below
          actualuptothemonthopenline: row.s,
          actualuptothemonthconst: row.t,
          actualuptothemonthtotal: row.u,

          utilizationofopenline: row.v,
          utilizationofconst: row.w,
          utilizationoftotal: row.x,

        })) : [],
      unitdata: sheets.Unitdata
        ? parseSheetWithAlphaKeys(sheets.Unitdata).map((row) => ({
          division,
          date: formattedDate,
          figure: detectFigureUnit(sheets.Unitdata),
          index: row.a,
          au: row.b,
          planheadname: row.c,
          rglastyear: row.d,
          actualtotheendoflastyear: row.e,
          actualforthemonthlastyear: row.f,
          actualforthemonth: row.g,
          percentageutilization: row.h,
        })) : [],



      selectedMonthYear,
      division,
    };
    console.log("excel extracted data", finalData)

    // const enrichedData = data.map((item) => ({
    //   ...item,
    //   date: selectedMonthYear,
    //   division,
    // }));

    return { finalData };
  } catch (error: any) {
    console.error("Error parsing Excel file:", error.message);
    return { finalData: {} };
  }
};









// Convert month to "MM/YYYY" format
export const getMonthYear = (month: string, year: any) => {
  const monthMap: { [key: string]: string } = {
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
  return `${monthMap[month]}/${year}`;
};









export const parseSheetWithHeaders = (sheet: any): any[] => {
  const ref = sheet["!ref"];
  if (!ref) return [];

  const range = XLSX.utils.decode_range(ref);
  const data: any[] = [];
  let headerRow = range.s.r;

  // 1) Find the real header row (>=2 non-empty text cells)
  for (let r = range.s.r; r <= range.e.r; r++) {
    let nonEmptyCount = 0;
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })];
      if (cell && typeof cell.v === "string" && cell.v.trim() !== "") {
        nonEmptyCount++;
      }
    }
    if (nonEmptyCount >= 2) {
      headerRow = r;
      break;
    }
  }

  // 2) Read headers
  const headers: string[] = [];
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell = sheet[XLSX.utils.encode_cell({ r: headerRow, c: C })];
    headers.push(
      cell && cell.v != null ? cell.v.toString().trim() : `UNKNOWN_${C}`
    );
  }

  const stopKeywords = ["total", "gross total"];

  // 3) Read data rows
  for (let R = headerRow + 1; R <= range.e.r; ++R) {
    // peek at first column to see if we should stop
    const firstAddr = XLSX.utils.encode_cell({ r: R, c: range.s.c });
    const rawFirst = sheet[firstAddr]?.v;
    const firstVal =
      rawFirst != null ? rawFirst.toString().trim().toLowerCase() : "";

    if (stopKeywords.some((k) => firstVal.includes(k))) {
      break;
    }

    const rowObj: Record<string, any> = {};
    let isEmpty = true;

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const addr = XLSX.utils.encode_cell({ r: R, c: C });
      const raw = sheet[addr]?.v;
      // empty or "-" → null
      const val = raw === undefined || raw === "" || raw === "-" ? null : raw;
      if (val != null) isEmpty = false;
      rowObj[headers[C - range.s.c]] = val;
    }

    // if the entire row is blank, stop parsing
    if (isEmpty) break;

    data.push(rowObj);
  }

  return data;
}