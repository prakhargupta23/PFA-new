import React from "react";
import { Box, Typography, Chip, Button } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import VoiceRecorder from "../components/voicecapturing";

const riskRows = [
  {
    division: "Bikaner (BKN)",
    score: 88,
    note: "Significant CAPEX utilization lag in Track Renewal (PH-31) and Bridge Works (PH-32)",
  },
  {
    division: "Jodhpur (JU)",
    score: 74,
    note: "High Unreconciled Suspense Balances and stagnating recovery of outstanding dues from state departments",
  },
  {
    division: "Ajmer (AII)",
    score: 65,
    note: "Operational Expenditure (OPEX) spike specifically in Diesel/Fuel consumption and Staff Overtime (OT)",
  },
  {
    division: "Jaipur (JP)",
    score: 42,
    note: "Minor lag in PH-53 (Passenger Amenities) fund utilization compared to the ambitious Station Redevelopment targets",
  },
];

export default function AIDecisionBrain() {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography sx={{ fontSize: "30px", fontWeight: 700, color: "#111827" }}>PFA AI Co-pilot & Decision Support</Typography>
        <Chip label="Zone: North Western Railway" size="small" sx={{ height: 20, fontSize: "10px", bgcolor: "#DBE8FF", color: "#2F5FE3" }} />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1.1fr 2.2fr", gap: 1.4, minHeight: "74vh" }}>
        <Box sx={{ bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 1.4, p: 1.3 }}>
          <Box sx={{ mb: 1.2, borderRadius: 1.2, overflow: "hidden", background: "linear-gradient(120deg, #0C142D 0%, #142957 56%, #1D3158 100%)" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 1.3, py: 1.1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                <BoltIcon sx={{ fontSize: 14, color: "#FACC15" }} />
                <Typography sx={{ fontSize: "12px", color: "white", fontWeight: 700 }}>BRIEFING</Typography>
              </Box>
              <VolumeUpIcon sx={{ fontSize: 15, color: "#A5B4FC" }} />
            </Box>
            <Typography sx={{ fontSize: "11px", color: "#94A3B8", px: 1.3, pb: 1.3, fontStyle: "italic" }}>Offline...</Typography>
          </Box>

          <Box sx={{ bgcolor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 1.2, p: 1.2 }}>
            <Typography sx={{ fontSize: "11px", color: "#334155", fontWeight: 700, mb: 1 }}>RISK HEATMAP</Typography>
            {riskRows.map((row) => (
              <Box key={row.division} sx={{ mb: 0.9, p: 0.8, bgcolor: "#F8FAFC", borderRadius: 1, border: "1px solid #EDF2F7" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.4 }}>
                  <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#1E293B" }}>{row.division}</Typography>
                  <Typography sx={{ fontSize: "10px", color: row.score > 70 ? "#EF4444" : "#4F7CEA", bgcolor: "#EEF2FF", px: 0.8, py: 0.2, borderRadius: 1, fontWeight: 700 }}>{row.score}</Typography>
                </Box>
                <Typography sx={{ fontSize: "9.5px", color: "#64748B", mb: 0.7 }}>
                  "{row.note}"
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Button size="small" sx={{ fontSize: "9px", px: 1, minWidth: 85, bgcolor: "#EEF2F7", color: "#0F172A", fontWeight: 700 }}>
                    DRAFT MEMO
                  </Button>
                  <Button size="small" sx={{ minWidth: 28, width: 28, height: 28, p: 0, borderRadius: 1, bgcolor: "#4FBF67", color: "white" }}>
                    <WhatsAppIcon sx={{ fontSize: 14 }} />
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ bgcolor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 1.4, p: 1.4, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <VoiceRecorder />
        </Box>
      </Box>
    </Box>
  );
}
