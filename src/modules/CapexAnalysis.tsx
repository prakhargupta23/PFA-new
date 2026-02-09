import React from "react";
import { Box, Typography, Chip, LinearProgress } from "@mui/material";

const rows = [
  {
    title: "11 - New Lines",
    division: "JAIPUR DIVISION",
    utilization: 89.76,
    progress: 85,
    spent: "Expended: ₹16.6Cr of ₹2Cr",
    remark: '"Utilization exceeds RG due to accelerated progress in final stages."',
    risky: false,
  },
  {
    title: "16 - Traffic Facilities",
    division: "JAIPUR DIVISION",
    utilization: 77.22,
    progress: 85,
    spent: "Expended: ₹21.49Cr of ₹157.34Cr",
    remark: '"On track for completion by March-end."',
    risky: false,
  },
  {
    title: "11 - New Lines",
    division: "AJMER DIVISION",
    utilization: 34.5,
    progress: 85,
    spent: "Expended: ₹1.04Cr of ₹3Cr",
    remark: '"Slow progress in New Lines. Needs review of mobilization."',
    risky: true,
  },
  {
    title: "16 - Traffic Facilities",
    division: "AJMER DIVISION",
    utilization: 99.73,
    progress: 85,
    spent: "Expended: ₹13.01Cr of ₹13.26Cr",
    remark: '"Excellent utilization. Funds fully committed."',
    risky: false,
  },
  {
    title: "31 - Track Renewals",
    division: "JODHPUR DIVISION",
    utilization: 89.14,
    progress: 85,
    spent: "Expended: ₹224.06Cr of ₹228Cr",
    remark: '"Work progressing as per schedule."',
    risky: false,
  },
  {
    title: "31 - Track Renewals",
    division: "BIKANER DIVISION",
    utilization: 60.03,
    progress: 85,
    spent: "Expended: ₹116.1Cr of ₹193Cr",
    remark: '"Low utilization compared to time lapse. Critical gap of 25%."',
    risky: true,
  },
  {
    title: "42 - W/Shop Incl. P. Unit",
    division: "BIKANER DIVISION",
    utilization: 221.59,
    progress: 85,
    spent: "Expended: ₹15.1Cr of ₹7.45Cr",
    remark: '"Exceptional utilization due to workshop upgrades."',
    risky: false,
  },
];

export default function CapexAnalysis() {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography sx={{ fontSize: "30px", fontWeight: 700, color: "#111827" }}>CAPEX Analysis (Works & Capital)</Typography>
        <Chip label="Zone: North Western Railway" size="small" sx={{ height: 20, fontSize: "10px", bgcolor: "#DBE8FF", color: "#2F5FE3" }} />
      </Box>

      <Box sx={{ borderRadius: 1.5, p: 2, mb: 1.5, color: "white", background: "#3C63D8" }}>
        <Typography sx={{ fontSize: "28px", fontWeight: 700 }}>Capital Expenditure & Works Monitoring</Typography>
        <Typography sx={{ fontSize: "11px", opacity: 0.85 }}>Analyzing utilization efficiency against budgetary timeline.</Typography>
        <Box sx={{ textAlign: "right", mt: -4 }}>
          <Typography sx={{ fontSize: "10px", opacity: 0.9 }}>TOTAL ALLOCATION</Typography>
          <Typography sx={{ fontSize: "40px", fontWeight: 700 }}>₹ 2,450 Cr</Typography>
        </Box>
      </Box>

      {rows.map((row, index) => (
        <Box
          key={`${row.title}-${index}`}
          sx={{
            bgcolor: "#F8FAFC",
            borderRadius: 1.2,
            p: 1.5,
            mb: 1,
            borderLeft: `4px solid ${row.risky ? "#EF4444" : "#3B82F6"}`,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>{row.title}</Typography>
              <Typography sx={{ fontSize: "10px", color: "#475569", fontWeight: 600 }}>{row.division}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              {row.risky && (
                <Box sx={{ px: 0.9, py: 0.3, borderRadius: 0.8, bgcolor: "#FEE2E2", color: "#B91C1C", fontSize: "9px", fontWeight: 700 }}>
                  LOW UTILIZATION RISK
                </Box>
              )}
              <Box sx={{ px: 0.9, py: 0.3, borderRadius: 0.8, bgcolor: "#E2E8F0", color: "#334155", fontSize: "9px", fontWeight: 700 }}>
                PLAN HEAD: 16
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1.5, alignItems: "center" }}>
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography sx={{ fontSize: "10px", color: "#64748B" }}>Utilization</Typography>
                <Typography sx={{ fontSize: "10px", color: "#1E293B", fontWeight: 700 }}>{row.utilization}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={Math.min(row.utilization, 100)} sx={{ height: 5, borderRadius: 5, bgcolor: "#DFE7F2", "& .MuiLinearProgress-bar": { bgcolor: "#4F7CEA" } }} />
              <Typography sx={{ fontSize: "9px", color: "#94A3B8", mt: 0.5 }}>{row.spent}</Typography>
            </Box>

            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography sx={{ fontSize: "10px", color: "#64748B" }}>Time Lapse (FY Progress)</Typography>
                <Typography sx={{ fontSize: "10px", color: "#1E293B", fontWeight: 700 }}>{row.progress}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={row.progress} sx={{ height: 5, borderRadius: 5, bgcolor: "#DFE7F2", "& .MuiLinearProgress-bar": { bgcolor: "#CBD5E1" } }} />
            </Box>

            <Box sx={{ bgcolor: "#EEF2F7", borderRadius: 1, p: 1.2 }}>
              <Typography sx={{ fontSize: "9px", color: "#94A3B8", mb: 0.4 }}>REMARKS ANALYSIS</Typography>
              <Typography sx={{ fontSize: "10px", color: "#475569", fontStyle: "italic" }}>{row.remark}</Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
