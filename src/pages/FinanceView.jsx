import React, { useEffect, useState } from "react";
import axios from "../api/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Tabs,
  Tab,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

// Color constants from your input
const GRADIENT_BG = "linear-gradient(135deg, #FAFAFA 0%, #EDEDED 100%)"; // ultra-soft gray gradient
const CARD_BG = "rgba(255, 255, 255, 0.95)"; // subtle translucency for cleaner cards
const TEXT_COLOR = "#444950"; // deep soft gray — elegant and readable
const ACCENT_COLOR = "#0d47a1"; // soothing lavender-blue, more inviting than navy
const SUBTEXT_COLOR = "#8E99A3"; // polished light gray-blue for captions/notes

const FinanceView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tabIndex, setTabIndex] = useState(0);
  const [approvalIndents, setApprovalIndents] = useState([]);
  const [paymentIndents, setPaymentIndents] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [paymentNotes, setPaymentNotes] = useState({});
  const [approveLoading, setApproveLoading] = useState({});
  const [paymentLoading, setPaymentLoading] = useState({});
  const [rejectLoading, setRejectLoading] = useState({});
  const [paymentRejectLoading, setPaymentRejectLoading] = useState({});

  useEffect(() => {
    fetchApprovalIndents();
    fetchPaymentIndents();
  }, []);

  const fetchApprovalIndents = async () => {
    try {
      const res = await axios.get("/indent/finance/pending");
      setApprovalIndents(res.data);
    } catch (err) {
      console.error("Failed to fetch approval indents:", err);
      setApprovalIndents([]);
    }
  };

  const fetchPaymentIndents = async () => {
    try {
      const res = await axios.get("/indent/finance/payment/pending");
      setPaymentIndents(res.data);
    } catch (err) {
      console.error("Failed to fetch payment indents:", err);
      setPaymentIndents([]);
    }
  };

  const handleRemarkChange = (id, value) => {
    setRemarks((prev) => ({ ...prev, [id]: value }));
  };

  const handlePaymentNoteChange = (id, value) => {
    setPaymentNotes((prev) => ({ ...prev, [id]: value }));
  };

  const handleApprove = async (id) => {
    if (!remarks[id] || remarks[id].trim() === "") return;
    setApproveLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.post("/indent/finance/approve", {
        indentId: id,
        remark: remarks[id] || "",
      });
      setApprovalIndents((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Failed to approve indent.");
    } finally {
      setApproveLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to reject this indent?"
    );
    if (!confirm) return;
    setRejectLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.post("/indent/finance/reject", {
        indentId: id,
        remark: remarks[id] || "",
      });
      alert("Indent rejected.");
      setApprovalIndents((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Rejection failed:", err);
      alert("Failed to reject indent.");
    } finally {
      setRejectLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handlePaymentComplete = async (id) => {
    if (!paymentNotes[id] || paymentNotes[id].trim() === "") return;
    setPaymentLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.post("/indent/finance/payment/submit", {
        indentId: id,
        paymentNote: paymentNotes[id] || "",
      });
      alert("Payment marked as completed.");
      setPaymentIndents((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert("Error submitting payment");
      console.error("Payment submission failed:", err);
    } finally {
      setPaymentLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handlePaymentReject = async (id) => {
    const confirm = window.confirm("Are you sure you want to reject this payment?");
    if (!confirm) return;
    setPaymentRejectLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.post('/indent/finance/payment/reject', {
        indentId: id,
        paymentNote: paymentNotes[id] || ''
      });
      alert("Payment rejected.");
      setPaymentIndents(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Payment rejection failed:', err);
      alert('Failed to reject payment.');
    } finally {
      setPaymentRejectLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%", // changed from 100vw
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        background: GRADIENT_BG,
        py: isMobile ? 2 : 6,
        px: isMobile ? 1 : 0, // add horizontal padding on mobile
        boxSizing: "border-box",
      }}
    >
      {/* Title moved outside white card */}
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{
          mb: 3,
          color: ACCENT_COLOR,
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: 1.2,
          width: "100%",
          maxWidth: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          background: "rgba(255,255,255,0.7)",
          borderRadius: 2,
          boxShadow: 2,
          py: 1.5,
          mx: "auto", // center horizontally
        }}
      >
        <FontAwesomeIcon icon={faCoins} style={{ marginRight: 12, fontSize: 32, color: ACCENT_COLOR }} />
        Finance Dashboard
      </Typography>
      <Box
        sx={{
          width: "100%",
          maxWidth: 950,
          bgcolor: CARD_BG,
          p: isMobile ? 1.2 : 3, // moderately reduced padding
          borderRadius: 3,
          boxShadow: 4,
          overflowY: "auto",
          color: TEXT_COLOR,
          minHeight: 400,
          mx: "auto",
          mt: 1.5, // slightly reduced margin-top
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(e, val) => setTabIndex(val)}
          sx={{ mb: 1.2 }} // reduce but keep visible
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            label="Approve & Forward"
            sx={{ color: SUBTEXT_COLOR, fontWeight: 600, minHeight: 36 }} // reduce tab height
          />
          <Tab
            label="Mark Payment Done"
            sx={{ color: SUBTEXT_COLOR, fontWeight: 600, minHeight: 36 }}
          />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          {approvalIndents.length === 0 ? (
            <Typography sx={{ color: SUBTEXT_COLOR, textAlign: "center", py: 2.5 }}>
              No pending approvals
            </Typography>
          ) : (
            <Grid container spacing={2}> {/* moderately reduced spacing */}
              {approvalIndents.map((indent) => (
                <Grid item xs={12} sm={6} key={indent.id}>
                  <Card
                    sx={{
                      bgcolor: CARD_BG,
                      color: TEXT_COLOR,
                      borderRadius: 3,
                      boxShadow: 2,
                      p: 1.5,
                      minHeight: 320,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                    elevation={0}
                  >
                    <CardContent sx={{ pb: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            background: ACCENT_COLOR,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 2,
                            boxShadow: 1,
                          }}
                        >
                          <FontAwesomeIcon icon={faCoins} style={{ color: "#fff", fontSize: 24 }} />
                        </Box>
                        <Box>
                          <Typography sx={{ color: ACCENT_COLOR, fontWeight: 700, fontSize: 18 }}>
                            {indent.projectName}
                          </Typography>
                          <Typography sx={{ color: SUBTEXT_COLOR, fontSize: 14 }}>
                            {indent.department}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.5 }}>
                        {indent.itemName}
                      </Typography>
                      <Typography sx={{ color: SUBTEXT_COLOR, fontSize: 13, mb: 1 }}>
                        {indent.description}
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
                    </CardContent>
                    <Box sx={{ mt: 2, px: 2, pb: 1 }}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={8}>
                          <TextField
                            label="Finance Remark"
                            fullWidth
                            required
                            value={remarks[indent.id] || ""}
                            onChange={(e) => handleRemarkChange(indent.id, e.target.value)}
                            size="small"
                            inputProps={{ maxLength: 200 }}
                            sx={{ bgcolor: "#f7fafd", borderRadius: 1 }}
                          />
                        </Grid>
                        <Grid item xs={4} display="flex" alignItems="center" gap={1} justifyContent="flex-end">
                          <Button
                            variant="contained"
                            onClick={() => handleApprove(indent.id)}
                            sx={{ bgcolor: ACCENT_COLOR, minWidth: 120, position: 'relative' }}
                            disabled={!remarks[indent.id] || approveLoading[indent.id] || rejectLoading[indent.id]}
                          >
                            {approveLoading[indent.id] ? (
                              <span className="spinner-border spinner-border-sm" style={{ color: "#fff", position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
                            ) : (
                              "Approve & Forward"
                            )}
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleReject(indent.id)}
                            disabled={approveLoading[indent.id] || rejectLoading[indent.id]}
                            sx={{ minWidth: 90, position: 'relative' }}
                          >
                            {rejectLoading[indent.id] ? (
                              <span className="spinner-border spinner-border-sm" style={{ color: ACCENT_COLOR, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
                            ) : (
                              "Reject"
                            )}
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          {paymentIndents.length === 0 ? (
            <Typography sx={{ color: SUBTEXT_COLOR, textAlign: "center", py: 2.5 }}>
              No pending payments
            </Typography>
          ) : (
            <Grid container spacing={2}> {/* moderately reduced spacing */}
              {paymentIndents.map((indent) => (
                <Grid item xs={12} sm={6} key={indent.id}>
                  <Card
                    sx={{
                      bgcolor: CARD_BG,
                      color: TEXT_COLOR,
                      borderRadius: 3,
                      boxShadow: 2,
                      p: 1.5,
                      minHeight: 320,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                    elevation={0}
                  >
                    <CardContent sx={{ pb: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            background: ACCENT_COLOR,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 2,
                            boxShadow: 1,
                          }}
                        >
                          <FontAwesomeIcon icon={faCoins} style={{ color: "#fff", fontSize: 24 }} />
                        </Box>
                        <Box>
                          <Typography sx={{ color: ACCENT_COLOR, fontWeight: 700, fontSize: 18 }}>
                            {indent.projectName}
                          </Typography>
                          <Typography sx={{ color: SUBTEXT_COLOR, fontSize: 14 }}>
                            {indent.department}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.5 }}>
                        {indent.itemName}
                      </Typography>
                      <Typography sx={{ color: SUBTEXT_COLOR, fontSize: 13, mb: 1 }}>
                        {indent.description}
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
                      <Typography sx={{ color: SUBTEXT_COLOR, mt: 1, fontSize: 13 }}>
                        <strong>GFR Note:</strong> {indent.paymentNote}
                      </Typography>
                      <Typography sx={{ color: SUBTEXT_COLOR, fontSize: 13 }}>
                        <strong>Requested Amount:</strong> ₹{indent.amountRequested}
                      </Typography>
                    </CardContent>
                    <Box sx={{ mt: 2, px: 2, pb: 1 }}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={8}>
                          <TextField
                            label="Payment Note"
                            fullWidth
                            required
                            value={paymentNotes[indent.id] || ""}
                            onChange={(e) => handlePaymentNoteChange(indent.id, e.target.value)}
                            size="small"
                            inputProps={{ maxLength: 200 }}
                            sx={{ bgcolor: "#f7fafd", borderRadius: 1 }}
                          />
                        </Grid>
                        <Grid item xs={4} display="flex" alignItems="center" gap={1} justifyContent="flex-end">
                          <Button
                            variant="contained"
                            onClick={() => handlePaymentComplete(indent.id)}
                            sx={{ bgcolor: ACCENT_COLOR, minWidth: 120 }}
                            disabled={!paymentNotes[indent.id] || paymentLoading[indent.id]}
                          >
                            {paymentLoading[indent.id] ? (
                              <span className="spinner-border spinner-border-sm" style={{ color: "#fff" }} />
                            ) : (
                              "Mark as Completed"
                            )}
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handlePaymentReject(indent.id)}
                            disabled={paymentLoading[indent.id] || paymentRejectLoading[indent.id]}
                            sx={{ minWidth: 90, position: 'relative' }}
                          >
                            {paymentRejectLoading[indent.id] ? (
                              <span className="spinner-border spinner-border-sm" style={{ color: ACCENT_COLOR, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
                            ) : (
                              "Reject"
                            )}
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Box>
    </Box>
  );
};

export default FinanceView;
