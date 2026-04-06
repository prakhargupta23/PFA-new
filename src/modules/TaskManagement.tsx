import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Box, Typography, Chip, IconButton, Dialog, DialogTitle, DialogContent, Button, Select, MenuItem, FormControl } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import SortIcon from "@mui/icons-material/Sort";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { taskService } from "../services/task.service";
import { blobService } from "../services/blob.service";

interface Task {
    taskId: string;
    createdby: string;
    status: string;
    taskHeading: string;
    content: string;
    segment: string;
    division: string;
    type: string;
    msgId: string;
    assignedTo: string;
    createdAt?: string;
    url?: string;
}

const PHONE_DESIGNATION_MAP: Record<string, string> = {
    "9001195100": "Pr. Financial Adviser",
    "9001195101": "FA&CAO/C",
    "9958709191": "FA&CAO(T)",
    "9001195103": "FA&CAO/C-1",
    "9001195115": "FA&CAO(F&B)",
    "9001195128": "FA&CAO(G)",
    "9001195111": "Dy.CAO(G)",
    "7737384957": "Dy.FACAO(W&S)",
    "9001195105": "Dy.FA&CAO/B&B,GST",
    "9001195125": "Dy.FA&CAO/Fin",
    "9001195142": "Dy.FA&CAO(C)I",
    "9001195135": "Dy.FA&CAO(C)",
    "9001198100": "Sr.DFM/JU",
    "7759966591": "Sr.DFM/JP",
    "9001196100": "Sr.DFM/AII",
    "9001197100": "Sr.DFM/BKN",
    "9001196104": "Dy.CAO/TA",
    "7800752003": "Developer(F&A)",
    "9971776764": "Developer(W&S)",
    "120363423746623808": "PFA(saar test group)",
    "120363407012014309": "PFA(whatsapp group)",
    "120363422003276029": "NWR(whatsapp group)"
};

const PHONE_NAME_MAP: Record<string, string> = {
    "9958709191": "Kush Beejal",
    "7759966591": "Manish",
    "7800752003": "Prakhar",
    "9971776764": "Yash",
    "9001195100": "Gitika Pandey",
    "9001195101": "V.S. Meena",
    "9001195104": "Rupesh Singhvi",
    "9001195103": "Abhinav Gupta",
    "9001195115": "Vishnu Bajaj",
    "9001195128": "Nishtha Puri",
    "9001195111": "Swati Chulet",
    "9001195106": "Pintu Lal Meena",
    "9001195105": "Hemant Singh",
    "9001195125": "K.K.Poonia",
    "9001195142": "Arnav Shivendu",
    "9001195135": "Kesri Meena",
    "9001198100": "Vikram Singh Saini",
    "9001199100": "Nikhil Kumar Garg",
    "9001196100": "Ashok Kr. Meena",
    "9001197100": "Sahil Garg",
    "9001196104": "Pradeep Sharma",
    "9001196581": "Mangliya Meena",
    "120363423746623808": "PFA(saar test group)",
    "120363407012014309": "PFA(whatsapp group)",
    "120363422003276029": "NWR(whatsapp group)"
};

const formatPhone = (raw: string | null | undefined): string => {
    if (!raw) return "—";
    // Remove @c.us / @g.us suffix, then strip leading country code "91"
    const withoutSuffix = raw.replace(/@[cg]\.us$/, "");
    const phone = withoutSuffix.startsWith("91") ? withoutSuffix.slice(2) : withoutSuffix;
    return PHONE_DESIGNATION_MAP[phone] || phone;
};

const formatToIST = (dateString: string | undefined): string => {
    if (!dateString) return "—";
    try {
        const date = new Date(dateString);
        return date.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    } catch {
        return "—";
    }
};

const formatName = (raw: string | null | undefined): string => {
    if (!raw) return "—";
    const withoutSuffix = raw.replace(/@[cg]\.us$/, "");
    const phone = withoutSuffix.startsWith("91") ? withoutSuffix.slice(2) : withoutSuffix;
    return PHONE_NAME_MAP[phone] || "—";
};

