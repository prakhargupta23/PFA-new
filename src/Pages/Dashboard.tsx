import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, IconButton, Button, Snackbar, Alert } from "@mui/material";
import {
  Devices as DeviceIcon,
  Refresh as RefreshIcon,
  OpenInFull as FullscreenIcon,
  ShowChart as SummaryIcon,
  Business as CapexIcon,
  AttachMoney as OweIcon,
  Assignment as AuditIcon,
  SmartToy as AiIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  NotificationsNone as NotificationsIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import ExecutiveSummary from "../modules/ExecutiveSummary";
import CapexAnalysis from "../modules/CapexAnalysis";
import OweManagement from "../modules/OweManagement";
import AuditInspection from "../modules/AuditInspection";
import AIDecisionBrain from "../modules/AIDecisionBrain";
import { parseExcelFile, allMonths } from "../utils/pfaUtils";
import { submitPfaData } from "../services/pfa.service";
import "../css/dashboard.css";

const SIDEBAR_WIDTH = 190;
const TOP_BAR_HEIGHT = 46;
const DEFAULT_DIVISION = "North Western Railway";

type NavKey = "executive-summary" | "capex" | "owe" | "audit" | "ai-brain";

const navItems: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: "executive-summary", label: "Executive Summary", icon: <SummaryIcon /> },
  { key: "capex", label: "CAPEX / Works", icon: <CapexIcon /> },
  { key: "owe", label: "OWE / Expenditure", icon: <OweIcon /> },
  { key: "audit", label: "Audit & Inspections", icon: <AuditIcon /> },
  { key: "ai-brain", label: "AI Decision Brain", icon: <AiIcon /> },
];

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState<NavKey>("executive-summary");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
    open: false,
    message: "",
    severity: "info",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [activeNav]);

  const renderMainContent = () => {
    switch (activeNav) {
      case "executive-summary":
        return <ExecutiveSummary />;
      case "capex":
        return <CapexAnalysis />;
      case "owe":
        return <OweManagement />;
      case "audit":
        return <AuditInspection />;
      case "ai-brain":
        return <AIDecisionBrain />;
      default:
        return <ExecutiveSummary />;
    }
  };

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

  return (
    <Box className="raiguard-dashboard">
      <Box
        className="dashboard-top-bar"
        sx={{
          height: TOP_BAR_HEIGHT,
          bgcolor: "#FFFFFF",
          color: "#0F172A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
        }}
      >
        <Typography variant="body2" fontWeight={600}>
          RailGuard PFA - Financial Governance Agent
        </Typography>
        <Box sx={{ position: "absolute", right: 8, display: "flex", alignItems: "center", gap: 0.3 }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls"
            style={{ display: "none" }}
          />
          <Button
            size="small"
            variant="contained"
            onClick={handleUploadClick}
            disabled={uploadLoading}
            startIcon={<UploadIcon sx={{ fontSize: 14 }} />}
            sx={{ minWidth: 78, height: 28, borderRadius: 1.4, fontSize: "10px", textTransform: "none", bgcolor: "#2E63EE" }}
          >
            {uploadLoading ? "Uploading..." : "Upload"}
          </Button>
          <IconButton size="small" sx={{ color: "#334155" }}>
            <DeviceIcon sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: "11px", ml: 0.4 }}>Device</Typography>
          </IconButton>
          <IconButton size="small" sx={{ color: "#334155" }}>
            <RefreshIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton size="small" sx={{ color: "#334155" }}>
            <FullscreenIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box
        className="dashboard-sidebar"
        sx={{
          width: SIDEBAR_WIDTH,
          position: "fixed",
          top: TOP_BAR_HEIGHT,
          left: 0,
          bottom: 0,
          bgcolor: "#0B1635",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          zIndex: 1000,
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 0.3 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: 1,
                bgcolor: "#2D66F5",
              }}
            />
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: 700, lineHeight: 1.2 }}>RailGuard</Typography>
              <Typography sx={{ fontSize: "9px", color: "rgba(255,255,255,0.7)" }}>PFA PORTAL V_2.0</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ flex: 1, py: 1.5, overflow: "auto" }}>
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
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  mx: 1,
                  mb: 0.7,
                  borderRadius: 1.2,
                  bgcolor: isActive ? "#2E63EE" : "transparent",
                  color: "#fff",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: isActive ? "transparent" : "rgba(255,255,255,0.06)",
                  "&:hover": { bgcolor: isActive ? "#2E63EE" : "rgba(255,255,255,0.08)" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>{item.icon}</Box>
                <Typography sx={{ fontSize: "11px", fontWeight: 500 }}>{item.label}</Typography>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ p: 1.2, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.2, p: 1, borderRadius: 1.2, border: "1px solid rgba(255,255,255,0.12)" }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                bgcolor: "#19325A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PersonIcon sx={{ color: "#fff", fontSize: 16 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "9px", fontWeight: 600, lineHeight: 1.2 }}>Sh. Rajendra Kumar</Typography>
              <Typography sx={{ fontSize: "8px", color: "rgba(255,255,255,0.7)", lineHeight: 1.2 }}>
                PRINCIPAL FINANCIAL ADVISER
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.6,
              cursor: "pointer",
              color: "rgba(255,255,255,0.75)",
              pl: 0.8,
              "&:hover": { color: "#fff" },
            }}
          >
            <LogoutIcon sx={{ fontSize: 12 }} />
            <Typography sx={{ fontSize: "10px" }}>Logout</Typography>
          </Box>
        </Box>
      </Box>

      <Box
        className="dashboard-main"
        ref={mainContentRef}
        sx={{
          marginLeft: SIDEBAR_WIDTH,
          marginTop: TOP_BAR_HEIGHT,
          minHeight: `calc(100vh - ${TOP_BAR_HEIGHT}px)`,
          bgcolor: "#EEF2F7",
          p: 2,
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          boxSizing: "border-box",
          overflow: "auto",
        }}
      >
        <Box sx={{ width: "100%", minHeight: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2, mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
              <CalendarIcon sx={{ color: "#64748B", fontSize: 14 }} />
              <Typography sx={{ fontSize: "11px", color: "#64748B" }}>Wk 1, Feb 2026</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
              <NotificationsIcon sx={{ color: "#64748B", fontSize: 14 }} />
              <Typography sx={{ fontSize: "11px", color: "#64748B" }}>Notifications</Typography>
              <Typography sx={{ fontSize: "11px", color: "#EF4444" }}>*</Typography>
            </Box>
          </Box>
          {renderMainContent()}
        </Box>
      </Box>
    </Box>
  );
}
