import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCheck, faTimes, faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Chip,
  Checkbox,
  FormControlLabel,
  Grid,
  Divider
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp, ShoppingCart, Assignment } from "@mui/icons-material";
import axios from "../api/api";
import FileViewerButton from "./FileViewerButton";

const GRADIENT_BG = "linear-gradient(135deg, #FAFAFA 0%, #EDEDED 100%)";
const ACCENT_COLOR = "#0d47a1";
const SUCCESS_COLOR = "#4caf50";
const ERROR_COLOR = "#f44336";

const ProductRow = ({ product, indentId, onApprovalChange, onRemarkChange, approvedProducts, rejectedProducts, remarks }) => {
  const isApproved = approvedProducts[indentId]?.includes(product.id);
  const isRejected = rejectedProducts[indentId]?.includes(product.id);
  const remarkValue = remarks[indentId]?.[product.id] || "";

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED_BY_SLA': return SUCCESS_COLOR;
      case 'REJECTED_BY_SLA': return ERROR_COLOR;
      default: return '#ff9800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'APPROVED_BY_SLA': return 'SLA Approved';
      case 'REJECTED_BY_SLA': return 'SLA Rejected';
      default: return status;
    }
  };

  return (
    <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' } }}>
      <TableCell sx={{ minWidth: 180 }}>
        <Typography variant="subtitle2" fontWeight={600}>{product.itemName}</Typography>
        <Typography variant="caption" color="text.secondary">{product.description}</Typography>
      </TableCell>
    
      <TableCell align="center" sx={{ fontWeight: 600 }}>{product.quantity}</TableCell>
      <TableCell align="right" sx={{ fontWeight: 600 }}>₹{product.perPieceCost?.toLocaleString()}</TableCell>
      <TableCell align="right" sx={{ fontWeight: 700, color: ACCENT_COLOR }}>₹{product.totalCost?.toLocaleString()}</TableCell>
      <TableCell>
        <Chip 
          label={getStatusText(product.productStatus)} 
          size="small" 
          sx={{ 
            backgroundColor: getStatusColor(product.productStatus),
            color: 'white',
            fontWeight: 600
          }}
        />
      </TableCell>
      <TableCell sx={{ minWidth: 200 }}>
        <Typography variant="caption" color="text.secondary">
          SLA: {product.slaRemarks || 'No remarks'}
        </Typography>
      </TableCell>
      <TableCell sx={{ minWidth: 200 }}>
          {/* <FileViewerButton fileName={product.attachmentPath}/> */}
            <FileViewerButton fileName={product.fileName} attachmentPath={product.attachmentPath} />
      </TableCell>
      <TableCell sx={{ minWidth: 250 }}>
        {product.productStatus === 'APPROVED_BY_SLA' && (
          <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isApproved}
                    onChange={(e) => onApprovalChange(indentId, product.id, 'approve', e.target.checked)}
                    color="success"
                    size="small"
                  />
                }
                label="Approve"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isRejected}
                    onChange={(e) => onApprovalChange(indentId, product.id, 'reject', e.target.checked)}
                    color="error"
                    size="small"
                  />
                }
                label="Reject"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
            </Box>
            <TextField
              size="small"
              placeholder="Store remarks..."
              value={remarkValue}
              onChange={(e) => onRemarkChange(indentId, product.id, e.target.value)}
              multiline
              rows={2}
              sx={{ mt: 1 }}
            />
          </Box>
        )}
        {product.productStatus === 'REJECTED_BY_SLA' && (
          <Chip label="Already Rejected by SLA" color="error" size="small" />
        )}
      </TableCell>
    </TableRow>
  );
};

