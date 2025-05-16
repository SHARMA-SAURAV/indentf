// src/pages/SLAView.jsx
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
  Snackbar,
  Alert,
  Stack,
  Container,
  Grid,
  Divider,
} from "@mui/material";

const SLAView = () => {
  const [indents, setIndents] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchIndents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/indent/sla/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIndents(res.data);
    } catch (err) {
      console.error("Error fetching indents", err);
      setNotification({
        open: true,
        message: "Failed to fetch pending indents.",
        severity: "error",
      });
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
        { indentId, remark },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotification({
        open: true,
        message: "Indent approved and forwarded to Store",
        severity: "success",
      });
      fetchIndents();
      setRemarks((prev) => ({ ...prev, [indentId]: "" }));
    } catch (err) {
      console.error("Approval failed", err);
      setNotification({
        open: true,
        message: "Approval failed. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 3, pb: 3 }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        align="center"
        gutterBottom
        sx={{ mb: 2 }}
      >
        SLA Approval Dashboard
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress />
        </Box>
      ) : indents.length === 0 ? (
        <Typography variant="body1" align="center" color="text.secondary">
          No pending indents for SLA approval.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {indents.map((indent) => (
            <Grid item xs={12} sm={6} md={4} key={indent.id}>
              <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom noWrap>
                    {indent.projectName}
                  </Typography>

                  <Typography variant="body2">
                    <strong>Item:</strong> {indent.itemName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Quantity:</strong> {indent.quantity}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Cost/Piece:</strong> ₹{indent.perPieceCost}
                  </Typography>
                  <Typography variant="body2" gutterBottom noWrap>
                    <strong>Description:</strong> {indent.description}
                  </Typography>

                  <TextField
                    label="SLA Remark"
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    size="small"
                    value={remarks[indent.id] || ""}
                    onChange={(e) =>
                      setRemarks({ ...remarks, [indent.id]: e.target.value })
                    }
                    sx={{ mt: 1 }}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="small"
                    sx={{ mt: 2, textTransform: "none" }}
                    onClick={() => handleApprove(indent.id)}
                  >
                    Approve & Forward to Store
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SLAView;
