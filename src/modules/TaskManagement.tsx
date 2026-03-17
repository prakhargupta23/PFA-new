import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Chip, IconButton, Dialog, DialogTitle, DialogContent } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import { taskService } from "../services/task.service";

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
}

const formatPhone = (raw: string | null | undefined): string => {
    if (!raw) return "—";
    // Remove @c.us / @g.us suffix, then strip leading country code "91"
    const withoutSuffix = raw.replace(/@[cg]\.us$/, "");
    return withoutSuffix.startsWith("91") ? withoutSuffix.slice(2) : withoutSuffix;
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

export default function TaskManagement() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const response = await taskService.getAllTasks();
            console.log("response of tasks fetching", response);
            setTasks(response || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleStatusUpdate = async (taskId: any) => {
        try {
            console.log("taskId", taskId);
            await taskService.updateTaskStatus(taskId);
            await fetchTasks();
        } catch (error) {
            console.error("Error updating task status:", error);
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
                <IconButton onClick={fetchTasks} disabled={loading}>
                    <RefreshIcon />
                </IconButton>
            </Box>

            <Box>
                <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#1E293B", mb: 1 }}>All Tasks</Typography>
                <Box sx={{ borderRadius: 1.2, overflow: "hidden", border: "1px solid #E2E8F0" }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: "0.8fr 1fr 1.5fr 0.8fr 1fr 0.8fr 0.7fr 0.7fr", px: 1.2, py: 1, bgcolor: "#F1F5F9", alignItems: "center" }}>
                        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>TASK ID</Typography>
                        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>CREATED BY</Typography>
                        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>CREATED AT</Typography>
                        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>CONTENT</Typography>
                        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>TYPE</Typography>
                        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>ASSIGNED TO</Typography>
                        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>STATUS</Typography>
                        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>ACTION</Typography>
                    </Box>

                    {loading ? (
                        <Box sx={{ px: 1.2, py: 2, textAlign: "center", bgcolor: "#F8FAFC" }}>
                            <Typography sx={{ fontSize: "12px", color: "#64748B" }}>Loading tasks...</Typography>
                        </Box>
                    ) : tasks.length === 0 ? (
                        <Box sx={{ px: 1.2, py: 2, textAlign: "center", bgcolor: "#F8FAFC" }}>
                            <Typography sx={{ fontSize: "12px", color: "#64748B" }}>No tasks found</Typography>
                        </Box>
                    ) : (
                        tasks.map((task) => {
                            const isPending = task.status === "pending";
                            return (
                                <Box
                                    key={task.taskId}
                                    onClick={() => setSelectedTask(task)}
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: "0.8fr 1fr 1.5fr 0.8fr 1fr 0.8fr 0.7fr 0.7fr",
                                        alignItems: "center",
                                        px: 1.2,
                                        py: 1.1,
                                        borderTop: "1px solid #EDF2F7",
                                        bgcolor: "#F8FAFC",
                                        cursor: "pointer",
                                        "&:hover": { bgcolor: "#EDF2F7" },
                                    }}
                                >
                                    <Typography sx={{ fontSize: "11px", color: "#334155", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {task.taskId}
                                    </Typography>
                                    {/* Col 1 – CREATED BY */}
                                    <Typography sx={{ fontSize: "11px", color: "#334155", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {formatPhone(task.createdby)}
                                    </Typography>
                                    {/* Col 2 – CREATED AT */}
                                    <Typography sx={{ fontSize: "11px", color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {formatToIST(task.createdAt)}
                                    </Typography>
                                    {/* Col 3 – CONTENT */}
                                    <Typography sx={{ fontSize: "11px", color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {task.content.length > 80 ? task.content.substring(0, 80) + "…" : task.content}
                                    </Typography>
                                    {/* Col 3 – TYPE */}
                                    <Typography sx={{ fontSize: "11px", color: "#334155", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {task.type}
                                    </Typography>
                                    {/* Col 4 – ASSIGNED TO */}
                                    <Typography sx={{ fontSize: "11px", color: "#334155", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {formatPhone(task.assignedTo)}
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

                                    {/* Col 6 – ACTION */}
                                    <Box sx={{ display: "flex", alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
                                        {isPending ? (
                                            <Box
                                                onClick={() => handleStatusUpdate(task.taskId)}
                                                sx={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: 0.4,
                                                    px: 1,
                                                    py: 0.4,
                                                    borderRadius: "6px",
                                                    border: "1px solid #16A34A",
                                                    color: "#16A34A",
                                                    cursor: "pointer",
                                                    fontSize: "10px",
                                                    fontWeight: 700,
                                                    transition: "all 0.15s ease",
                                                    "&:hover": { bgcolor: "#F0FDF4", boxShadow: "0 1px 4px rgba(22,163,74,0.2)" },
                                                }}
                                            >
                                                {/* <CheckCircleIcon sx={{ fontSize: 12 }} /> */}
                                                Complete
                                            </Box>
                                        ) : (
                                            <Typography sx={{ fontSize: "10px", color: "#94A3B8", fontStyle: "italic" }}>Done</Typography>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })
                    )}
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
