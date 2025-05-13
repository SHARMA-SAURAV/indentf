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

const SLAView = () => {
  const [indents, setIndents] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const fetchIndents = async () => {
    try {
      const res = await axios.get("/indent/sla/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIndents(res.data);
    } catch (err) {
      console.error("Error fetching indents", err);
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
        "/indent/sla/approve",
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
      setStatus("✅ Indent approved and forwarded to Store.");
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
        background: "linear-gradient(135deg, #f0f4ff, #e8f5e9)",
        borderRadius: 4,
        pb: 5,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        fontWeight="bold"
        sx={{ py: 3, color: "#2e7d32" }}
      >
         SLA Approval Panel
      </Typography>

      {status && (
        <Alert severity="info" sx={{ mb: 3, mx: 1 }}>
          {status}
        </Alert>
      )}

      {indents.length === 0 ? (
        <Typography textAlign="center" sx={{ fontSize: 18 }}>
             No pending indents for SLA
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
                background: "#fff",
                transition: "transform 0.3s ease, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.01)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Chip label={`Indent ID: ${indent.id}`} color="secondary" />
                <Typography variant="subtitle2" sx={{ color: "gray" }}>
                  Cost: ₹{indent.perPieceCost} × {indent.quantity}
                </Typography>
              </Box>

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {indent.itemName}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                📦 Quantity: {indent.quantity}
              </Typography>
              <Typography sx={{ mb: 2 }}>📝 {indent.description}</Typography>

              <TextField
                label="Add a Remark"
                fullWidth
                multiline
                rows={2}
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
                  mt: 3,
                  py: 1.2,
                  fontSize: 16,
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#2e7d32",
                  },
                }}
                onClick={() => handleApprove(indent.id)}
              >
                Approve & Forward to Store
              </Button>
            </Paper>
          </Grow>
        ))
      )}
    </Box>
  );
};

export default SLAView;
