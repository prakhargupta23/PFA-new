import React, { useEffect, useState, useCallback } from "react";

import { Box, Typography, Chip } from "@mui/material";
import { Public as GlobeIcon, Chat as EscalateIcon } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { callToAction } from "../services/whatsapp.service";
import { dashboardService } from "../services/dashboardService";


const escalateDivisions = ["JODHPUR", "BIKANER", "AJMER", "JAIPUR"];

export default function ExecutiveSummary({ month, year }: { month: number; year: number }) {
  const [dashboardData, setDashboardData] = useState({
    operatingRatio: 0,
    Earnings: 0,
    workingExpenses: 0,
    capex: 0,
    audit: 0
  });
  const [divisionData, setDivisionData] = useState([]);
  const maxGraphValue = Math.max(200, ...divisionData.map((item: any) => Number(item.utilization) || 0));
  const yAxisMax = Math.ceil(maxGraphValue / 50) * 50;
  const yAxisTicks = Array.from({ length: yAxisMax / 50 + 1 }, (_, i) => i * 50);

  const fetchDashboard = useCallback(async () => {
    try {
      const data = await dashboardService.getDashboardData(month, year);
      setDashboardData({
        operatingRatio: data.operatingRatio || 0,
        Earnings: data.Earnings || 0,
        workingExpenses: data.workingExpenses || 0,
        capex: data.capex || 0,
        audit: data.audit || 0
      });

      // Maintain graph data if it still arrives in data.graphData
      if (data.graphData) {
        setDivisionData(
          data.graphData.map((item: any, index: number) => ({
            name: escalateDivisions[index] || `Div ${index + 1}`,
            utilization: Number(item.value)
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  }, [month, year]);

  useEffect(() => {
    if (month && year) {
      fetchDashboard();
    }
  }, [month, year, fetchDashboard]);

  const formatPercentage = (value: number) => {
    return `${Number(value).toFixed(2).replace(/\.?0+$/, "")}%`;
  };

  const dashboardCards = [
    { label: "OPERATING RATIO", value: Number(dashboardData.operatingRatio || 0).toFixed(2), color: "#93C5FD" },
    { label: "EARNINGS", value: formatPercentage(dashboardData.Earnings), color: dashboardData.Earnings < 0 ? "#EF4444" : "#22C55E" },
    { label: "OWE", value: formatPercentage(dashboardData.workingExpenses), color: dashboardData.workingExpenses > 0 ? "#EF4444" : "#22C55E" },
    { label: "CAPEX UTILIZATION", value: Number(dashboardData.capex).toLocaleString('en-IN'), color: "white" },
    { label: "CRITICAL AUDIT", value: dashboardData.audit.toString(), color: "#FACC15" }
  ];

  const handleCardClick = async (title: string, value: string) => {
    try {
      const data = await callToAction(["FA/G"], title, value);
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

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1.5 }}>
          {dashboardCards.map((card, idx) => (
            <Box
              key={idx}
              sx={{
                bgcolor: "rgba(255,255,255,0.06)",
                borderRadius: 1.5,
                p: 1.5,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 120,
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "0.2s all ease-in-out",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
                }
              }}
            >
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mb: 0.5 }}>
                  <Typography sx={{ fontSize: "10px", color: "#94A3B8", fontWeight: 700, letterSpacing: "0.5px" }}>
                    {card.label}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: "32px", color: card.color, fontWeight: 800, lineHeight: 1.2 }}>
                  {card.value}
                </Typography>
              </Box>

              <Box
                onClick={(e) => { e.stopPropagation(); handleCardClick(card.label, String(card.value)); }}
                sx={{
                  mt: 1.5,
                  py: 0.6,
                  px: 1,
                  borderRadius: "6px",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.8,
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "#FACC15",
                    color: "#0F172A",
                    borderColor: "#FACC15",
                    boxShadow: "0 4px 12px rgba(250, 204, 21, 0.3)"
                  },
                  "&:active": { transform: "translateY(1px)" }
                }}
              >
                <EscalateIcon sx={{ fontSize: 13 }} />
                <Typography sx={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.4px" }}>
                  ESCALATE NOW
                </Typography>
              </Box>
            </Box>
          ))}
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
                  tick={false}
                  stroke="#94A3B8"
                  axisLine={{ stroke: "#94A3B8" }}
                />
                <Tooltip
                  formatter={(value: number | string) => {
                    const numericValue = Number(value);
                    if (Number.isNaN(numericValue)) {
                      return value;
                    }
                    return `${numericValue.toFixed(2)}%`;
                  }}
                />
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

      {/* <Box sx={{ bgcolor: "#F8FAFC", borderRadius: 1.2, p: 1.3, border: "1px solid #E2E8F0" }}>
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
      </Box> */}
    </Box>
  );
}
