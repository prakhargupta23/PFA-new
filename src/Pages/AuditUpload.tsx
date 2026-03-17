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
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { allMonths, fileToBase64, parseAuditExcelFile } from "../utils/auditUtils";
import { submitAuditData, getAuditMonths } from "../services/audit.service";
//import { dashboardService } from "../services/dashboardService";
import { blobService } from "../services/blob.service";

const DEFAULT_DIVISION = "North Western Railway";
const BASE_YEAR = 2017;
const currentYearValue = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYearValue - BASE_YEAR + 1 }, (_, i) => String(BASE_YEAR + i));

interface UploadRecord {
    raw: string;       // e.g. "01/2026"
    monthName: string; // e.g. "January"
    monthNum: number;  // 1-12
    year: number;      // e.g. 2026
}

const AuditUpload: React.FC = () => {
    const now = new Date();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [records, setRecords] = useState<UploadRecord[]>([]);
    const [uploadedCount, setUploadedCount] = useState(0);
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

    // Fetch Upload History (assuming dashboardService.getUploadDashboardData supports audit or needs a different endpoint later)
    const fetchUploadHistory = useCallback(async () => {
        setLoadingHistory(true);
        try {
            // Note: Currently using the same dashboard data as Capex for historical record placeholders
            // If backend provides a specific history for audit, this should be updated.
            const data = await getAuditMonths();
            console.log("Fetched audit data:", data);
            // Handle both { months: [...] } and [...] formats
            const uploadedMonths: string[] = Array.isArray(data) ? data : (data?.months ?? []);
            console.log("Uploaded audit months:", uploadedMonths);

            const rows: UploadRecord[] = uploadedMonths.map((raw: string) => {
                const [mmStr, yyyyStr] = raw.split('/');
                const monthNum = parseInt(mmStr, 10);
                const year = parseInt(yyyyStr, 10);
                const monthName = allMonths[monthNum - 1] ?? raw;
                return { raw, monthName, monthNum, year };
            });

            setRecords(rows);
            setUploadedCount(rows.length);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setLoadingHistory(false);
        }
    }, []);

    useEffect(() => {
        fetchUploadHistory();
    }, [fetchUploadHistory]);

    const handleAuditUpload = async (file: File, isReplace: boolean = false) => {
        setUploading(true);
        try {
            // 1. Upload to Blob first
            const base64 = await fileToBase64(file);
            const dateStr = `${selectedMonth}_${selectedYear}`;
            await blobService.uploadExcelToBlob("Audit", dateStr, base64);

            // 2. Parse audit file and submit
            const buffer = await file.arrayBuffer();
            const { finalData } = await parseAuditExcelFile(buffer, "NWR", selectedMonth, selectedYear, []);

            await submitAuditData({
                ...finalData,
                sourceModule: "audit-upload",
                sourceLabel: "Audit Upload",
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
        handleAuditUpload(file);
    };

    const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleNewUpload(file);
        e.target.value = '';
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleNewUpload(file);
    };

    const handleDownload = async (rec: UploadRecord) => {
        try {
            const dateStr = `${rec.monthName}_${rec.year}`;
            await blobService.downloadFileFromBlob("Audit", dateStr);
            showSnackbar("Download started.", "success");
        } catch (error: any) {
            showSnackbar(error.message || "Download failed.", "error");
        }
    };

    return (
        <Box sx={{ height: '110vh', overflowY: 'auto', bgcolor: '#F1F5F9', p: { xs: 2, md: 4 }, pb: 6 }}>
            {/* Page header */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                    <Typography
                        sx={{ fontSize: '26px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}
                    >
                        AUDIT Upload
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#64748B', mt: 0.5 }}>
                        Upload monthly AUDIT files and manage previously submitted reports.
                    </Typography>
                </Box>

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

            {/* Upload card */}
            <Paper
                elevation={0}
                sx={{
                    border: dragOver ? '2px dashed #F59E0B' : '2px dashed #CBD5E1',
                    borderRadius: 2,
                    bgcolor: dragOver ? '#FFFBEB' : '#FFFFFF',
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
                        bgcolor: '#FFFBEB',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mx: 'auto', mb: 2,
                    }}
                >
                    <CloudUploadIcon sx={{ fontSize: 28, color: '#F59E0B' }} />
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
                        bgcolor: '#F59E0B',
                        color: '#FFFFFF',
                        '&:hover': { bgcolor: '#D97706' },
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                    }}
                >
                    {uploading ? 'Uploading…' : 'Upload AUDIT'}
                </Button>
            </Paper>

            {/* History table */}
            <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
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
                            label={`${uploadedCount} uploaded`}
                            size="small"
                            sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 600, fontSize: '11px', height: 20 }}
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
                                        <Typography sx={{ color: '#64748B', fontSize: '14px' }}>No uploads found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : records.map((rec, idx) => (
                                <TableRow
                                    key={rec.raw}
                                    sx={{
                                        '&:hover': { bgcolor: '#F8FAFC' },
                                        transition: 'background 0.15s',
                                        borderBottom: idx === records.length - 1 ? 'none' : '1px solid #F1F5F9',
                                    }}
                                >
                                    <TableCell sx={{ color: '#94A3B8', fontSize: '13px', py: 1.8 }}>
                                        {idx + 1}
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 600, color: '#1E293B', fontSize: '14px', py: 1.8 }}>
                                        {rec.monthName} {rec.year}
                                    </TableCell>

                                    <TableCell sx={{ py: 1.8 }}>
                                        <Chip
                                            label="Uploaded"
                                            size="small"
                                            sx={{
                                                bgcolor: '#DCFCE7',
                                                color: '#15803D',
                                                fontWeight: 600,
                                                fontSize: '11px',
                                                height: 22,
                                                borderRadius: '6px',
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell sx={{ py: 1.8 }}>
                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<VisibilityIcon />}
                                                onClick={() => handleDownload(rec)}
                                                sx={{
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    fontSize: '12px',
                                                    borderColor: '#F59E0B',
                                                    color: '#F59E0B',
                                                    borderRadius: 1.2,
                                                    '&:hover': { bgcolor: '#FFFBEB', borderColor: '#D97706' },
                                                }}
                                            >
                                                View
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar((prev: any) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar((prev: any) => ({ ...prev, open: false }))}
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

export default AuditUpload;