const getDivision = (phone: string | null | undefined): string => {
    if (!phone) return "—";
    const p = phone.replace(/@[cg]\.us$/, "").replace(/^91/, "");
    if ([
        "9001195100", "9001195101", "9001195104", "9001195103", "9001195115",
        "9001195128", "9001195111", "9001195106", "9001195105", "9001195125",
        "9001195142", "9001195135", "9001196104", "9001196581", "9958709191",
        "9958709191", "7800752003", "9971776764", "120363423746623808", "120363407012014309",
        "120363422003276029"
    ].includes(p)) {
        return "HQ";
    }
    if (p === "9001198100") return "Jodhpur";
    if (p === "7759966591") return "Jaipur";
    if (p === "9001196100") return "Ajmer";
    if (p === "9001197100") return "Bikaner";
    return "—";
};

const getDept = (phone: string | null | undefined): string => {
    if (!phone) return "—";
    const p = phone.replace(/@[cg]\.us$/, "").replace(/^91/, "");
    if (PHONE_DESIGNATION_MAP[p]) {
        return "F&A";
    }
    return "—";
};

const getDelayDays = (createdAt: string | undefined): number => {
    if (!createdAt) return -1;
    try {
        const createdDate = new Date(createdAt);
        const today = new Date();
        createdDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const diffTime = today.getTime() - createdDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 ? diffDays : -1;
    } catch {
        return -1;
    }
};

const calculateDelay = (createdAt: string | undefined): string => {
    const days = getDelayDays(createdAt);
    return days >= 0 ? `${days} days` : "—";
};

