import React, { useEffect, useState } from "react";
import axios from "../api/api";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Grow,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const StoreView = () => {
  const [indents, setIndents] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const fetchIndents = async () => {
    try {
      const res = await axios.get("/indent/store/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIndents(res.data);
    } catch (err) {
      console.error("Error fetching store indents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndents();
  }, []);

  const handleApprove = async (indentId) => {
    const remark = remarks[indentId] || "";
    try {
      await axios.post(
        "/indent/store/approve",
        {
          indentId,
          remark,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStatus("✅ Indent approved and forwarded to Finance.");
      fetchIndents(); // Refresh
    } catch (err) {
      console.error("Approval failed", err);
      setStatus("❌ Approval failed. Try again.");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: "1000px",
        mx: "auto",
        mt: 5,
        px: 2,
        background: "linear-gradient(145deg, #f3faff, #fff0f4)",
        borderRadius: 4,
        pb: 5,
        boxShadow: 4,
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        fontWeight="bold"
        sx={{ py: 3, color: "#1565c0" }}
      >
         Store Approval Panel
      </Typography>
  
      {status && (
        <Alert
          severity={status.startsWith("✅") ? "success" : "error"}
          sx={{ mb: 3, mx: 1 }}
        >
          {status}
        </Alert>
      )}
  
      {indents.length === 0 ? (
        <Typography textAlign="center" sx={{ fontSize: 18 }}>
           No pending indents for Store
        </Typography>
      ) : (
        indents.map((indent, index) => (
          <Grow in key={indent.id} timeout={500 + index * 200}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                m: 2,
                borderRadius: 3,
                background: "#ffffff",
                transition: "transform 0.3s ease, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Chip
                  label={`Indent ID: ${indent.id}`}
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                />
                <Typography variant="subtitle2" sx={{ color: "gray" }}>
                  ₹{indent.perPieceCost} × {indent.quantity}
                </Typography>
              </Box>
  
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {indent.itemName}
              </Typography>
  
              <Typography sx={{ mb: 1 }}>
                📦 Quantity:{" "}
                <strong style={{ color: "#333" }}>{indent.quantity}</strong>
              </Typography>
              <Typography sx={{ mb: 2 }}>📝 {indent.description}</Typography>
  
              <TextField
                label="Add a Remark"
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                sx={{ mb: 2 }}
                value={remarks[indent.id] || ""}
                onChange={(e) =>
                  setRemarks({ ...remarks, [indent.id]: e.target.value })
                }
              />
  
              <Button
                variant="contained"
                color="success"
                endIcon={<CheckCircle />}
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.3,
                  fontSize: 15,
                  fontWeight: "bold",
                  textTransform: "none",
                  backgroundColor: "#43a047",
                  "&:hover": {
                    backgroundColor: "#2e7d32",
                  },
                }}
                onClick={() => handleApprove(indent.id)}
              >
                Approve & Forward to Finance
              </Button>
            </Paper>
          </Grow>
        ))
      )}
    </Box>
  );
};

export default StoreView;
