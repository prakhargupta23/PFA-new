import React, { useEffect, useState } from "react";
import { Box, Typography, Chip, Button, IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import RefreshIcon from "@mui/icons-material/Refresh";
import { taskService } from "../services/task.service";

interface Task {
    _id: string;
    createdBy: string;
    status: string;
    taskHeading: string;
    content: string;
    segment: string;
    division: string;
    type: string;
    msgId: string;
    createdAt?: string;
}

export default function TaskManagement() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await taskService.getAllTasks();
            console.log("dashboard tasks response", response);
            setTasks(response || []);
            console.log("dashboard tasks", tasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId: string, newStatus: string) => {
        try {
            await taskService.updateTaskStatus(taskId, newStatus);
            // Refresh tasks after updating status
            fetchTasks();
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

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
                    <Box sx={{ display: "grid", gridTemplateColumns: "0.8fr 1.5fr 2fr 0.8fr 0.8fr 0.8fr 0.7fr", px: 1.2, py: 1, bgcolor: "#F1F5F9", alignItems: "center" }}>
                        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>CREATED BY</Typography>
                        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>HEADING</Typography>
                        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>CONTENT</Typography>
                        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>DIVISION</Typography>
                        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>TYPE</Typography>
                        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>STATUS</Typography>
                        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748B", textAlign: "center" }}>ACTION</Typography>
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
                                    key={task._id}
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: "0.8fr 1.5fr 2fr 0.8fr 0.8fr 0.8fr 0.7fr",
                                        alignItems: "center",
                                        px: 1.2,
                                        py: 1.1,
                                        borderTop: "1px solid #EDF2F7",
                                        bgcolor: "#F8FAFC",
                                    }}
                                >
                                    <Typography sx={{ fontSize: "12px", color: "#334155", fontWeight: 600 }}>{task.createdBy}</Typography>
                                    <Typography sx={{ fontSize: "12px", color: "#64748B" }}>{task.taskHeading}</Typography>
                                    <Typography sx={{ fontSize: "11px", color: "#64748B", whiteSpace: "pre-wrap" }}>
                                        {task.content.length > 100 ? task.content.substring(0, 100) + "..." : task.content}
                                    </Typography>
                                    <Typography sx={{ fontSize: "12px", color: "#334155" }}>{task.division}</Typography>
                                    <Typography sx={{ fontSize: "12px", color: "#334155" }}>{task.type}</Typography>
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
                                                onClick={() => handleStatusUpdate(task._id, "completed")}
                                            >
                                                Complete
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })
                    )}
                </Box>
            </Box>
        </Box>
    );
}
