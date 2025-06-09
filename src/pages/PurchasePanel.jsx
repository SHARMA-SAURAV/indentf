import React, { useEffect, useState, useCallback } from "react";
import axios from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPlus, faCheck, faTimes, faEye } from "@fortawesome/free-solid-svg-icons";
import {
  Container,Typography,Card,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Checkbox,
  FormControlLabel,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import FileViewerButton from "../components/FileViewerButton";

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
  const [reviewCommentMap, setReviewCommentMap] = useState({});
  const [inwardEntryMap, setInwardEntryMap] = useState({});
  const [gfrIndents, setGfrIndents] = useState([]);
  const [gfrNoteMap, setGfrNoteMap] = useState({});
  const [status, setStatus] = useState("");
  const [loadingIndents, setLoadingIndents] = useState(false);
  const [loadingGfr, setLoadingGfr] = useState(false);
  const [completeLoading, setCompleteLoading] = useState({});
  const [rejectLoading, setRejectLoading] = useState({});
  const [reviewLoading, setReviewLoading] = useState({});
  const [gfrLoading, setGfrLoading] = useState({});
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedIndent, setSelectedIndent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [actionSnackbar, setActionSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [trackTab, setTrackTab] = useState(0); // for new tab index
  const [trackingIndents, setTrackingIndents] = useState([]);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState(null);
  const [openTrackingIdx, setOpenTrackingIdx] = useState(null);

  // Add state for review actions
  const [expandedIndentId, setExpandedIndentId] = useState(null);
  const [itemReviewState, setItemReviewState] = useState({}); // { [indentId]: { approved: [], rejected: [], remarks: {} } }
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState({});
  const [indentReviews, setIndentReviews] = useState({}); // { [indentId]: [review, ...] }
  const [addReviewLoading, setAddReviewLoading] = useState({});
  const [addReviewText, setAddReviewText] = useState({});

  // Add state for expanded indent reviews and loading
  const [expandedReviews, setExpandedReviews] = useState({}); // { [indentId]: [reviews] }
  const [expandedReviewLoading, setExpandedReviewLoading] = useState({});

  const fetchPendingIndents = useCallback(async () => {
    try {
      setLoadingIndents(true);
      const res = await axios.get("/indent/purchase/pending");
      setIndents(res.data);
      
      // Initialize inward entry map with current database values
      const inwardMap = {};
      res.data.forEach(indent => {
        inwardMap[indent.id] = indent.inwardEntryGenerated || false;
      });
      setInwardEntryMap(inwardMap);
      
    } catch (err) {
      console.error("Failed to fetch purchase indents", err);
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
      console.error("Failed to fetch GFR indents", err);
    } finally {
      setLoadingGfr(false);
    }
  }, []);

  const fetchReviews = async (indentId) => {
    try {
      const res = await axios.get(`/indent/purchase/${indentId}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
      setReviews([]);
    }
  };

  const fetchTrackingIndents = async () => {
    setTrackingLoading(true);
    setTrackingError(null);
    try {
      const res = await axios.get("indent/purchase/tracking");
      setTrackingIndents(res.data);
    } catch (err) {
      setTrackingError("Failed to load tracked indents. Please try again.");
    } finally {
      setTrackingLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingIndents();
    fetchPendingGFRIndents();
  }, [fetchPendingIndents, fetchPendingGFRIndents]);

  useEffect(() => {
    if (tab === 2) fetchTrackingIndents();
  }, [tab]);

  const handleTabChange = (_, newValue) => setTab(newValue);

  const handleRemarkChange = (id, value) => {
    setRemarkMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleReviewCommentChange = (id, value) => {
    setReviewCommentMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleInwardEntryChange = async (id, checked) => {
    try {
      // Update backend first
      await axios.post("/indent/purchase/toggle-inward-entry", {
        indentId: id,
        inwardEntryGenerated: checked,
      });
      
      // Update frontend state only if backend update succeeds
      setInwardEntryMap((prev) => ({ ...prev, [id]: checked }));
      
      setStatus(checked ? 
        "Inward Entry marked as generated" : 
        "Inward Entry marked as not generated"
      );
      setTimeout(() => setStatus(""), 3000);
      
    } catch (err) {
      console.error("Failed to update inward entry status", err);
      alert("Error updating inward entry status");
    }
  };

  const handleAddReview = async (indentId) => {
    const comment = reviewCommentMap[indentId];
    if (!comment || comment.trim() === "") {
      alert("Please enter a review comment");
      return;
    }

    setReviewLoading((prev) => ({ ...prev, [indentId]: true }));
    try {
      await axios.post("/indent/purchase/add-review", {
        indentId: indentId,
        comment: comment.trim(),
      });
      
      setReviewCommentMap((prev) => {
        const copy = { ...prev };
        delete copy[indentId];
        return copy;
      });
      
      setStatus("Review added successfully");
      setTimeout(() => setStatus(""), 3000);
      
      // Refresh reviews if dialog is open for this indent
      if (selectedIndent?.id === indentId) {
        fetchReviews(indentId);
      }
    } catch (err) {
      console.error("Failed to add review", err);
      alert("Error adding review");
    } finally {
      setReviewLoading((prev) => ({ ...prev, [indentId]: false }));
    }
  };

  const handleViewReviews = async (indent) => {
    setSelectedIndent(indent);
    await fetchReviews(indent.id);
    setReviewDialogOpen(true);
  };

  const handleComplete = async (id) => {
    // Check if inward entry is selected
    if (!inwardEntryMap[id]) {
      alert("Please confirm that Inward Entry has been generated before completing the indent.");
      return;
    }

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
      
      setStatus("Indent marked as WAITING_FOR_USER_CONFIRMATION and sent to user for inspection.");
      fetchPendingIndents();
      
      // Clear form data
      setRemarkMap((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setInwardEntryMap((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      console.error("Error completing indent:", err);
      alert("Error completing indent. Please ensure Inward Entry is generated.");
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
      console.error("Failed to reject indent:", err);
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
      console.error("GFR submission failed", err);
      setStatus("Error submitting GFR.");
      setTimeout(() => setStatus(""), 4000);
    } finally {
      setGfrLoading((prev) => ({ ...prev, [id]: false }));
      setActionSnackbar({ open: false, message: "", severity: "info" });
    }
  };

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

  // Helper to get items array
  const getIndentItems = (indent) => indent.items && indent.items.length > 0 ? indent.items : (indent.products || []);

  // Handle per-item approve/reject
  const handleItemReviewChange = (indentId, itemId, action) => {
    setItemReviewState(prev => {
      const state = prev[indentId] || { approved: [], rejected: [], remarks: {} };
      // Remove from both arrays first
      state.approved = state.approved.filter(id => id !== itemId);
      state.rejected = state.rejected.filter(id => id !== itemId);
      if (action === 'approve') state.approved.push(itemId);
      if (action === 'reject') state.rejected.push(itemId);
      return { ...prev, [indentId]: state };
    });
  };

  const handleItemRemarkChange = (indentId, itemId, value) => {
    setItemReviewState(prev => {
      const state = prev[indentId] || { approved: [], rejected: [], remarks: {} };
      state.remarks[itemId] = value;
      return { ...prev, [indentId]: state };
    });
  };

  const handleSubmitReview = async (indent) => {
    const state = itemReviewState[indent.id] || { approved: [], rejected: [], remarks: {} };
    if (state.approved.length === 0 && state.rejected.length === 0) {
      alert('Select at least one item to approve or reject.');
      return;
    }
    setReviewSubmitLoading(prev => ({ ...prev, [indent.id]: true }));
    try {
      await axios.post('/indent/purchase/review-products', {
        indentId: indent.id,
        approvedProductIds: state.approved,
        rejectedProductIds: state.rejected,
        remarks: state.remarks
      });
      setStatus('Review submitted successfully.');
      fetchPendingIndents();
      setItemReviewState(prev => {
        const copy = { ...prev };
        delete copy[indent.id];
        return copy;
      });
      setExpandedIndentId(null);
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      alert('Failed to submit review.');
    } finally {
      setReviewSubmitLoading(prev => ({ ...prev, [indent.id]: false }));
    }
  };

  // Fetch reviews for an indent when expanded
  const fetchReviewsForExpanded = async (indentId) => {
    setExpandedReviewLoading(prev => ({ ...prev, [indentId]: true }));
    try {
      const res = await axios.get(`/indent/purchase/${indentId}/reviews`);
      setExpandedReviews(prev => ({ ...prev, [indentId]: res.data }));
    } catch (err) {
      setExpandedReviews(prev => ({ ...prev, [indentId]: [] }));
    } finally {
      setExpandedReviewLoading(prev => ({ ...prev, [indentId]: false }));
    }
  };

  // Handle expand/collapse and fetch reviews
  const handleExpandIndent = (indentId) => {
    if (expandedIndentId === indentId) {
      setExpandedIndentId(null);
    } else {
      setExpandedIndentId(indentId);
      fetchReviewsForExpanded(indentId);
    }
  };

  const handleAddReviewForIndent = async (indentId) => {
    const comment = reviewCommentMap[indentId];
    if (!comment || comment.trim() === "") {
      alert("Please enter a review comment");
      return;
    }
    setReviewLoading((prev) => ({ ...prev, [indentId]: true }));
    try {
      await axios.post("/indent/purchase/add-review", {
        indentId: indentId,
        comment: comment.trim(),
      });
      setReviewCommentMap((prev) => {
        const copy = { ...prev };
        delete copy[indentId];
        return copy;
      });
      setStatus("Review added successfully");
      setTimeout(() => setStatus(""), 3000);
      // Refresh reviews for expanded view
      fetchReviewsForExpanded(indentId);
    } catch (err) {
      alert("Error adding review");
    } finally {
      setReviewLoading((prev) => ({ ...prev, [indentId]: false }));
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        minWidth: '100vw',
        background: GRADIENT_BG,
        p: { xs: 1, md: 3 },
        m: 0,
        borderRadius: 0,
        // Remove fixed positioning and overflow here
      }}
    >
        <Box sx={{ mb: 2 }}></Box>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: ACCENT_COLOR,
          fontWeight: "bold",
          letterSpacing: 1,
        }}
      >
        <FontAwesomeIcon icon={faUser} style={{ marginRight: 8 }} />
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
        <Tab label="Track Indents" sx={{ color: ACCENT_COLOR }} />
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
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell />
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Indent Number</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Project Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Total Cost</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Items</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Actions</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Attachment</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {indents.map((indent) => {
                    const items = getIndentItems(indent);
                    const reviewState = itemReviewState[indent.id] || { approved: [], rejected: [], remarks: {} };
                    const inwardEntry = inwardEntryMap[indent.id];
                    const isExpanded = expandedIndentId === indent.id;
                    return (
                      <React.Fragment key={indent.id}>
                        <TableRow hover>
                          <TableCell>
                            <IconButton size="small" onClick={() => handleExpandIndent(indent.id)}>
                              {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                          </TableCell>
                          <TableCell>{indent.indentNumber}</TableCell>
                          <TableCell>{indent.projectName}</TableCell>
                          <TableCell>{indent.department}</TableCell>
                          <TableCell>₹{indent.totalIndentCost}</TableCell>
                          <TableCell>
                            <Chip label={`${items.length} items`} size="small" color="primary" />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleExpandIndent(indent.id)}
                              sx={{ bgcolor: ACCENT_COLOR }}
                              startIcon={<FontAwesomeIcon icon={faEye} />}
                            >
                              Review
                            </Button>
                          </TableCell>
                          <TableCell>
                            <FileViewerButton indent={indent} />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                              <Box sx={{ p: 2, bgcolor: '#fafafa' }}>
                                <Typography variant="h6" sx={{ mb: 2, color: ACCENT_COLOR }}>
                                  Items in this Indent
                                </Typography>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ fontWeight: 600 }}>Item Name</TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>Unit Cost</TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>Total Cost</TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>Approve</TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>Reject</TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>Remarks</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {items.map((item) => (
                                      <TableRow key={item.id}>
                                        <TableCell>{item.itemName}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>₹{item.perPieceCost}</TableCell>
                                        <TableCell>₹{item.totalCost}</TableCell>
                                        <TableCell>{item.productStatus}</TableCell>
                                        <TableCell>
                                          <Checkbox
                                            checked={reviewState.approved.includes(item.id)}
                                            onChange={() => handleItemReviewChange(indent.id, item.id, 'approve')}
                                            color="success"
                                            disabled={item.productStatus !== 'APPROVED_BY_FINANCE'}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Checkbox
                                            checked={reviewState.rejected.includes(item.id)}
                                            onChange={() => handleItemReviewChange(indent.id, item.id, 'reject')}
                                            color="error"
                                            disabled={item.productStatus !== 'APPROVED_BY_FINANCE'}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <TextField
                                            size="small"
                                            value={reviewState.remarks[item.id] || ''}
                                            onChange={e => handleItemRemarkChange(indent.id, item.id, e.target.value)}
                                            disabled={item.productStatus !== 'APPROVED_BY_FINANCE'}
                                          />
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                                {/* Add review section */}
                                <Box sx={{ mt: 3, mb: 2 }}>
                                  <Typography variant="subtitle1" sx={{ color: ACCENT_COLOR, fontWeight: 600, mb: 1 }}>
                                    Add Review (multiple allowed before submitting item review)
                                  </Typography>
                                  <Box display="flex" gap={2} alignItems="center">
                                    <TextField
                                      size="small"
                                      label="Review Comment"
                                      value={reviewCommentMap[indent.id] || ''}
                                      onChange={e => handleReviewCommentChange(indent.id, e.target.value)}
                                      sx={{ minWidth: 300 }}
                                    />
                                    <Button
                                      variant="outlined"
                                      onClick={() => handleAddReviewForIndent(indent.id)}
                                      disabled={reviewLoading[indent.id]}
                                    >
                                      {reviewLoading[indent.id] ? <CircularProgress size={18} /> : 'Add Review'}
                                    </Button>
                                  </Box>
                                </Box>
                                {/* Show all reviews for this indent */}
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="subtitle2" sx={{ color: ACCENT_COLOR, fontWeight: 600, mb: 1 }}>
                                    All Reviews
                                  </Typography>
                                  {expandedReviewLoading[indent.id] ? (
                                    <CircularProgress size={20} />
                                  ) : (expandedReviews[indent.id]?.length > 0 ? (
                                    <List>
                                      {expandedReviews[indent.id].map((review, idx) => (
                                        <React.Fragment key={review.id}>
                                          <ListItem alignItems="flex-start">
                                            <ListItemText
                                              primary={<Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography sx={{ fontWeight: 600, color: ACCENT_COLOR }}>{review.reviewer}</Typography>
                                                <Typography variant="caption" sx={{ color: SUBTEXT_COLOR }}>{new Date(review.reviewDate).toLocaleString()}</Typography>
                                              </Box>}
                                              secondary={<Typography sx={{ color: TEXT_COLOR, mt: 1 }}>{review.comment}</Typography>}
                                            />
                                          </ListItem>
                                          {idx < expandedReviews[indent.id].length - 1 && <Divider />}
                                        </React.Fragment>
                                      ))}
                                    </List>
                                  ) : (
                                    <Typography sx={{ color: SUBTEXT_COLOR, fontStyle: 'italic' }}>No reviews yet.</Typography>
                                  ))}
                                </Box>
                                {/* Inward entry checkbox and warning */}
                                <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                                  <Checkbox
                                    checked={!!inwardEntry}
                                    onChange={e => handleInwardEntryChange(indent.id, e.target.checked)}
                                    color="primary"
                                    sx={{ mr: 1 }}
                                  />
                                  <Typography sx={{ color: ACCENT_COLOR, fontWeight: 500 }}>
                                    Inward Entry Generated
                                  </Typography>
                                </Box>
                                {!inwardEntry && (
                                  <Alert severity="warning" sx={{ mb: 2 }}>
                                    Please confirm that Inward Entry has been generated before submitting item review.
                                  </Alert>
                                )}
                                <Box display="flex" justifyContent="flex-end" mt={2}>
                                  <Button
                                    variant="contained"
                                    onClick={() => handleSubmitReview(indent)}
                                    disabled={reviewSubmitLoading[indent.id] || !inwardEntry}
                                    sx={{ bgcolor: ACCENT_COLOR }}
                                  >
                                    {reviewSubmitLoading[indent.id] ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Submit Review'}
                                  </Button>
                                </Box>
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
        </>
      )}

      {/* GFR Submission Tab */}
      {/* {tab === 1 && (
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
      )} */}





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
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell />
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Indent Number</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Project Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Total Cost</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Items</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Actions</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Attachment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gfrIndents.map((indent) => {
                    const items = getIndentItems(indent);
                    const isExpanded = expandedIndentId === indent.id;
                    return (
                      <React.Fragment key={indent.id}>
                        <TableRow hover>
                          <TableCell>
                            <IconButton size="small" onClick={() => handleExpandIndent(indent.id)}>
                              {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                          </TableCell>
                          <TableCell>{indent.indentNumber}</TableCell>
                          <TableCell>{indent.projectName}</TableCell>
                          <TableCell>{indent.department}</TableCell>
                          <TableCell>₹{indent.totalIndentCost || indent.displayTotalCost}</TableCell>
                          <TableCell>
                            <Chip label={`${items.length} items`} size="small" color="primary" />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={indent.status} 
                              size="small" 
                              color="warning"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleExpandIndent(indent.id)}
                              sx={{ bgcolor: ACCENT_COLOR }}
                              startIcon={<FontAwesomeIcon icon={faEye} />}
                            >
                              View Details
                            </Button>
                          </TableCell>

                          <TableCell>
                            <FileViewerButton indent={indent} />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                              <Box sx={{ p: 2, bgcolor: '#fafafa' }}>
                                <Typography variant="h6" sx={{ mb: 2, color: ACCENT_COLOR }}>
                                  Items in this Indent
                                </Typography>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ fontWeight: 600 }}>Item Name</TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>Unit Cost</TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>Total Cost</TableCell>
                                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                      
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {items.map((item) => (
                                      <TableRow key={item.id}>
                                        <TableCell>{item.itemName}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>₹{item.perPieceCost}</TableCell>
                                        <TableCell>₹{item.totalCost}</TableCell>
                                        <TableCell>
                                          <Chip 
                                            label={item.productStatus} 
                                            size="small" 
                                            color={item.productStatus === 'APPROVED_BY_PURCHASE' ? 'success' : 'default'}
                                            sx={{ fontSize: '0.7rem' }}
                                          />
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                                
                                {/* GFR Note Section */}
                                <Box sx={{ mt: 3 }}>
                                  <Typography variant="subtitle1" sx={{ color: ACCENT_COLOR, fontWeight: 600, mb: 2 }}>
                                    GFR Submission
                                  </Typography>
                                  <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="GFR Note"
                                    value={gfrNoteMap[indent.id] || ""}
                                    onChange={(e) => handleGfrNoteChange(indent.id, e.target.value)}
                                    sx={{
                                      mb: 2,
                                      "& .MuiInputBase-root": { color: TEXT_COLOR },
                                    }}
                                  />
                                  <Box display="flex" justifyContent="flex-end">
                                    <Button
                                      variant="contained"
                                      onClick={() => handleSubmitGFR(indent.id)}
                                      sx={{
                                        backgroundColor: ACCENT_COLOR,
                                        minWidth: 140,
                                        position: "relative",
                                      }}
                                      disabled={gfrLoading[indent.id]}
                                      startIcon={<FontAwesomeIcon icon={faCheck} />}
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
                                </Box>
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
        </>
      )}

      {/* Track Indents Tab */}
      {tab === 2 && (
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
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Attachment</TableCell>
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
                          <TableCell>{indent.requestedBy?.department || 'N/A'}</TableCell>
                          <TableCell>{indent.quantity}</TableCell>
                          <TableCell>₹{indent.totalCost}</TableCell>
                          <TableCell sx={{ color: indent.status.includes('REJECTED') ? '#d32f2f' : '#1976d2', fontWeight: 700 }}>{indent.status}</TableCell>
                          <TableCell>
                            <FileViewerButton indent={indent} />
                          </TableCell>
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
      )}
      {/* Reviews Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: ACCENT_COLOR }}>
          Reviews for Indent #{selectedIndent?.id} - {selectedIndent?.projectName}
        </DialogTitle>
        <DialogContent>
          {reviews.length === 0 ? (
            <Typography sx={{ color: SUBTEXT_COLOR, p: 2 }}>
              No reviews added yet.
            </Typography>
          ) : (
            <List>
              {reviews.map((review, index) => (
                <React.Fragment key={review.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontWeight: 600, color: ACCENT_COLOR }}>
                            {review.reviewer}
                          </Typography>
                          <Typography variant="caption" sx={{ color: SUBTEXT_COLOR }}>
                            {new Date(review.reviewDate).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography sx={{ color: TEXT_COLOR, mt: 1 }}>
                          {review.comment}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < reviews.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setReviewDialogOpen(false)}
            sx={{ color: ACCENT_COLOR }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default PurchasePanel;