import React, { useEffect, useState } from "react";
import axios from "../api/api";
import {
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Grow,
  Divider,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const StoreView = () => {
  const [indents, setIndents] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchIndents();
  }, []);

  const fetchIndents = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/indent/store/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIndents(response.data || []);
    } catch (error) {
      console.error("Failed to fetch indents", error);
      setStatus("❌ Unable to retrieve indent data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (indentId) => {
    const remark = remarks[indentId] || "";
    try {
      await axios.post(
        "/indent/store/approve",
        { indentId, remark },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStatus("✅ Indent has been approved and forwarded to the Finance Department.");
      fetchIndents();
    } catch (error) {
      console.error("Approval process failed", error);
      setStatus("❌ Approval failed. Kindly retry.");
    }
  };

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100vw"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(to right, #f0f4f8, #ffffff)",
        overflow: "auto",
        p: 0,
        m: 0,
      }}
    >
      <Box sx={{ px: 3, py: 4 }}>
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="600"
          gutterBottom
          sx={{ color: "#0d47a1" }}
        >
          Store Indent Approval Dashboard
        </Typography>

        {status && (
          <Alert
            severity={status.startsWith("✅") ? "success" : "error"}
            sx={{ mb: 3 }}
          >
            {status}
          </Alert>
        )}

        {indents.length === 0 ? (
          <Typography textAlign="center" sx={{ fontSize: 18, mt: 4 }}>
            There are currently no pending indent requests.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 3,
              mt: 2,
            }}
          >
            {indents.map((indent, index) => (
              <Grow in key={indent.id} timeout={500 + index * 200}>
                <Paper
                  elevation={6}
                  sx={{
                    width: 380,
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: "#ffffff",
                    transition: "transform 0.3s ease, box-shadow 0.3s",
                    "&:hover": {
                      transform: "scale(1.015)",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Chip label={`Indent #${indent.id}`} color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                      ₹{(Number(indent.perPieceCost) * indent.quantity).toLocaleString()}
                    </Typography>

                   

                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Typography gutterBottom><strong>Project:</strong> {indent.projectName}</Typography>
                  <Typography gutterBottom><strong>Item:</strong> {indent.itemName}</Typography>
                  <Typography gutterBottom><strong>Quantity:</strong> {indent.quantity}</Typography>
                  <Typography gutterBottom>
                    <strong>Unit Cost:</strong> ₹{Number(indent.perPieceCost).toLocaleString()}
                  </Typography>
                  <Typography gutterBottom sx={{ mb: 2 }}>
                    <strong>Description:</strong> {indent.description}
                  </Typography>

                  <TextField
                    label="Remarks (Optional)"
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    value={remarks[indent.id] || ""}
                    onChange={(e) =>
                      setRemarks((prev) => ({ ...prev, [indent.id]: e.target.value }))
                    }
                    sx={{ mb: 2 }}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<CheckCircle />}
                    fullWidth
                    sx={{
                      fontWeight: "bold",
                      textTransform: "none",
                      py: 1.3,
                      fontSize: 15,
                    }}
                    onClick={() => handleApprove(indent.id)}
                  >
                    Approve & Forward to Finance
                  </Button>
                </Paper>
              </Grow>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StoreView;
