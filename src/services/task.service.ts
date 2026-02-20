import { fetchWrapper } from "../helpers/fetch-wrapper";
import { config } from "../shared/constants/config";

export const taskService = {
    getAllTasks,
    updateTaskStatus,
};

async function getAllTasks() {
    try {
        const response = await fetchWrapper.get(`${config.apiUrl}/api/get-task-data`);
        console.log("task fetching response", response);
        return response;
    } catch (error) {
        console.log("task fetching error", error);
        return [];
    }
}

async function updateTaskStatus(taskId: string) {
    return fetchWrapper.post(`${config.apiUrl}/api/update-task`, {
        taskId,
    });
}
