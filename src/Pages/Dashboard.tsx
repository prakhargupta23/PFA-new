import React, { useState, useRef } from "react";
import { Box, Typography, IconButton, Button, Snackbar, Alert } from "@mui/material";
import {
  Monitor as DeviceIcon,
  Sync as RefreshIcon,
  Fullscreen as FullscreenIcon,
  ShowChart as SummaryIcon,
  Business as CapexIcon,
  AttachMoney as OweIcon,
  Assignment as AuditIcon,
  SmartToy as AiIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import ExecutiveSummary from "../modules/ExecutiveSummary";
import { parseExcelFile, allMonths } from "../utils/pfaUtils";
import { submitPfaData } from "../services/pfa.service";
import "../css/dashboard.css";

const SIDEBAR_WIDTH = 260;
const TOP_BAR_HEIGHT = 48;

type NavKey = "executive-summary" | "capex" | "owe" | "audit" | "ai-brain";

const navItems: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: "executive-summary", label: "Executive Summary", icon: <SummaryIcon /> },
  { key: "capex", label: "CAPEX / Works", icon: <CapexIcon /> },
  { key: "owe", label: "OWE / Expenditure", icon: <OweIcon /> },
  { key: "audit", label: "Audit & Inspections", icon: <AuditIcon /> },
  { key: "ai-brain", label: "AI Decision Brain", icon: <AiIcon /> },
];

const DEFAULT_DIVISION = "North Western Railway";

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState<NavKey>("executive-summary");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({ open: false, message: "", severity: "info" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const now = new Date();
    const month = allMonths[now.getMonth()];
    const year = String(now.getFullYear());

    setUploadLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const { finalData } = await parseExcelFile(buffer, DEFAULT_DIVISION, month, year, []);
      await submitPfaData(finalData);
      setSnackbar({ open: true, message: "File uploaded and data sent successfully.", severity: "success" });
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? "Upload failed.";
      setSnackbar({ open: true, message, severity: "error" });
    } finally {
      setUploadLoading(false);
    }
  };

  const renderMainContent = () => {
    switch (activeNav) {
      case "executive-summary":
        return <ExecutiveSummary />;
      case "capex":
      case "owe":
      case "audit":
      case "ai-brain":
      default:
        return null;
    }
  };

  return (
    <Box className="raiguard-dashboard">
      {/* Top header bar */}
      <Box
        className="dashboard-top-bar"
        sx={{
          height: TOP_BAR_HEIGHT,
          bgcolor: "#1a1d24",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
        }}
      >
        <Typography variant="body1" fontWeight={600}>
          RailGuard PFA - Financial Governance Agent
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 1 }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls"
              style={{ display: "none" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUploadClick}
              disabled={uploadLoading}
              startIcon={<UploadIcon />}
            >
              <Typography variant="caption">{uploadLoading ? "Uploading…" : "Upload"}</Typography>
            </Button>
          </Box>
          <IconButton size="small" sx={{ color: "#fff" }}>
            <RefreshIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: "#fff" }}>
            <FullscreenIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Sidebar */}
      <Box
        className="dashboard-sidebar"
        sx={{
          width: SIDEBAR_WIDTH,
          position: "fixed",
          top: TOP_BAR_HEIGHT,
          left: 0,
          bottom: 0,
          bgcolor: "#1C273C",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          zIndex: 1000,
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: "#2563EB",
              }}
            />
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                RailGuard
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                PFA PORTAL V2.0
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ flex: 1, py: 2, overflow: "auto" }}>
          {navItems.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <Box
                key={item.key}
                className="nav-item"
                onClick={() => setActiveNav(item.key)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 1.5,
                  bgcolor: isActive ? "#2563EB" : "transparent",
                  color: "#fff",
                  cursor: "pointer",
                  "&:hover": { bgcolor: isActive ? "#2563EB" : "rgba(255,255,255,0.08)" },
                }}
              >
                {item.icon}
                <Typography variant="body2" fontWeight={500}>
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                bgcolor: "#22c55e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PersonIcon sx={{ color: "#fff", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Sh. Rajendra Kumar
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                PRINCIPAL FINANCIAL ADVISER
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              color: "rgba(255,255,255,0.9)",
              "&:hover": { color: "#fff" },
            }}
          >
            <LogoutIcon sx={{ fontSize: 20 }} />
            <Typography variant="body2">Logout</Typography>
          </Box>
        </Box>
      </Box>

      {/* Main content area */}
      <Box
        className="dashboard-main"
        sx={{
          marginLeft: SIDEBAR_WIDTH,
          marginTop: TOP_BAR_HEIGHT,
          minHeight: `calc(100vh - ${TOP_BAR_HEIGHT}px)`,
          bgcolor: "#F5F7FA",
          p: 3,
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          boxSizing: "border-box",
          overflow: "auto",
        }}
      >
        <Box sx={{ width: "100%", minHeight: "100%" }}>
          {renderMainContent()}
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
