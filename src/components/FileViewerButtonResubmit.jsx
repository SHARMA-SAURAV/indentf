// src/components/FileViewerButton.jsx
import React from "react";
import { Button } from "@mui/material";
import axios from "../api/api"; // Adjust the import path as necessary

const COLORS = {
  accent: "#1976d2", // Replace with your theme color
};

const downloadFile = async (fileNameOrPath) => {
  try {
    // Accept both fileName and attachmentPath
    const response = await axios.get(`/indent/fileresubmit/${encodeURIComponent(fileNameOrPath)}`, {
      responseType: 'blob',
    });
    const blob = response.data;
    const fileURL = window.URL.createObjectURL(blob);
    window.open(fileURL);
  } catch (error) {
    console.error(error);
    alert("Failed to download file. Please ensure you are logged in.");
  }
};

const FileViewerButtonResubmit = ({ fileName }) => {
  // Prefer item-level props, fallback to indent-level
  const fileProp = fileName || indent?.attachmentPath || indent?.attachmentName || indent?.file;
  console.log("File Prop:", fileProp); // Debugging line to check the fileProp value
  if (!fileProp) return null;

  return (
    <Button
      variant="outlined"
      size="small"
      sx={{ mt: 1, color: COLORS.accent, borderColor: COLORS.accent, textTransform: "none" }}
      startIcon={<i className="fas fa-paperclip" />}
      onClick={() => downloadFile(fileProp)}
    >
      View Attached File
    </Button>
  );
};

export default FileViewerButtonResubmit;
