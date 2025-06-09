// src/components/FileViewerButton.jsx
import React from "react";
import { Button } from "@mui/material";
import axios from "../api/api"; // Adjust the import path as necessary

const COLORS = {
  accent: "#1976d2", // Replace with your theme color
};

const downloadFile = async (fileName) => {
  try {
    const response = await axios.get(`/indent/file/${encodeURIComponent(fileName)}`, {
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

const FileViewerButton = ({ indent }) => {
  const fileProp = indent?.fileName || indent?.attachmentPath || indent?.attachmentName || indent?.file;
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

export default FileViewerButton;
