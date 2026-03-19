import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Chip, Button, Skeleton, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CloseIcon from "@mui/icons-material/Close";
import VoiceRecorder from "../components/voicecapturing";
import { dashboardService } from "../services/dashboardService";

// riskRows is no longer needed as we use dynamic data

export default function AIDecisionBrain() {
  const [summaries, setSummaries] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSummary, setSelectedSummary] = useState<any>(null);

  const fetchBriefings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getLatestSummaries();
      console.log("Summaries data:", data);
      setSummaries(data || {});
    } catch (error) {
      console.error("Error fetching briefings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBriefings();
  }, [fetchBriefings]);

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
            {/* {loading ? (
              <Box sx={{ px: 1.3, pb: 1.3 }}>
                <Skeleton variant="text" sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                <Skeleton variant="text" sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
              </Box>
            ) : (
              <Typography sx={{ fontSize: "11px", color: "#E2E8F0", px: 1.3, pb: 1.3, lineHeight: 1.5 }}>
                {summaries?.capex?.content || "No recent briefings found."}
              </Typography>
            )} */}
          </Box>

          <Box sx={{ bgcolor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 1.2, p: 1.2 }}>
            <Typography sx={{ fontSize: "11px", color: "#334155", fontWeight: 700, mb: 1 }}>EXECUTIVE INSIGHTS</Typography>
            {loading ? (
              [1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 1, borderRadius: 1 }} />)
            ) : Object.keys(summaries || {}).length === 0 ? (
              <Typography sx={{ fontSize: "11px", color: "#64748B", p: 2, textAlign: "center" }}>No summaries available</Typography>
            ) : (
              Object.entries(summaries).map(([key, item]: [string, any]) => (
                <Box
                  key={key}
                  onClick={() => setSelectedSummary({ ...item, key })}
                  sx={{
                    mb: 0.9,
                    p: 0.8,
                    bgcolor: "#F8FAFC",
                    borderRadius: 1,
                    border: "1px solid #EDF2F7",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "#F1F5F9",
                      borderColor: "#cbd5e1",
                      transform: "translateY(-1px)"
                    }
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.4 }}>
                    <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#1E293B", textTransform: "uppercase" }}>{key}</Typography>
                    <Typography sx={{ fontSize: "9px", color: "#64748B", bgcolor: "#EEF2FF", px: 0.8, py: 0.2, borderRadius: 1, fontWeight: 700 }}>{item.date}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: "9.5px", color: "#64748B", mb: 0.7, fontStyle: "italic", lineHeight: 1.4 }}>
                    "{item.content.substring(0, 150)}{item.content.length > 150 ? "..." : ""}"
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                    <Button
                      size="small"
                      sx={{
                        fontSize: "9px",
                        px: 1,
                        minWidth: 85,
                        bgcolor: "#EEF2F7",
                        color: "#0F172A",
                        fontWeight: 700,
                        "&:hover": { bgcolor: "#E2E8F0" }
                      }}
                    >
                      VIEW FULL REPORT
                    </Button>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>

        <Box sx={{ bgcolor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 1.4, p: 1.4, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <VoiceRecorder />
        </Box>
      </Box>

      {/* Full Summary Dialog */}
      <Dialog
        open={Boolean(selectedSummary)}
        onClose={() => setSelectedSummary(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, p: 1 }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BoltIcon sx={{ color: "#FACC15" }} />
            <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {selectedSummary?.key} REPORT - {selectedSummary?.date}
            </Typography>
          </Box>
          <IconButton onClick={() => setSelectedSummary(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ fontSize: '15px', color: '#1E293B', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {selectedSummary?.content}
          </Typography>
        </DialogContent>
        {/* <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedSummary(null)} variant="outlined">
            Close
          </Button>
          <Button variant="contained" sx={{ bgcolor: "#1D3158" }}>
            Draft Memo
          </Button>
        </DialogActions> */}
      </Dialog>
    </Box>
  );
}
