import axios from "axios";

const toSelectedMonthYear = (month: number, year: number): string => {
  const mm = String(month).padStart(2, "0");
  return `${mm}/${year}`;
};

export const getOweData = async (
  month: number,
  year: number,
  division = "North Western Railway"
) => {
  const response = await axios.post(
    "http://localhost:7071/api/get-owe-data",
    {
      month,
      year,
      selectedMonthYear: toSelectedMonthYear(month, year),
      division,
    }
  );

  return response.data;
};
