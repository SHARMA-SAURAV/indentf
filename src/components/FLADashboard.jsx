import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Collapse,
  IconButton,
  Grid,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  DoneOutline as DoneOutlineIcon,
  Close as CloseIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";
import axios from "../api/api";

const FLADashboard = () => {
  const [pendingIndents, setPendingIndents] = useState([]);
  const [slaUsers, setSlaUsers] = useState([]);
  const [remarksMap, setRemarksMap] = useState({});
  const [selectedSlaMap, setSelectedSlaMap] = useState({});
  const [notification, setNotification] = useState({ message: "", visible: false });

  useEffect(() => {
    fetchPendingIndents();
    fetchSlaUsers();
  }, []);

  const fetchPendingIndents = async () => {
    try {
      const { data } = await axios.get("/indent/fla/pending");
      setPendingIndents(data);
    } catch (error) {
      console.error("Error fetching pending indents:", error);
    }
  };

  const fetchSlaUsers = async () => {
    try {
      const { data } = await axios.get("/auth/users/by-role?role=SLA");
      setSlaUsers(data);
    } catch (error) {
      console.error("Error fetching SLA users:", error);
    }
  };

  const handleApproveIndent = async (indentId) => {
    try {
      const payload = {
        indentId,
        remark: remarksMap[indentId] || "",
        slaId: selectedSlaMap[indentId],
      };
      await axios.post("/indent/fla/approve", payload);
      setNotification({ message: "Indent successfully approved and forwarded.", visible: true });
      fetchPendingIndents();
    } catch (error) {
      console.error("Approval failed:", error);
      setNotification({ message: "Failed to approve the indent.", visible: true });
    } finally {
      setTimeout(() => setNotification({ ...notification, visible: false }), 3000);
    }
  };

  const handleExportToCSV = () => {
    const headers = ["Project Name", "Item Name", "Quantity", "Per Piece Cost", "Description"];
    const rows = pendingIndents.map((indent) => [
      indent.projectName,
      indent.itemName,
      indent.quantity,
      indent.perPieceCost,
      indent.description,
    ]);

    const csvData =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvData);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pending_indents.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#ffffff", py: 4, px: { xs: 2, md: 4 } }}>
      <Card elevation={3} sx={{ borderRadius: 2, px: 3, py: 2 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              FLA Dashboard
            </Typography>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportToCSV}
              sx={{ textTransform: "none", color: "primary.main", borderColor: "primary.main" }}
            >
              Export as CSV
            </Button>
          </Stack>

          <Collapse in={notification.visible}>
            <Alert
              severity={notification.message.includes("Failed") ? "error" : "info"}
              action={
                <IconButton size="small" onClick={() => setNotification({ ...notification, visible: false })}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              {notification.message}
            </Alert>
          </Collapse>

          {pendingIndents.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" mt={6}>
              No pending indents available for review at this time.
            </Typography>
          ) : (
            pendingIndents.map((indent, index) => (
              <Accordion key={indent.id} sx={{ mb: 2, borderRadius: 2, border: 1, borderColor: "primary.light" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600} color="primary.dark">
                    {index + 1}. {indent.projectName}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography><strong>Item Name:</strong> {indent.itemName}</Typography>
                      <Typography><strong>Quantity:</strong> {indent.quantity}</Typography>
                      <Typography><strong>Per Unit Cost:</strong> ₹{Number(indent.perPieceCost).toLocaleString()}</Typography>
                      <Typography><strong>Description:</strong> {indent.description}</Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Remarks"
                        fullWidth
                        margin="dense"
                        multiline
                        value={remarksMap[indent.id] || ""}
                        onChange={(e) =>
                          setRemarksMap((prev) => ({ ...prev, [indent.id]: e.target.value }))
                        }
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        select
                        label="Assign to SLA"
                        fullWidth
                        margin="dense"
                        value={selectedSlaMap[indent.id] || ""}
                        onChange={(e) =>
                          setSelectedSlaMap((prev) => ({ ...prev, [indent.id]: e.target.value }))
                        }
                        sx={{ mb: 2 }}
                      >
                        {slaUsers.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.username}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<DoneOutlineIcon />}
                        onClick={() => handleApproveIndent(indent.id)}
                        disabled={!selectedSlaMap[indent.id]}
                        sx={{ fontWeight: 600, textTransform: "none" }}
                      >
                        Approve & Forward
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default FLADashboard;
