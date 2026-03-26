import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Chip, IconButton } from "@mui/material";
// import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { callToAction } from "../services/whatsapp.service";
import { oweService } from "../services/owedashboard.service";

type OweRow = {
  smh: string;
  div: string;
  grant: string;
  actual: string;
  variance: string;
  trend: "UP" | "DOWN";
  whatsapp: string;
};

const DEFAULT_WHATSAPP_TARGET = "Generate Draft Note for Sr. DFM";

const toNumber = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return 0;

  const parsed = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const toCurrency = (value: unknown): string => {
  const n = toNumber(value);
  return `${n.toFixed(2)} Cr`;
};
const toVarianceString = (value: unknown): string => {
  const n = toNumber(value);
  const formatted = n.toFixed(2);
  return n > 0 ? `+${formatted}%` : `${formatted}%`;
};

const toTrend = (value: unknown): "UP" | "DOWN" => {
  if (typeof value === "string") {
    const normalized = value.trim().toUpperCase();
    if (normalized === "UP" || normalized === "DOWN") return normalized;
  }

  return toNumber(value) >= 0 ? "UP" : "DOWN";
};

const extractRows = (payload: any): any[] => {
  console.log("payload", payload);
  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.tableRows)) return payload.tableRows;
  if (Array.isArray(payload?.smhRows)) return payload.smhRows;
  if (Array.isArray(payload?.data)) return payload.data;

  return [];
};

const getSmhOrder = (smh: string): number => {
  const upper = smh.toUpperCase();
  if (upper === 'TOTAL' || upper === 'TOTAL OWE') return 999;
  const match = smh.match(/SMH-(\d+)/i);
  if (!match) return 888;
  return Number(match[1]);
};