const IndentDetailsTable = ({ 
  indent, 
  expanded, 
  onToggleExpand, 
  onApprovalChange, 
  onRemarkChange, 
  approvedProducts, 
  rejectedProducts, 
  remarks,
  onSubmitReview,
  loading
}) => {
  const eligibleProducts = indent.products?.filter(p => p.productStatus === 'APPROVED_BY_SLA') || [];
  const hasEligibleProducts = eligibleProducts.length > 0;
  const approvedCount = approvedProducts[indent.id]?.length || 0;
  const rejectedCount = rejectedProducts[indent.id]?.length || 0;
  const totalEligible = eligibleProducts.length;

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => onToggleExpand(indent.id)}
          >
            {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Box>
            <Typography variant="subtitle2" fontWeight={600} color={ACCENT_COLOR}>
              {indent.indentNumber}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {indent.id}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2" fontWeight={600}>
            {indent.project.projectName}
          </Typography>
          {/* <Typography variant="caption" color="text.secondary">
            {indent.purpose}
          </Typography> */}
        </TableCell>
        <TableCell>
            {indent.projectHead}
        </TableCell>  
        <TableCell>{indent.department || 'N/A'}</TableCell>
        <TableCell>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {indent.requestedBy?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {indent.requestedBy?.designation}
            </Typography>
          </Box>
        </TableCell>
        <TableCell align="center">
          <Chip 
            label={`${indent.products?.length || 0} items`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        </TableCell>
        <TableCell align="right">
          <Typography variant="h6" fontWeight={700} color={ACCENT_COLOR}>
            ₹{indent.totalIndentCost?.toLocaleString()}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip 
            label={indent.status.replace('PENDING_', '')} 
            color="warning" 
            size="small"
            sx={{ fontWeight: 600 }}
          />
          {/* {console.log(indent.items.fileName, indent.items.attachmentPath)} */}
        </TableCell>
        
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" gutterBottom component="div" sx={{ color: ACCENT_COLOR, fontWeight: 700 }}>
                  Product Details
                </Typography>
                {hasEligibleProducts && (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress: {approvedCount + rejectedCount}/{totalEligible} reviewed
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onSubmitReview(indent.id)}
                      disabled={loading || (approvedCount + rejectedCount === 0)}
                      startIcon={loading ? <CircularProgress size={16} /> : <Assignment />}
                      sx={{ minWidth: 140 }}
                    >
                      {loading ? 'Processing...' : 'Submit Review'}
                    </Button>
                  </Box>
                )}
              </Box>
              
              <TableContainer component={Paper} elevation={1}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Item Name</TableCell>
                      {/* <TableCell sx={{ fontWeight: 700 }}>Category</TableCell> */}
                      <TableCell sx={{ fontWeight: 700 }} align="center">Qty</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Unit Price</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Total Cost</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>SLA Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>SLA Remarks</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Attachment</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Store Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {indent.products?.map((product) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        indentId={indent.id}
                        onApprovalChange={onApprovalChange}
                        onRemarkChange={onRemarkChange}
                        approvedProducts={approvedProducts}
                        rejectedProducts={rejectedProducts}
                        remarks={remarks}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {hasEligibleProducts && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Review Summary for Indent {indent.indentNumber}:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Typography variant="body2">
                      <strong>Approved:</strong> {approvedCount} items
                    </Typography>
                    <Typography variant="body2">
                      <strong>Rejected:</strong> {rejectedCount} items
                    </Typography>
                    <Typography variant="body2">
                      <strong>Pending:</strong> {totalEligible - approvedCount - rejectedCount} items
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const StoreView = () => {
  const [indents, setIndents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [approvedProducts, setApprovedProducts] = useState({});
  const [rejectedProducts, setRejectedProducts] = useState({});
  const [remarks, setRemarks] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [trackIndents, setTrackIndents] = useState([]);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState(null);
  const [returnedIndents, setReturnedIndents] = useState([]);
  const [returnedFileMap, setReturnedFileMap] = useState({});
  const [returnedRemarkMap, setReturnedRemarkMap] = useState({});
  const [returnedLoading, setReturnedLoading] = useState({});

  const fetchIndents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/indent/store/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIndents(res.data);
    } catch (err) {
      console.error("Error fetching store indents", err);
      alert("Failed to load indents, please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrackIndents = useCallback(async () => {
    setTrackLoading(true);
    setTrackError(null);
    try {
      const res = await axios.get("/track/store/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTrackIndents(res.data);
    } catch (err) {
      setTrackError("Failed to load tracked indents. Please try again.");
    } finally {
      setTrackLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndents();
  }, [fetchIndents]);

  useEffect(() => {
    if (tab === 1) fetchTrackIndents();
  }, [tab, fetchTrackIndents]);

  useEffect(() => {
    if (tab === 2) {
      axios.get("/returned-to-role").then(res => setReturnedIndents(res.data));
    }
  }, [tab]);

  const handleToggleExpand = useCallback((indentId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(indentId)) {
        newSet.delete(indentId);
      } else {
        newSet.add(indentId);
      }
      return newSet;
    });
  }, []);

  const handleApprovalChange = useCallback((indentId, productId, action, checked) => {
    if (action === 'approve') {
      setApprovedProducts(prev => {
        const current = prev[indentId] || [];
        if (checked) {
          // Remove from rejected if exists
          setRejectedProducts(prevRej => ({
            ...prevRej,
            [indentId]: (prevRej[indentId] || []).filter(id => id !== productId)
          }));
          return {
            ...prev,
            [indentId]: [...current.filter(id => id !== productId), productId]
          };
        } else {
          return {
            ...prev,
            [indentId]: current.filter(id => id !== productId)
          };
        }
      });
    } else if (action === 'reject') {
      setRejectedProducts(prev => {
        const current = prev[indentId] || [];
        if (checked) {
          // Remove from approved if exists
          setApprovedProducts(prevApp => ({
            ...prevApp,
            [indentId]: (prevApp[indentId] || []).filter(id => id !== productId)
          }));
          return {
            ...prev,
            [indentId]: [...current.filter(id => id !== productId), productId]
          };
        } else {
          return {
            ...prev,
            [indentId]: current.filter(id => id !== productId)
          };
        }
      });
    }
  }, []);

  const handleRemarkChange = useCallback((indentId, productId, value) => {
    setRemarks(prev => ({
      ...prev,
      [indentId]: {
        ...prev[indentId],
        [productId]: value
      }
    }));
  }, []);

  const handleSubmitReview = useCallback(async (indentId) => {
    const approvedIds = approvedProducts[indentId] || [];
    const rejectedIds = rejectedProducts[indentId] || [];
    const indentRemarks = remarks[indentId] || {};

    console.log('Submit review called for indent:', indentId, 'Approved:', approvedIds, 'Rejected:', rejectedIds, 'Remarks:', indentRemarks);

    if (approvedIds.length === 0 && rejectedIds.length === 0) {
      alert("Please approve or reject at least one product before submitting.");
      return;
    }

    setActionLoading(true);
    try {
      await axios.post(
        "/indent/store/review-products",
        {
          indentId: indentId,
          approvedProductIds: approvedIds,
          rejectedProductIds: rejectedIds,
          remarks: indentRemarks
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Store review submitted successfully!");
      setApprovedProducts(prev => ({ ...prev, [indentId]: [] }));
      setRejectedProducts(prev => ({ ...prev, [indentId]: [] }));
      setRemarks(prev => ({ ...prev, [indentId]: {} }));
      fetchIndents();
    } catch (err) {
      console.error("Review submission failed", err);
      alert("Something went wrong during review submission.");
    } finally {
      setActionLoading(false);
    }
  }, [approvedProducts, rejectedProducts, remarks, fetchIndents]);

  const handleReturnedFileChange = (id, file) => {
    setReturnedFileMap(prev => ({ ...prev, [id]: file }));
  };
  const handleReturnedRemarkChange = (id, value) => {
    setReturnedRemarkMap(prev => ({ ...prev, [id]: value }));
  };
  const handleResubmitToFinance = async (indentId) => {
    const file = returnedFileMap[indentId];
    const remark = returnedRemarkMap[indentId];
    if (!remark) {
      alert("Please enter a remark before resubmitting.");
      return;
    }
    setReturnedLoading(prev => ({ ...prev, [indentId]: true }));
    try {
      const formData = new FormData();
      formData.append("remarks", remark);
      if (file) formData.append("attachment", file);
      await axios.put(`/resubmit/${indentId}`, formData);
      alert("Indent resubmitted to Finance successfully.");
      setReturnedIndents(prev => prev.filter(i => i.id !== indentId));
      setReturnedFileMap(prev => { const c = { ...prev }; delete c[indentId]; return c; });
      setReturnedRemarkMap(prev => { const c = { ...prev }; delete c[indentId]; return c; });
    } catch (err) {
      alert("Failed to resubmit indent.");
    } finally {
      setReturnedLoading(prev => ({ ...prev, [indentId]: false }));
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: GRADIENT_BG,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: ACCENT_COLOR }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e3eafc 100%)",
        py: { xs: 3, md: 4 },
        px: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: ACCENT_COLOR, 
            fontWeight: 700, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2 
          }}
        >
          <FontAwesomeIcon icon={faUser} /> Store Dashboard
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab label="Pending Indents" />
          <Tab label="Track Indents" />
          <Tab label="Returned Indents" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            {indents.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No pending indents for store review
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell />
                      <TableCell sx={{ fontWeight: 700 }}>Indent No.</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Project Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Project Head</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Requested By</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="center">Items</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Total Cost</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      {/* <TableCell sx={{ fontWeight: 700 }}>Attachment</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {indents.map((indent) => (
                      <IndentDetailsTable
                        key={indent.id}
                        indent={indent}
                        expanded={expandedRows.has(indent.id)}
                        onToggleExpand={handleToggleExpand}
                        onApprovalChange={handleApprovalChange}
                        onRemarkChange={handleRemarkChange}
                        approvedProducts={approvedProducts}
                        rejectedProducts={rejectedProducts}
                        remarks={remarks}
                        onSubmitReview={handleSubmitReview}
                        loading={actionLoading}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <Card sx={{ boxShadow: 6, borderRadius: 3, background: 'rgba(255,255,255,0.98)', border: `1.5px solid ${ACCENT_COLOR}22` }}>
          <CardContent sx={{ p: { xs: 1, md: 3 } }}>
            <Typography variant="h5" sx={{ mb: 1, color: ACCENT_COLOR, fontWeight: 600, letterSpacing: 1, textAlign: 'center', textShadow: '0 2px 8px #0d47a122' }}>
              <FontAwesomeIcon icon={faUser} style={{ marginRight: 10, color: ACCENT_COLOR }} />
              Tracking History
            </Typography>
            {trackLoading ? (
              <Box display="flex" justifyContent="center" mt={4}><CircularProgress sx={{ color: ACCENT_COLOR }} /></Box>
            ) : trackError ? (
              <Typography variant="h6" align="center" mt={4} color="error" fontWeight={600}>{trackError}</Typography>
            ) : trackIndents.length === 0 ? (
              <Typography sx={{ color: '#8E99A3', textAlign: 'center', fontWeight: 600, fontSize: 20, py: 4 }}>No indents found.</Typography>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2, background: 'rgba(250,250,255,0.98)' }}>
                <Table size="small" sx={{ minWidth: 1100 }}>
                  <TableHead>
                    <TableRow sx={{ background: `linear-gradient(90deg, #e3f2fd 60%, #fce4ec 100%)` }}>
                      <TableCell />
                      <TableCell sx={{ fontWeight: 600, color: ACCENT_COLOR, fontSize: 16 }}>Indent No.</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: ACCENT_COLOR, fontSize: 16 }}>Project</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: ACCENT_COLOR, fontSize: 16 }}>Purpose</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: ACCENT_COLOR, fontSize: 16 }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: ACCENT_COLOR, fontSize: 16 }}>Requested By</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: ACCENT_COLOR, fontSize: 16 }}>Total Cost</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: ACCENT_COLOR, fontSize: 16 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: ACCENT_COLOR, fontSize: 16 }}>Created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {trackIndents.map((indent) => {
                      const isExpanded = expandedRows.has(`track-${indent.id}`);
                      return (
                        <React.Fragment key={indent.id}>
                          <TableRow hover sx={{ background: isExpanded ? '#e3f2fd44' : 'transparent', transition: 'background 0.2s' }}>
                            <TableCell>
                              <IconButton size="small" onClick={() => handleToggleExpand(`track-${indent.id}`)} sx={{ color: ACCENT_COLOR, border: `1.5px solid ${ACCENT_COLOR}22`, background: isExpanded ? '#e3f2fd' : '#fff', borderRadius: 1 }}>
                                {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                              </IconButton>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>{indent.indentNumber || indent.id}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{indent.projectName}</TableCell>
                            <TableCell>{indent.purpose}</TableCell>
                            <TableCell>{indent.department}</TableCell>
                            <TableCell>{indent.requestedBy?.name || indent.requestedBy?.username}</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>₹{indent.totalIndentCost?.toLocaleString() || indent.totalCost?.toLocaleString()}</TableCell>
                            <TableCell sx={{ color: indent.status?.includes('REJECTED') ? '#d32f2f' : '#1976d2', fontWeight: 700 }}>{indent.status?.replace(/_/g, ' ')}</TableCell>
                            <TableCell sx={{ color: '#888' }}>{indent.createdAt ? new Date(indent.createdAt).toLocaleString() : ''}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={9} sx={{ background: '#f8fafd', p: 0 }}>
                              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <Box sx={{ p: { xs: 1, md: 3 }, background: '#f8fafd', borderRadius: 2, boxShadow: '0 2px 12px #0d47a111', mb: 2 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: ACCENT_COLOR, mb: 2, letterSpacing: 0.5 }}>
                                    Tracking Steps
                                  </Typography>
                                  <Table size="small" sx={{ mb: 2, background: '#fff', borderRadius: 2, boxShadow: '0 1px 6px #0d47a111' }}>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Remark</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {(() => {
                                        const steps = [];
                                        if (indent.remarkByFla && (indent.flaApprovalDate || indent.status === "REJECTED_BY_FLA")) {
                                          steps.push({ role: "FLA", remark: indent.remarkByFla, date: indent.flaApprovalDate || indent.updatedAt, status: indent.status === "REJECTED_BY_FLA" ? "Rejected" : "Approved" });
                                        }
                                        if (indent.remarkBySla && (indent.slaApprovalDate || indent.status === "REJECTED_BY_SLA")) {
                                          steps.push({ role: "SLA", remark: indent.remarkBySla, date: indent.slaApprovalDate || indent.updatedAt, status: indent.status === "REJECTED_BY_SLA" ? "Rejected" : "Approved" });
                                        }
                                        if (indent.remarkByStore && (indent.storeApprovalDate || indent.status === "REJECTED_BY_STORE")) {
                                          steps.push({ role: "Store", remark: indent.remarkByStore, date: indent.storeApprovalDate || indent.updatedAt, status: indent.status === "REJECTED_BY_STORE" ? "Rejected" : "Approved" });
                                        }
                                        if (indent.remarkByFinance && (indent.financeApprovalDate || indent.status === "REJECTED_BY_FINANCE")) {
                                          steps.push({ role: "Finance", remark: indent.remarkByFinance, date: indent.financeApprovalDate || indent.updatedAt, status: indent.status === "REJECTED_BY_FINANCE" ? "Rejected" : "Approved" });
                                        }
                                        if (indent.remarkByPurchase && (indent.purchaseCompletionDate || indent.status === "REJECTED_BY_PURCHASE")) {
                                          steps.push({ role: "Purchase", remark: indent.remarkByPurchase, date: indent.purchaseCompletionDate || indent.updatedAt, status: indent.status === "REJECTED_BY_PURCHASE" ? "Rejected" : "Completed" });
                                        }
                                        if (indent.remarkByUser && indent.userInspectionDate) {
                                          steps.push({ role: "User", remark: indent.remarkByUser, date: indent.userInspectionDate, status: "Inspection Done" });
                                        }
                                        if (indent.gfrNote && indent.gfrCreatedAt) {
                                          steps.push({ role: "Purchase", remark: indent.gfrNote, date: indent.gfrCreatedAt, status: "GFR Submitted" });
                                        }
                                        if (indent.paymentNote && (indent.paymentCreatedAt || indent.status === "PAYMENT_REJECTED")) {
                                          steps.push({ role: "Finance", remark: indent.paymentNote, date: indent.paymentCreatedAt, status: indent.status === "PAYMENT_REJECTED" ? "Rejected" : "Payment Done" });
                                        }
                                        steps.sort((a, b) => new Date(a.date) - new Date(b.date));
                                        return steps.length > 0 ? steps.map((step, sidx) => (
                                          <TableRow key={sidx}>
                                            <TableCell sx={{ fontWeight: 600 }}>{step.role}</TableCell>
                                            <TableCell>{step.remark}</TableCell>
                                            <TableCell sx={{ color: step.status === "Rejected" ? '#d32f2f' : '#388e3c', fontWeight: 600 }}>{step.status}</TableCell>
                                            <TableCell sx={{ color: '#666' }}>{step.date ? new Date(step.date).toLocaleString() : ''}</TableCell>
                                          </TableRow>
                                        )) : (
                                          <TableRow>
                                            <TableCell colSpan={4} sx={{ textAlign: 'center', color: '#888' }}>No tracking steps available for this indent.</TableCell>
                                          </TableRow>
                                        );
                                      })()}
                                    </TableBody>
                                  </Table>
                                  {/* Tracking of indent items */}
                                  {indent.products && indent.products.length > 0 && (
                                    <Box sx={{ mt: 3 }}>
                                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: ACCENT_COLOR, mb: 2, letterSpacing: 0.5 }}>
                                        Products/Items
                                      </Typography>
                                      <Table size="small" sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 6px #0d47a111' }}>
                                        <TableHead>
                                          <TableRow>
                                            <TableCell sx={{ fontWeight: 700 }}>Item Name</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Qty</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Unit Price</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Total Cost</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>FLA Remarks</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>SLA Remarks</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Store Remarks</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Finance Remarks</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Purchase Remarks</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {indent.products.map((item) => (
                                            <TableRow key={item.id} sx={{ background: item.productStatus?.includes('REJECTED') ? '#ffebee' : item.productStatus?.includes('APPROVED') ? '#e8f5e9' : 'inherit' }}>
                                              <TableCell>{item.itemName}</TableCell>
                                              <TableCell>{item.category}</TableCell>
                                              <TableCell>{item.quantity}</TableCell>
                                              <TableCell>₹{item.perPieceCost?.toLocaleString()}</TableCell>
                                              <TableCell>₹{item.totalCost?.toLocaleString()}</TableCell>
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
          </CardContent>
        </Card>
      )}

      {tab === 2 && (
        <Box>
          {returnedIndents.length === 0 ? (
            <Typography sx={{ color: '#8E99A3', textAlign: 'center', mt: 8, fontSize: 20, fontWeight: 500 }}>
              No returned indents.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Indent Number</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Project Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Finance Remarks</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date Returned</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Attach File</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Remark</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {returnedIndents.map(indent => (
                    <TableRow key={indent.id}>
                      <TableCell>{indent.indentNumber}</TableCell>
                      <TableCell>{indent.projectName}</TableCell>
                      <TableCell>{indent.financeRemarks}</TableCell>
                      <TableCell>{indent.financeReamrksDate ? new Date(indent.financeReamrksDate).toLocaleString() : '-'}</TableCell>
                      <TableCell>
                        <Button variant="outlined" component="label">
                          {returnedFileMap[indent.id] ? returnedFileMap[indent.id].name : "Attach File"}
                          <input type="file" hidden onChange={e => handleReturnedFileChange(indent.id, e.target.files[0])} />
                        </Button>
                        {returnedFileMap[indent.id] && (
                          <Button size="small" color="error" onClick={() => handleReturnedFileChange(indent.id, null)}>Remove</Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={returnedRemarkMap[indent.id] || ''}
                          onChange={e => handleReturnedRemarkChange(indent.id, e.target.value)}
                          placeholder="Enter remark"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={returnedLoading[indent.id]}
                          onClick={() => handleResubmitToFinance(indent.id)}
                        >
                          {returnedLoading[indent.id] ? <CircularProgress size={18} /> : 'Resubmit'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
    </Box>
  );
};

export default StoreView;