export default function TaskManagement() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showDelayedTasks, setShowDelayedTasks] = useState(false);
    const [selectedDivision, setSelectedDivision] = useState<string>("All");

    const displayedTasks = useMemo(() => {
        let filtered = [...tasks];

        if (selectedDivision !== "All") {
            filtered = filtered.filter(t => getDivision(t.createdby) === selectedDivision);
        }

        if (showDelayedTasks) {
            filtered = filtered
                .filter(t => t.status === "pending")
                .sort((a, b) => getDelayDays(b.createdAt) - getDelayDays(a.createdAt));
        }

        return filtered;
    }, [tasks, showDelayedTasks, selectedDivision]);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const response = await taskService.getAllTasks();
            console.log("response of tasks fetching", response);
            const validTasks = (response || []).filter((t: Task) => t && t.taskId && t.taskId.trim() !== "");
            setTasks(validTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDownload = async (url: string | undefined) => {
        if (!url) return;
        try {
            await blobService.downloadFileFromBlobusingURL(url);
        } catch (error) {
            console.error("Error downloading file:", error);
            // Fallback to window.open if blob service fetch fails (e.g., CORS or network issues)
            window.open(url, "_blank");
        }
    };

    const handleStatusUpdate = async (taskId: string) => {
        try {
            await taskService.updateTaskStatus(taskId);
            alert(`Task status updated successfully! ${taskId}`);
            fetchTasks();
        } catch (error) {
            console.error("Error updating task status:", error);
            alert(`Failed to update task status. ${error}`);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "30px", fontWeight: 700, color: "#111827" }}>Task Management</Typography>
                    <Chip label="Zone: North Western Railway" size="small" sx={{ height: 20, fontSize: "10px", bgcolor: "#DBE8FF", color: "#2F5FE3" }} />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                            value={selectedDivision}
                            onChange={(e) => setSelectedDivision(e.target.value)}
                            displayEmpty
                            sx={{
                                fontSize: "12px",
                                height: 32,
                                bgcolor: "#FFFFFF",
                                borderRadius: 1.5,
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#CBD5E1" }
                            }}
                        >
                            <MenuItem value="All" sx={{ fontSize: "12px" }}>All Divisions</MenuItem>
                            <MenuItem value="HQ" sx={{ fontSize: "12px" }}>HQ</MenuItem>
                            <MenuItem value="Jodhpur" sx={{ fontSize: "12px" }}>Jodhpur</MenuItem>
                            <MenuItem value="Jaipur" sx={{ fontSize: "12px" }}>Jaipur</MenuItem>
                            <MenuItem value="Ajmer" sx={{ fontSize: "12px" }}>Ajmer</MenuItem>
                            <MenuItem value="Bikaner" sx={{ fontSize: "12px" }}>Bikaner</MenuItem>
                            <MenuItem value="—" sx={{ fontSize: "12px" }}>Other</MenuItem>
                        </Select>
                    </FormControl>

                    <IconButton
                        onClick={() => setShowDelayedTasks(!showDelayedTasks)}
                        sx={{
                            color: showDelayedTasks ? "#16A34A" : "#64748B",
                            bgcolor: showDelayedTasks ? "#DCFCE7" : "transparent"
                        }}
                        title="Filter pending and sort by delay"
                    >
                        <SortIcon />
                    </IconButton>
                    <IconButton onClick={fetchTasks} disabled={loading}>
                        <RefreshIcon />
                    </IconButton>
                </Box>
            </Box>

            <Box>
                <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#1E293B", mb: 1 }}>All Tasks</Typography>
                <Box sx={{ borderRadius: 1.2, overflowX: "auto", border: "1px solid #E2E8F0" }}>
                    <Box sx={{ minWidth: "1600px" }}>
                        <Box sx={{ display: "grid", gridTemplateColumns: "0.6fr 0.6fr 0.6fr 0.6fr 2fr 0.5fr 0.8fr 0.8fr 1fr 0.8fr 0.8fr 0.6fr 0.6fr 0.4fr 0.2fr", columnGap: 2, px: 2, py: 1.5, bgcolor: "#F1F5F9", alignItems: "center" }}>
                            <Typography sx={{ fontSize: "9px", fontWeight: 700, color: "#64748B" }}>TASK ID</Typography>
                            <Typography sx={{ fontSize: "9px", fontWeight: 700, color: "#64748B" }}>DIVISION</Typography>
                            <Typography sx={{ fontSize: "9px", fontWeight: 700, color: "#64748B" }}>DEPT.</Typography>
                            <Typography sx={{ fontSize: "9px", fontWeight: 700, color: "#64748B" }}>STATUS</Typography>
                            <Typography sx={{ fontSize: "9px", fontWeight: 700, color: "#64748B" }}>CONTENT</Typography>
                            <Typography sx={{ fontSize: "9px", fontWeight: 700, color: "#64748B" }}>DELAY</Typography>
                            <Typography sx={{ fontSize: "9px", fontWeight: 700, color: "#64748B" }}>ASSGN. TO (NAME)</Typography>
                            <Typography sx={{ fontSize: "9px", fontWeight: 700, color: "#64748B" }}>ASSGN. TO (DESIG)</Typography>
                            <Typography sx={{ fontSize: "9px", fontWeight: 700, color: "#64748B" }}>CREATED AT</Typography>

                            <Typography sx={{ fontSize: "9px", fontWeight: 700, color: "#64748B" }}>CR. BY (NAME)</Typography>
                            <Typography sx={{ fontSize: "9px", fontWeight: 700, color: "#64748B" }}>CR. BY (DESIG)</Typography>
                            <Typography sx={{ fontSize: "9px", fontWeight: 700, color: "#64748B" }}>TYPE</Typography>
                            <Typography sx={{ fontSize: "9px", fontWeight: 700, color: "#64748B", textAlign: "center" }}>ACTION</Typography>
                            <Typography sx={{ fontSize: "9px", fontWeight: 700, color: "#64748B", textAlign: "center" }}>Report</Typography>
                            <Typography sx={{ fontSize: "9px", fontWeight: 700, color: "#64748B", textAlign: "center" }}></Typography>
                        </Box>

                        {loading ? (
                            <Box sx={{ px: 1.2, py: 2, textAlign: "center", bgcolor: "#F8FAFC" }}>
                                <Typography sx={{ fontSize: "12px", color: "#64748B" }}>Loading tasks...</Typography>
                            </Box>
                        ) : displayedTasks.length === 0 ? (
                            <Box sx={{ px: 1.2, py: 2, textAlign: "center", bgcolor: "#F8FAFC" }}>
                                <Typography sx={{ fontSize: "12px", color: "#64748B" }}>No tasks found</Typography>
                            </Box>
                        ) : (
                            displayedTasks.map((task) => {
                                const isPending = task.status === "pending";
                                return (
                                    <Box
                                        key={task.taskId}
                                        onClick={() => setSelectedTask(task)}
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: "0.6fr 0.6fr 0.6fr 0.6fr 2fr 0.5fr 0.8fr 0.8fr 1fr 0.8fr 0.8fr 0.6fr 0.6fr 0.4fr 0.2fr",
                                            columnGap: 2,
                                            alignItems: "center",
                                            px: 2,
                                            py: 1.5,
                                            borderTop: "1px solid #EDF2F7",
                                            bgcolor: "#F8FAFC",
                                            cursor: "pointer",
                                            "&:hover": { bgcolor: "#EDF2F7" },
                                        }}
                                    >
                                        <Typography sx={{ fontSize: "11px", color: "#334155", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "left" }}>
                                            {task.taskId}
                                        </Typography>
                                        <Typography sx={{ fontSize: "11px", color: "#334155", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {getDivision(task.createdby)}
                                        </Typography>
                                        <Typography sx={{ fontSize: "11px", color: "#334155", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {getDept(task.createdby)}
                                        </Typography>

                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                                            {isPending ? (
                                                <PendingIcon sx={{ fontSize: 14, color: "#F59E0B" }} />
                                            ) : (
                                                <CheckCircleIcon sx={{ fontSize: 14, color: "#16A34A" }} />
                                            )}
                                            <Typography
                                                sx={{
                                                    fontSize: "11px",
                                                    color: isPending ? "#F59E0B" : "#16A34A",
                                                    fontWeight: 700,
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                {task.status}
                                            </Typography>
                                        </Box>

                                        <Typography sx={{ fontSize: "11px", color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {task.content.length > 80 ? task.content.substring(0, 80) + "…" : task.content}
                                        </Typography>
                                        <Typography sx={{ fontSize: "11px", color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {calculateDelay(task.createdAt)}
                                        </Typography>
                                        <Typography sx={{ fontSize: "11px", color: "#334155", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {formatName(task.assignedTo)}
                                        </Typography>
                                        <Typography sx={{ fontSize: "11px", color: "#334155", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {formatPhone(task.assignedTo)}
                                        </Typography>
                                        <Typography sx={{ fontSize: "11px", color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {formatToIST(task.createdAt)}
                                        </Typography>

                                        <Typography sx={{ fontSize: "11px", color: "#334155", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {formatName(task.createdby)}
                                        </Typography>
                                        <Typography sx={{ fontSize: "11px", color: "#334155", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {formatPhone(task.createdby)}
                                        </Typography>
                                        <Typography sx={{ fontSize: "11px", color: "#334155", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {task.type}
                                        </Typography>

                                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                                            {isPending && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        textTransform: "none",
                                                        fontSize: "9px",
                                                        py: 0.4,
                                                        px: 1,
                                                        borderColor: "#16A34A",
                                                        color: "#16A34A",
                                                        "&:hover": { borderColor: "#16A34A", bgcolor: "#F0FDF4" },
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusUpdate(task.taskId);
                                                    }}
                                                >
                                                    Complete
                                                </Button>
                                            )}
                                        </Box>

                                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                                            {task.url ? (
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownload(task.url);
                                                    }}
                                                    sx={{ color: "#2E63EE", p: 0.5 }}
                                                >
                                                    <CloudDownloadIcon sx={{ fontSize: 16 }} />
                                                </IconButton>
                                            ) : (
                                                "—"
                                            )}
                                        </Box>


                                    </Box>
                                );
                            })
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Task Details Dialog */}
            <Dialog
                open={Boolean(selectedTask)}
                onClose={() => setSelectedTask(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                    }
                }}
            >
                {selectedTask && (
                    <>
                        <DialogTitle sx={{
                            m: 0,
                            px: 3,
                            py: 2.5,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            bgcolor: "#F8FAFC",
                            borderBottom: "1px solid #E2E8F0"
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{
                                    width: 8,
                                    height: 24,
                                    bgcolor: "#2E63EE",
                                    borderRadius: 4
                                }} />
                                <Typography sx={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                                    Task Details
                                </Typography>
                            </Box>
                            <IconButton
                                aria-label="close"
                                onClick={() => setSelectedTask(null)}
                                sx={{
                                    color: "#64748B",
                                    bgcolor: "#F1F5F9",
                                    "&:hover": { bgcolor: "#E2E8F0", color: "#0F172A" }
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent sx={{ p: 4, bgcolor: "#FFFFFF" }}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: 4 }}>
                                {/* Left Column: Meta Info */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box sx={{ p: 2.5, bgcolor: "#F8FAFC", borderRadius: 2, border: "1px solid #F1F5F9" }}>
                                        <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748B", mb: 0.5, letterSpacing: "0.05em" }}>TASK ID</Typography>
                                        <Typography sx={{ fontSize: "16px", color: "#0F172A", fontWeight: 600, wordBreak: "break-all" }}>{selectedTask.taskId}</Typography>
                                    </Box>

                                    <Box sx={{ p: 2.5, bgcolor: "#F8FAFC", borderRadius: 2, border: "1px solid #F1F5F9" }}>
                                        <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748B", mb: 0.5, letterSpacing: "0.05em" }}>CREATED AT (IST)</Typography>
                                        <Typography sx={{ fontSize: "16px", color: "#0F172A", fontWeight: 600 }}>{formatToIST(selectedTask.createdAt)}</Typography>
                                    </Box>

                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                        <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: 2, border: "1px solid #F1F5F9" }}>
                                            <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748B", mb: 0.5 }}>STATUS</Typography>
                                            <Box sx={{ mt: 0.5 }}>
                                                <Chip
                                                    icon={selectedTask.status === "pending" ? <PendingIcon sx={{ fontSize: 16 }} /> : <CheckCircleIcon sx={{ fontSize: 16 }} />}
                                                    label={selectedTask.status}
                                                    sx={{
                                                        height: 28,
                                                        fontSize: "13px",
                                                        fontWeight: 700,
                                                        textTransform: "capitalize",
                                                        px: 0.5,
                                                        bgcolor: selectedTask.status === "pending" ? "#FEF3C7" : "#DCFCE7",
                                                        color: selectedTask.status === "pending" ? "#D97706" : "#16A34A",
                                                        "& .MuiChip-icon": { color: "inherit" }
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                        <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: 2, border: "1px solid #F1F5F9" }}>
                                            <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748B", mb: 0.5 }}>TYPE</Typography>
                                            <Typography sx={{ fontSize: "15px", color: "#0F172A", fontWeight: 600, textTransform: "capitalize" }}>{selectedTask.type}</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                        <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: 2, border: "1px solid #F1F5F9" }}>
                                            <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748B", mb: 0.5 }}>CREATED BY</Typography>
                                            <Typography sx={{ fontSize: "15px", color: "#2E63EE", fontWeight: 600 }}>{formatPhone(selectedTask.createdby)}</Typography>
                                        </Box>
                                        <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: 2, border: "1px solid #F1F5F9" }}>
                                            <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748B", mb: 0.5 }}>ASSIGNED TO</Typography>
                                            <Typography sx={{ fontSize: "15px", color: "#2E63EE", fontWeight: 600 }}>{formatPhone(selectedTask.assignedTo)}</Typography>
                                        </Box>
                                    </Box>

                                    {selectedTask.type !== "GENERAL" && selectedTask.segment && (
                                        <Box sx={{ p: 2.5, bgcolor: "#F8FAFC", borderRadius: 2, border: "1px solid #F1F5F9" }}>
                                            <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748B", mb: 0.5 }}>SEGMENT</Typography>
                                            <Typography sx={{ fontSize: "15px", color: "#0F172A", fontWeight: 600 }}>{selectedTask.segment}</Typography>
                                        </Box>
                                    )}

                                    {selectedTask.url && (
                                        <Box sx={{ p: 2.5, bgcolor: "#EFF6FF", borderRadius: 2, border: "1px solid #DBE8FF" }}>
                                            <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#2E63EE", mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <AttachmentIcon sx={{ fontSize: 14 }} /> ATTACHMENT
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<CloudDownloadIcon />}
                                                onClick={() => handleDownload(selectedTask.url)}
                                                sx={{
                                                    bgcolor: "#2E63EE",
                                                    textTransform: 'none',
                                                    fontSize: '12px',
                                                    fontWeight: 700,
                                                    borderRadius: 1.5,
                                                    "&:hover": { bgcolor: "#1E4DD8" }
                                                }}
                                            >
                                                Download File
                                            </Button>
                                        </Box>
                                    )}
                                </Box>

                                {/* Right Column: Content */}
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{
                                        flex: 1,
                                        p: 3,
                                        bgcolor: "#F1F5F9",
                                        borderRadius: 3,
                                        border: "1px solid #E2E8F0",
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#E2E8F0", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Typography sx={{ fontSize: "16px" }}>📝</Typography>
                                            </Box>
                                            <Typography sx={{ fontSize: "14px", fontWeight: 800, color: "#475569", letterSpacing: "0.05em" }}>TASK CONTENT</Typography>
                                        </Box>
                                        <Box sx={{
                                            p: 3,
                                            bgcolor: "#FFFFFF",
                                            borderRadius: 2,
                                            flex: 1,
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                            overflowY: 'auto',
                                            maxHeight: '400px'
                                        }}>
                                            <Typography sx={{
                                                fontSize: "15px",
                                                color: "#1E293B",
                                                lineHeight: 1.8,
                                                whiteSpace: "pre-wrap",
                                                fontWeight: 500
                                            }}>
                                                {selectedTask.content}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Box>
    );
}
