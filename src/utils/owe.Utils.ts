import * as XLSX from "xlsx";

type ParsedRow = Record<string, unknown>;

const getMonthNumber = (month: string): string => {
  const monthMap: Record<string, string> = {
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

  return monthMap[month] ?? "01";
};

const normalizeSheetKey = (name: string): string =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const colToAlpha = (n: number): string => {
  let col = "";
  let value = n;

  while (value >= 0) {
    col = String.fromCharCode((value % 26) + 97) + col;
    value = Math.floor(value / 26) - 1;
  }

  return col;
};

const detectFigureUnit = (sheet: XLSX.WorkSheet): string | null => {
  for (const addr of Object.keys(sheet)) {
    if (addr.startsWith("!")) continue;

    const value = sheet[addr]?.v;
    if (typeof value !== "string") continue;

    const lc = value.toLowerCase();
    if (lc.includes("crore")) return "Crore";
    if (lc.includes("thousand")) return "Thousand";
  }

  return null;
};

const parseSheetRows = (
  sheet: XLSX.WorkSheet,
  sheetName: string,
  division: string,
  selectedMonthYear: string
): ParsedRow[] => {
  const ref = sheet["!ref"];
  if (!ref) return [];

  const range = XLSX.utils.decode_range(ref);
  const figure = detectFigureUnit(sheet);

  let startRow: number | null = null;

  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })];
      if (cell && typeof cell.v === "number") {
        startRow = r;
        break;
      }
    }

    if (startRow !== null) break;
  }

  if (startRow === null) return [];

  const rows: ParsedRow[] = [];
  let emptyRowStreak = 0;

  for (let r = startRow; r <= range.e.r; r++) {
    const rowData: Record<string, unknown> = {};
    let hasValue = false;

    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      const cellValue = sheet[addr]?.v ?? null;
      const alphaKey = colToAlpha(c - range.s.c);

      rowData[alphaKey] = cellValue;
      if (cellValue !== null && cellValue !== "") hasValue = true;
    }

    if (!hasValue) {
      emptyRowStreak += 1;
      if (emptyRowStreak >= 2) break;
      continue;
    }

    emptyRowStreak = 0;

    const firstCellValue = rowData.a;
    if (
      typeof firstCellValue === "string" &&
      firstCellValue.toLowerCase().includes("total")
    ) {
      break;
    }

    rows.push({
      sheetName,
      division,
      date: selectedMonthYear,
      figure,
      ...rowData,
      // Backward-compatible aliases for existing OWE mapping.
      sno: rowData.a,
      category: rowData.b,
      actualLastFY: rowData.c,
      obg: rowData.d,
      rbg: rowData.e,
      bpToEndMonth: rowData.f,
      actualForMonth: rowData.g,
      actualToEndCurrentYear: rowData.h,
      actualToEndLastYear: rowData.i,
      diffActualVsBP: rowData.j,
      diffCurrentVsLastYear: rowData.k,
      percentVariationBP: rowData.l,
      percentVariationLastYear: rowData.m,
    });
  }

  return rows;
};

export const parseOweExcelFile = async (
  buffer: ArrayBuffer,
  division: string,
  month: string,
  year: string
) => {
  try {
    const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });
    const selectedMonthYear = `${getMonthNumber(month)}/${year}`;

    const allSheetNames = workbook.SheetNames ?? [];
    const allSheetsData = allSheetNames.reduce(
      (acc: Record<string, ParsedRow[]>, sheetName: string) => {
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) return acc;

        const key = normalizeSheetKey(sheetName) || sheetName;
        acc[key] = parseSheetRows(sheet, sheetName, division, selectedMonthYear);
        return acc;
      },
      {}
    );

    const grossSheetName = allSheetNames.find((name) =>
      /(gross|earning)/i.test(name)
    );
    const workingSheetName = allSheetNames.find((name) =>
      /(working|expense)/i.test(name)
    );

    let grossEarnings = grossSheetName
      ? allSheetsData[normalizeSheetKey(grossSheetName)] ?? []
      : [];
    let workingExpenses = workingSheetName
      ? allSheetsData[normalizeSheetKey(workingSheetName)] ?? []
      : [];

    const parsedSheetsInOrder = allSheetNames
      .map((name) => allSheetsData[normalizeSheetKey(name)] ?? [])
      .filter((rows) => rows.length > 0);

    if (grossEarnings.length === 0 && parsedSheetsInOrder.length > 0) {
      grossEarnings = parsedSheetsInOrder[0];
    }

    if (workingExpenses.length === 0 && parsedSheetsInOrder.length > 1) {
      workingExpenses = parsedSheetsInOrder[1];
    }

    const finalData = {
      grossEarnings,
      workingExpenses,
      allSheets: allSheetsData,
      selectedMonthYear,
      division,
    };

    return { finalData };
  } catch (error: any) {
    console.error("OWE Excel Parse Error:", error?.message ?? error);
    return {
      finalData: {
        grossEarnings: [],
        workingExpenses: [],
        allSheets: {},
        selectedMonthYear: `${getMonthNumber(month)}/${year}`,
        division,
      },
    };
  }
};

// Backward compatibility for older imports.
export const parseFinancialExcel = parseOweExcelFile;
