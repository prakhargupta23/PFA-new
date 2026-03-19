import { config } from "../shared/constants/config";
import { fetchWrapper } from "../helpers/fetch-wrapper";
import axios from "axios";




export const callToAction = async (roles: string[], title: string, message: string) => {
    try {
        console.log("call to action reached")
        const taskIDroute = await axios.get(
            "https://nwr-whatsapp-api-bqfadsfzc2ergzcx.canadacentral-01.azurewebsites.net/generate_taskid",
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const taskID = taskIDroute.data.task_id
        console.log("taskID", taskID)
        console.log("roles", roles)
        const response = await fetch("https://nwr-whatsapp-api-bqfadsfzc2ergzcx.canadacentral-01.azurewebsites.net/message-from-pfa-portal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roles: roles,
                body: `${message} \n\n Task ID: ${taskID}`,
            }),

        });


        const data = await response.json();
        console.log("data id", data.id)
        console.log("data", data)
        const dbdata = {
            createdBy: "PFA",
            status: "pending",
            taskHeading: title,
            content: message,
            segment: "NWR",
            division: "NWR",
            type: "PFA",
            msgId: data.id,
            taskId: taskID,
            assignedTo: roles.join(", "),
        }
        console.log("hey", data);
        const insertionresponse = await fetchWrapper.post(`${config.apiUrl}/api/create-task`, dbdata);
        return { data, insertionresponse };
    } catch (error: any) {
        console.error("Error submitting PFA data:", error?.response?.data ?? error.message);
        throw error;
    }
};


