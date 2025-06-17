import React, { useEffect, useState } from "react";
import axios from "../api/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faCheck, faTimes, faEye, faCreditCard } from '@fortawesome/free-solid-svg-icons';
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
  CircularProgress,
  Checkbox,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp, ExpandMore, ExpandLess } from "@mui/icons-material";
import FileViewerButton from "../components/FileViewerButton";
import FileViewerButtonResubmit from "../components/FileViewerButtonResubmit";
import InspectionFileViewer from "../components/InspectionFileViewer";
import GfrFileViewer from "../components/GfrFileViewer";


const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

// Color constants
const GRADIENT_BG = "linear-gradient(135deg, #FAFAFA 0%, #EDEDED 100%)";
const CARD_BG = "rgba(255, 255, 255, 0.95)";
const TEXT_COLOR = "#444950";
const ACCENT_COLOR = "#0d47a1";
const SUBTEXT_COLOR = "#8E99A3";

const ProductStatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED_BY_STORE':
        return { bg: '#e3f2fd', color: '#1976d2' };
      case 'APPROVED_BY_FINANCE':
        return { bg: '#e8f5e8', color: '#2e7d32' };
      case 'REJECTED_BY_FINANCE':
        return { bg: '#ffebee', color: '#d32f2f' };
      default:
        return { bg: '#f5f5f5', color: '#666' };
    }
  };

  const colors = getStatusColor(status);
  return (
    <Chip
      label={status?.replace(/_/g, ' ')}
      size="small"
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontWeight: 600,
        fontSize: '0.75rem'
      }}
    />
  );
};

