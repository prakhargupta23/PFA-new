import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

const items = [
  { type: "Draft Para", desc: "Reply under verification by Audit Dept", division: "Ajmer", aging: "145 DAYS", last: "10 May 2024", agingColor: "#F59E0B" },
  { type: "Audit Note", desc: "Matter under process at HQ level", division: "Bikaner", aging: "210 DAYS", last: "10 May 2024", agingColor: "#EF4444" },
  { type: "Part I Para", desc: "Unit has been nudged for closure", division: "Jodhpur", aging: "60 DAYS", last: "10 May 2024", agingColor: "#22C55E" },
];

export default function AuditInspection() {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography sx={{ fontSize: "30px", fontWeight: 700, color: "#111827" }}>Audit & Inspection Pendency</Typography>
        <Chip label="Zone: North Western Railway" size="small" sx={{ height: 20, fontSize: "10px", bgcolor: "#DBE8FF", color: "#2F5FE3" }} />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1.2, mb: 1.5 }}>
        <Box sx={{ bgcolor: "#F8FAFC", borderRadius: 1.2, p: 1.8, textAlign: "center", border: "1px solid #E2E8F0" }}>
          <Typography sx={{ fontSize: "42px", fontWeight: 700, color: "#1E293B", lineHeight: 1 }}>12</Typography>
          <Typography sx={{ fontSize: "10px", color: "#94A3B8" }}>TOTAL ACTIVE PARAS</Typography>
        </Box>
        <Box sx={{ bgcolor: "#F8FAFC", borderRadius: 1.2, p: 1.8, textAlign: "center", border: "1px solid #E2E8F0" }}>
          <Typography sx={{ fontSize: "42px", fontWeight: 700, color: "#DC2626", lineHeight: 1 }}>2</Typography>
          <Typography sx={{ fontSize: "10px", color: "#94A3B8" }}>AGEING &gt; 180 DAYS</Typography>
        </Box>
        <Box sx={{ bgcolor: "#F8FAFC", borderRadius: 1.2, p: 1.8, textAlign: "center", border: "1px solid #E2E8F0" }}>
          <Typography sx={{ fontSize: "42px", fontWeight: 700, color: "#F59E0B", lineHeight: 1 }}>4</Typography>
          <Typography sx={{ fontSize: "10px", color: "#94A3B8" }}>AGEING &lt; 90 DAYS</Typography>
        </Box>
      </Box>

      <Box sx={{ border: "1px solid #E2E8F0", borderRadius: 1.2, overflow: "hidden", mb: 1.5 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "2fr 0.8fr 1fr 1.3fr 1fr", p: 1.2, bgcolor: "#F1F5F9" }}>
          <Typography sx={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>REF/PARA TYPE</Typography>
          <Typography sx={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>DIVISION</Typography>
          <Typography sx={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>AGEING</Typography>
          <Typography sx={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>LAST REMARK DATE</Typography>
          <Typography sx={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>ACTION</Typography>
        </Box>

        {items.map((item) => (
          <Box key={item.type} sx={{ display: "grid", gridTemplateColumns: "2fr 0.8fr 1fr 1.3fr 1fr", p: 1.2, borderTop: "1px solid #EDF2F7", bgcolor: "#F8FAFC", alignItems: "center" }}>
            <Box>
              <Typography sx={{ fontSize: "12px", color: "#334155", fontWeight: 700 }}>{item.type}</Typography>
              <Typography sx={{ fontSize: "10px", color: "#94A3B8", fontStyle: "italic" }}>{item.desc}</Typography>
            </Box>
            <Typography sx={{ fontSize: "12px", color: "#334155" }}>{item.division}</Typography>
            <Box>
              <Typography sx={{ fontSize: "10px", display: "inline-block", px: 0.7, py: 0.3, borderRadius: 0.6, bgcolor: `${item.agingColor}22`, color: item.agingColor, fontWeight: 700 }}>{item.aging}</Typography>
            </Box>
            <Typography sx={{ fontSize: "11px", color: "#94A3B8" }}>{item.last}</Typography>
            <Typography sx={{ fontSize: "11px", color: "#2E63EE", fontWeight: 700 }}>NUDGE UNIT</Typography>
          </Box>
        ))}
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
