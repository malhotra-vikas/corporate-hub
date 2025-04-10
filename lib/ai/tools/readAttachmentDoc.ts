import axios from 'axios';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

// Helper function to download a file from a URL and return it as a buffer
async function downloadFile(url: string): Promise<Buffer> {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);  // Convert the response data to a Buffer
    } catch (error) {
        console.error(`Error downloading file from ${url}:`, error);
        throw new Error('Failed to download the file from the URL');
    }
}

// Function to extract text from a .docx file (using Buffer from URL)
async function extractTextFromDocx(buffer: Buffer): Promise<string> {
    try {
        const data = await mammoth.extractRawText({ buffer });
        return data.value;  // Return the extracted text from the .docx file
    } catch (error) {
        console.error('Error extracting text from .docx file:', error);
        throw new Error('Failed to extract text from .docx file');
    }
}

// Function to detect file type and extract text based on extension
export async function extractTextFromFile(url: string): Promise<string> {
    const fileExtension = url.split('.').pop()?.toLowerCase();  // Get the file extension

    if (!fileExtension) {
        throw new Error('File extension is missing');
    }

    try {
        // Download the file from the URL
        const fileBuffer = await downloadFile(url);

        console.log("In read file util, URL is ", url)

        if (fileExtension === 'docx') {
            return await extractTextFromDocx(fileBuffer);  // Extract text from .docx file
        } else {
            throw new Error('Unsupported file type');  // Handle unsupported file types
        }
    } catch (error) {
        console.error('Error extracting text from file:', error);
        throw new Error('Error extracting text from file');
    }
}
