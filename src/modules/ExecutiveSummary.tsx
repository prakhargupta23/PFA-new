import React, { useEffect, useState, useCallback } from "react";

import { Box, Typography, Chip } from "@mui/material";
import { Public as GlobeIcon, Bolt as BoltIcon, Chat as EscalateIcon } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { callToAction } from "../services/whatsapp.service";
import { getDashboardData } from "../services/dashboardService";


const escalateDivisions = ["JODHPUR", "BIKANER", "AJMER", "JAIPUR"];

export default function ExecutiveSummary({ month, year }: { month: number; year: number }) {
  const [utilization, setUtilization] = useState(0);
  const [earningsGrowth, setEarningsGrowth] = useState<number>(0);
  const [divisionData, setDivisionData] = useState([]);
  const maxGraphValue = Math.max(200, ...divisionData.map((item: any) => Number(item.utilization) || 0));
  const yAxisMax = Math.ceil(maxGraphValue / 50) * 50;
  const yAxisTicks = Array.from({ length: yAxisMax / 50 + 1 }, (_, i) => i * 50);
  const fetchDashboard = useCallback(async () => {
    try {
      const data = await getDashboardData(month, year);
      setUtilization(data.utilization || 0);
      setEarningsGrowth(Number(data.earningsGrowth) || 0);
      setDivisionData(
        data.graphData?.map((item: any, index: number) => ({
          name: escalateDivisions[index], // JAIPUR, AJMER etc
          utilization: Number(item.value)
        })) || []
      );
    } catch (error) {
      console.error(error);
    }
  }, [month, year]);

  useEffect(() => {
    if (month && year) {
      fetchDashboard();
    }
  }, [month, year, fetchDashboard]);



  const formatGrowth = (value: number) => {
    const absValue = Math.abs(value);
    const twoDecimals = absValue.toFixed(2);
    const formatted = twoDecimals.endsWith("00")
      ? absValue.toFixed(1)
      : twoDecimals.endsWith("0")
        ? absValue.toFixed(1)
        : twoDecimals;
    return value >= 0 ? `+${formatted}%` : `-${formatted}%`;
  };

  const earningsGrowthText = formatGrowth(earningsGrowth);
  const earningsGrowthColor = earningsGrowth < 0 ? "#EF4444" : "#22C55E";
  const utilizationText = Number(utilization).toFixed(2).replace(/\.?0+$/, "");
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
            <Typography sx={{ fontSize: "38px", color: "white", fontWeight: 700 }}>{utilizationText}%
            </Typography>
          </Box>
          <Box sx={{
            bgcolor: "rgba(255,255,255,0.06)", borderRadius: 1, p: 1.1, cursor: "pointer", transition: "0.2s", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
          }} onClick={() => { }}>
            <Typography sx={{ fontSize: "10px", color: "#94A3B8" }}>EARNINGS GROWTH</Typography>
            <Typography sx={{ fontSize: "38px", color: earningsGrowthColor, fontWeight: 700 }}>{earningsGrowthText}</Typography>
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
              <BarChart data={divisionData} margin={{ top: 10, right: 10, left: 8, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  height={48}
                  angle={-15}
                  textAnchor="end"
                  tick={{ fontSize: 10, fill: "#64748B" }}
                  stroke="#94A3B8"
                />
                <YAxis
                  domain={[0, yAxisMax]}
                  ticks={yAxisTicks}
                  tick={{ fontSize: 10 }}
                  stroke="#94A3B8"
                  label={{ value: "fig. in crores", angle: -90, position: "insideLeft", style: { fill: "#64748B", fontSize: 10 } }}
                />
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
