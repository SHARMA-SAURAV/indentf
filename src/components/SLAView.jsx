import React, { useEffect, useState, useCallback } from "react";
import axios from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Icon,
  Tabs,
  Tab,
} from "@mui/material";

// Theme Constants
const CARD_BG = "rgba(255, 255, 255, 0.95)";
const TEXT_COLOR = "#444950";
const ACCENT_COLOR = "#0d47a1";

const IndentCard = React.memo(({ indent, remark, onRemarkChange, onApprove, onReject, actionLoading }) => (
  <Card
    sx={{
      my: 3,
      mx: 'auto',
      background: '#fff',
      borderRadius: 5,
      boxShadow: '0 8px 32px 0 rgba(13,71,161,0.10)',
      border: 'none',
      maxWidth: 480,
      minWidth: 320,
      position: 'relative',
      overflow: 'hidden',
      p: 0,
      transition: 'box-shadow 0.25s, transform 0.18s',
      '&:hover': {
        boxShadow: '0 16px 48px 0 rgba(13,71,161,0.18)',
        transform: 'scale(1.018)',
      },
    }}
  >
    <CardContent sx={{ p: 4, pb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{
          bgcolor: '#1976d2',
          color: '#fff',
          width: 54,
          height: 54,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 26,
          mr: 2,
          boxShadow: '0 2px 8px #1976d222',
        }}>
          {indent.itemName?.[0]?.toUpperCase() || '?'}
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 20, color: '#0d47a1', lineHeight: 1 }}>Project Name: {indent.projectName}</Typography>
          <Typography sx={{ color: 'Black', fontWeight: 500, fontSize: 15, mt: 0.2 }}>Project:Item Name: {indent.itemName}</Typography>
        </Box>
      </Box>
      <Box sx={{ mb: 1.5 }}>
        <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Indent Id:</b> {indent.id}</Typography>
        <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Department:</b> {indent.department}</Typography>
        <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Quantity:</b> {indent.quantity}</Typography>
        <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Per Piece Cost:</b> {indent.perPieceCost}</Typography>
        <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Total Cost:</b> {indent.totalCost}</Typography>
        <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Status:</b> {indent.status}</Typography>
        <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Description:</b> {indent.description}</Typography>
      </Box>
      <TextField
        label="Remark"
        fullWidth
        margin="normal"
        size="small"
        multiline
        rows={3}
        value={remark || ""}
        onChange={(e) => onRemarkChange(indent.id, e.target.value)}
        sx={{ background: '#f6f8fa', borderRadius: 2, mb: 1 }}
      />
      <Box sx={{ mt: 2.5, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          sx={{
            background: remark ? 'linear-gradient(90deg, #0d47a1 60%, #42a5f5 100%)' : '#b0b8c1',
            fontWeight: 800,
            px: 3,
            borderRadius: 2,
            boxShadow: '0 2px 8px #0d47a122',
            textTransform: 'none',
            fontSize: 16,
            letterSpacing: 0.5,
            minWidth: 170,
            transition: 'all 0.18s',
            '&:hover': remark ? { background: 'linear-gradient(90deg, #1565c0 60%, #64b5f6 100%)', transform: 'translateY(-2px) scale(1.03)' } : {},
          }}
          onClick={() => onApprove(indent.id)}
          disabled={actionLoading || !remark || remark.trim() === ""}
          endIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {actionLoading ? 'Processing...' : 'Approve & Forward'}
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{
            fontWeight: 800,
            px: 3,
            borderRadius: 2,
            borderWidth: 2,
            boxShadow: '0 2px 8px #d32f2f22',
            textTransform: 'none',
            fontSize: 16,
            letterSpacing: 0.5,
            minWidth: 120,
            transition: 'all 0.18s',
            '&:hover': { background: '#fff0f0', transform: 'translateY(-2px) scale(1.03)' },
          }}
          onClick={() => onReject(indent.id)}
          disabled={actionLoading}
        >
          Reject
        </Button>
      </Box>
    </CardContent>
  </Card>
));

