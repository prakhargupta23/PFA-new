import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { Public as GlobeIcon, Bolt as BoltIcon, Chat as EscalateIcon } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { callToAction } from "../services/whatsapp.service";

const divisionChartData = [
  { name: "Jaipur", utilization: 820, timeLapse: 90 },
  { name: "Jaipur", utilization: 85, timeLapse: 90 },
  { name: "Ajmer", utilization: 45, timeLapse: 90 },
  { name: "Ajmer", utilization: 105, timeLapse: 90 },
  { name: "Jodhpur", utilization: 95, timeLapse: 90 },
  { name: "Bikaner", utilization: 68, timeLapse: 90 },
  { name: "Bikaner", utilization: 225, timeLapse: 90 },
];

const escalateDivisions = ["JAIPUR", "AJMER", "JODHPUR", "BIKANER"];

export default function ExecutiveSummary() {
  const handleCardClick = async (title: string, value: string) => {
    try {
      const data = await callToAction(title, value);
      console.log("Data sent successfully:", data);
      alert(`Task created successfully!`);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography sx={{ fontSize: "30px", fontWeight: 700, color: "#111827" }}>Financial Governance Dashboard</Typography>
        <Chip label="Zone: North Western Railway" size="small" sx={{ height: 20, fontSize: "10px", bgcolor: "#DBE8FF", color: "#2F5FE3" }} />
      </Box>

      <Box
        sx={{
          borderRadius: 1.4,
          p: 2,
          mb: 1.5,
          background: "linear-gradient(120deg, #09112A 0%, #0E1D48 54%, #1C325C 100%)",
        }}
      >
        <Typography sx={{ fontSize: "42px", fontWeight: 700, color: "white", mb: 0.2 }}>The PFA Command Scorecard</Typography>
        <Typography sx={{ fontSize: "12px", color: "#A5B4FC", mb: 1.5 }}>Zone: North Western Railway</Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1 }}>
          <Box sx={{
            bgcolor: "rgba(255,255,255,0.06)", borderRadius: 1, p: 1.1, cursor: "pointer", transition: "0.2s", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
          }}
          >
            <Typography sx={{ fontSize: "10px", color: "#94A3B8" }}>UTILIZATION</Typography>
            <Typography sx={{ fontSize: "38px", color: "white", fontWeight: 700 }}>84.2%</Typography>
          </Box>
          <Box sx={{
            bgcolor: "rgba(255,255,255,0.06)", borderRadius: 1, p: 1.1, cursor: "pointer", transition: "0.2s", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
          }} onClick={() => { }}>
            <Typography sx={{ fontSize: "10px", color: "#94A3B8" }}>EARNINGS GROWTH</Typography>
            <Typography sx={{ fontSize: "38px", color: "#22C55E", fontWeight: 700 }}>+5.2%</Typography>
          </Box>
          <Box sx={{
            bgcolor: "rgba(255,255,255,0.06)", borderRadius: 1, p: 1.1, cursor: "pointer", transition: "0.2s", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
          }} onClick={() => { }}>
            <Typography sx={{ fontSize: "10px", color: "#94A3B8" }}>CRITICAL AUDIT</Typography>
            <Typography sx={{ fontSize: "38px", color: "#FACC15", fontWeight: 700 }}>2</Typography>
          </Box>
          <Box sx={{
            bgcolor: "rgba(255,255,255,0.06)", borderRadius: 1, p: 1.1, cursor: "pointer", transition: "0.2s", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
          }} onClick={() => { }}>
            <Typography sx={{ fontSize: "10px", color: "#94A3B8" }}>GOVERNANCE SCORE</Typography>
            <Typography sx={{ fontSize: "38px", color: "#93C5FD", fontWeight: 700 }}>88</Typography>
          </Box>
          <Box sx={{
            bgcolor: "rgba(255,255,255,0.08)", borderRadius: 1.2, p: 1.1, cursor: "pointer", transition: "0.2s", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
          }} onClick={() => { }}>
            <Box sx={{ display: "flex", gap: 0.6, alignItems: "center", mb: 0.5 }}>
              <BoltIcon sx={{ color: "#93C5FD", fontSize: 14 }} />
              <Typography sx={{ fontSize: "10px", color: "#CBD5E1", fontWeight: 700 }}>YEAR-END FORESIGHT</Typography>
            </Box>
            <Typography sx={{ fontSize: "10px", color: "#94A3B8", fontStyle: "italic" }}>Wait...</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 1.2, mb: 1.2 }}>
        <Box sx={{ bgcolor: "#F8FAFC", borderRadius: 1.2, p: 1.3, border: "1px solid #E2E8F0" }}>
          <Typography sx={{ fontSize: "22px", fontWeight: 700, color: "#111827", mb: 1 }}>Division Efficiency Matrix</Typography>
          <Box sx={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={divisionChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                <YAxis domain={[0, 1000]} tick={{ fontSize: 10 }} stroke="#94A3B8" />
                <Tooltip />
                <Bar dataKey="utilization" fill="#3B63E2" radius={[3, 3, 0, 0]} />
                <Bar dataKey="timeLapse" fill="#CBD5E1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box sx={{ bgcolor: "#F8FAFC", borderRadius: 1.2, p: 1.3, border: "1px solid #E2E8F0" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, mb: 1.2 }}>
            <GlobeIcon sx={{ color: "#3B63E2", fontSize: 14 }} />
            <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>NATIONAL CONTEXT</Typography>
          </Box>
          <Typography sx={{ fontSize: "11px", color: "#94A3B8", fontStyle: "italic", borderLeft: "3px solid #DBEAFE", pl: 1 }}>
            Benchmarking unavailable...
          </Typography>
        </Box>
      </Box>

      <Box sx={{ bgcolor: "#F8FAFC", borderRadius: 1.2, p: 1.3, border: "1px solid #E2E8F0" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mb: 1.2 }}>
          <EscalateIcon sx={{ color: "#22C55E", fontSize: 14 }} />
          <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>ESCALATE DIRECTIVES TO SR. DFMS</Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
          {escalateDivisions.map((div) => (
            <Box key={div} sx={{ borderRadius: 1, p: 1, bgcolor: "#F1F5F9", border: "1px solid #E2E8F0" }}
              onClick={() => handleCardClick(div, "Escalate Now")}>
              <Typography sx={{ fontSize: "9px", color: "#64748B", mb: 0.4 }}>{div}</Typography>
              <Typography sx={{ fontSize: "11px", color: "#0F172A", fontWeight: 700 }}>ESCALATE NOW</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
