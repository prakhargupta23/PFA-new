import { config } from "../shared/constants/config";
import { fetchWrapper } from "../helpers/fetch-wrapper";

export const blobService = {
    uploadExcelToBlob,
    downloadFileFromBlob,
};

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
