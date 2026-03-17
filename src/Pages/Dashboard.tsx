import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, Snackbar, Alert, FormControl, Select, MenuItem, Menu } from "@mui/material";
import {
  ShowChart as SummaryIcon,
  Business as CapexIcon,
  AttachMoney as OweIcon,
  Assignment as AuditIcon,
  SmartToy as AiIcon,
  ListAlt as TaskIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  NotificationsNone as NotificationsIcon,
} from "@mui/icons-material";
import ExecutiveSummary from "../modules/ExecutiveSummary";
import CapexAnalysis from "../modules/CapexAnalysis";
import OweManagement from "../modules/OweManagement";
import AuditInspection from "../modules/AuditInspection";
import AIDecisionBrain from "../modules/AIDecisionBrain";
import TaskManagement from "../modules/TaskManagement";
import { parseExcelFile, allMonths } from "../utils/pfaUtils";
import { submitPfaData } from "../services/pfa.service";
import { parseOweExcelFile } from "../utils/owe.Utils";
import { submitOweData } from "../services/owe.service";
import { parseAuditExcelFile } from "../utils/auditUtils";
import { submitAuditData } from "../services/audit.service";

const SIDEBAR_WIDTH = 190;
const TOP_BAR_HEIGHT = 46;
const DEFAULT_DIVISION = "North Western Railway";

type NavKey = "executive-summary" | "capex" | "owe" | "audit" | "ai-brain" | "tasks";
type SnackbarSeverity = "success" | "error" | "info";

const navItems: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: "executive-summary", label: "Executive Summary", icon: <SummaryIcon /> },
  { key: "capex", label: "CAPEX / Works", icon: <CapexIcon /> },
  { key: "owe", label: "OWE / Expenditure", icon: <OweIcon /> },
  { key: "audit", label: "Audit & Inspections", icon: <AuditIcon /> },
  { key: "ai-brain", label: "AI Decision Brain", icon: <AiIcon /> },
  { key: "tasks", label: "Task Management", icon: <TaskIcon /> },
];

