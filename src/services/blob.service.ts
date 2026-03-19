import { config } from "../shared/constants/config";
import { fetchWrapper } from "../helpers/fetch-wrapper";


export const blobService = {
    uploadExcelToBlob,
    downloadFileFromBlob,
    downloadFileFromBlobusingURL,
};

async function downloadFileFromBlobusingURL(fileurl: string) {
    let response;

    // If it's a direct Azure Blob URL, it's likely private (409 error) and needs backend proxying
    if (fileurl.includes("blob.core.windows.net")) {
        const segments = fileurl.split("/");
        // Assuming https://host/{container}/{filename}
        const container = segments[3];
        const filename = segments[segments.length - 1] || "";
        const fullPath = segments.slice(3).join("/"); // e.g. "pfa-uploads/52a242.pdf"

        // Pass the container as doctype and the full path as the 'file' param
        console.log("fullPath", fullPath);
        response = await fetchWrapper.download(
            `${config.apiUrl}/api/get-file-from-blob?doctype=${container}&date=${filename}&file=${fullPath}&type=file`
        );
        console.log("response", response);
    } else {
        response = await fetchWrapper.download(fileurl);
    }

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to download file (Status: ${response.status}). Details: ${errorText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Extract filename from URL
    const filenameFromUrl = fileurl.split("/").pop() || "download";
    a.download = filenameFromUrl;

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

async function downloadFileFromBlob(doctype: string, date: string) {
    const response = await fetchWrapper.download(
        `${config.apiUrl}/api/get-file-from-blob?doctype=${doctype}&date=${date}`
    );
    if (!response.ok) {
        throw new Error("Failed to download file");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doctype}_${date}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}




async function uploadExcelToBlob(docname: string, date: string, base64: string) {
    console.log("Uploading to Blob:", docname, date);
    const response = await fetchWrapper.post(`${config.apiUrl}/api/upload-excel-to-blob`, [
        docname,
        date,
        base64,
    ]);
    console.log("Blob Upload Response:", response);
    return response;
}
