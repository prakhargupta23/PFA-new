import React from "react";
import { Box, Typography, Chip, Button, IconButton } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { callToAction } from "../services/whatsapp.service";

const tableRows = [
  { smh: "SMH-2 Repairs & Main.P.Way", div: "HQ/NWR", grant: "₹946.7", actual: "₹760.87", variance: "+46.31", trend: "UP", whatsapp: "Generate Draft Note for Sr. DFM" },
  { smh: "SMH-4 Repairs&Maint.C&W", div: "HQ/NWR", grant: "₹807.2", actual: "₹687.3", variance: "+80.43", trend: "UP", whatsapp: "Generate Draft Note for Sr. DFM" },
  { smh: "SMH-8 Operat.Exp.-Fuel", div: "HQ/NWR", grant: "₹2160", actual: "₹1645.59", variance: "+25.56", trend: "UP", whatsapp: "Generate Draft Note for Sr. DFM" },
  { smh: "SMH-3 Repairs&Maint Powers", div: "HQ/NWR", grant: "₹146.7", actual: "₹104.66", variance: "-5.78", trend: "DOWN", whatsapp: "Generate Draft Note for Sr. DFM" },
];

export default function OweManagement() {
  const createtask = async (title: string, value: string) => {
    try {
      const data = await callToAction(title, value);
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

      <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 1.5 }}>
        <Box>
          <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#1E293B", mb: 1 }}>SMH-wise Budget Compliance</Typography>
          <Box sx={{ borderRadius: 1.2, overflow: "hidden", border: "1px solid #E2E8F0" }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "2fr 0.7fr 0.7fr 0.7fr 0.7fr 0.8fr 0.5fr", px: 1.2, py: 1, bgcolor: "#F1F5F9", alignItems: "center" }}>
              <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>SMH DESCRIPTION</Typography>
              <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>DIV</Typography>
              <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>GRANT</Typography>
              <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>ACTUAL</Typography>
              <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>VAR</Typography>
              <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>TREND</Typography>
              <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B", textAlign: "center" }}>ACTION</Typography>
            </Box>

            {tableRows.map((row) => {
              const up = row.trend === "UP";
              return (
                <Box key={row.smh} sx={{ display: "grid", gridTemplateColumns: "2fr 0.7fr 0.7fr 0.7fr 0.7fr 0.8fr 0.5fr", alignItems: "center", px: 1.2, py: 1.1, borderTop: "1px solid #EDF2F7", bgcolor: "#F8FAFC" }}>
                  <Typography sx={{ fontSize: "12px", color: "#334155", fontWeight: 600 }}>{row.smh}</Typography>
                  <Typography sx={{ fontSize: "12px", color: "#64748B" }}>{row.div}</Typography>
                  <Typography sx={{ fontSize: "12px", color: "#334155" }}>{row.grant}</Typography>
                  <Typography sx={{ fontSize: "12px", color: "#334155" }}>{row.actual}</Typography>
                  <Typography sx={{ fontSize: "12px", color: up ? "#DC2626" : "#16A34A", fontWeight: 700 }}>{row.variance}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                    {up ? <TrendingUpIcon sx={{ fontSize: 13, color: "#DC2626" }} /> : <TrendingDownIcon sx={{ fontSize: 13, color: "#16A34A" }} />}
                    <Typography sx={{ fontSize: "11px", color: up ? "#DC2626" : "#16A34A", fontWeight: 700 }}>{row.trend}</Typography>
                  </Box>
                  <IconButton size="small" sx={{ color: "#25D366" }}>
                    <WhatsAppIcon fontSize="small" onClick={() => createtask(row.div, `\nTo:${row.whatsapp}\nSMH: ${row.smh}\nGrant: ${row.grant}\nActual: ${row.actual}\nVariance: ${row.variance}\nTrend: ${row.trend}`)} />
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box>
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
        </Box>
      </Box>
    </Box>
  );
}
