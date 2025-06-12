import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
} from "@mui/material";
import axios from "../api/api";
import FileViewerButton from "./FileViewerButton";

const COLORS = {
  background: "linear-gradient(135deg, #FAFAFA 0%, #EDEDED 100%)",
  cardBg: "rgba(255, 255, 255, 0.95)",
  textPrimary: "#444950",
  textSecondary: "#8E99A3",
  accent: "#0d47a1",
  error: "#D32F2F",
  success: "#2E7D32",
};

const FLADashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [indents, setIndents] = useState([]);
  const [slaList, setSlaList] = useState([]);
  const [selectedSla, setSelectedSla] = useState({});
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [allIndents, setAllIndents] = useState([]);
  const [openTrackingIdx, setOpenTrackingIdx] = useState(null);

  // New state for product-level management
  const [selectedProducts, setSelectedProducts] = useState({});
  const [productRemarks, setProductRemarks] = useState({});
  const [expandedIndent, setExpandedIndent] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [dialog, setDialog] = useState({
    open: false,
    type: "",
    indentId: null,
  });

  useEffect(() => {
    fetchIndents();
    fetchSLAs();
  }, []);

  useEffect(() => {
    if (tab === 1) fetchAllIndents();
  }, [tab]);

  const fetchIndents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/indent/fla/pending");
      setIndents(res.data);

      // Initialize product selection state
      const productSelection = {};
      const productRemarksInit = {};
      res.data.forEach((indent) => {
        indent.items?.forEach((item) => {
          productSelection[item.id] = undefined; // <-- Fix: use undefined, not false
          productRemarksInit[item.id] = "";
        });
      });
      setSelectedProducts(productSelection);
      setProductRemarks(productRemarksInit);
    } catch {
      showSnackbar("Failed to load indents.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchSLAs = async () => {
    try {
      const res = await axios.get("/auth/users/by-role?role=SLA");
      setSlaList(res.data);
    } catch {
      showSnackbar("Failed to load SLA list.", "error");
    }
  };

  const fetchAllIndents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/track/fla/all");
      setAllIndents(res.data);
    } catch {
      showSnackbar("Failed to load all indents.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const openDialog = (type, indentId) => {
    setDialog({ open: true, type, indentId });
  };

  const closeDialog = () => {
    setDialog({ open: false, type: "", indentId: null });
  };

  const handleProductSelection = (productId, checked) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: checked,
    }));
    // Do not clear or set remark here; user will write remark after selecting Approve/Reject
  };

  const handleProductRemarkChange = (productId, remark) => {
    setProductRemarks((prev) => ({
      ...prev,
      [productId]: remark,
    }));
  };

  const getSelectedProductsForIndent = (indent) => {
    if (!indent.items) return { approved: [], rejected: [] };

    const approved = [];
    const rejected = [];

    indent.items.forEach((item) => {
      if (selectedProducts[item.id]) {
        approved.push(item.id);
      } else if (productRemarks[item.id]?.trim()) {
        rejected.push(item.id);
      }
    });

    return { approved, rejected };
  };

  const getProductRemarksForIndent = (indent) => {
    if (!indent.items) return {};

    const remarks = {};
    indent.items.forEach((item) => {
      if (productRemarks[item.id]?.trim()) {
        remarks[item.id.toString()] = productRemarks[item.id];
      }
    });

    return remarks;
  };

  const handleReviewProducts = async (indentId) => {
    const indent = indents.find((i) => i.id === indentId);
    if (!indent) return;

    const { approved, rejected } = getSelectedProductsForIndent(indent);
    const remarks = getProductRemarksForIndent(indent);

    if (approved.length === 0 && rejected.length === 0) {
      showSnackbar(
        "Please select products to approve or add remarks to reject.",
        "error"
      );
      closeDialog();
      return;
    }

    // Only require SLA selection if there are approved products
    if (approved.length > 0 && !selectedSla[indentId]) {
      showSnackbar("Please select an SLA for approved products.", "error");
      closeDialog();
      return;
    }
    // If only rejected, do not send slaId at all
    const payload = {
      indentId,
      approvedProductIds: approved,
      rejectedProductIds: rejected,
      remarks: remarks,
    };
    if (approved.length > 0) {
      payload.slaId = selectedSla[indentId];
    }
    try {
      setLoading(true);
      await axios.post("/indent/fla/review-products", payload);
      showSnackbar("Products reviewed successfully.", "success");
      fetchIndents();
    } catch (err) {
      // Show backend error if available
      if (err.response && err.response.status === 401) {
        showSnackbar(
          "Unauthorized: Please log in again or check your permissions.",
          "error"
        );
      } else {
        showSnackbar("Failed to review products.", "error");
      }
    } finally {
      setLoading(false);
      closeDialog();
    }
  };

  const calculateIndentTotals = (indent) => {
    if (!indent.items) return { totalItems: 0, totalCost: 0 };

    const totalItems = indent.items.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    const totalCost = indent.items.reduce(
      (sum, item) => sum + (item.perPieceCost || 0) * (item.quantity || 0),
      0
    );

    return { totalItems, totalCost };
  };

  const getStatusColor = (status) => {
    const statusColors = {
      PENDING: "#ff9800",
      APPROVED_BY_FLA: "#4caf50",
      REJECTED_BY_FLA: "#f44336",
      PENDING_SLA: "#2196f3",
    };
    return statusColors[status] || "#757575";
  };

  // Replace TrackingSteps with a table-based, modern, clear UI
  const TrackingStepsTable = ({ indent }) => {
    // Indent Info Table
    const infoRows = [
      { label: "Indent Number", value: indent.indentNumber },
      { label: "Project Name", value: indent.project.projectName },
      { label: "Department", value: indent.department },
      { label: "Purpose", value: indent.purpose },
      { label: "Description", value: indent.description },
      {
        label: "Total Cost",
        value: `₹${
          indent.totalIndentCost?.toLocaleString() ||
          indent.totalCost?.toLocaleString()
        }`,
      },
      { label: "Status", value: indent.status?.replace(/_/g, " ") },
      {
        label: "Requested By",
        value: indent.requestedBy?.fullName || indent.requestedBy?.username,
      },
      {
        label: "Created At",
        value: indent.createdAt
          ? new Date(indent.createdAt).toLocaleString()
          : "",
      },
    ];

    // Tracking Steps
    const steps = [];
    if (
      indent.remarkByFla &&
      (indent.flaApprovalDate || indent.status === "REJECTED_BY_FLA")
    ) {
      steps.push({
        role: "FLA",
        remark: indent.remarkByFla,
        date: indent.flaApprovalDate || indent.updatedAt,
        status: indent.status === "REJECTED_BY_FLA" ? "Rejected" : "Approved",
      });
    }
    if (
      indent.remarkBySla &&
      (indent.slaApprovalDate || indent.status === "REJECTED_BY_SLA")
    ) {
      steps.push({
        role: "SLA",
        remark: indent.remarkBySla,
        date: indent.slaApprovalDate || indent.updatedAt,
        status: indent.status === "REJECTED_BY_SLA" ? "Rejected" : "Approved",
      });
    }
    if (
      indent.remarkByStore &&
      (indent.storeApprovalDate || indent.status === "REJECTED_BY_STORE")
    ) {
      steps.push({
        role: "Store",
        remark: indent.remarkByStore,
        date: indent.storeApprovalDate || indent.updatedAt,
        status: indent.status === "REJECTED_BY_STORE" ? "Rejected" : "Approved",
      });
    }
    if (
      indent.remarkByFinance &&
      (indent.financeApprovalDate || indent.status === "REJECTED_BY_FINANCE")
    ) {
      steps.push({
        role: "Finance",
        remark: indent.remarkByFinance,
        date: indent.financeApprovalDate || indent.updatedAt,
        status:
          indent.status === "REJECTED_BY_FINANCE" ? "Rejected" : "Approved",
      });
    }
    if (
      indent.remarkByPurchase &&
      (indent.purchaseCompletionDate ||
        indent.status === "REJECTED_BY_PURCHASE")
    ) {
      steps.push({
        role: "Purchase",
        remark: indent.remarkByPurchase,
        date: indent.purchaseCompletionDate || indent.updatedAt,
        status:
          indent.status === "REJECTED_BY_PURCHASE" ? "Rejected" : "Completed",
      });
    }
    if (indent.remarkByUser && indent.userInspectionDate) {
      steps.push({
        role: "User",
        remark: indent.remarkByUser,
        date: indent.userInspectionDate,
        status: "Inspection Done",
      });
    }
    if (indent.gfrNote && indent.gfrCreatedAt) {
      steps.push({
        role: "Purchase",
        remark: indent.gfrNote,
        date: indent.gfrCreatedAt,
        status: "GFR Submitted",
      });
    }
    if (
      indent.paymentNote &&
      (indent.paymentCreatedAt || indent.status === "PAYMENT_REJECTED")
    ) {
      steps.push({
        role: "Finance",
        remark: indent.paymentNote,
        date: indent.paymentCreatedAt,
        status:
          indent.status === "PAYMENT_REJECTED" ? "Rejected" : "Payment Done",
      });
    }
    steps.sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
      <Box>
        {/* Indent Info Table */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
        >
          Indent Information
        </Typography>
        <TableContainer
          component={Paper}
          sx={{ mb: 2, borderRadius: 2, background: "#f8fafd" }}
        >
          <Table size="small">
            <TableBody>
              {infoRows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontWeight: 600, width: 180 }}>
                    {row.label}
                  </TableCell>
                  <TableCell>{row.value || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Indent Items Table */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
        >
          Indent Items
        </Typography>
        <TableContainer
          component={Paper}
          sx={{ mb: 2, borderRadius: 2, background: "#f8fafd" }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Item Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Qty</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Per Piece Cost</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total Cost</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Attachment</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Remark</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(indent.items || []).map((item, idx) => (
                <TableRow key={item.id || idx}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.itemName || item.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.description}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₹{item.perPieceCost?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>
                      ₹
                      {(
                        (item.perPieceCost || 0) *
                        (item.quantity || 0)
                      ).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={(() => {
                        const statusMap = {
                          PENDING: "Pending at FLA",
                          APPROVED_BY_FLA: "Pending at SLA",
                          REJECTED_BY_FLA: "Rejected by FLA",
                          APPROVED_BY_SLA: "Pending at Store",
                          REJECTED_BY_SLA: "Rejected by SLA",
                          APPROVED_BY_STORE: "Pending at Finance",
                          REJECTED_BY_STORE: "Rejected by Store",
                          APPROVED_BY_FINANCE: "Pending at Purchase",
                          REJECTED_BY_FINANCE: "Rejected by Finance",
                          COMPLETED: "Completed",
                          REJECTED_BY_PURCHASE: "Rejected by Purchase",
                          PAYMENT_REJECTED: "Payment Rejected",
                        };
                        return (
                          statusMap[
                            item.productStatus || "PENDING"
                          ] ||
                          item.productStatus ||
                          "PENDING"
                        );
                      })()}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(
                          item.productStatus || "PENDING"
                        ),
                        color: "white",
                        fontSize: "0.75rem",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {/* Attachment column: show FileViewerButton if file exists, else 'No file' */}
                    {item.attachmentPath || item.fileName ? (
                      <FileViewerButton fileName={item.fileName} attachmentPath={item.attachmentPath} />
                    ) : (
                      <Typography variant="caption" color="text.secondary">No file</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedProducts[item.id] === true}
                            onChange={() => handleProductSelection(item.id, true)}
                            color="primary"
                            size="small"
                          />
                        }
                        label="Approve"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedProducts[item.id] === false}
                            onChange={() => handleProductSelection(item.id, false)}
                            color="error"
                            size="small"
                          />
                        }
                        label="Reject"
                      />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      placeholder={
                        selectedProducts[item.id] === false
                          ? "Enter rejection remark..."
                          : "Add remark (optional)"
                      }
                      value={productRemarks[item.id] || ""}
                      onChange={(e) =>
                        handleProductRemarkChange(
                          item.id,
                          e.target.value
                        )
                      }
                      multiline
                      rows={2}
                      sx={{ minWidth: 150 }}
                      // Only disable if neither approve nor reject is selected
                      disabled={
                        selectedProducts[item.id] !== true &&
                        selectedProducts[item.id] !== false
                          ? true
                          : false
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Tracking Steps Table */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
        >
          Tracking History
        </Typography>
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, background: "#f8fafd", my: 2 }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                  Role
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                  Remark
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                  Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {steps.length > 0 ? (
                steps.map((step, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ fontWeight: 600 }}>{step.role}</TableCell>
                    <TableCell>{step.remark}</TableCell>
                    <TableCell
                      sx={{
                        color:
                          step.status === "Rejected"
                            ? "#d32f2f"
                            : step.status === "Review Added"
                            ? "#1976d2"
                            : "#388e3c",
                        fontWeight: 600,
                      }}
                    >
                      {step.status}
                    </TableCell>
                    <TableCell sx={{ color: "#666" }}>
                      {step.date ? new Date(step.date).toLocaleString() : ""}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    sx={{ textAlign: "center", color: "text.secondary" }}
                  >
                    No tracking steps available for this indent.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // const TrackingSteps = ({ indent }) => {
  //   const [isExpanded, setIsExpanded] = useState(false);
  //   const trackingSteps = [];

  //   if (indent.remarkByFla && (indent.flaApprovalDate || indent.status === "REJECTED_BY_FLA")) {
  //     trackingSteps.push({
  //       role: "FLA",
  //       remark: indent.remarkByFla,
  //       date: indent.flaApprovalDate || indent.updatedAt,
  //       status: indent.status === "REJECTED_BY_FLA" ? "Rejected" : "Approved",
  //     });
  //   }
  //   if (indent.remarkBySla && (indent.slaApprovalDate || indent.status === "REJECTED_BY_SLA")) {
  //     trackingSteps.push({
  //       role: "SLA",
  //       remark: indent.remarkBySla,
  //       date: indent.slaApprovalDate || indent.updatedAt,
  //       status: indent.status === "REJECTED_BY_SLA" ? "Rejected" : "Approved",
  //     });
  //   }
  //   if (indent.remarkByStore && (indent.storeApprovalDate || indent.status === "REJECTED_BY_STORE")) {
  //     trackingSteps.push({
  //       role: "Store",
  //       remark: indent.remarkByStore,
  //       date: indent.storeApprovalDate || indent.updatedAt,
  //       status: indent.status === "REJECTED_BY_STORE" ? "Rejected" : "Approved",
  //     });
  //   }
  //   if (indent.remarkByFinance && (indent.financeApprovalDate || indent.status === "REJECTED_BY_FINANCE")) {
  //     trackingSteps.push({
  //       role: "Finance",
  //       remark: indent.remarkByFinance,
  //       date: indent.financeApprovalDate || indent.updatedAt,
  //       status: indent.status === "REJECTED_BY_FINANCE" ? "Rejected" : "Approved",
  //     });
  //   }
  //   if (indent.remarkByPurchase && (indent.purchaseCompletionDate || indent.status === "REJECTED_BY_PURCHASE")) {
  //     trackingSteps.push({
  //       role: "Purchase",
  //       remark: indent.remarkByPurchase,
  //       date: indent.purchaseCompletionDate || indent.updatedAt,
  //       status: indent.status === "REJECTED_BY_PURCHASE" ? "Rejected" : "Completed",
  //     });
  //   }
  //   if (indent.remarkByUser && indent.userInspectionDate) {
  //     trackingSteps.push({
  //       role: "User",
  //       remark: indent.remarkByUser,
  //       date: indent.userInspectionDate,
  //       status: "Inspection Done",
  //     });
  //   }
  //   if (indent.gfrNote && indent.gfrCreatedAt) {
  //     trackingSteps.push({
  //       role: "Purchase",
  //       remark: indent.gfrNote,
  //       date: indent.gfrCreatedAt,
  //       status: "GFR Submitted",
  //     });
  //   }
  //   if (indent.paymentNote && (indent.paymentCreatedAt || indent.status === "PAYMENT_REJECTED")) {
  //     trackingSteps.push({
  //       role: "Finance",
  //       remark: indent.paymentNote,
  //       date: indent.paymentCreatedAt,
  //       status: indent.status === "PAYMENT_REJECTED" ? "Rejected" : "Payment Done",
  //     });
  //   }

  //   const hasTrackingSteps = trackingSteps.length > 0;
  //   return (
  //     <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 1 }}>
  //       <Box
  //         onClick={() => setIsExpanded(!isExpanded)}
  //         sx={{
  //           display: 'flex',
  //           alignItems: 'center',
  //           gap: 1,
  //           cursor: 'pointer',
  //           '&:hover': { backgroundColor: '#f5f5f5' },
  //           p: 1,
  //           borderRadius: 1,
  //         }}
  //       >
  //         <Typography variant="subtitle1">
  //           Tracking Steps ({trackingSteps.length})
  //         </Typography>
  //         <Icon sx={{ fontSize: 16 }}>{isExpanded ? 'expand_less' : 'expand_more'}</Icon>
  //       </Box>
  //       {isExpanded && (
  //         <Box sx={{ mt: 1 }}>
  //           {hasTrackingSteps ? (
  //             trackingSteps
  //               .sort((a, b) => new Date(a.date) - new Date(b.date))
  //               .map((step, index) => (
  //                 <Box
  //                   key={index}
  //                   sx={{
  //                     ml: 2,
  //                     my: 1,
  //                     borderLeft: "3px solid #1976d2",
  //                     pl: 2,
  //                     position: "relative",
  //                   }}
  //                 >
  //                   <Box
  //                     sx={{
  //                       position: "absolute",
  //                       left: "-7px",
  //                       top: "5px",
  //                       width: "10px",
  //                       height: "10px",
  //                       borderRadius: "50%",
  //                       backgroundColor:
  //                         step.status === "Rejected" ? "red" : "#1976d2",
  //                     }}
  //                   />
  //                   <Typography>
  //                     <strong>{step.role}</strong>{" "}
  //                     <span
  //                       style={{
  //                         fontStyle: "italic",
  //                         color: step.status === "Rejected" ? "red" : "inherit",
  //                       }}
  //                     >
  //                       ({step.status})
  //                     </span>
  //                   </Typography>
  //                   <Typography sx={{ mb: 0.5 }}>{step.remark}</Typography>
  //                   <Typography variant="caption" color="text.secondary">
  //                     {new Date(step.date).toLocaleString()}
  //                   </Typography>
  //                 </Box>
  //               ))
  //           ) : (
  //             <Typography sx={{ p: 1 }}>
  //               No tracking info available yet.
  //             </Typography>
  //           )}
  //         </Box>
  //       )}
  //     </Box>
  //   );
  // };

  // Helper to download file with auth token
  const downloadFile = async (fileName) => {
    try {
      const response = await axios.get(
        `/indent/file/${encodeURIComponent(fileName)}`,
        {
          responseType: "blob",
        }
      );
      const blob = response.data;
      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL);
    } catch (error) {
      console.error(error);
      alert("Failed to download file. Please ensure you are logged in.");
    }
  };

  return (
    <Box
      sx={{
        background: COLORS.background,
        minHeight: "100vh",
        p: isMobile ? 2 : 6,
        fontFamily: "'Roboto', sans-serif",
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        ml: "-50vw",
        mr: "-50vw",
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{
          mb: 5,
          color: COLORS.accent,
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: 1.2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          textShadow: "0 2px 12px #e3eafc",
        }}
      >
        <FontAwesomeIcon icon={faUser} /> FLA Dashboard
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <CircularProgress color="primary" size={48} thickness={5} />
        </Box>
      )}

      <Box sx={{ mb: 4 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab label="Review Indents" />
          <Tab label="Track Indents" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Box>
          {!loading && indents.length === 0 && (
            <Typography
              variant="body1"
              sx={{
                color: COLORS.textSecondary,
                textAlign: "center",
                mt: 8,
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              No pending indents for review.
            </Typography>
          )}

          {indents.map((indent) => {
            const { totalItems, totalCost } = calculateIndentTotals(indent);
            const hasSelectedItems = indent.items?.some(
              (item) => selectedProducts[item.id]
            );
            const hasItemsWithRemarks = indent.items?.some((item) =>
              productRemarks[item.id]?.trim()
            );

            return (
              <Card
                key={indent.id}
                elevation={6}
                sx={{
                  mb: 4,
                  backgroundColor: COLORS.cardBg,
                  borderRadius: 4,
                  boxShadow: "0 3px 18px rgba(26, 35, 126, 0.13)",
                  border: "1.5px solid #e3eafc",
                  maxWidth: "100%",
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    sx={{ mb: 3 }}
                  >
                    <Grid item xs={12} md={8}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor: COLORS.accent,
                            color: "white",
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: 20,
                          }}
                        >
                          {/* Use project.projectName if available, else fallback */}
                          {indent.project?.projectName?.[0]?.toUpperCase() || indent.projectName?.[0]?.toUpperCase() || "?"}
                        </Box>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ color: COLORS.accent, fontWeight: 700 }}
                          >
                            {/* Show project.projectName and indent.projectName if both exist */}
                            {indent.project?.projectName ? `${indent.project.projectName} (${indent.projectName})` : indent.projectName}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: COLORS.textSecondary }}
                          >
                            Indent ID: {indent.id} | Department:{" "}
                            {indent.department}
                          </Typography>
                          {/* Show Project Head if available */}
                          {indent.projectHead && (
                            <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
                              Project Head: {indent.projectHead}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                        <Chip
                          label={`${totalItems} Items`}
                          color="primary"
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                        />
                        <Chip
                          label={`₹${totalCost.toLocaleString()}`}
                          color="success"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Items Table with Approve/Reject in same row */}
                  <TableContainer
                    component={Paper}
                    sx={{ mb: 3, borderRadius: 2 }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Item Name
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Description
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Quantity
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Unit Cost
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Total Cost
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Status
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Attachment
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Action
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Remark
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(indent.items || []).map((item) => (
                          <TableRow key={item.id} hover>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.itemName || item.name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  maxWidth: 200,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item.description}
                              </Typography>
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>₹{item.perPieceCost?.toLocaleString()}</TableCell>
                            <TableCell>
                              <Typography sx={{ fontWeight: 600 }}>
                                ₹
                                {(
                                  (item.perPieceCost || 0) *
                                  (item.quantity || 0)
                                ).toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={(() => {
                                  const statusMap = {
                                    PENDING: "Pending at FLA",
                                    APPROVED_BY_FLA: "Pending at SLA",
                                    REJECTED_BY_FLA: "Rejected by FLA",
                                    APPROVED_BY_SLA: "Pending at Store",
                                    REJECTED_BY_SLA: "Rejected by SLA",
                                    APPROVED_BY_STORE: "Pending at Finance",
                                    REJECTED_BY_STORE: "Rejected by Store",
                                    APPROVED_BY_FINANCE: "Pending at Purchase",
                                    REJECTED_BY_FINANCE: "Rejected by Finance",
                                    COMPLETED: "Completed",
                                    REJECTED_BY_PURCHASE: "Rejected by Purchase",
                                    PAYMENT_REJECTED: "Payment Rejected",
                                  };
                                  return (
                                    statusMap[
                                      item.productStatus || "PENDING"
                                    ] ||
                                    item.productStatus ||
                                    "PENDING"
                                  );
                                })()}
                                size="small"
                                sx={{
                                  backgroundColor: getStatusColor(
                                    item.productStatus || "PENDING"
                                  ),
                                  color: "white",
                                  fontSize: "0.75rem",
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {/* Attachment column: show FileViewerButton if file exists, else 'No file' */}
                              {item.attachmentPath || item.fileName ? (
                                <FileViewerButton fileName={item.fileName} attachmentPath={item.attachmentPath} />
                              ) : (
                                <Typography variant="caption" color="text.secondary">No file</Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        selectedProducts[item.id] === true
                                      }
                                      onChange={() =>
                                        handleProductSelection(item.id, true)
                                      }
                                      color="primary"
                                      size="small"
                                    />
                                  }
                                  label="Approve"
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        selectedProducts[item.id] === false
                                      }
                                      onChange={() =>
                                        handleProductSelection(item.id, false)
                                      }
                                      color="error"
                                      size="small"
                                    />
                                  }
                                  label="Reject"
                                />
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                placeholder={
                                  selectedProducts[item.id] === false
                                    ? "Enter rejection remark..."
                                    : "Add remark (optional)"
                                }
                                value={productRemarks[item.id] || ""}
                                onChange={(e) =>
                                  handleProductRemarkChange(
                                    item.id,
                                    e.target.value
                                  )
                                }
                                multiline
                                rows={2}
                                sx={{ minWidth: 150 }}
                                // Only disable if neither approve nor reject is selected
                                disabled={
                                  selectedProducts[item.id] !== true &&
                                  selectedProducts[item.id] !== false
                                    ? true
                                    : false
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* SLA Selection */}
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      select
                      label="Assign to SLA"
                      value={selectedSla[indent.id] || ""}
                      onChange={(e) =>
                        setSelectedSla({
                          ...selectedSla,
                          [indent.id]: e.target.value,
                        })
                      }
                      sx={{ minWidth: 250 }}
                      size="small"
                    >
                      <MenuItem value="">-- Select SLA --</MenuItem>
                      {slaList.map((sla) => (
                        <MenuItem key={sla.id} value={sla.id}>
                          {sla.username}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  {/* Action Buttons */}
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={
                        (!hasSelectedItems && !hasItemsWithRemarks) || loading
                      }
                      onClick={() => openDialog("review", indent.id)}
                      sx={{ fontWeight: 600 }}
                    >
                      Review Products
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {tab === 1 && (
        <Box
          sx={{
            width: "100vw",
            position: "relative",
            left: "50%",
            right: "50%",
            ml: "-50vw",
            mr: "-50vw",
            px: { xs: 0, md: 4 },
            py: 2,
            background: "linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)",
          }}
        >
          {allIndents.length === 0 ? (
            <Typography>No indents found.</Typography>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 24px 0 rgba(25, 118, 210, 0.10)",
                maxWidth: "98vw",
                mx: "auto",
                mt: 2,
              }}
            >
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                      Project Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                      Department
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                      Items Count
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                      Total Cost
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                      Created
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allIndents.map((indent, idx) => {
                    const { totalItems, totalCost } =
                      calculateIndentTotals(indent);
                    // User-friendly status mapping
                    const statusMap = {
                      PENDING: "Pending at FLA",
                      APPROVED_BY_FLA: "Pending at SLA",
                      REJECTED_BY_FLA: "Rejected by FLA",
                      APPROVED_BY_SLA: "Pending at Store",
                      REJECTED_BY_SLA: "Rejected by SLA",
                      APPROVED_BY_STORE: "Pending at Finance",
                      REJECTED_BY_STORE: "Rejected by Store",
                      APPROVED_BY_FINANCE: "Pending at Purchase",
                      REJECTED_BY_FINANCE: "Rejected by Finance",
                      COMPLETED: "Completed",
                      REJECTED_BY_PURCHASE: "Rejected by Purchase",
                      PAYMENT_REJECTED: "Payment Rejected",
                    };
                    const userStatus =
                      statusMap[indent.status] || indent.status;
                    return (
                      <React.Fragment key={indent.id}>
                        <TableRow
                          hover
                          sx={{
                            cursor: "pointer",
                            transition: "background 0.2s",
                            "&:hover": { background: "#e3f2fd" },
                          }}
                          onClick={() =>
                            setOpenTrackingIdx(
                              idx === openTrackingIdx ? null : idx
                            )
                          }
                        >
                          <TableCell>{indent.project.projectName}</TableCell>
                          <TableCell>{indent.department}</TableCell>
                          <TableCell>{totalItems}</TableCell>
                          <TableCell>₹{totalCost.toLocaleString()}</TableCell>
                          <TableCell>
                            <span
                              style={{ color: COLORS.accent, fontWeight: 600 }}
                            >
                              {userStatus}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(indent.createdAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                        {openTrackingIdx === idx && (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              sx={{ background: "#f3e5f5", p: 2 }}
                            >
                              <TrackingStepsTable indent={indent} />
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={dialog.open} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Review Products</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have selected items to approve or reject, and chosen an SLA for
            forwarding. Please confirm if the selected SLA is correct and all
            item decisions are accurate. If everything looks good, would you
            like to Approved the indent now?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleReviewProducts(dialog.indentId)}
            color="primary"
            autoFocus
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Confirm Review"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FLADashboard;
