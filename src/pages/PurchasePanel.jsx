import React, { useEffect, useState, useCallback } from "react";
import axios from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  Alert,
  Tabs,
  Tab,
  Grow,
  Grid,
  Fade,
  CircularProgress,
  Snackbar,
} from "@mui/material";

// Design Tokens
const GRADIENT_BG = "linear-gradient(135deg, #FAFAFA 0%, #EDEDED 100%)";
const CARD_BG = "rgba(255, 255, 255, 0.95)";
const TEXT_COLOR = "#444950";
const ACCENT_COLOR = "#0d47a1";
const SUBTEXT_COLOR = "#8E99A3";

const PurchasePanel = () => {
  const [tab, setTab] = useState(0);
  const [indents, setIndents] = useState([]);
  const [remarkMap, setRemarkMap] = useState({});
  const [gfrIndents, setGfrIndents] = useState([]);
  const [gfrNoteMap, setGfrNoteMap] = useState({});
  const [status, setStatus] = useState("");
  const [loadingIndents, setLoadingIndents] = useState(false);
  const [loadingGfr, setLoadingGfr] = useState(false);
  const [completeLoading, setCompleteLoading] = useState({});
  const [rejectLoading, setRejectLoading] = useState({});
  const [gfrLoading, setGfrLoading] = useState({});
  const [actionSnackbar, setActionSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const fetchPendingIndents = useCallback(async () => {
    try {
      setLoadingIndents(true);
      const res = await axios.get("/indent/purchase/pending");
      setIndents(res.data);
    } catch (err) {
      // console.error("Failed to fetch purchase indents", err);
    } finally {
      setLoadingIndents(false);
    }
  }, []);

  const fetchPendingGFRIndents = useCallback(async () => {
    try {
      setLoadingGfr(true);
      const res = await axios.get("/indent/purchase/gfr/pending");
      setGfrIndents(res.data);
    } catch (err) {
      // console.error("Failed to fetch GFR indents", err);
    } finally {
      setLoadingGfr(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingIndents();
    fetchPendingGFRIndents();
  }, [fetchPendingIndents, fetchPendingGFRIndents]);

  const handleTabChange = (_, newValue) => setTab(newValue);

  const handleRemarkChange = (id, value) => {
    setRemarkMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleComplete = async (id) => {
    setCompleteLoading((prev) => ({ ...prev, [id]: true }));
    setActionSnackbar({
      open: true,
      message: "Processing completion...",
      severity: "info",
    });
    try {
      await axios.post("/indent/purchase/complete", {
        indentId: id,
        remark: remarkMap[id] || "",
      });
      setStatus("Indent marked as COMPLETED.");
      fetchPendingIndents();
      setRemarkMap((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setTimeout(() => setStatus(""), 4000);
    } catch {
      alert("Error completing indent.");
    } finally {
      setCompleteLoading((prev) => ({ ...prev, [id]: false }));
      setActionSnackbar({ open: false, message: "", severity: "info" });
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this indent?")) return;
    setRejectLoading((prev) => ({ ...prev, [id]: true }));
    setActionSnackbar({
      open: true,
      message: "Processing rejection...",
      severity: "info",
    });
    try {
      await axios.post("/indent/purchase/reject", {
        indentId: id,
        remark: remarkMap[id] || "",
      });
      setStatus("Indent rejected by Purchase.");
      fetchPendingIndents();
      setRemarkMap((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      // console.error("Failed to reject indent:", err);
      alert("Error rejecting indent.");
    } finally {
      setRejectLoading((prev) => ({ ...prev, [id]: false }));
      setActionSnackbar({ open: false, message: "", severity: "info" });
    }
  };

  const handleGfrNoteChange = (id, value) => {
    setGfrNoteMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitGFR = async (id) => {
    setGfrLoading((prev) => ({ ...prev, [id]: true }));
    setActionSnackbar({
      open: true,
      message: "Submitting GFR...",
      severity: "info",
    });
    try {
      await axios.post("/indent/purchase/gfr/submit", {
        indentId: id,
        gfrNote: gfrNoteMap[id] || "",
      });
      setStatus("GFR submitted successfully.");
      fetchPendingGFRIndents();
      setGfrNoteMap((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      // console.error("GFR submission failed", err);
      setStatus("Error submitting GFR.");
      setTimeout(() => setStatus(""), 4000);
    } finally {
      setGfrLoading((prev) => ({ ...prev, [id]: false }));
      setActionSnackbar({ open: false, message: "", severity: "info" });
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        minHeight: "80vh",
        background: GRADIENT_BG,
        borderRadius: 2,
        p: 3,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: ACCENT_COLOR,
          fontWeight: "bold",
        }}
      >
        <FontAwesomeIcon icon={faUser} />
        Purchase Dashboard
      </Typography>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        sx={{
          mb: 2,
          color: ACCENT_COLOR,
          borderBottom: 1,
          borderColor: "divider",
        }}
        textColor="inherit"
        indicatorColor="primary"
      >
        <Tab label="Pending Indents" sx={{ color: ACCENT_COLOR }} />
        <Tab label="GFR Submission" sx={{ color: ACCENT_COLOR }} />
      </Tabs>

      {status && (
        <Fade in={!!status} timeout={600}>
          <Alert severity="info" sx={{ mb: 2 }}>
            {status}
          </Alert>
        </Fade>
      )}

      {/* Pending Indents Tab */}
      {tab === 0 && (
        <>
          {loadingIndents ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress color="primary" />
            </Box>
          ) : indents.length === 0 ? (
            <Typography sx={{ color: SUBTEXT_COLOR }}>
              No indents at Purchase stage.
            </Typography>
          ) : (
            indents.map((indent) => (
              <Grow key={indent.id} in timeout={600}>
                <Card
                  sx={{
                    mb: 3,
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #e3e9f7 100%)",
                    boxShadow: 6,
                    borderRadius: 3,
                    border: "1px solid #e3e9f7",
                  }}
                >
                  <CardContent sx={{ color: TEXT_COLOR, p: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: ACCENT_COLOR,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: 2,
                          mr: 2,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faUser}
                          style={{ color: "#fff", fontSize: 24 }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            color: ACCENT_COLOR,
                            fontWeight: 700,
                            fontSize: 20,
                          }}
                        >
                          Project Name: {indent.projectName}
                        </Typography>
                        <Typography sx={{ color: SUBTEXT_COLOR, fontSize: 15 }}>
                          Item Name: {indent.itemName}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                      <Typography variant="body2">
                        <strong>Indent Id:</strong> {indent.id}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Department:</strong>{" "}
                        {indent.requestedBy?.department || "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Quantity:</strong> {indent.quantity}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Per Piece:</strong> ₹{indent.perPieceCost}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Total:</strong> ₹{indent.totalCost}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Status:</strong> {indent.status}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: SUBTEXT_COLOR, mb: 2 }}
                    >
                      <strong>Description:</strong> {indent.description}
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      label="Purchase Remark"
                      value={remarkMap[indent.id] || ""}
                      onChange={(e) =>
                        handleRemarkChange(indent.id, e.target.value)
                      }
                      sx={{
                        mt: 2,
                        bgcolor: "#f7fafd",
                        borderRadius: 1,
                        "& .MuiInputBase-root": { color: TEXT_COLOR },
                      }}
                    />
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      gap={2}
                      mt={2}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleComplete(indent.id)}
                        sx={{
                          backgroundColor: ACCENT_COLOR,
                          minWidth: 140,
                          position: "relative",
                        }}
                        disabled={
                          completeLoading[indent.id] || rejectLoading[indent.id]
                        }
                      >
                        {completeLoading[indent.id] ? (
                          <CircularProgress
                            size={22}
                            sx={{
                              color: "#fff",
                              position: "absolute",
                              left: "50%",
                              top: "50%",
                              marginTop: "-11px",
                              marginLeft: "-11px",
                            }}
                          />
                        ) : (
                          "Mark as Completed"
                        )}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleReject(indent.id)}
                        sx={{ minWidth: 100, position: "relative" }}
                        disabled={
                          completeLoading[indent.id] || rejectLoading[indent.id]
                        }
                      >
                        {rejectLoading[indent.id] ? (
                          <CircularProgress
                            size={22}
                            sx={{
                              color: ACCENT_COLOR,
                              position: "absolute",
                              left: "50%",
                              top: "50%",
                              marginTop: "-11px",
                              marginLeft: "-11px",
                            }}
                          />
                        ) : (
                          "Reject"
                        )}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            ))
          )}
        </>
      )}

      {/* GFR Submission Tab */}
      {tab === 1 && (
        <>
          {loadingGfr ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress color="primary" />
            </Box>
          ) : gfrIndents.length === 0 ? (
            <Typography sx={{ color: SUBTEXT_COLOR }}>
              No indents awaiting GFR submission.
            </Typography>
          ) : (
            gfrIndents.map((indent) => (
              <Grow key={indent.id} in timeout={600}>
                <Card sx={{ mb: 3, backgroundColor: CARD_BG, boxShadow: 3 }}>
                  {/* <CardHeader  subheader={indent.projectName} sx={{ color: ACCENT_COLOR }} />
                  <CardHeader subheader={indent.itemName} sx={{ color: ACCENT_COLOR }} /> */}

                  <CardContent sx={{ color: TEXT_COLOR }}>
                    <Typography
                      sx={{
                        color: ACCENT_COLOR,
                        fontWeight: 700,
                        fontSize: 18,
                      }}
                    >
                      Project Name: {indent.projectName}
                    </Typography>
                    <Typography
                      sx={{ color: "black", fontSize: 14, fontWeight: 600 }}
                    >
                      Item Name: {indent.itemName}
                    </Typography>
                       <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography sx={{ fontSize: 13 }}>
                            <strong>Indent Id:</strong> {indent.id}
                          </Typography>
                          <Typography sx={{ fontSize: 13 }}>
                            <strong>Quantity:</strong> {indent.quantity}
                          </Typography>
                          <Typography sx={{ fontSize: 13 }}>
                            <strong>Per Piece:</strong> ₹{indent.perPieceCost}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography sx={{ fontSize: 13 }}>
                            <strong>Total:</strong> ₹{indent.totalCost}
                          </Typography>
                          <Typography sx={{ fontSize: 13 }}>
                            <strong>Status:</strong> {indent.status}
                          </Typography>
                        </Grid>
                      </Grid>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="GFR Note"
                      value={gfrNoteMap[indent.id] || ""}
                      onChange={(e) =>
                        handleGfrNoteChange(indent.id, e.target.value)
                      }
                      sx={{
                        mt: 2,
                        "& .MuiInputBase-root": { color: TEXT_COLOR },
                      }}
                    />

                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      sx={{ mt: 2 }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleSubmitGFR(indent.id)}
                        sx={{
                          backgroundColor: ACCENT_COLOR,
                          minWidth: 140,
                          position: "relative",
                        }}
                        disabled={gfrLoading[indent.id]}
                      >
                        {gfrLoading[indent.id] ? (
                          <CircularProgress
                            size={22}
                            sx={{
                              color: "#fff",
                              position: "absolute",
                              left: "50%",
                              top: "50%",
                              marginTop: "-11px",
                              marginLeft: "-11px",
                            }}
                          />
                        ) : (
                          "Submit GFR"
                        )}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            ))
          )}
        </>
      )}

      <Snackbar
        open={actionSnackbar.open}
        autoHideDuration={null}
        onClose={() => setActionSnackbar({ ...actionSnackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={actionSnackbar.severity} sx={{ width: "100%" }}>
          {actionSnackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PurchasePanel;
