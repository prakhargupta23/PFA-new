import React, { useEffect, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { callToAction } from "../services/whatsapp.service";
import { auditService } from "../services/audit.service";

interface AuditDataRow {
  unit: string;
  typeOfAuditObj: string;
  openingBalance: number;
  accretion: number;
  clearanceOld: number;
  clearanceNew: number;
  closingBalance: number;
  lessThanOneYearOld: number;
  moreThanOneYearOld: number;
  total: number;
  division?: string;
  date?: string;
}

const getAgingColor = (closingBalance: number) => {
  if (closingBalance > 10) return "#EF4444"; // High pendency
  if (closingBalance > 5) return "#F59E0B";  // Medium pendency
  return "#22C55E"; // Low pendency
};

export default function AuditInspection() {
  const [data, setData] = useState<AuditDataRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        setLoading(true);
        const result = await auditService.getAuditData();
        const auditRows = Array.isArray(result) ? result : (result?.sortedAuditData || result?.AuditData || result?.auditdata || []);
        setData(auditRows);
      } catch (error) {
        console.error("Failed to fetch audit data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditData();
  }, []);

  const filteredData = data.filter(row =>
    row.typeOfAuditObj?.toLowerCase() !== 'total' &&
    row.unit?.toLowerCase() !== 'total'
  );

  const totalActiveParas = filteredData.reduce((sum, row) => sum + (Number(row.closingBalance) || 0), 0);
  const moreThanOneYear = filteredData.reduce((sum, row) => sum + (Number(row.moreThanOneYearOld) || 0), 0);
  const lessThanOneYear = filteredData.reduce((sum, row) => sum + (Number(row.lessThanOneYearOld) || 0), 0);

  const handleNudge = async (row: AuditDataRow) => {
    try {
      const title = `📑 Audit Monitoring Portal Alert`;
      const message = `A large number of audit cases are pending for closure.
Kindly prepare an action plan for early clearance of long-pending audit objections.\n\nDetails:\nUnit: ${row.unit}\nPara Type: ${row.typeOfAuditObj}\nClosing Balance: ${row.closingBalance}\nAgeing > 1 Year: ${row.moreThanOneYearOld}`;
      await callToAction(["FA/T"], title, message);
      alert(`Task created successfully!`);

      // const title = `Audit Nudge: ${row.unit}`;
      // const message = `\nUnit: ${row.unit}\nPara Type: ${row.typeOfAuditObj}\nClosing Balance: ${row.closingBalance}\nAgeing > 1 Year: ${row.moreThanOneYearOld}`;
      // await callToAction(["FA/T"], title, message);
      // alert(`Nudge sent for ${row.unit}`);
    } catch (error) {
      console.error("Error sending nudge:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading Audit & Inspection Data...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography sx={{ fontSize: "30px", fontWeight: 700, color: "#111827" }}>Audit & Inspection Pendency</Typography>
        <Chip label="Zone: North Western Railway" size="small" sx={{ height: 20, fontSize: "10px", bgcolor: "#DBE8FF", color: "#2F5FE3" }} />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1.2, mb: 1.5 }}>
        <Box sx={{ bgcolor: "#F8FAFC", borderRadius: 1.2, p: 1.8, textAlign: "center", border: "1px solid #E2E8F0" }}>
          <Typography sx={{ fontSize: "42px", fontWeight: 700, color: "#1E293B", lineHeight: 1 }}>{totalActiveParas}</Typography>
          <Typography sx={{ fontSize: "10px", color: "#94A3B8" }}>TOTAL ACTIVE PARAS</Typography>
        </Box>
        <Box sx={{ bgcolor: "#F8FAFC", borderRadius: 1.2, p: 1.8, textAlign: "center", border: "1px solid #E2E8F0" }}>
          <Typography sx={{ fontSize: "42px", fontWeight: 700, color: "#DC2626", lineHeight: 1 }}>{moreThanOneYear}</Typography>
          <Typography sx={{ fontSize: "10px", color: "#94A3B8" }}>AGEING &gt; 1 YEAR</Typography>
        </Box>
        <Box sx={{ bgcolor: "#F8FAFC", borderRadius: 1.2, p: 1.8, textAlign: "center", border: "1px solid #E2E8F0" }}>
          <Typography sx={{ fontSize: "42px", fontWeight: 700, color: "#F59E0B", lineHeight: 1 }}>{lessThanOneYear}</Typography>
          <Typography sx={{ fontSize: "10px", color: "#94A3B8" }}>AGEING &lt; 1 YEAR</Typography>
        </Box>
      </Box>

      <Box sx={{ border: "1px solid #E2E8F0", borderRadius: 1.2, overflowX: "auto", mb: 1.5 }}>
        <Box sx={{ minWidth: "1000px" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr", p: 1.2, bgcolor: "#F1F5F9" }}>
            <Typography sx={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>REF/PARA TYPE</Typography>
            <Typography sx={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>UNIT</Typography>
            <Typography sx={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>OPENING</Typography>
            <Typography sx={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>ACCRETION</Typography>
            <Typography sx={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>CLR(OLD)</Typography>
            <Typography sx={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>CLR(NEW)</Typography>
            <Typography sx={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>CLOSING</Typography>
            <Typography sx={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>&lt; 1 YR</Typography>
            <Typography sx={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>&gt; 1 YR</Typography>
            <Typography sx={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>TOTAL</Typography>
            <Typography sx={{ fontSize: "10px", color: "#64748B", fontWeight: 700, textAlign: "center" }}>ACTION</Typography>
          </Box>

          {filteredData.length > 0 ? (
            filteredData.map((row, idx) => (
              <Box key={idx} sx={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr", p: 1.2, borderTop: "1px solid #EDF2F7", bgcolor: "#F8FAFC", alignItems: "center" }}>
                <Box>
                  <Typography sx={{ fontSize: "12px", color: "#334155", fontWeight: 700 }}>{row.typeOfAuditObj || "N/A"}</Typography>
                  {/* <Typography sx={{ fontSize: "10px", color: "#94A3B8", fontStyle: "italic" }}>Audit reference data</Typography> */}
                </Box>
                <Typography sx={{ fontSize: "12px", color: "#334155" }}>{row.unit || "N/A"}</Typography>
                <Typography sx={{ fontSize: "12px", color: "#334155" }}>{row.openingBalance ?? 0}</Typography>
                <Typography sx={{ fontSize: "12px", color: "#334155" }}>{row.accretion ?? 0}</Typography>
                <Typography sx={{ fontSize: "12px", color: "#334155" }}>{row.clearanceOld ?? 0}</Typography>
                <Typography sx={{ fontSize: "12px", color: "#334155" }}>{row.clearanceNew ?? 0}</Typography>
                <Box>
                  <Typography sx={{
                    fontSize: "10px",
                    display: "inline-block",
                    px: 0.7,
                    py: 0.3,
                    borderRadius: 0.6,
                    bgcolor: `${getAgingColor(Number(row.closingBalance))}22`,
                    color: getAgingColor(Number(row.closingBalance)),
                    fontWeight: 700
                  }}>
                    {row.closingBalance ?? 0}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: "12px", color: "#334155" }}>{row.lessThanOneYearOld ?? 0}</Typography>
                <Typography sx={{ fontSize: "12px", color: "#334155" }}>{row.moreThanOneYearOld ?? 0}</Typography>
                <Typography sx={{ fontSize: "12px", color: "#334155", fontWeight: 700 }}>{row.total ?? 0}</Typography>
                <Box
                  onClick={() => handleNudge(row)}
                  sx={{
                    py: 0.6,
                    px: 1,
                    borderRadius: "6px",
                    bgcolor: "rgba(37, 211, 102, 0.1)",
                    border: "1px solid rgba(37, 211, 102, 0.15)",
                    color: "#25D366",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.8,
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    justifySelf: "center",
                    "&:hover": {
                      bgcolor: "#25D366",
                      color: "#fff",
                      borderColor: "#25D366",
                      boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)"
                    },
                    "&:active": { transform: "translateY(1px)" }
                  }}
                >
                  <WhatsAppIcon sx={{ fontSize: 13 }} />
                  <Typography sx={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.4px" }}>
                    NUDGE UNIT
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '13px', color: '#64748B' }}>No audit records found.</Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ borderRadius: 1.2, border: "1px solid #F4D28A", bgcolor: "#FFF7E6", p: 1.4, display: "flex", gap: 0.8 }}>
        <WarningAmberRoundedIcon sx={{ fontSize: 16, color: "#B45309", mt: 0.1 }} />
        <Box>
          <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#9A3412", mb: 0.4 }}>AI Governance Insight: Audit Loop Detected</Typography>
          <Typography sx={{ fontSize: "10px", color: "#B45309" }}>
            The Sojapur HQ Para (Draft Para - Part I) has returned "Matter under process at HQ level" for 4 consecutive weeks. This indicates a bottleneck in the approval workflow rather than a data verification issue.
            <strong> Recommendation:</strong> PFA may consider seeking a timeline for final disposal from Dy.FA&amp;CAO/G.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
