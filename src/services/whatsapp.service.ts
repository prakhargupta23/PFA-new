import axios from "axios";
import { config } from "../shared/constants/config";
import { fetchWrapper } from "../helpers/fetch-wrapper";
import { Segment } from "@mui/icons-material";


export const callToAction = async (title: string, value: string) => {
    try {
        const response = await fetch("https://nwrwhatsappapi-a3f6f0dfd5hbdka3.centralindia-01.azurewebsites.net/send-hi", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to: ["+917800752003@c.us", "120363407012014309@g.us"],
                data: `Task Created: \n${title}: ${value}\n`,
                mentions: ["7800752003"],
            }),

        });
        const data = await response.json();
        const dbdata = {
            createdBy: "PFA",
            status: "pending",
            taskHeading: title,
            content: value,
            segment: "NWR",
            division: "NWR",
            type: "PFA",
            msgId: data.id,
        }
        console.log("hey", data);
        const insertionresponse = await fetchWrapper.post(`${config.apiUrl}/api/create-task`, dbdata);
        return { data, insertionresponse };
    } catch (error: any) {
        console.error("Error submitting PFA data:", error?.response?.data ?? error.message);
        throw error;
    }
};