export default function Dashboard() {
  const now = new Date();
  const [activeNav, setActiveNav] = useState<NavKey>("executive-summary");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("December");
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [uploadMenuAnchor, setUploadMenuAnchor] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: SnackbarSeverity }>({
    open: false,
    message: "",
    severity: "info",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const BASE_YEAR = 2017;
  const currentYear = now.getFullYear();
  const yearOptions = Array.from({ length: currentYear - BASE_YEAR + 1 }, (_, i) => String(BASE_YEAR + i));

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [activeNav]);

  const renderMainContent = () => {
    const monthNumber = allMonths.indexOf(selectedMonth) + 1;

    switch (activeNav) {
      // case "executive-summary":
      //   return <ExecutiveSummary />;
      case "executive-summary":
        return (
          <ExecutiveSummary
            month={monthNumber}
            year={Number(selectedYear)}
          />
        );

      case "capex":
        return <CapexAnalysis month={monthNumber} year={Number(selectedYear)} />;
      case "owe":
        return <OweManagement month={monthNumber} year={Number(selectedYear)} />;
      case "audit":
        return <AuditInspection />;
      case "ai-brain":
        return <AIDecisionBrain />;
      case "tasks":
        return <TaskManagement />;
      default: {
        const monthNumber = allMonths.indexOf(selectedMonth) + 1;
        return (
          <ExecutiveSummary
            month={monthNumber}
            year={Number(selectedYear)}
          />
        );
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const shouldUseUploadMenu = activeNav === "executive-summary" || activeNav === "owe";
  const isUploadMenuOpen = Boolean(uploadMenuAnchor);

  // const handleUploadMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
  //   setUploadMenuAnchor(event.currentTarget);
  // };

  const handleUploadMenuClose = () => {
    setUploadMenuAnchor(null);
  };

  const handleMenuUploadClick = () => {
    handleUploadMenuClose();
    handleUploadClick();
  };

  const showSnackbar = (message: string, severity: SnackbarSeverity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleFinancialUpload = async (file: File, contextLabel: string, nav: NavKey) => {
    const month = selectedMonth;
    const year = selectedYear;

    const buffer = await file.arrayBuffer();
    if (nav === "owe") {
      const { finalData } = await parseOweExcelFile(buffer, DEFAULT_DIVISION, month, year);
      console.log("Parsed OWE Excel Data:", finalData);
      await submitOweData(finalData);
    } else if (nav === "executive-summary") {
      const { finalData } = await parseExcelFile(buffer, DEFAULT_DIVISION, month, year, []);
      console.log("Parsed Excel Data:", finalData);
      await submitPfaData({
        ...finalData,
        sourceModule: nav,
        sourceLabel: contextLabel,
      });
    } else if (nav === "audit") {
      const { finalData } = await parseAuditExcelFile(buffer, DEFAULT_DIVISION, month, year, []);
      console.log("Parsed Audit Excel Data:", finalData);
      await submitAuditData({
        ...finalData,
        sourceModule: nav,
        sourceLabel: contextLabel,
      });
    }
    showSnackbar(`${contextLabel} upload completed successfully.`, "success");
  };

  const handleAIBrainUpload = async (file: File) => {
    if (file.size === 0) {
      throw new Error("Selected file is empty.");
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    showSnackbar(`AI Brain file "${file.name}" received for briefing.`, "success");
  };

  const getUploadConfig = (nav: NavKey) => {
    switch (nav) {
      case "executive-summary":
        return {
          label: "Upload Executive",
          accept: ".xlsx,.xls",
          color: "#2eeee4",
          hoverColor: "#d01e98",
          textColor: "#FFFFFF",
          handler: (file: File) => handleFinancialUpload(file, "Executive Summary", nav),
        };
      case "capex":
        return {
          label: "Upload CAPEX",
          accept: ".xlsx,.xls",
          color: "#53219900",
          hoverColor: "#cf1dd8",
          textColor: "#111111",
          handler: (file: File) => handleFinancialUpload(file, "CAPEX / Works", nav),
        };
      case "owe":
        return {
          label: "Upload OWE",
          accept: ".xlsx,.xls,.csv",
          color: "#0EA5A4",
          hoverColor: "#0B8685",
          textColor: "#FFFFFF",
          handler: (file: File) => handleFinancialUpload(file, "OWE / Expenditure", nav),
        };
      case "audit":
        return {
          label: "Upload Audit",
          accept: ".xlsx,.xls,.csv",
          color: "#F59E0B",
          hoverColor: "#D97706",
          textColor: "#FFFFFF",
          handler: (file: File) => handleFinancialUpload(file, "Audit & Inspections", nav),
        };
      case "ai-brain":
        return {
          label: "Upload AI Input",
          accept: ".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv",
          color: "#7C3AED",
          hoverColor: "#6D28D9",
          textColor: "#FFFFFF",
          handler: (file: File) => handleAIBrainUpload(file),
        };
      default:
        return {
          label: "Upload",
          accept: ".xlsx,.xls",
          color: "#2E63EE",
          hoverColor: "#1E4FD0",
          textColor: "#FFFFFF",
          handler: (file: File) => handleFinancialUpload(file, "Executive Summary", "executive-summary"),
        };
    }
  };

  const activeUploadConfig = getUploadConfig(activeNav);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setUploadLoading(true);
    try {
      await activeUploadConfig.handler(file);
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? "Upload failed.";
      showSnackbar(message, "error");
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
          bgcolor: "#ffffff",
          color: "#0F172A",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          borderBottom: "1px solid #E2E8F0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        {/* Left: Branding */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Box sx={{ width: 26, height: 26, borderRadius: "6px", bgcolor: "#2D66F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SummaryIcon sx={{ color: "#fff", fontSize: 15 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "13px", fontWeight: 700, lineHeight: 1.1, color: "#0F172A" }}>RailGuard PFA</Typography>
            <Typography sx={{ fontSize: "9px", color: "#94A3B8", lineHeight: 1.1, letterSpacing: "0.04em" }}>FINANCIAL GOVERNANCE PORTAL</Typography>
          </Box>
        </Box>

        {/* Right: Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.4 }}>
          {/* Month selector */}
          {/* <FormControl size="small">
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              sx={{ fontSize: "11px", height: 30, minWidth: 110, bgcolor: "#F8FAFC", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E1" } }}
            >
              {allMonths.map((month) => (
                <MenuItem key={month} value={month} sx={{ fontSize: "11px" }}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>


          <FormControl size="small">
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              sx={{ fontSize: "11px", height: 30, minWidth: 76, bgcolor: "#F8FAFC", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E1" } }}
            >
              {yearOptions.map((y) => (
                <MenuItem key={y} value={y} sx={{ fontSize: "11px" }}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl> */}

          {/* Upload button */}
          {/* {activeNav !== "ai-brain" && activeNav !== "tasks" && (


            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={activeUploadConfig.accept}
                style={{ display: "none" }}
              />
              <Button
                size="small"
                variant="contained"
                onClick={handleUploadClick}
                disabled={uploadLoading}
                sx={{
                  height: 30,
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "none",
                  px: 1.8,
                  bgcolor: "#2E63EE",
                  boxShadow: "none",
                  borderRadius: "6px",
                  "&:hover": { bgcolor: "#1E4FD0", boxShadow: "none" },
                  "&.Mui-disabled": { bgcolor: "#CBD5E1", color: "#94A3B8" },
                }}
              >
                {uploadLoading ? "Uploading…" : activeUploadConfig.label}
              </Button>
            </>
          )} */}

          {/* Divider */}
          <Box sx={{ width: "1px", height: 22, bgcolor: "#E2E8F0" }} />

          {/* Notifications */}
          <Box sx={{ cursor: "pointer", color: "#64748B", "&:hover": { color: "#0F172A" }, display: "flex", alignItems: "center" }}>
            <NotificationsIcon sx={{ fontSize: 18 }} />
          </Box>

          {/* Avatar */}
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              bgcolor: "#2D66F5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <PersonIcon sx={{ color: "#fff", fontSize: 15 }} />
          </Box>
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

      {/* ── Sidebar ── */}
      <Box
        className="dashboard-sidebar"
        sx={{
          width: SIDEBAR_WIDTH,
          position: "fixed",
          top: TOP_BAR_HEIGHT,
          left: 0,
          bottom: 0,
          bgcolor: "#0B1635",
          display: "flex",
          flexDirection: "column",
          zIndex: 1000,
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Nav items */}
        <Box sx={{ flex: 1, py: 1.5, overflowY: "auto" }}>
          {navItems.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <Box
                key={item.key}
                onClick={() => setActiveNav(item.key)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.1,
                  px: 1.6,
                  py: 0.9,
                  mx: 1,
                  mb: 0.4,
                  borderRadius: "8px",
                  bgcolor: isActive ? "rgba(46,99,238,0.18)" : "transparent",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.15s ease",
                  borderLeft: isActive ? "3px solid #2E63EE" : "3px solid transparent",
                  "&:hover": {
                    bgcolor: isActive ? "rgba(46,99,238,0.18)" : "rgba(255,255,255,0.06)",
                    color: "#fff",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", "& svg": { fontSize: 17 } }}>{item.icon}</Box>
                <Typography sx={{ fontSize: "11.5px", fontWeight: isActive ? 700 : 500, letterSpacing: "0.01em" }}>
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Footer */}
        <Box sx={{ p: 1.4, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.2, p: 0.9, borderRadius: "8px", bgcolor: "rgba(255,255,255,0.05)" }}>
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                bgcolor: "#19325A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <PersonIcon sx={{ color: "#fff", fontSize: 14 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: "10px", fontWeight: 600, lineHeight: 1.2, color: "#fff" }}>Username</Typography>
              <Typography sx={{ fontSize: "8px", color: "rgba(255,255,255,0.5)", lineHeight: 1.2, letterSpacing: "0.03em" }}>
                PRINCIPAL FINANCIAL ADVISER
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              cursor: "pointer",
              color: "rgba(255,255,255,0.5)",
              pl: 0.5,
              borderRadius: "6px",
              py: 0.4,
              transition: "color 0.15s",
              "&:hover": { color: "#fff" },
            }}
          >
            <LogoutIcon sx={{ fontSize: 13 }} />
            <Typography sx={{ fontSize: "10px", fontWeight: 500 }}>Sign out</Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Main Content ── */}
      <Box
        className="dashboard-main"
        ref={mainContentRef}
        sx={{
          position: "fixed",
          top: TOP_BAR_HEIGHT,
          left: SIDEBAR_WIDTH,
          right: 0,
          bottom: 0,
          bgcolor: "#F1F5F9",
          p: 2.5,
          boxSizing: "border-box",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* Page section label */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <Box sx={{ width: 3, height: 16, borderRadius: 2, bgcolor: "#2E63EE" }} />
            <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#64748B", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {navItems.find((n) => n.key === activeNav)?.label ?? "Dashboard"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <CalendarIcon sx={{ color: "#94A3B8", fontSize: 12 }} />
            <Typography sx={{ fontSize: "10px", color: "#94A3B8" }}>
              {selectedMonth} {selectedYear}
            </Typography>
          </Box>
        </Box>

        {renderMainContent()}
      </Box>

      {/* Hidden upload menu (kept for backward-compat, no longer used) */}
      <Menu
        anchorEl={uploadMenuAnchor}
        open={shouldUseUploadMenu && isUploadMenuOpen}
        onClose={handleUploadMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { p: 1.2, mt: 0.6, minWidth: 210 } }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <FormControl size="small" fullWidth>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              sx={{ fontSize: "11px", height: 32 }}
            >
              {allMonths.map((month) => (
                <MenuItem key={month} value={month} sx={{ fontSize: "11px" }}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            size="small"
            variant="contained"
            onClick={handleMenuUploadClick}
            disabled={uploadLoading}
            sx={{ height: 32, fontSize: "11px", textTransform: "none", bgcolor: "#2E63EE", "&:hover": { bgcolor: "#1E4FD0" } }}
          >
            Upload Excel
          </Button>
        </Box>
      </Menu>
    </Box>
  );
}
