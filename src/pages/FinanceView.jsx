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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  CircularProgress
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

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

const TrackingStepsTable = ({ steps }) => (
  <Table size="small" sx={{ background: '#f8fafc', borderRadius: 2, mt: 1 }}>
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Role</TableCell>
        <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Remark</TableCell>
        <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Status</TableCell>
        <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Date</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {steps.map((step, idx) => (
        <TableRow key={idx}>
          <TableCell sx={{ fontWeight: 600 }}>{step.role}</TableCell>
          <TableCell>{step.remark}</TableCell>
          <TableCell sx={{ color: step.status.includes('Rejected') ? '#d32f2f' : '#388e3c', fontWeight: 600 }}>{step.status}</TableCell>
          <TableCell sx={{ color: '#666' }}>{step.date ? new Date(step.date).toLocaleString() : ''}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const getTrackingSteps = (indent) => {
  const trackingSteps = [];
  if (indent.remarkByFla && (indent.flaApprovalDate || indent.status === "REJECTED_BY_FLA")) {
    trackingSteps.push({
      role: "FLA",
      remark: indent.remarkByFla,
      date: indent.flaApprovalDate || indent.updatedAt,
      status: indent.status === "REJECTED_BY_FLA" ? "Rejected" : "Approved",
    });
  }
  if (indent.remarkBySla && (indent.slaApprovalDate || indent.status === "REJECTED_BY_SLA")) {
    trackingSteps.push({
      role: "SLA",
      remark: indent.remarkBySla,
      date: indent.slaApprovalDate || indent.updatedAt,
      status: indent.status === "REJECTED_BY_SLA" ? "Rejected" : "Approved",
    });
  }
  if (indent.remarkByStore && (indent.storeApprovalDate || indent.status === "REJECTED_BY_STORE")) {
    trackingSteps.push({
      role: "Store",
      remark: indent.remarkByStore,
      date: indent.storeApprovalDate || indent.updatedAt,
      status: indent.status === "REJECTED_BY_STORE" ? "Rejected" : "Approved",
    });
  }
  if (indent.remarkByFinance && (indent.financeApprovalDate || indent.status === "REJECTED_BY_FINANCE")) {
    trackingSteps.push({
      role: "Finance",
      remark: indent.remarkByFinance,
      date: indent.financeApprovalDate || indent.updatedAt,
      status: indent.status === "REJECTED_BY_FINANCE" ? "Rejected" : "Approved",
    });
  }
  if (indent.remarkByPurchase && (indent.purchaseCompletionDate || indent.status === "REJECTED_BY_PURCHASE")) {
    trackingSteps.push({
      role: "Purchase",
      remark: indent.remarkByPurchase,
      date: indent.purchaseCompletionDate || indent.updatedAt,
      status: indent.status === "REJECTED_BY_PURCHASE" ? "Rejected" : "Completed",
    });
  }
  if (indent.remarkByUser && indent.userInspectionDate) {
    trackingSteps.push({
      role: "User",
      remark: indent.remarkByUser,
      date: indent.userInspectionDate,
      status: "Inspection Done",
    });
  }
  if (indent.gfrNote && indent.gfrCreatedAt) {
    trackingSteps.push({
      role: "Purchase",
      remark: indent.gfrNote,
      date: indent.gfrCreatedAt,
      status: "GFR Submitted",
    });
  }
  if (indent.paymentNote && (indent.paymentCreatedAt || indent.status === "PAYMENT_REJECTED")) {
    trackingSteps.push({
      role: "Finance",
      remark: indent.paymentNote,
      date: indent.paymentCreatedAt,
      status: indent.status === "PAYMENT_REJECTED" ? "Rejected" : "Payment Done",
    });
  }
  return trackingSteps;
};

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
  const [trackingIndents, setTrackingIndents] = useState([]);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState(null);
  const [openTrackingIdx, setOpenTrackingIdx] = useState(null);

  useEffect(() => {
    fetchApprovalIndents();
    fetchPaymentIndents();
  }, []);

  const fetchApprovalIndents = async () => {
    try {
      const res = await axios.get("/indent/finance/pending");
      setApprovalIndents(res.data);
    } catch (err) {
      // console.error("Failed to fetch approval indents:", err);
      setApprovalIndents([]);
    }
  };

  const fetchPaymentIndents = async () => {
    try {
      const res = await axios.get("/indent/finance/payment/pending");
      setPaymentIndents(res.data);
    } catch (err) {
      // console.error("Failed to fetch payment indents:", err);
      setPaymentIndents([]);
    }
  };

  const fetchTrackingIndents = async () => {
    setTrackingLoading(true);
    setTrackingError(null);
    try {
      const res = await axios.get("/track/finance/tracking");
      setTrackingIndents(res.data);
    } catch (err) {
      setTrackingError("Failed to load tracked indents. Please try again.");
    } finally {
      setTrackingLoading(false);
    }
  };

  useEffect(() => {
    if (tabIndex === 2) fetchTrackingIndents();
  }, [tabIndex]);

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
      // console.error("Approval failed:", err);
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
      // console.error("Rejection failed:", err);
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
      // console.error("Payment submission failed:", err);
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
      // console.error('Payment rejection failed:', err);
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
          <Tab
            label="Track Indents"
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
                            Project Name: {indent.projectName}
                          </Typography>
                          <Typography sx={{ color: "black", fontSize: 14, fontWeight: 600 }}>
                            Department: {indent.department}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.5 }}>
                        Item Name: {indent.itemName}
                      </Typography>
                      <Typography sx={{ color: "black", fontSize: 13, mb: 1, fontWeight: 500 }}>
                        Description: {indent.description}
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
                            Project Name: {indent.projectName}
                          </Typography>
                          <Typography sx={{ color: SUBTEXT_COLOR, fontSize: 14 }}>
                            Department: {indent.department}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.5 }}>
                        Item name: {indent.itemName}
                      </Typography>
                      <Typography sx={{ color: "black", fontSize: 13, mb: 1 }}>
                       Description:  {indent.description}
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
                      {/* <Typography sx={{ color: SUBTEXT_COLOR, mt: 1, fontSize: 13 }}>
                        <strong>GFR Note:</strong> {indent.paymentNote}
                      </Typography>
                      <Typography sx={{ color: SUBTEXT_COLOR, fontSize: 13 }}>
                        <strong>Requested Amount:</strong> ₹{indent.amountRequested}
                      </Typography> */}
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
        <TabPanel value={tabIndex} index={2}>
          <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', background: '#fff', borderRadius: 3, boxShadow: '0 2px 16px #0d47a122', p: { xs: 1, md: 3 }, mt: 2 }}>
            {trackingLoading ? (
              <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
            ) : trackingError ? (
              <Typography variant="h6" align="center" mt={4} color="error" fontWeight={600}>{trackingError}</Typography>
            ) : trackingIndents.length === 0 ? (
              <Typography sx={{ color: SUBTEXT_COLOR, textAlign: 'center', fontWeight: 600, fontSize: 20, py: 4 }}>No indents found.</Typography>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', background: 'transparent' }}>
                <Table sx={{ minWidth: 900, background: 'transparent' }} aria-label="track indents table">
                  <TableHead>
                    <TableRow sx={{ background: 'linear-gradient(90deg, #e3f2fd 60%, #fce4ec 100%)' }}>
                      <TableCell />
                      <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Indent ID</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Project</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Item</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Quantity</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Total Cost</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {trackingIndents.map((indent, idx) => {
                      const isOpen = openTrackingIdx === idx;
                      const steps = getTrackingSteps(indent);
                      return (
                        <React.Fragment key={indent.id}>
                          <TableRow hover sx={{ background: isOpen ? '#f3e5f5' : 'transparent', transition: 'background 0.2s' }}>
                            <TableCell>
                              <IconButton size="small" onClick={() => setOpenTrackingIdx(isOpen ? null : idx)}>
                                {isOpen ? <KeyboardArrowUp sx={{ color: ACCENT_COLOR }} /> : <KeyboardArrowDown sx={{ color: ACCENT_COLOR }} />}
                              </IconButton>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{indent.id}</TableCell>
                            <TableCell>{indent.projectName}</TableCell>
                            <TableCell>{indent.itemName}</TableCell>
                            <TableCell>{indent.department}</TableCell>
                            <TableCell>{indent.quantity}</TableCell>
                            <TableCell>₹{indent.totalCost}</TableCell>
                            <TableCell sx={{ color: indent.status.includes('REJECTED') ? '#d32f2f' : '#1976d2', fontWeight: 700 }}>{indent.status}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0, background: '#f8fafc' }} colSpan={8}>
                              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                <Box sx={{ pl: 1, pr: 1, pb: 2, pt: 2 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: ACCENT_COLOR, mb: 1 }}>Tracking Steps</Typography>
                                  {steps.length > 0 ? (
                                    <TrackingStepsTable steps={steps} />
                                  ) : (
                                    <Typography sx={{ color: '#888', fontStyle: 'italic', py: 2 }}>No tracking steps available for this indent.</Typography>
                                  )}
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default FinanceView;
