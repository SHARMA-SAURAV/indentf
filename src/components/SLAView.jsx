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
  Tabs,
  Tab,
  Chip,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import FileViewerButton from "./FileViewerButton";

// Theme Constants
const CARD_BG = "rgba(255, 255, 255, 0.95)";
const TEXT_COLOR = "#444950";
const ACCENT_COLOR = "#0d47a1";
const COLORS = {
  background: "linear-gradient(135deg, #FAFAFA 0%, #EDEDED 100%)",
  cardBg: "rgba(255, 255, 255, 0.95)",
  textPrimary: "#444950",
  textSecondary: "#8E99A3",
  accent: "#0d47a1",
  error: "#D32F2F",
  success: "#2E7D32",
};
const ProductReviewTable = ({ indent, onReviewProducts, loading }) => {
  // Only allow review for items with productStatus === 'APPROVED_BY_FLA' or 'PENDING_SLA'
  const reviewableStatuses = ['APPROVED_BY_FLA', 'PENDING_SLA', 'PENDING'];
  const [selectedProducts, setSelectedProducts] = useState({
    approved: [],
    rejected: []
  });
  const [remarks, setRemarks] = useState({});
  const handleProductSelection = (productId, action) => {
    setSelectedProducts(prev => {
      const newState = { ...prev };
      
      // Remove from both arrays first
      newState.approved = newState.approved.filter(id => id !== productId);
      newState.rejected = newState.rejected.filter(id => id !== productId);
      
      // Add to appropriate array
      if (action === 'approve') {
        newState.approved.push(productId);
      } else if (action === 'reject') {
        newState.rejected.push(productId);
      }
      
      return newState;
    });
  };

  const handleRemarkChange = (productId, remark) => {
    setRemarks(prev => ({ ...prev, [productId]: remark }));
  };

  const handleSubmitReview = () => {
    const reviewData = {
      indentId: indent.id,
      approvedProductIds: selectedProducts.approved,
      rejectedProductIds: selectedProducts.rejected,
      remarks: remarks
    };
    
    onReviewProducts(reviewData);
  };

  const getProductStatus = (productId) => {
    if (selectedProducts.approved.includes(productId)) return 'approve';
    if (selectedProducts.rejected.includes(productId)) return 'reject';
    return 'pending';
  };

  const isReviewComplete = () => {
    const totalSelected = selectedProducts.approved.length + selectedProducts.rejected.length;
    // Only allow review for items with status APPROVED_BY_FLA, PENDING_SLA, or PENDING
    const eligibleProducts = indent.items?.filter(item =>
      reviewableStatuses.includes(item.productStatus)
    ) || [];
    // All eligible products must be selected (approved or rejected)
    if (totalSelected !== eligibleProducts.length || totalSelected === 0) return false;
    // All selected products must have a non-empty remark
    for (const item of eligibleProducts) {
      if ((selectedProducts.approved.includes(item.id) || selectedProducts.rejected.includes(item.id)) && !remarks[item.id]?.trim()) {
        return false;
      }
    }
    return true;
  };

  return (
    <Card sx={{ mt: 3, p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <Typography variant="h6" sx={{ mb: 3, color: ACCENT_COLOR, fontWeight: 700 }}>
        Review Products for: {indent.project.projectName}
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 700 }}>Item Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Per Piece Cost</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Total Cost</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Attachment</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Remarks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {indent.items?.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>₹{item.perPieceCost}</TableCell>
                <TableCell>₹{item.totalCost}</TableCell>
                {/* Show 'Pending at SLA' if productStatus is APPROVED_BY_FLA, else show actual status */}
                <TableCell>
                  <Chip
                    label={
                      reviewableStatuses.includes(item.productStatus)
                        ? 'Pending at SLA'
                        : item.productStatus
                    }
                    color={
                      reviewableStatuses.includes(item.productStatus)
                        ? 'warning'
                        : item.productStatus?.includes('APPROVED')
                        ? 'success'
                        : item.productStatus?.includes('REJECTED')
                        ? 'error'
                        : 'default'
                    }
                    size="small"
                  />
                </TableCell>

                

                <TableCell>
                  {/* Show approve/reject only if status is APPROVED_BY_FLA */}
                  {reviewableStatuses.includes(item.productStatus) ? (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={getProductStatus(item.id) === 'approve'}
                            onChange={() => handleProductSelection(item.id, 'approve')}
                            color="success"
                          />
                        }
                        label="Approve"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={getProductStatus(item.id) === 'reject'}
                            onChange={() => handleProductSelection(item.id, 'reject')}
                            color="error"
                          />
                        }
                        label="Reject"
                      />
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Not available for review
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                    {/* <FileViewerButton
                      fileName={item.attachmentName || item.fileName}/>*/}

                       <FileViewerButton fileName={item.fileName} attachmentPath={item.attachmentPath} />
                </TableCell>
                <TableCell>
                  {/* Show remark input only if status is APPROVED_BY_FLA */}
                  {reviewableStatuses.includes(item.productStatus) && (
                    <TextField
                      size="small"
                      placeholder="Add remark..."
                      value={remarks[item.id] || ''}
                      onChange={(e) => handleRemarkChange(item.id, e.target.value)}
                      multiline
                      rows={2}
                      sx={{ minWidth: 200 }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="body2" color="textSecondary">
            Approved: {selectedProducts.approved.length} | 
            Rejected: {selectedProducts.rejected.length}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleSubmitReview}
          disabled={!isReviewComplete() || loading}
          sx={{
            background: 'linear-gradient(90deg, #0d47a1 60%, #42a5f5 100%)',
            fontWeight: 700,
            px: 4,
            py: 1.5,
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Submit Review'}
        </Button>
      </Box>
    </Card>
  );
};

// Utility to get file name from any common property
const getIndentFileName = (indent) => {
  return (
    indent.fileName ||
    indent.attachmentPath ||
    indent.attachmentName ||
    indent.file ||
    null
  );
};

// File download handler using shared axios instance
// const handleDownloadFile = async (fileName) => {
//   if (!fileName) return;
//   try {
//     const response = await axios.get(`/indent/file/${encodeURIComponent(fileName)}`, {
//       responseType: 'blob',
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//     });
//     // Create a blob link to download
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', fileName);
//     document.body.appendChild(link);
//     link.click();
//     link.parentNode.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   } catch (err) {
//     alert('Failed to download file. Please try again.');
//   }
// };

const IndentProjectCard = ({ indent, onReviewProducts, actionLoading }) => {
  const [expanded, setExpanded] = useState(false);
  const fileName = getIndentFileName(indent);

  return (
    <Accordion 
      expanded={expanded} 
      onChange={() => setExpanded(!expanded)}
      sx={{
        mb: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderRadius: 2,
        '&:before': { display: 'none' }
      }}
    >
      <AccordionSummary
        expandIcon={<KeyboardArrowDown />}
        sx={{
          bgcolor: '#f8f9fa',
          borderRadius: expanded ? '8px 8px 0 0' : '8px',
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
            justifyContent: 'space-between'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Box sx={{
            bgcolor: ACCENT_COLOR,
            color: '#fff',
            width: 50,
            height: 50,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 20,
            mr: 3,
          }}>
            {indent.project.projectName?.[0]?.toUpperCase() || '?'}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: ACCENT_COLOR }}>
              {indent.project.projectName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Department: {indent.department} | Items: {indent.items?.length || 0} | 
              Status: {indent.status}
            </Typography>
            {indent.projectHead && (
                                        <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
                                          Project Head: {indent.projectHead}
                                        </Typography>
                                      )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
            <Chip 
              label={`ID: ${indent.id}`} 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label={indent.status} 
              color={indent.status === 'PENDING_SLA' ? 'warning' : 'default'}
              size="small"
            />
            {/* {fileName && (
              <Button
                variant="outlined"
                size="small"
                sx={{ ml: 2, fontWeight: 600 }}
                onClick={e => {
                  e.stopPropagation();
                  handleDownloadFile(fileName);
                }}
              >
                View Attached File
              </Button>
            )} */}

            <FileViewerButton indent={indent} />
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <ProductReviewTable
          indent={indent}
          onReviewProducts={onReviewProducts}
          loading={actionLoading}
        />
      </AccordionDetails>
    </Accordion>
  );
};

const SLAView = () => {
  const [indents, setIndents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
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
      console.error("Error fetching indents", err);
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

  const handleReviewProducts = useCallback(async (reviewData) => {
    setActionLoading(true);
    try {
      await axios.post("/indent/sla/review-products", reviewData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Products reviewed successfully!");
      fetchIndents(); // Refresh the list
    } catch (err) {
      console.error("Review failed", err);
      alert("Failed to review products. Please try again.");
    } finally {
      setActionLoading(false);
    }
  }, [fetchIndents]);
  

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e3eafc 100%)',
        minHeight: '100vh',
        py: { xs: 3, md: 4 },
        px: { xs: 2, md: 4 },
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{
          mb: 4,
          color: ACCENT_COLOR,
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: 1.2,
        }}
      >
        <FontAwesomeIcon icon={faUser} style={{ marginRight: '12px' }} />
        SLA Dashboard
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={tab} 
          onChange={(_, v) => setTab(v)} 
          textColor="primary" 
          indicatorColor="primary" 
          sx={{ mb: 2 }}
        >
          <Tab label="Pending Reviews" />
          <Tab label="Track All Indents" />
        </Tabs>
      </Box>

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
          {tab === 0 && (
            <Box>
              {indents.length === 0 ? (
                <Typography variant="h6" align="center" mt={4} color="textSecondary">
                  No pending indents for SLA review.
                </Typography>
              ) : (
                <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                  {indents.map((indent) => (
                    <IndentProjectCard
                      key={indent.id}
                      indent={indent}
                      onReviewProducts={handleReviewProducts}
                      actionLoading={actionLoading}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}

          {tab === 1 && (
            <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
              {allIndents.length === 0 ? (
                <Typography variant="h6" align="center" mt={4} color="textSecondary">
                  No indents found.
                </Typography>
              ) : (
                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 4px 24px 0 rgba(25, 118, 210, 0.10)',
                    maxWidth: '100%',
                    mx: 'auto', 
                    mt: 2 
                  }}
                >
                  <Table sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Project Name</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Project Head</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Department</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Total Items</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Created</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allIndents.map((indent, idx) => (
                        <React.Fragment key={indent.id}>
                          <TableRow
                            hover
                            sx={{ 
                              cursor: 'pointer', 
                              transition: 'background 0.2s', 
                              '&:hover': { background: '#e3f2fd' } 
                            }}
                            onClick={() => setOpenTrackingIdx(idx === openTrackingIdx ? null : idx)}
                          >
                            <TableCell sx={{ fontWeight: 600 }}>{indent.project.projectName}</TableCell>
                            <TableCell>{indent.projectHead || 'N/A'}</TableCell>
                            <TableCell>{indent.department}</TableCell>
                            <TableCell>{indent.items?.length || 0}</TableCell>
                            <TableCell>
                              <Chip
                                label={indent.status}
                                color={
                                  indent.status.includes('APPROVED') ? 'success' :
                                  indent.status.includes('REJECTED') ? 'error' :
                                  indent.status.includes('PENDING') ? 'warning' : 'default'
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{new Date(indent.createdAt).toLocaleDateString()}</TableCell>
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
                              <TableCell colSpan={6} sx={{ background: '#f8f9fa', p: 3 }}>
                                <TrackingDetailsSLA indent={indent} />
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
    </Box>
  );
};

// Enhanced tracking component showing detailed product information
const TrackingDetailsSLA = ({ indent }) => {
  const [activeTab, setActiveTab] = useState(0);
  const fileName = getIndentFileName(indent);

  return (
    <Box>
      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2 }}>
        <Tab label="Items Details" />
        <Tab label="Tracking History" />
      </Tabs>
      {/* {fileName && (
        <Button
          variant="outlined"
          size="small"
          sx={{ mb: 2, fontWeight: 600 }}
          onClick={() => handleDownloadFile(fileName)}
        >
          View Attached File
        </Button>
      )} */}
      <FileViewerButton indent={indent} />
      {activeTab === 0 && (
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f0f0f0' }}>
                <TableCell sx={{ fontWeight: 600 }}>Item Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Qty</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Unit Cost</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Attachment</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>SLA Remark</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {indent.items?.map((item) => (
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
                      color={
                        item.productStatus?.includes('APPROVED') ? 'success' :
                        item.productStatus?.includes('REJECTED') ? 'error' : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <FileViewerButton fileName={item.fileName} attachmentPath={item.attachmentPath} />
                  </TableCell>
                  <TableCell>{item.slaRemarks || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 1 && (
        <TrackingStepsSLA indent={indent} />
      )}
    </Box>
  );
};

// Existing TrackingStepsSLA component (keeping as is)
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
    <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ fontWeight: 600, color: '#333', fontSize: 16 }}>Tracking History</Typography>
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
        <Box sx={{ pl: 2, pr: 1, pb: 1, borderTop: '1px solid #ddd', pt: 2 }}>
          {trackingSteps.map((step, idx) => (
            <Box key={idx} sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
              <Typography sx={{ fontWeight: 600, color: '#555', fontSize: 14 }}>
                <b>{step.role}:</b> {step.remark}
              </Typography>
              <Typography sx={{ color: '#777', fontSize: 12, mt: 0.5 }}>
                {new Date(step.date).toLocaleString()} - 
                <span style={{ 
                  color: step.status.includes('Rejected') ? '#d32f2f' : '#388e3c', 
                  fontWeight: 500,
                  marginLeft: '4px'
                }}>
                  {step.status}
                </span>
              </Typography>
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