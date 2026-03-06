import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Visibility as VisibilityIcon,
  SwapHoriz as ReplaceIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { parseExcelFile, allMonths } from "../utils/pfaUtils";
import { submitPfaData } from "../services/pfa.service";
import { getDashboardData } from "../services/dashboardService";

const DEFAULT_DIVISION = "North Western Railway";
const BASE_YEAR = 2017;
const currentYearValue = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYearValue - BASE_YEAR + 1 }, (_, i) => String(BASE_YEAR + i));

// ── Real data structure ──────────────────────────────────────────────────────
interface UploadRecord {
  month: string;
  monthNum: number;
  year: number;
  isUploaded: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────

const ExecutiveSummaryUpload: React.FC = () => {
  const now = new Date();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const [records, setRecords] = useState<UploadRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  
  const [selectedMonth, setSelectedMonth] = useState<string>(allMonths[now.getMonth()]);
  const [selectedYear, setSelectedYear] = useState<string>(String(now.getFullYear()));
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // ── Fetch Upload History (Real Logic) ─────────────────────────────────────────
  const fetchUploadHistory = useCallback(async () => {
    setLoadingHistory(true);
    const yr = Number(selectedYear);
    const results: UploadRecord[] = [];
    
    // Check months for the selected year
    // For performance, we could check only up to current month if it's the current year
    const monthsToCheck = yr === now.getFullYear() ? now.getMonth() + 1 : 12;

    try {
      // In a real scenario, there'd be one API for all. Here we use getDashboardData as requested.
      // We'll iterate through all relevant months.
      const promises = allMonths.slice(0, monthsToCheck).map(async (m, idx) => {
        try {
          const data = await getDashboardData(idx + 1, yr);
          // If data has utilization or graphData, assume it's uploaded
          const isUploaded = !!(data && (data.utilization > 0 || (data.graphData && data.graphData.length > 0)));
          return { month: m, monthNum: idx + 1, year: yr, isUploaded };
        } catch (e) {
          return { month: m, monthNum: idx + 1, year: yr, isUploaded: false };
        }
      });

      const resolvedRecords = await Promise.all(promises);
      setRecords(resolvedRecords.reverse()); // Show most recent first
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoadingHistory(false);
    }
  }, [selectedYear, now]);

  useEffect(() => {
    fetchUploadHistory();
  }, [fetchUploadHistory]);

  // ── New upload (Real Logic) ──────────────────────────────────────────────────
  const handleFinancialUpload = async (file: File, isReplace: boolean = false) => {
    setUploading(true);
    try {
      const buffer = await file.arrayBuffer();
      const { finalData } = await parseExcelFile(buffer, DEFAULT_DIVISION, selectedMonth, selectedYear, []);
      
      await submitPfaData({
        ...finalData,
        sourceModule: "executive-summary",
        sourceLabel: "Executive Summary",
      });

      showSnackbar(`${isReplace ? 'Replacement' : 'Upload'} for ${selectedMonth} ${selectedYear} completed.`, "success");
      fetchUploadHistory();
    } catch (error: any) {
      showSnackbar(error?.message || "Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleNewUpload = (file: File) => {
    handleFinancialUpload(file);
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleNewUpload(file);
    e.target.value = '';
  };

  // ── Replace ─────────────────────────────────────────────────────────────────
  const onReplaceSelected = (month: string, monthNum: number, year: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Set temp month/year for the upload context
    setSelectedMonth(month);
    setSelectedYear(String(year));
    
    handleFinancialUpload(file, true);
    e.target.value = '';
  };

  // ── Drag-and-drop ────────────────────────────────────────────────────────────
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleNewUpload(file);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F1F5F9', p: { xs: 2, md: 4 } }}>
      {/* ── Page header ── */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography
            sx={{ fontSize: '26px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}
          >
            Executive Summary Upload
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#64748B', mt: 0.5 }}>
            Upload monthly executive summary files and manage previously submitted reports.
          </Typography>
        </Box>

        {/* Month/Year Selectors */}
        <Stack direction="row" spacing={2} sx={{ mb: 0.5 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#64748B', mb: 0.5, ml: 0.5 }}>SELECT MONTH</Typography>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              sx={{ height: 36, bgcolor: 'white', borderRadius: 1.5, fontSize: '13px' }}
            >
              {allMonths.map((m) => (
                <MenuItem key={m} value={m} sx={{ fontSize: '13px' }}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#64748B', mb: 0.5, ml: 0.5 }}>SELECT YEAR</Typography>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              sx={{ height: 36, bgcolor: 'white', borderRadius: 1.5, fontSize: '13px' }}
            >
              {yearOptions.map((y) => (
                <MenuItem key={y} value={y} sx={{ fontSize: '13px' }}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* ── Upload card ── */}
      <Paper
        elevation={0}
        sx={{
          border: dragOver ? '2px dashed #3B63E2' : '2px dashed #CBD5E1',
          borderRadius: 2,
          bgcolor: dragOver ? '#EFF6FF' : '#FFFFFF',
          p: 4,
          mb: 4,
          textAlign: 'center',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          style={{ display: 'none' }}
          onChange={onFileSelected}
        />

        <Box
          sx={{
            width: 56, height: 56,
            borderRadius: '50%',
            bgcolor: '#EFF6FF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 2,
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 28, color: '#3B63E2' }} />
        </Box>

        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>
          {uploading ? 'Uploading…' : 'Drag & drop your file here'}
        </Typography>
        <Typography sx={{ fontSize: '13px', color: '#94A3B8', mb: 2.5 }}>
          Supported formats: Excel (.xlsx, .xls) &nbsp;·&nbsp; Max size: 20 MB
        </Typography>

        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          disabled={uploading}
          onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
          sx={{
            bgcolor: '#3B63E2',
            '&:hover': { bgcolor: '#2A4FCC' },
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
          }}
        >
          {uploading ? 'Uploading…' : 'Upload Executive Summary'}
        </Button>
      </Paper>

      {/* ── History table ── */}
      <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {/* Table header bar */}
        <Box
          sx={{
            px: 3, py: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckCircleIcon sx={{ fontSize: 18, color: '#22C55E' }} />
            <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>
              Upload History
            </Typography>
            <Chip
              label={`${records.length} records`}
              size="small"
              sx={{ bgcolor: '#EFF6FF', color: '#3B63E2', fontWeight: 600, fontSize: '11px', height: 20 }}
            />
          </Stack>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                {['#', 'Period', 'Status', 'Actions'].map(col => (
                  <TableCell
                    key={col}
                    sx={{
                      fontWeight: 700,
                      fontSize: '12px',
                      color: '#64748B',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      py: 1.5,
                      borderBottom: '1px solid #E2E8F0',
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loadingHistory ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography sx={{ color: '#64748B', fontSize: '14px' }}>Loading history...</Typography>
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography sx={{ color: '#64748B', fontSize: '14px' }}>No records found for {selectedYear}</Typography>
                  </TableCell>
                </TableRow>
              ) : records.map((rec, idx) => (
                <TableRow
                  key={`${rec.month}-${rec.year}`}
                  sx={{
                    '&:hover': { bgcolor: '#F8FAFC' },
                    transition: 'background 0.15s',
                    borderBottom: idx === records.length - 1 ? 'none' : '1px solid #F1F5F9',
                  }}
                >
                  {/* # */}
                  <TableCell sx={{ color: '#94A3B8', fontSize: '13px', py: 1.8 }}>
                    {idx + 1}
                  </TableCell>

                  {/* Period */}
                  <TableCell sx={{ fontWeight: 600, color: '#1E293B', fontSize: '14px', py: 1.8 }}>
                    {rec.month} {rec.year}
                  </TableCell>

                  {/* Status */}
                  <TableCell sx={{ py: 1.8 }}>
                    <Chip
                      label={rec.isUploaded ? "Uploaded" : "No Data"}
                      size="small"
                      sx={{
                        bgcolor: rec.isUploaded ? '#DCFCE7' : '#F1F5F9',
                        color: rec.isUploaded ? '#15803D' : '#64748B',
                        fontWeight: 600,
                        fontSize: '11px',
                        height: 22,
                        borderRadius: '6px',
                      }}
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell sx={{ py: 1.8 }}>
                    <Stack direction="row" spacing={1}>
                      {/* View */}
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={!rec.isUploaded}
                        startIcon={<VisibilityIcon />}
                        onClick={() => window.open(`/?month=${rec.month}&year=${rec.year}`, '_blank')}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '12px',
                          borderColor: '#3B63E2',
                          color: '#3B63E2',
                          borderRadius: 1.2,
                          '&:hover': { bgcolor: '#EFF6FF', borderColor: '#2A4FCC' },
                        }}
                      >
                        View
                      </Button>

                      {/* Replace */}
                      <>
                        <input
                          ref={el => (replaceInputRefs.current[rec.monthNum] = el)}
                          type="file"
                          accept=".xlsx,.xls"
                          style={{ display: 'none' }}
                          onChange={e => onReplaceSelected(rec.month, rec.monthNum, rec.year, e)}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ReplaceIcon />}
                          onClick={() => replaceInputRefs.current[rec.monthNum]?.click()}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '12px',
                            borderColor: '#E2E8F0',
                            color: '#64748B',
                            borderRadius: 1.2,
                            '&:hover': { bgcolor: '#F1F5F9', borderColor: '#CBD5E1' },
                          }}
                        >
                          Replace
                        </Button>
                      </>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExecutiveSummaryUpload;