export default function OweManagement({ month, year }: { month?: number; year?: number }) {
  const now = new Date();
  const selectedMonth = month ?? now.getMonth() + 1;
  const selectedYear = year ?? now.getFullYear();
  const [tableRows, setTableRows] = useState<OweRow[]>([]);

  useEffect(() => {
    const loadRows = async () => {
      try {
        const response = await oweService.getOweData();
        const rawRows = extractRows(response.oweData);
        console.log("rawRows", rawRows);
        const mappedRows: OweRow[] = rawRows
          .filter((row: any) => {
            const cat = (row.category || "").toUpperCase();
            return cat.startsWith("SMH-") || cat === "TOTAL" || cat === "TOTAL  OWE" || cat === "TOTAL OWE";
          })
          .map((row: any) => {
            // Use percentVariationBP if available (scaled to 100 for display)
            // otherwise fallback to diffActualVsBP or other fields
            const varianceRaw =
              row.percentVariationBP !== undefined
                ? Number(row.percentVariationBP) * 100
                : (row.variance ?? row.diffActualVsBP ?? row.var ?? row.difference ?? 0);

            // Prioritize cumulative actual (ToEndCurrentYear) over monthly actual
            const actualRaw =
              row.actualToEndCurrentYear ??
              row.actual ??
              row.actualForMonth ??
              0;

            const trendRaw = row.trend ?? varianceRaw;

            return {
              smh:
                row.category ??
                row.smh ??
                row.smhDescription ??
                row.description ??
                row.head ??
                "-",
              div: "NWR",
              grant: toCurrency(row.obg || 0),
              actual: toCurrency(actualRaw),
              variance: toVarianceString(varianceRaw),
              trend: toTrend(trendRaw),
              whatsapp: row.whatsapp ?? DEFAULT_WHATSAPP_TARGET,
            };
          });

        const sortedRows = [...mappedRows].sort((a, b) => getSmhOrder(a.smh) - getSmhOrder(b.smh));
        setTableRows(sortedRows);
      } catch (error) {
        console.error("Error fetching OWE rows:", error);
        setTableRows([]);
      }
    };

    loadRows();
  }, [selectedMonth, selectedYear]);

  const hasRows = useMemo(() => tableRows.length > 0, [tableRows]);

  const handleWhatsappClick = async (row: OweRow) => {
    try {
      const title = `⚠️ OWE Analysis Portal Alert`;
      const message = `Expenditure Review – ${row.smh}\nExpenditure under ${row.smh} is above the Budget Proportion (BP).\nKindly prepare an action plan to control expenditure under ${row.smh} and bring it in line with the budget proportion.\n\nDetails:\nDiv: ${row.div}\nGrant: ${row.grant}\nActual: ${row.actual}\nVariance: ${row.variance}\nTrend: ${row.trend}\nTo: ${row.whatsapp}`;
      const data = await callToAction(["FA/T"], title, message);
      console.log("Data sent successfully:", data);
      alert(`Task created successfully!`);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography sx={{ fontSize: "30px", fontWeight: 700, color: "#111827" }}>OWE Management (Ordinary Working Expenses)</Typography>
        <Chip label="Zone: North Western Railway" size="small" sx={{ height: 20, fontSize: "10px", bgcolor: "#DBE8FF", color: "#2F5FE3" }} />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "2fr", gap: 1.5 }}>
        <Box>
          <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#1E293B", mb: 1 }}>SMH-wise Budget Compliance</Typography>
          <Box sx={{ borderRadius: 1.2, overflow: "hidden", border: "1px solid #E2E8F0" }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "2fr 0.7fr 0.7fr 0.7fr 0.7fr 0.8fr 0.5fr", px: 1.2, py: 1, bgcolor: "#F1F5F9", alignItems: "center" }}>
              <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>SMH DESCRIPTION</Typography>
              <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>GRANT</Typography>
              <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>ACTUAL</Typography>
              <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>VAR</Typography>
              <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>TREND</Typography>
              <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B", textAlign: "center" }}>ACTION</Typography>
            </Box>

            {tableRows.map((row) => {
              const up = row.trend === "UP";
              return (
                <Box key={`${row.smh}-${row.div}`} sx={{ display: "grid", gridTemplateColumns: "2fr 0.7fr 0.7fr 0.7fr 0.7fr 0.8fr 0.5fr", alignItems: "center", px: 1.2, py: 1.1, borderTop: "1px solid #EDF2F7", bgcolor: "#F8FAFC" }}>
                  <Typography sx={{ fontSize: "12px", color: "#334155", fontWeight: 600 }}>{row.smh}</Typography>
                  <Typography sx={{ fontSize: "12px", color: "#334155" }}>{row.grant}</Typography>
                  <Typography sx={{ fontSize: "12px", color: "#334155" }}>{row.actual}</Typography>
                  <Typography sx={{ fontSize: "12px", color: up ? "#DC2626" : "#16A34A", fontWeight: 700 }}>{row.variance}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                    {up ? <TrendingUpIcon sx={{ fontSize: 13, color: "#DC2626" }} /> : <TrendingDownIcon sx={{ fontSize: 13, color: "#16A34A" }} />}
                    <Typography sx={{ fontSize: "11px", color: up ? "#DC2626" : "#16A34A", fontWeight: 700 }}>{row.trend}</Typography>
                  </Box>
                  <IconButton size="small" sx={{ color: "#25D366" }} onClick={() => handleWhatsappClick(row)}>
                    <WhatsAppIcon fontSize="small" />
                  </IconButton>
                </Box>
              );
            })}

            {!hasRows && (
              <Box sx={{ px: 1.2, py: 1.5, borderTop: "1px solid #EDF2F7", bgcolor: "#F8FAFC" }}>
                <Typography sx={{ fontSize: "12px", color: "#64748B" }}>
                  No SHM data available for the selected month/year.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* <Box>
          <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#1E293B", mb: 1 }}>Expenditure Risk Markers</Typography>
          <Box sx={{ bgcolor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 1.2, p: 1.2 }}>
            <Box sx={{ bgcolor: "#FEECEC", borderRadius: 1, px: 1, py: 0.8, display: "flex", gap: 0.7, mb: 1.3 }}>
              <WarningAmberRoundedIcon sx={{ color: "#DC2626", fontSize: 16, mt: 0.1 }} />
              <Box>
                <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#B91C1C" }}>Persistent Over-trend</Typography>
                <Typography sx={{ fontSize: "10px", color: "#B91C1C" }}>Nagpur - SMH-08 (Fuel)</Typography>
              </Box>
            </Box>

            <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#475569", mb: 0.4 }}>Impact Analysis</Typography>
            <Typography sx={{ fontSize: "10px", color: "#64748B", mb: 1.2 }}>
              If current trend continues, SMH 08 will exceed final Grant by ?120Cr (Approx 24% over-run). Primary driver identified as un-rate hike in diesel.
            </Typography>

            <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#475569", mb: 0.4 }}>Suggested Direction</Typography>
            <Typography sx={{ fontSize: "10px", color: "#64748B", mb: 1.2 }}>
              "PFA may consider directing Nagpur Division to conduct a fuel efficiency audit and provide a revised requirement note."
            </Typography>

            <Button fullWidth variant="contained" sx={{ textTransform: "none", fontSize: "10px", py: 0.7, bgcolor: "#0B1635" }}>
              Generate Draft Note for Sr. DFM
            </Button>
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
}