const SLAView = () => {
  const [indents, setIndents] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [rejectingIndentId, setRejectingIndentId] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);
  const [allIndents, setAllIndents] = useState([]);
  const [openTrackingIdx, setOpenTrackingIdx] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchIndents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/indent/sla/pending", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIndents(res.data);
    } catch (err) {
      // console.error("Error fetching indents", err);
      setError("Failed to load pending indents. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllIndents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/track/sla/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAllIndents(res.data);
    } catch (err) {
      setError("Failed to load all indents for tracking. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndents();
  }, [fetchIndents]);

  useEffect(() => {
    if (tab === 1) fetchAllIndents();
  }, [tab, fetchAllIndents]);

  const handleRemarkChange = useCallback((id, value) => {
    setRemarks((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleApprove = useCallback(async (indentId) => {
    if (!remarks[indentId] || remarks[indentId].trim() === "") {
      alert("Remark is required to approve.");
      return;
    }
    const confirmApprove = window.confirm("Are you sure you want to approve this indent?");
    if (!confirmApprove) return;
    setActionLoading(true);
    try {
      await axios.post(
        "/indent/sla/approve",
        {
          indentId,
          remark: remarks[indentId],
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Indent approved and forwarded to Store");
      fetchIndents();
    } catch (err) {
      // console.error("Approval failed", err);
      alert("Something went wrong while approving.");
    } finally {
      setActionLoading(false);
    }
  }, [remarks, fetchIndents]);

  const handleReject = useCallback(async () => {
    if (!remarks[rejectingIndentId] || remarks[rejectingIndentId].trim() === "") {
      alert("Remark is required to reject.");
      return;
    }
    const confirmReject = window.confirm("Are you sure you want to reject this indent?");
    if (!confirmReject) return;
    setActionLoading(true);
    try {
      await axios.post(
        "/indent/sla/reject",
        {
          indentId: rejectingIndentId,
          remark: remarks[rejectingIndentId],
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Indent rejected by SLA");
      handleCloseReject();
      fetchIndents();
    } catch (err) {
      // console.error("Rejection failed", err);
      alert("Failed to reject indent.");
    } finally {
      setActionLoading(false);
    }
  }, [remarks, rejectingIndentId, fetchIndents]);

  const handleOpenReject = useCallback((indentId) => {
    setRejectingIndentId(indentId);
    setOpenReject(true);
  }, []);

  const handleCloseReject = useCallback(() => {
    setOpenReject(false);
    setRejectingIndentId(null);
  }, []);

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e3eafc 100%)',
        minHeight: '100vh',
        py: { xs: 3, md: 6 },
        px: { xs: 1, md: 6 },
        fontFamily: "'Roboto', sans-serif",
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        ml: '-50vw',
        mr: '-50vw',
      }}
    >
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography
          variant="h6"
          align="center"
          mt={4}
          color="error"
          fontWeight={600}
        >
          {error}
        </Typography>
      ) : (
        <>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              mb: 5,
              color: ACCENT_COLOR,
              fontWeight: 700,
              textAlign: "center",
              letterSpacing: 1.2,
            }}
          >
            <FontAwesomeIcon icon={faUser} />
            SLA Dashboard
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="primary" indicatorColor="primary" sx={{ mb: 2 }}>
              <Tab label="Pending Indents" />
              <Tab label="Track Indents" />
            </Tabs>
          </Box>
          {tab === 0 && (
            indents.length === 0 ? (
              <Typography variant="h6" align="center" mt={4}>
                No pending indents for SLA.
              </Typography>
            ) : (
              <Grid container spacing={4} justifyContent="center">
                {indents.map((indent) => (
                  <Grid item xs={12} sm={6} md={6} lg={5} xl={4} key={indent.id} display="flex" justifyContent="center">
                    <IndentCard
                      indent={indent}
                      remark={remarks[indent.id]}
                      onRemarkChange={handleRemarkChange}
                      onApprove={handleApprove}
                      onReject={handleOpenReject}
                      actionLoading={actionLoading}
                    />
                  </Grid>
                ))}
              </Grid>
            )
          )}
          {tab === 1 && (
            <Box sx={{ width: '100vw', position: 'relative', left: '50%', right: '50%', ml: '-50vw', mr: '-50vw', px: { xs: 0, md: 4 }, py: 2, background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)' }}>
              {loading ? (
                <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
              ) : error ? (
                <Typography variant="h6" align="center" mt={4} color="error" fontWeight={600}>{error}</Typography>
              ) : allIndents.length === 0 ? (
                <Typography>No indents found.</Typography>
              ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 24px 0 rgba(25, 118, 210, 0.10)', maxWidth: '98vw', mx: 'auto', mt: 2 }}>
                  <Table sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Item Name</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Project</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Department</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Quantity</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Created</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allIndents.map((indent, idx) => (
                        <React.Fragment key={indent.id}>
                          <TableRow
                            hover
                            sx={{ cursor: 'pointer', transition: 'background 0.2s', '&:hover': { background: '#e3f2fd' } }}
                            onClick={() => setOpenTrackingIdx(idx === openTrackingIdx ? null : idx)}
                          >
                            <TableCell>{indent.itemName}</TableCell>
                            <TableCell>{indent.projectName}</TableCell>
                            <TableCell>{indent.department}</TableCell>
                            <TableCell>{indent.quantity}</TableCell>
                            <TableCell>
                              <span style={{ color: ACCENT_COLOR, fontWeight: 600 }}>{indent.status}</span>
                            </TableCell>
                            <TableCell>{new Date(indent.createdAt).toLocaleString()}</TableCell>
                            <TableCell>
                              {openTrackingIdx === idx ? (
                                <KeyboardArrowUp sx={{ color: ACCENT_COLOR, fontSize: 28 }} />
                              ) : (
                                <KeyboardArrowDown sx={{ color: ACCENT_COLOR, fontSize: 28 }} />
                              )}
                            </TableCell>
                          </TableRow>
                          {openTrackingIdx === idx && (
                            <TableRow>
                              <TableCell colSpan={7} sx={{ background: '#f3e5f5', p: 2 }}>
                                <TrackingStepsSLA indent={indent} />
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </>
      )}

      {/* Reject Remark Dialog */}
      <Dialog open={openReject} onClose={handleCloseReject} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Indent</DialogTitle>
        <DialogContent>
          <TextField
            label="Rejection Remark"
            multiline
            rows={4}
            fullWidth
            value={remarks[rejectingIndentId] || ""}
            onChange={(e) => handleRemarkChange(rejectingIndentId, e.target.value)}
            disabled={actionLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReject} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={actionLoading}
          >
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Add TrackingStepsSLA component for SLA tracking
const TrackingStepsSLA = ({ indent }) => {
  const [isExpanded, setIsExpanded] = useState(true);
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
  const hasTrackingSteps = trackingSteps.length > 0;
  return (
    <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ fontWeight: 600, color: '#333', fontSize: 16 }}>Tracking Steps</Typography>
        {isExpanded ? (
          <KeyboardArrowUp
            onClick={() => setIsExpanded((prev) => !prev)}
            sx={{ cursor: 'pointer', color: ACCENT_COLOR, fontSize: 28 }}
          />
        ) : (
          <KeyboardArrowDown
            onClick={() => setIsExpanded((prev) => !prev)}
            sx={{ cursor: 'pointer', color: ACCENT_COLOR, fontSize: 28 }}
          />
        )}
      </Box>
      {isExpanded && hasTrackingSteps && (
        <Box sx={{ pl: 2, pr: 1, pb: 1, borderTop: '1px solid #ddd' }}>
          {trackingSteps.map((step, idx) => (
            <Box key={idx} sx={{ mb: 1 }}>
              <Typography sx={{ fontWeight: 500, color: '#555', fontSize: 14 }}><b>{step.role}:</b> {step.remark}</Typography>
              <Typography sx={{ color: '#777', fontSize: 12 }}>{new Date(step.date).toLocaleString()} - <span style={{ color: step.status.includes('Rejected') ? '#d32f2f' : '#388e3c', fontWeight: 500 }}>{step.status}</span></Typography>
            </Box>
          ))}
        </Box>
      )}
      {!hasTrackingSteps && (
        <Typography sx={{ color: '#777', fontSize: 14, textAlign: 'center', py: 2 }}>
          No tracking steps available for this indent.
        </Typography>
      )}
    </Box>
  );
};

export default SLAView;