import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  Notifications as NotificationsIcon,
  Public as GlobeIcon,
  Bolt as BoltIcon,
  Chat as EscalateIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const divisionChartData = [
  { name: "Jaipur", utilization: 800, timeLapse: 100 },
  { name: "Jaipur", utilization: 100, timeLapse: 80 },
  { name: "Ajmer", utilization: 50, timeLapse: 60 },
  { name: "Ajmer", utilization: 120, timeLapse: 70 },
  { name: "Jodhpur", utilization: 110, timeLapse: 90 },
  { name: "Bikaner", utilization: 100, timeLapse: 50 },
  { name: "Bikaner", utilization: 230, timeLapse: 85 },
];

const externalLinks = [
  "indianexpress.com",
  "psuconnect.in",
  "dtnext.in",
  "prsindia.org",
];

const escalateDivisions = ["JAIPUR", "AJMER", "JODHPUR", "BIKANER"];

export default function ExecutiveSummary() {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Main header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Typography variant="h5" fontWeight={700} color="#1a1d24">
            Financial Governance Dashboard
          </Typography>
          <Chip
            label="Zone: North Western Railway"
            size="small"
            sx={{
              bgcolor: "#E3F2FD",
              color: "#1565C0",
              fontWeight: 600,
              borderRadius: 2,
            }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarIcon sx={{ color: "#64748B", fontSize: 20 }} />
            <Typography variant="body2" color="#475569">
              Wk 1, Feb 2026
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, position: "relative" }}>
            <NotificationsIcon sx={{ color: "#64748B", fontSize: 22 }} />
            <Typography variant="body2" color="#475569">
              Notifications
            </Typography>
            <Box
              sx={{
                position: "absolute",
                top: -2,
                left: 10,
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#ef4444",
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {/* Left column: Scorecard + Chart + Escalate */}
        <Box sx={{ flex: "1 1 600px", minWidth: 0 }}>
          {/* PFA Command Scorecard */}
          <Box
            sx={{
              bgcolor: "#2C3E50",
              borderRadius: 2,
              p: 3,
              mb: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            }}
          >
            <Typography variant="h6" fontWeight={700} color="#fff" gutterBottom>
              The PFA Command Scorecard
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 2 }}>
              Zone: North Western Railway
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
                gap: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 1.5,
                  p: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  UTILIZATION
                </Typography>
                <Typography variant="h5" fontWeight={700} color="#fff">
                  84.2%
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 1.5,
                  p: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  EARNINGS GROWTH
                </Typography>
                <Typography variant="h5" fontWeight={700} color="#4CAF50">
                  +5.2%
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 1.5,
                  p: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  CRITICAL AUDIT
                </Typography>
                <Typography variant="h5" fontWeight={700} color="#FFC107">
                  2
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 1.5,
                  p: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  GOVERNANCE SCORE
                </Typography>
                <Typography variant="h5" fontWeight={700} color="#9C27B0">
                  0.92
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <BoltIcon sx={{ color: "#7DD3FC", fontSize: 22, mt: 0.3 }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="#fff" sx={{ letterSpacing: "0.05em" }}>
                  YEAR-END FORESIGHT
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5, color: "#fff", "& li": { mb: 0.5 } }}>
                  <li>CAPEX - AJMER (NEW LINES): Certain Surrender of Funds (~60% of allocation)</li>
                  <li>CAPEX - BIKANER (TRACK RENEWALS): Projected Under-utilization of ~15-20%</li>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Division Efficiency Matrix */}
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: 2,
              p: 3,
              mb: 3,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" fontWeight={700} color="#1a1d24">
                Division Efficiency Matrix
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#2563EB" }} />
                  <Typography variant="caption" color="#64748B">UTILIZATION</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#94A3B8" }} />
                  <Typography variant="caption" color="#64748B">TIME LAPSE</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={divisionChartData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748B" />
                  <YAxis domain={[0, 1000]} tick={{ fontSize: 12 }} stroke="#64748B" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="utilization" fill="#2563EB" name="UTILIZATION" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="timeLapse" fill="#94A3B8" name="TIME LAPSE" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          {/* Escalate Directives */}
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: 2,
              p: 3,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <EscalateIcon sx={{ color: "#22c55e", fontSize: 24 }} />
              <Typography variant="h6" fontWeight={700} color="#1a1d24">
                ESCALATE DIRECTIVES TO SR. DFMS
              </Typography>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
                gap: 2,
              }}
            >
              {escalateDivisions.map((div) => (
                <Box
                  key={div}
                  sx={{
                    bgcolor: "#F8FAFC",
                    borderRadius: 1.5,
                    p: 2,
                    border: "1px solid #E2E8F0",
                    textAlign: "center",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#F1F5F9", borderColor: "#2563EB" },
                  }}
                >
                  <Typography variant="caption" color="#64748B" display="block" gutterBottom>
                    {div}
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="#1a1d24">
                    ESCALATE NOW
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Right column: National Context */}
        <Box sx={{ width: 320, flexShrink: 0 }}>
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: 2,
              p: 3,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              height: "fit-content",
              maxHeight: "calc(100vh - 200px)",
              overflow: "auto",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <GlobeIcon sx={{ color: "#2563EB", fontSize: 22 }} />
              <Typography variant="h6" fontWeight={700} color="#1a1d24">
                NATIONAL CONTEXT
              </Typography>
            </Box>
            <Typography variant="body2" color="#475569" sx={{ mb: 2, lineHeight: 1.6 }}>
              Based on the available data for the fiscal year 2024-25 (and year-to-date trends), here is the
              comparison of North Western Railway (NWR) performance against national Indian Railways trends.
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} color="#1a1d24" gutterBottom>
              Executive Summary
            </Typography>
            <Typography variant="body2" color="#475569" sx={{ mb: 2, lineHeight: 1.6 }}>
              <strong>North Western Railway (NWR)</strong> has outperformed the national average in terms of
              utilization and governance indicators. Key focus areas remain CAPEX deployment and audit
              closure as highlighted in the Year-End Foresight section.
            </Typography>
            <Typography variant="caption" color="#64748B" display="block" sx={{ mb: 1.5 }}>
              External references
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {externalLinks.map((link) => (
                <Box
                  key={link}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1.5,
                    borderRadius: 1.5,
                    bgcolor: "#F1F5F9",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#E2E8F0" },
                  }}
                >
                  <LinkIcon sx={{ fontSize: 18, color: "#64748B" }} />
                  <Typography variant="body2" color="#475569">
                    {link}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