const PaymentCompletionDialog = ({ open, onClose, indent, onSubmit }) => {
  const [paymentNote, setPaymentNote] = useState('');
  const [loading, setLoading] = useState(false);

  // Calculate approved and rejected payment amounts
  const approvedItems = indent?.items?.filter(item => !String(item.productStatus).includes('REJECTED')) || [];
  const rejectedItems = indent?.items?.filter(item => String(item.productStatus).includes('REJECTED')) || [];
  const approvedAmount = approvedItems.reduce((total, item) => total + parseFloat(item.totalCost || 0), 0);
  const rejectedAmount = rejectedItems.reduce((total, item) => total + parseFloat(item.totalCost || 0), 0);

  useEffect(() => {
    if (open) {
      setPaymentNote('');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!paymentNote.trim()) {
      alert('Please enter a payment note');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(indent.id, paymentNote.trim());
      onClose();
    } catch (error) {
      alert('Failed to complete payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <FontAwesomeIcon icon={faCreditCard} style={{ color: ACCENT_COLOR }} />
          Complete Payment - {indent?.projectName}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: ACCENT_COLOR }}>
            Payment Summary
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e8' }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Approved Amount
                </Typography>
                <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                  ₹{approvedAmount.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#ffebee' }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Rejected Amount
                </Typography>
                <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600 }}>
                  ₹{rejectedAmount.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Original
                </Typography>
                <Typography variant="h6" sx={{ color: ACCENT_COLOR, fontWeight: 600 }}>
                  ₹{indent?.totalIndentCost?.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Show approved items */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#2e7d32' }}>
            Approved Items for Payment:
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 3, maxHeight: 300 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Qty</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Unit Cost</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approvedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ color: SUBTEXT_COLOR }}>
                      No approved items for payment.
                    </TableCell>
                  </TableRow>
                ) : (
                  approvedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {item.itemName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {item.description}
                        </Typography>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.perPieceCost}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>₹{item.totalCost}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Optionally show rejected items */}
          {rejectedItems.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#d32f2f' }}>
                Rejected Items:
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 3, maxHeight: 200 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Qty</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Unit Cost</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rejectedItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {item.itemName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {item.description}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{item.perPieceCost}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>₹{item.totalCost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Payment Note / Remark:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter payment completion note, transaction details, or any remarks..."
            value={paymentNote}
            onChange={(e) => setPaymentNote(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!paymentNote.trim() || loading}
          startIcon={loading ? <CircularProgress size={16} /> : <FontAwesomeIcon icon={faCheck} />}
          sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
        >
          {loading ? 'Processing...' : `Complete Payment (₹${approvedAmount.toLocaleString()})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ProductReviewDialog = ({ open, onClose, indent, onSubmit }) => {
  const [selectedProducts, setSelectedProducts] = useState({
    approved: [],
    rejected: []
  });
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && indent) {
      // Reset selections when dialog opens
      setSelectedProducts({ approved: [], rejected: [] });
      setRemarks({});
    }
  }, [open, indent]);

  const handleProductSelection = (productId, type) => {
    setSelectedProducts(prev => {
      const newState = { ...prev };
      
      if (type === 'approved') {
        if (newState.approved.includes(productId)) {
          newState.approved = newState.approved.filter(id => id !== productId);
        } else {
          newState.approved.push(productId);
          newState.rejected = newState.rejected.filter(id => id !== productId);
        }
      } else {
        if (newState.rejected.includes(productId)) {
          newState.rejected = newState.rejected.filter(id => id !== productId);
        } else {
          newState.rejected.push(productId);
          newState.approved = newState.approved.filter(id => id !== productId);
        }
      }
      
      return newState;
    });
  };

  const handleRemarkChange = (productId, value) => {
    setRemarks(prev => ({ ...prev, [productId]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({
        indentId: indent.id,
        approvedProductIds: selectedProducts.approved,
        rejectedProductIds: selectedProducts.rejected,
        remarks: remarks
      });
      onClose();
    } catch (error) {
      alert('Failed to review products');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = selectedProducts.approved.length > 0 || selectedProducts.rejected.length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <FontAwesomeIcon icon={faCoins} style={{ color: ACCENT_COLOR }} />
          Review Products - {indent?.projectName}
        </Box>
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Specs</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Qty</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {indent?.items?.filter(item => item.productStatus === 'APPROVED_BY_STORE').map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {item.itemName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item.specificationModelDetails || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₹{item.perPieceCost}</TableCell>
                  <TableCell>₹{item.totalCost}</TableCell>
                  <TableCell>
                    <ProductStatusChip status={item.productStatus} />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Checkbox
                        checked={selectedProducts.approved.includes(item.id)}
                        onChange={() => handleProductSelection(item.id, 'approved')}
                        color="success"
                        size="small"
                      />
                      <Typography variant="caption">Approve</Typography>
                      <Checkbox
                        checked={selectedProducts.rejected.includes(item.id)}
                        onChange={() => handleProductSelection(item.id, 'rejected')}
                        color="error"
                        size="small"
                      />
                      <Typography variant="caption">Reject</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      placeholder="Add remark..."
                      value={remarks[item.id] || ''}
                      onChange={(e) => handleRemarkChange(item.id, e.target.value)}
                      sx={{ minWidth: 150 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          startIcon={loading ? <CircularProgress size={16} /> : <FontAwesomeIcon icon={faCheck} />}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SendBackDialog = ({ open, onClose, onSubmit, indent }) => {
  const [targetRole, setTargetRole] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!targetRole || !remarks.trim()) {
      alert("Please select a role and enter remarks.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(indent.id, targetRole, remarks);
      onClose();
    } catch (e) {
      alert("Failed to send back indent.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setTargetRole("");
      setRemarks("");
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Send Back Indent</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography>Select role to send back:</Typography>
          <Select
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          >
            <MenuItem value="FLA">FLA</MenuItem>
            <MenuItem value="SLA">SLA</MenuItem>
            <MenuItem value="STORE">STORE</MenuItem>
            <MenuItem value="PURCHASE">PURCHASE</MenuItem>
          </Select>
        </Box>
        <TextField
          label="Remarks"
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading || !targetRole || !remarks.trim()}
        >
          {loading ? <CircularProgress size={16} /> : "Send Back"}
        </Button>
      </DialogActions>
    </Dialog>
  );
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
          <TableCell sx={{ color: step.status.includes('Rejected') ? '#d32f2f' : '#388e3c', fontWeight: 600 }}>
            {step.status}
          </TableCell>
          <TableCell sx={{ color: '#666' }}>
            {step.date ? new Date(step.date).toLocaleString() : ''}
          </TableCell>
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
      role: "User Inspection",
      remark: indent.remarkByUser,
      date: indent.userInspectionDate,
      status: "Inspection Done",
    });
  }
  if (indent.gfrNote && indent.gfrCreatedAt) {
    trackingSteps.push({
      role: "GFR Note",
      remark: indent.gfrNote,
      date: indent.gfrCreatedAt,
      status: "GFR Submitted",
    });
  }
  if (indent.paymentNote && indent.paymentCreatedAt) {
    trackingSteps.push({
      role: "Payment Note",
      remark: indent.paymentNote,
      date: indent.paymentCreatedAt,
      status: "Payment Done",
    });
  }
  trackingSteps.sort((a, b) => new Date(a.date) - new Date(b.date));
  return trackingSteps;
};

const FinanceView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tabIndex, setTabIndex] = useState(0);
  const [approvalIndents, setApprovalIndents] = useState([]);
  const [paymentIndents, setPaymentIndents] = useState([]);
  const [trackingIndents, setTrackingIndents] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(false);
  const [reviewDialog, setReviewDialog] = useState({ open: false, indent: null });
  const [paymentDialog, setPaymentDialog] = useState({ open: false, indent: null });
  const [sendBackDialog, setSendBackDialog] = useState({ open: false, indent: null });

  useEffect(() => {
    fetchApprovalIndents();
    fetchPaymentIndents();
  }, []);

  const fetchApprovalIndents = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/indent/finance/pending");
      setApprovalIndents(res.data);
    } catch (err) {
      console.error("Failed to fetch approval indents:", err);
      setApprovalIndents([]);
    } finally {
      setLoading(false);
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

  const fetchTrackingIndents = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/track/finance/tracking");
      setTrackingIndents(res.data);
    } catch (err) {
      console.error("Failed to fetch tracking indents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tabIndex === 2) fetchTrackingIndents();
  }, [tabIndex]);

  const toggleRowExpansion = (indentId) => {
    setExpandedRows(prev => ({
      ...prev,
      [indentId]: !prev[indentId]
    }));
  };

  const handleReviewProducts = async (reviewData) => {
    try {
      await axios.post("/indent/finance/review-products", reviewData);
      alert('Products reviewed successfully');
      fetchApprovalIndents();
    } catch (error) {
      throw error;
    }
  };

  const handlePaymentComplete = async (indentId, paymentNote) => {
    try {
      // Add Authorization header and log payload for debugging
      const payload = {
        indentId, // If backend expects 'id', change this to 'id'
        paymentNote
      };
      console.log('Submitting payment:', payload);
      const response = await axios.post(
        "/indent/finance/payment/submit",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert("Payment marked as completed successfully");
      fetchPaymentIndents();
      setPaymentDialog({ open: false, indent: null });
    } catch (error) {
      // Log backend error for debugging
      if (error.response) {
        console.error('Payment submit error:', error.response.data);
        alert(`Failed to complete payment: ${error.response.data?.message || error.response.statusText}`);
      } else {
        alert("Failed to complete payment");
      }
      throw new Error("Failed to complete payment");
    }
  };

  const handleSendBack = async (indentId, targetRole, remarks) => {
    try {
      await axios.put(
        `/finance/send-back/${indentId}?targetRole=${targetRole}&remarks=${encodeURIComponent(remarks)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(`Indent sent back to ${targetRole} successfully.`);
      fetchPaymentIndents();
      fetchApprovalIndents();
      setSendBackDialog({ open: false, indent: null });
    } catch (e) {
      throw e;
    }
  };

  // Calculate adjusted total cost for payment indents
  const getAdjustedTotal = (indent) => {
    if (!indent.items) return indent.totalIndentCost;
    // Exclude any item that is rejected by anyone (status includes 'REJECTED')
    const approvedAmount = indent.items.reduce((total, item) => {
      if (!String(item.productStatus).includes('REJECTED')) {
        return total + parseFloat(item.totalCost || 0);
      }
      return total;
    }, 0);
    return approvedAmount;
  };

  const IndentTable = ({ indents, type }) => (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8fafc' }}>
            <TableCell />
            <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Indent ID</TableCell>
            <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Project Name</TableCell>
            <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Project Head</TableCell>
            <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Department</TableCell>
            <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>
              {type === 'payment' ? 'Payment Amount' : 'Total Cost'}
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Products</TableCell>
            <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Actions</TableCell>
            <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Inspection Report</TableCell>
            <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>GFR Report</TableCell>
            <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Resubmit Attachment</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {indents.map((indent) => {
            const displayAmount = type === 'payment' ? getAdjustedTotal(indent) : indent.totalIndentCost;
            return (
              <React.Fragment key={indent.id}>
                <TableRow hover>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleRowExpansion(indent.id)}
                    >
                      {expandedRows[indent.id] ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{indent.indentNumber}</TableCell>
                  <TableCell>{indent.project.projectName}</TableCell>
                  <TableCell>{indent.projectHead || 'N/A'}</TableCell>
                  <TableCell>{indent.department || 'N/A'}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    ₹{displayAmount?.toLocaleString()}
                    {type === 'payment' && displayAmount !== indent.totalIndentCost && (
                      <Typography variant="caption" display="block" sx={{ color: SUBTEXT_COLOR }}>
                        (Original: ₹{indent.totalIndentCost?.toLocaleString()})
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${indent.productCount} items`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <ProductStatusChip status={indent.status} />
                  </TableCell>
                  <TableCell>
                    {type === 'approval' && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => setReviewDialog({ open: true, indent })}
                        startIcon={<FontAwesomeIcon icon={faEye} />}
                        sx={{ bgcolor: ACCENT_COLOR, mr: 1 }}
                      >
                        Review
                      </Button>
                    )}
                    {type === 'payment' && (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' }, mr: 1 }}
                          onClick={() => setPaymentDialog({ open: true, indent })}
                          startIcon={<FontAwesomeIcon icon={faCreditCard} />}
                        >
                          Complete Payment
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="warning"
                          onClick={() => setSendBackDialog({ open: true, indent })}
                          sx={{ ml: 1 }}
                        >
                          Send Back
                        </Button>
                      </>
                    )}
                  </TableCell>

                  <TableCell>
                    <InspectionFileViewer fileName={indent.inspectionReportPath} />
                  </TableCell>

                    <TableCell>
                      <GfrFileViewer fileName={indent.gfrReportPath} />
                    </TableCell>
                 
                  <TableCell>
                   {console.log(indent.fileName, indent.fileUrl)}

                    {/* Show attachment only if status is RESUBMITTED_TO_FINANCE and fileName/fileUrl exists */}
                    {indent.status === 'RESUBMITTED_TO_FINANCE' && (indent.fileName || indent.fileUrl) ? (

                      
                      <FileViewerButtonResubmit fileName={indent.fileName}  />
                    ) : (
                      <Typography variant="caption" color="textSecondary">-</Typography>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={8} sx={{ p: 0 }}>
                    <Collapse in={expandedRows[indent.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 3, backgroundColor: '#fafafa' }}>
                        <Typography variant="h6" sx={{ mb: 2, color: ACCENT_COLOR, fontWeight: 600 }}>
                          Product Details
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 600 }}>Item Name</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Specifications</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Per Piece Cost</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Total Cost</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Attachment</TableCell>

                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {indent.items?.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.itemName}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.specificationModelDetails || 'N/A'}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>₹{item.perPieceCost}</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>₹{item.totalCost}</TableCell>
                                <TableCell>
                                  <ProductStatusChip status={item.productStatus} />
                                </TableCell>
                                <TableCell>
                                  <FileViewerButton indent={item} />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        width: "100vw",
        height: "100vh",
        background: GRADIENT_BG,
        py: 0,
        px: 0,
        m: 0,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{
          mb: 3,
          color: ACCENT_COLOR,
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: 1.2,
          width: "100%",
          maxWidth: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          background: "rgba(255,255,255,0.7)",
          borderRadius: 2,
          boxShadow: 2,
          py: 1.5,
          mx: "auto",
        }}
      >
        <FontAwesomeIcon icon={faCoins} style={{ marginRight: 12, fontSize: 32, color: ACCENT_COLOR }} />
        Finance Dashboard
      </Typography>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          maxWidth: "100vw",
          maxHeight: "100vh",
          bgcolor: CARD_BG,
          p: isMobile ? 1.2 : 3,
          borderRadius: 0,
          boxShadow: 0,
          overflowY: "auto",
          color: TEXT_COLOR,
          minHeight: 400,
          mx: 0,
          mt: 0,
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(e, val) => setTabIndex(val)}
          sx={{ mb: 2 }}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Review Products" sx={{ color: SUBTEXT_COLOR, fontWeight: 600 }} />
          <Tab label="Complete Payments" sx={{ color: SUBTEXT_COLOR, fontWeight: 600 }} />
          <Tab label="Track Indents" sx={{ color: SUBTEXT_COLOR, fontWeight: 600 }} />
        </Tabs>

        <TabPanel value={tabIndex} index={0}>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : approvalIndents.length === 0 ? (
            <Typography sx={{ color: SUBTEXT_COLOR, textAlign: "center", py: 4 }}>
              No pending approvals
            </Typography>
          ) : (
            <IndentTable indents={approvalIndents} type="approval" />
          )}
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          {paymentIndents.length === 0 ? (
            <Typography sx={{ color: SUBTEXT_COLOR, textAlign: "center", py: 4 }}>
              No pending payments
            </Typography>
          ) : (
            <IndentTable indents={paymentIndents} type="payment" />
          )}
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : trackingIndents.length === 0 ? (
            <Typography sx={{ color: SUBTEXT_COLOR, textAlign: "center", py: 4 }}>
              No indents found
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell />
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Indent ID</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Project</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Purpose</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Total Cost</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trackingIndents.map((indent, idx) => {
                    const isOpen = expandedRows[indent.id];
                    const steps = getTrackingSteps(indent);
                    return (
                      <React.Fragment key={indent.id}>
                        <TableRow hover>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => toggleRowExpansion(indent.id)}
                            >
                              {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{indent.indentNumber}</TableCell>
                          <TableCell>{indent.projectName}</TableCell>
                          <TableCell>{indent.purpose}</TableCell>
                          <TableCell>{indent.department}</TableCell>
                          <TableCell>₹{indent.totalIndentCost}</TableCell>
                          <TableCell>
                            <ProductStatusChip status={indent.status} />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={7} sx={{ p: 0 }}>
                            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                              <Box sx={{ p: 3, backgroundColor: '#f8fafc' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: ACCENT_COLOR, mb: 1 }}>
                                  Tracking Steps
                                </Typography>
                                {steps.length > 0 ? (
                                  <TrackingStepsTable steps={steps} />
                                ) : (
                                  <Typography sx={{ color: '#888', fontStyle: 'italic', py: 2 }}>
                                    No tracking steps available for this indent.
                                  </Typography>
                                )}
                                {/* Product/Item Table */}
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: ACCENT_COLOR, mt: 3, mb: 1 }}>
                                  All Products/Items
                                </Typography>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ fontWeight: 700 }}>Item Name</TableCell>
                                      <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                                      <TableCell sx={{ fontWeight: 700 }}>Specs</TableCell>
                                      <TableCell sx={{ fontWeight: 700 }}>Qty</TableCell>
                                      <TableCell sx={{ fontWeight: 700 }}>Unit Cost</TableCell>
                                      <TableCell sx={{ fontWeight: 700 }}>Total Cost</TableCell>
                                      <TableCell sx={{ fontWeight: 700 }}>Attachment</TableCell>
                                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                      <TableCell sx={{ fontWeight: 700 }}>FLA Remarks</TableCell>
                                      <TableCell sx={{ fontWeight: 700 }}>SLA Remarks</TableCell>
                                      <TableCell sx={{ fontWeight: 700 }}>Store Remarks</TableCell>
                                      <TableCell sx={{ fontWeight: 700 }}>Finance Remarks</TableCell>
                                      <TableCell sx={{ fontWeight: 700 }}>Purchase Remarks</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {(indent.items || indent.products || []).map((item) => (
                                      <TableRow key={item.id}>
                                        <TableCell>{item.itemName}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell>{item.specificationModelDetails || 'N/A'}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>₹{item.perPieceCost}</TableCell>
                                        <TableCell>₹{item.totalCost}</TableCell>
                                        <TableCell>
                                          <FileViewerButton indent={item} />  
                                        </TableCell>
                                        <TableCell>{item.productStatus?.replace(/_/g, ' ')}</TableCell>
                                        <TableCell>{item.flaRemarks}</TableCell>
                                        <TableCell>{item.slaRemarks}</TableCell>
                                        <TableCell>{item.storeRemarks}</TableCell>
                                        <TableCell>{item.financeRemarks}</TableCell>
                                        <TableCell>{item.purchaseRemarks}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
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
        </TabPanel>
      </Box>

      <ProductReviewDialog
        open={reviewDialog.open}
        onClose={() => setReviewDialog({ open: false, indent: null })}
        indent={reviewDialog.indent}
        onSubmit={handleReviewProducts}
      />

      <PaymentCompletionDialog
        open={paymentDialog.open}
        onClose={() => setPaymentDialog({ open: false, indent: null })}
        indent={paymentDialog.indent}
        onSubmit={handlePaymentComplete}
      />

      <SendBackDialog
        open={sendBackDialog.open}
        onClose={() => setSendBackDialog({ open: false, indent: null })}
        onSubmit={handleSendBack}
        indent={sendBackDialog.indent}
      />
    </Box>
  );
};

export default FinanceView;













