import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Tabs,
  Tab,
  Icon,
  Snackbar,
  CircularProgress,
  Avatar,
  Collapse,
  Chip,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse as TableCollapse,
  IconButton
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import axios from "../api/api";
import InspectionItem from "./InspectionItem";

const UserIndentRequest = () => {
  const [tab, setTab] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [perPieceCost, setPerPieceCost] = useState("");
  const [description, setDescription] = useState("");
  const [flaList, setFlaList] = useState([]);
  const [selectedFla, setSelectedFla] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [pendingInspections, setPendingInspections] = useState([]);
  const [allIndents, setAllIndents] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [purpose, setPurpose] = useState(""); // for Purpose
  const [specification, setSpecification] = useState(""); // for Specification/Model Details
  const [department, setDepartment] = useState(""); // for Department
  // Replace selectedFla with these states
  const [recipientType, setRecipientType] = useState("FLA");
  const [recipientList, setRecipientList] = useState([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [openTrackingIdx, setOpenTrackingIdx] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setStatus({ type: "", message: "" });
  };

  // Add this useEffect to load FLAs/SLAs based on selection
  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const res = await axios.get(
          `/auth/users/by-role?role=${recipientType}`
        );
        setRecipientList(res.data);
      } catch (err) {
        // console.error(`Error fetching ${recipientType}s`, err);
      }
    };
    fetchRecipients();
  }, [recipientType]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "orange";
      case "approved":
      case "completed":
      case "inspected":
        return "green";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  useEffect(() => {
    const fetchFLAs = async () => {
      try {
        const res = await axios.get("/auth/users/by-role?role=FLA");
        setFlaList(res.data);
      } catch (err) {
        // console.error("Error fetching FLAs", err);
      }
    };
    fetchFLAs();
  }, []);

  useEffect(() => {
    const fetchPendingInspections = async () => {
      try {
        const res = await axios.get("/indent/user/pending-inspection");
        setPendingInspections(res.data);
      } catch (err) {
        // console.error("Error fetching pending inspections", err);
      }
    };
    if (tab === 1) fetchPendingInspections();
  }, [tab]);
  useEffect(() => {
    const cost = quantity && perPieceCost ? quantity * perPieceCost : 0;
    setTotalCost(cost);
  }, [quantity, perPieceCost]);

  useEffect(() => {
    const fetchIndents = async () => {
      try {
        const res = await axios.get("/indent/user/all");
        setAllIndents(res.data);
      } catch (err) {
        // console.error("Error fetching indents", err);
      }
    };
    if (tab === 2) fetchIndents();
  }, [tab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSnackbar({ open: true, message: 'Submitting indent...', severity: 'info' });
    try {
      const body = {
        projectName,
        itemName,
        quantity: parseInt(quantity),
        perPieceCost: parseInt(perPieceCost),
        description,
        recipientType, // Changed from flaId
        recipientId: selectedRecipientId, // Changed from flaId
        totalCost,
        purpose,
        specification,
        department,
      };
      await axios.post("/indent/create", body);
      setStatus({ type: "success", message: "Indent submitted successfully!" });
      setSnackbar({ open: true, message: 'Indent submitted successfully!', severity: 'success' });
      // Reset form
      setItemName("");
      setProjectName("");
      setQuantity("");
      setPerPieceCost("");
      setDescription("");
      setSelectedRecipientId(""); // Changed
      setRecipientType("FLA"); // Reset to default
      setPurpose("");
      setSpecification("");
      setDepartment("");
    } catch (err) {
      // console.error("Failed to submit indent", err);
      setStatus({ type: "error", message: "Failed to submit indent." });
      setSnackbar({ open: true, message: 'Failed to submit indent.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Collapsible TrackingSteps component
  // const TrackingSteps = ({ indent }) => {
  //   const [isExpanded, setIsExpanded] = React.useState(false);
  //   const trackingSteps = [];

  //   // FLA Step
  //   if (
  //     indent.remarkByFla &&
  //     (indent.flaApprovalDate || indent.status === "REJECTED_BY_FLA")
  //   ) {
  //     trackingSteps.push({
  //       role: "FLA",
  //       remark: indent.remarkByFla,
  //       date: indent.flaApprovalDate || indent.updatedAt,
  //       status:
  //         indent.status === "REJECTED_BY_FLA" ? "Rejected" : "Approved",
  //     });
  //   }

  //   // SLA Step
  //   if (
  //     indent.remarkBySla &&
  //     (indent.slaApprovalDate || indent.status === "REJECTED_BY_SLA")
  //   ) {
  //     trackingSteps.push({
  //       role: "SLA",
  //       remark: indent.remarkBySla,
  //       date: indent.slaApprovalDate || indent.updatedAt,
  //       status:
  //         indent.status === "REJECTED_BY_SLA" ? "Rejected" : "Approved",
  //     });
  //   }

  //   // Store Step
  //   if (
  //     indent.remarkByStore &&
  //     (indent.storeApprovalDate || indent.status === "REJECTED_BY_STORE")
  //   ) {
  //     trackingSteps.push({
  //       role: "Store",
  //       remark: indent.remarkByStore,
  //       date: indent.storeApprovalDate || indent.updatedAt,
  //       status:
  //         indent.status === "REJECTED_BY_STORE" ? "Rejected" : "Approved",
  //     });
  //   }

  //   // Finance Step
  //   if (
  //     indent.remarkByFinance &&
  //     (indent.financeApprovalDate || indent.status === "REJECTED_BY_FINANCE")
  //   ) {
  //     trackingSteps.push({
  //       role: "Finance",
  //       remark: indent.remarkByFinance,
  //       date: indent.financeApprovalDate || indent.updatedAt,
  //       status:
  //         indent.status === "REJECTED_BY_FINANCE" ? "Rejected" : "Approved",
  //     });
  //   }

  //   // Purchase Step
  //   if (
  //     indent.remarkByPurchase &&
  //     (indent.purchaseCompletionDate || indent.status === "REJECTED_BY_PURCHASE")
  //   ) {
  //     trackingSteps.push({
  //       role: "Purchase",
  //       remark: indent.remarkByPurchase,
  //       date: indent.purchaseCompletionDate || indent.updatedAt,
  //       status:
  //         indent.status === "REJECTED_BY_PURCHASE" ? "Rejected" : "Completed",
  //     });
  //   }

  //   // User Inspection
  //   if (indent.remarkByUser && indent.userInspectionDate) {
  //     trackingSteps.push({
  //       role: "User",
  //       remark: indent.remarkByUser,
  //       date: indent.userInspectionDate,
  //       status: "Inspection Done",
  //     });
  //   }

  //   // GFR Note
  //   if (indent.gfrNote && indent.gfrCreatedAt) {
  //     trackingSteps.push({
  //       role: "Purchase",
  //       remark: indent.gfrNote,
  //       date: indent.gfrCreatedAt,
  //       status: "GFR Submitted",
  //     });
  //   }

  //   // Payment Done
  //   if (
  //     indent.paymentNote &&
  //     (indent.paymentCreatedAt || indent.status === "PAYMENT_REJECTED")
  //   ) {
  //     trackingSteps.push({
  //       role: "Finance",
  //       remark: indent.paymentNote,
  //       date: indent.paymentCreatedAt,
  //       status:
  //         indent.status === "PAYMENT_REJECTED" ? "Rejected" : "Payment Done",
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
  //         <Icon sx={{ fontSize: 16 }}>{isExpanded ? '▼' : '▶'}</Icon>
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


  // Updated TrackingSteps component with Purchase Reviews
const TrackingSteps = ({ indent }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const trackingSteps = [];

  // FLA Step
  if (
    indent.remarkByFla &&
    (indent.flaApprovalDate || indent.status === "REJECTED_BY_FLA")
  ) {
    trackingSteps.push({
      role: "FLA",
      remark: indent.remarkByFla,
      date: indent.flaApprovalDate || indent.updatedAt,
      status: indent.status === "REJECTED_BY_FLA" ? "Rejected" : "Approved",
      type: "single"
    });
  }

  // SLA Step
  if (
    indent.remarkBySla &&
    (indent.slaApprovalDate || indent.status === "REJECTED_BY_SLA")
  ) {
    trackingSteps.push({
      role: "SLA",
      remark: indent.remarkBySla,
      date: indent.slaApprovalDate || indent.updatedAt,
      status: indent.status === "REJECTED_BY_SLA" ? "Rejected" : "Approved",
      type: "single"
    });
  }

  // Store Step
  if (
    indent.remarkByStore &&
    (indent.storeApprovalDate || indent.status === "REJECTED_BY_STORE")
  ) {
    trackingSteps.push({
      role: "Store",
      remark: indent.remarkByStore,
      date: indent.storeApprovalDate || indent.updatedAt,
      status: indent.status === "REJECTED_BY_STORE" ? "Rejected" : "Approved",
      type: "single"
    });
  }

  // Finance Step
  if (
    indent.remarkByFinance &&
    (indent.financeApprovalDate || indent.status === "REJECTED_BY_FINANCE")
  ) {
    trackingSteps.push({
      role: "Finance",
      remark: indent.remarkByFinance,
      date: indent.financeApprovalDate || indent.updatedAt,
      status: indent.status === "REJECTED_BY_FINANCE" ? "Rejected" : "Approved",
      type: "single"
    });
  }

  // Purchase Reviews - Multiple entries
  if (indent.purchaseReviews && indent.purchaseReviews.length > 0) {
    // Sort reviews by date (newest first)
    const sortedReviews = [...indent.purchaseReviews].sort(
      (a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)
    );
    
    sortedReviews.forEach((review, index) => {
      trackingSteps.push({
        role: "Purchase",
        remark: review.comment,
        date: review.reviewDate,
        status: "Review Added",
        reviewer: review.reviewer,
        type: "review",
        reviewIndex: index + 1
      });
    });
  }

  // Purchase Final Step (if completed or rejected)
  if (
    indent.remarkByPurchase &&
    (indent.purchaseCompletionDate || indent.status === "PURCHASE_REJECTED")
  ) {
    trackingSteps.push({
      role: "Purchase",
      remark: indent.remarkByPurchase,
      date: indent.purchaseCompletionDate || indent.updatedAt,
      status: indent.status === "PURCHASE_REJECTED" ? "Rejected" : "Completed",
      type: "single"
    });
  }

  // User Inspection
  if (indent.remarkByUser && indent.userInspectionDate) {
    trackingSteps.push({
      role: "User",
      remark: indent.remarkByUser,
      date: indent.userInspectionDate,
      status: "Inspection Done",
      type: "single"
    });
  }

  // GFR Note
  if (indent.gfrNote && indent.gfrCreatedAt) {
    trackingSteps.push({
      role: "Purchase",
      remark: indent.gfrNote,
      date: indent.gfrCreatedAt,
      status: "GFR Submitted",
      type: "single"
    });
  }

  // Payment Done
  if (
    indent.paymentNote &&
    (indent.paymentCreatedAt || indent.status === "PAYMENT_REJECTED")
  ) {
    trackingSteps.push({
      role: "Finance",
      remark: indent.paymentNote,
      date: indent.paymentCreatedAt,
      status: indent.status === "PAYMENT_REJECTED" ? "Rejected" : "Payment Done",
      type: "single"
    });
  }

  // Sort all steps by date
  trackingSteps.sort((a, b) => new Date(a.date) - new Date(b.date));

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
      case "Completed":
      case "Inspection Done":
      case "GFR Submitted":
      case "Payment Done":
        return "#4caf50";
      case "Rejected":
        return "#f44336";
      case "Review Added":
        return "#2196f3";
      default:
        return "#ff9800";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "FLA":
        return "👤";
      case "SLA":
        return "👥";
      case "Store":
        return "🏪";
      case "Finance":
        return "💰";
      case "Purchase":
        return "🛒";
      case "User":
        return "🔍";
      default:
        return "📝";
    }
  };

  return (
    <Box>
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{
          color: "primary.main",
          textTransform: "none",
          fontWeight: 600,
          mb: 1,
        }}
      >
        {isExpanded ? "Hide" : "Show"} Tracking Details ({trackingSteps.length} steps)
      </Button>
      
      <Collapse in={isExpanded}>
        <Box sx={{ pl: 2, borderLeft: "2px solid #e0e0e0" }}>
          {trackingSteps.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 1 }}>
              No tracking information available yet.
            </Typography>
          ) : (
            trackingSteps.map((step, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: 2,
                  pb: 2,
                  borderBottom: index < trackingSteps.length - 1 ? "1px solid #f0f0f0" : "none",
                }}
              >
                <Box
                  sx={{
                    minWidth: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: getStatusColor(step.status),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                    fontSize: "18px",
                  }}
                >
                  {getRoleIcon(step.role)}
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: "primary.main",
                      }}
                    >
                      {step.role}
                    </Typography>
                    
                    {step.type === "review" && (
                      <Chip
                        label={`Review #${step.reviewIndex}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    
                    <Chip
                      label={step.status}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(step.status),
                        color: "white",
                        fontWeight: 500,
                      }}
                    />
                    
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: "auto" }}
                    >
                      {new Date(step.date).toLocaleString()}
                    </Typography>
                  </Box>
                  
                  {step.reviewer && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5, fontStyle: "italic" }}
                    >
                      Reviewed by: {step.reviewer}
                    </Typography>
                  )}
                  
                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor: "#f8f9fa",
                      padding: 1,
                      borderRadius: 1,
                      border: "1px solid #e9ecef",
                    }}
                  >
                    {step.remark}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

// Tracking Steps Table Component
const TrackingStepsTable = ({ steps }) => (
  <Table size="small" sx={{ background: '#f8fafc', borderRadius: 2, mt: 1 }}>
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Role</TableCell>
        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Remark</TableCell>
        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Status</TableCell>
        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Date</TableCell>
        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Reviewer</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {steps.map((step, idx) => (
        <TableRow key={idx}>
          <TableCell sx={{ fontWeight: 600 }}>{step.role}</TableCell>
          <TableCell>{step.remark}</TableCell>
          <TableCell sx={{ color: step.status === 'Rejected' ? '#d32f2f' : step.status === 'Review Added' ? '#1976d2' : '#388e3c', fontWeight: 600 }}>{step.status}</TableCell>
          <TableCell sx={{ color: '#666' }}>{step.date ? new Date(step.date).toLocaleString() : ''}</TableCell>
          <TableCell>{step.reviewer || '-'}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

return (
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)', p: 2 }}>
      <Paper elevation={6} sx={{ borderRadius: 4, maxWidth: 700, width: '100%', p: { xs: 2, sm: 4 }, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <FontAwesomeIcon icon={faUser} />
            </Avatar>
            <Typography variant="h5" fontWeight={700} color="primary.main">
              User Panel
            </Typography>
          </Box>

          <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }} textColor="primary" indicatorColor="primary">
            <Tab label="Request Indent" />
            <Tab label="Pending Inspections" />
            <Tab label="Track Indents" />
          </Tabs>

          {status.message && (
            <Alert severity={status.type} sx={{ mb: 2 }}>
              {status.message}
            </Alert>
          )}

          {tab === 0 && (
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Item Name"
                    margin="normal"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    margin="normal"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Per Piece Cost"
                    margin="normal"
                    type="number"
                    value={perPieceCost}
                    onChange={(e) => setPerPieceCost(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Total Cost"
                    value={totalCost}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    margin="normal"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    margin="normal"
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Purpose"
                    margin="normal"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Specification/Model Details"
                    margin="normal"
                    value={specification}
                    onChange={(e) => setSpecification(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControl>
                      <RadioGroup
                        row
                        value={recipientType}
                        onChange={(e) => setRecipientType(e.target.value)}
                      >
                        <FormControlLabel value="FLA" control={<Radio />} label="FLA" />
                        <FormControlLabel value="SLA" control={<Radio />} label="SLA" />
                      </RadioGroup>
                    </FormControl>
                    <TextField
                      select
                      fullWidth
                      label={`Select ${recipientType}`}
                      value={selectedRecipientId}
                      onChange={(e) => setSelectedRecipientId(e.target.value)}
                      required
                      sx={{ minWidth: 180 }}
                    >
                      {recipientList.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.username}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ position: 'relative', mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      disabled={loading}
                      sx={{ fontWeight: 700, borderRadius: 2, py: 1.5, fontSize: 18, boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)' }}
                    >
                      {loading ? <CircularProgress size={26} color="inherit" /> : 'Submit Indent'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {tab === 1 && (
            <Box>
              {pendingInspections.length === 0 ? (
                <Typography>No pending items for inspection.</Typography>
              ) : (
                pendingInspections.map((indent) => (
                  <InspectionItem
                    key={indent.id}
                    indent={indent}
                    onConfirm={async (id, remark) => {
                      try {
                        await axios.post(`/indent/${id}/confirm-inspection`, { remark });
                        setStatus({ type: "success", message: "Product confirmed OK!" });
                        setSnackbar({ open: true, message: 'Product confirmed OK!', severity: 'success' });
                        setPendingInspections((prev) => prev.filter((i) => i.id !== id));
                      } catch (err) {
                        // console.error(err);
                        setStatus({ type: "error", message: "Failed to confirm inspection" });
                        setSnackbar({ open: true, message: 'Failed to confirm inspection', severity: 'error' });
                        throw err;
                      }
                    }}
                  />
                ))
              )}
            </Box>
          )}

          {tab === 2 && (
            <Box>
              {allIndents.length === 0 ? (
                <Typography>No indents found.</Typography>
              ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', background: 'transparent', mt: 2 }}>
                  <Table sx={{ minWidth: 900, background: 'transparent' }} aria-label="track indents table">
                    <TableHead>
                      <TableRow sx={{ background: 'linear-gradient(90deg, #e3f2fd 60%, #fce4ec 100%)' }}>
                        <TableCell />
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Indent ID</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Project</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Item</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Department</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Quantity</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Total Cost</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allIndents.map((indent, idx) => {
                        // Build tracking steps array (reuse logic from TrackingSteps)
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
                        if (indent.purchaseReviews && indent.purchaseReviews.length > 0) {
                          const sortedReviews = [...indent.purchaseReviews].sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));
                          sortedReviews.forEach((review, index) => {
                            trackingSteps.push({
                              role: "Purchase",
                              remark: review.comment,
                              date: review.reviewDate,
                              status: "Review Added",
                              reviewer: review.reviewer,
                            });
                          });
                        }
                        if (indent.remarkByPurchase && (indent.purchaseCompletionDate || indent.status === "PURCHASE_REJECTED")) {
                          trackingSteps.push({
                            role: "Purchase",
                            remark: indent.remarkByPurchase,
                            date: indent.purchaseCompletionDate || indent.updatedAt,
                            status: indent.status === "PURCHASE_REJECTED" ? "Rejected" : "Completed",
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
                        trackingSteps.sort((a, b) => new Date(a.date) - new Date(b.date));
                        const isOpen = openTrackingIdx === idx;
                        return (
                          <React.Fragment key={indent.id}>
                            <TableRow hover sx={{ background: isOpen ? '#f3e5f5' : 'transparent', transition: 'background 0.2s' }}>
                              <TableCell>
                                <IconButton size="small" onClick={() => setOpenTrackingIdx(isOpen ? null : idx)}>
                                  {isOpen ? <KeyboardArrowUp sx={{ color: 'primary.main' }} /> : <KeyboardArrowDown sx={{ color: 'primary.main' }} />}
                                </IconButton>
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>{indent.id}</TableCell>
                              <TableCell>{indent.projectName}</TableCell>
                              <TableCell>{indent.itemName}</TableCell>
                              <TableCell>{indent.department}</TableCell>
                              <TableCell>{indent.quantity}</TableCell>
                              <TableCell>₹{indent.totalCost}</TableCell>
                              <TableCell sx={{ color: indent.status.toLowerCase().includes('rejected') ? '#d32f2f' : '#1976d2', fontWeight: 700 }}>{indent.status}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell style={{ paddingBottom: 0, paddingTop: 0, background: '#f8fafc' }} colSpan={8}>
                                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                  <Box sx={{ pl: 1, pr: 1, pb: 2, pt: 2 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>Tracking Steps</Typography>
                                    {trackingSteps.length > 0 ? (
                                      <TrackingStepsTable steps={trackingSteps} />
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
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </CardContent>
      </Paper>
    </Box>
  );
};

export default UserIndentRequest;



































// import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser } from "@fortawesome/free-solid-svg-icons";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   MenuItem,
//   Alert,
//   Box,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   Tabs,
//   Tab,
//   Icon,
//   Snackbar,
//   CircularProgress,
//   Avatar,
//   Collapse,
//   Chip,
//   Paper,
//   Grid,
// } from "@mui/material";
// import axios from "../api/api";
// import InspectionItem from "./InspectionItem";

// const UserIndentRequest = () => {
//   const [tab, setTab] = useState(0);
//   const [projectName, setProjectName] = useState("");
//   const [itemName, setItemName] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [perPieceCost, setPerPieceCost] = useState("");
//   const [description, setDescription] = useState("");
//   const [flaList, setFlaList] = useState([]);
//   const [selectedFla, setSelectedFla] = useState("");
//   const [status, setStatus] = useState({ type: "", message: "" });
//   const [pendingInspections, setPendingInspections] = useState([]);
//   const [allIndents, setAllIndents] = useState([]);
//   const [totalCost, setTotalCost] = useState(0);
//   const [purpose, setPurpose] = useState(""); // for Purpose
//   const [specification, setSpecification] = useState(""); // for Specification/Model Details
//   const [department, setDepartment] = useState(""); // for Department
//   // Replace selectedFla with these states
//   const [recipientType, setRecipientType] = useState("FLA");
//   const [recipientList, setRecipientList] = useState([]);
//   const [selectedRecipientId, setSelectedRecipientId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

//   const handleTabChange = (event, newValue) => {
//     setTab(newValue);
//     setStatus({ type: "", message: "" });
//   };

//   // Add this useEffect to load FLAs/SLAs based on selection
//   useEffect(() => {
//     const fetchRecipients = async () => {
//       try {
//         const res = await axios.get(
//           `/auth/users/by-role?role=${recipientType}`
//         );
//         setRecipientList(res.data);
//       } catch (err) {
//         // console.error(`Error fetching ${recipientType}s`, err);
//       }
//     };
//     fetchRecipients();
//   }, [recipientType]);

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case "pending":
//         return "orange";
//       case "approved":
//       case "completed":
//       case "inspected":
//         return "green";
//       case "rejected":
//         return "red";
//       default:
//         return "gray";
//     }
//   };

//   useEffect(() => {
//     const fetchFLAs = async () => {
//       try {
//         const res = await axios.get("/auth/users/by-role?role=FLA");
//         setFlaList(res.data);
//       } catch (err) {
//         // console.error("Error fetching FLAs", err);
//       }
//     };
//     fetchFLAs();
//   }, []);

//   useEffect(() => {
//     const fetchPendingInspections = async () => {
//       try {
//         const res = await axios.get("/indent/user/pending-inspection");
//         setPendingInspections(res.data);
//       } catch (err) {
//         // console.error("Error fetching pending inspections", err);
//       }
//     };
//     if (tab === 1) fetchPendingInspections();
//   }, [tab]);
//   useEffect(() => {
//     const cost = quantity && perPieceCost ? quantity * perPieceCost : 0;
//     setTotalCost(cost);
//   }, [quantity, perPieceCost]);

//   useEffect(() => {
//     const fetchIndents = async () => {
//       try {
//         const res = await axios.get("/indent/user/all");
//         setAllIndents(res.data);
//       } catch (err) {
//         // console.error("Error fetching indents", err);
//       }
//     };
//     if (tab === 2) fetchIndents();
//   }, [tab]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setSnackbar({ open: true, message: 'Submitting indent...', severity: 'info' });
//     try {
//       const body = {
//         projectName,
//         itemName,
//         quantity: parseInt(quantity),
//         perPieceCost: parseInt(perPieceCost),
//         description,
//         recipientType, // Changed from flaId
//         recipientId: selectedRecipientId, // Changed from flaId
//         totalCost,
//         purpose,
//         specification,
//         department,
//       };
//       await axios.post("/indent/create", body);
//       setStatus({ type: "success", message: "Indent submitted successfully!" });
//       setSnackbar({ open: true, message: 'Indent submitted successfully!', severity: 'success' });
//       // Reset form
//       setItemName("");
//       setProjectName("");
//       setQuantity("");
//       setPerPieceCost("");
//       setDescription("");
//       setSelectedRecipientId(""); // Changed
//       setRecipientType("FLA"); // Reset to default
//       setPurpose("");
//       setSpecification("");
//       setDepartment("");
//     } catch (err) {
//       // console.error("Failed to submit indent", err);
//       setStatus({ type: "error", message: "Failed to submit indent." });
//       setSnackbar({ open: true, message: 'Failed to submit indent.', severity: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Collapsible TrackingSteps component
//   // const TrackingSteps = ({ indent }) => {
//   //   const [isExpanded, setIsExpanded] = React.useState(false);
//   //   const trackingSteps = [];

//   //   // FLA Step
//   //   if (
//   //     indent.remarkByFla &&
//   //     (indent.flaApprovalDate || indent.status === "REJECTED_BY_FLA")
//   //   ) {
//   //     trackingSteps.push({
//   //       role: "FLA",
//   //       remark: indent.remarkByFla,
//   //       date: indent.flaApprovalDate || indent.updatedAt,
//   //       status:
//   //         indent.status === "REJECTED_BY_FLA" ? "Rejected" : "Approved",
//   //     });
//   //   }

//   //   // SLA Step
//   //   if (
//   //     indent.remarkBySla &&
//   //     (indent.slaApprovalDate || indent.status === "REJECTED_BY_SLA")
//   //   ) {
//   //     trackingSteps.push({
//   //       role: "SLA",
//   //       remark: indent.remarkBySla,
//   //       date: indent.slaApprovalDate || indent.updatedAt,
//   //       status:
//   //         indent.status === "REJECTED_BY_SLA" ? "Rejected" : "Approved",
//   //     });
//   //   }

//   //   // Store Step
//   //   if (
//   //     indent.remarkByStore &&
//   //     (indent.storeApprovalDate || indent.status === "REJECTED_BY_STORE")
//   //   ) {
//   //     trackingSteps.push({
//   //       role: "Store",
//   //       remark: indent.remarkByStore,
//   //       date: indent.storeApprovalDate || indent.updatedAt,
//   //       status:
//   //         indent.status === "REJECTED_BY_STORE" ? "Rejected" : "Approved",
//   //     });
//   //   }

//   //   // Finance Step
//   //   if (
//   //     indent.remarkByFinance &&
//   //     (indent.financeApprovalDate || indent.status === "REJECTED_BY_FINANCE")
//   //   ) {
//   //     trackingSteps.push({
//   //       role: "Finance",
//   //       remark: indent.remarkByFinance,
//   //       date: indent.financeApprovalDate || indent.updatedAt,
//   //       status:
//   //         indent.status === "REJECTED_BY_FINANCE" ? "Rejected" : "Approved",
//   //     });
//   //   }

//   //   // Purchase Step
//   //   if (
//   //     indent.remarkByPurchase &&
//   //     (indent.purchaseCompletionDate || indent.status === "REJECTED_BY_PURCHASE")
//   //   ) {
//   //     trackingSteps.push({
//   //       role: "Purchase",
//   //       remark: indent.remarkByPurchase,
//   //       date: indent.purchaseCompletionDate || indent.updatedAt,
//   //       status:
//   //         indent.status === "REJECTED_BY_PURCHASE" ? "Rejected" : "Completed",
//   //     });
//   //   }

//   //   // User Inspection
//   //   if (indent.remarkByUser && indent.userInspectionDate) {
//   //     trackingSteps.push({
//   //       role: "User",
//   //       remark: indent.remarkByUser,
//   //       date: indent.userInspectionDate,
//   //       status: "Inspection Done",
//   //     });
//   //   }

//   //   // GFR Note
//   //   if (indent.gfrNote && indent.gfrCreatedAt) {
//   //     trackingSteps.push({
//   //       role: "Purchase",
//   //       remark: indent.gfrNote,
//   //       date: indent.gfrCreatedAt,
//   //       status: "GFR Submitted",
//   //     });
//   //   }

//   //   // Payment Done
//   //   if (
//   //     indent.paymentNote &&
//   //     (indent.paymentCreatedAt || indent.status === "PAYMENT_REJECTED")
//   //   ) {
//   //     trackingSteps.push({
//   //       role: "Finance",
//   //       remark: indent.paymentNote,
//   //       date: indent.paymentCreatedAt,
//   //       status:
//   //         indent.status === "PAYMENT_REJECTED" ? "Rejected" : "Payment Done",
//   //     });
//   //   }

//   //   const hasTrackingSteps = trackingSteps.length > 0;

//   //   return (
//   //     <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 1 }}>
//   //       <Box
//   //         onClick={() => setIsExpanded(!isExpanded)}
//   //         sx={{
//   //           display: 'flex',
//   //           alignItems: 'center',
//   //           gap: 1,
//   //           cursor: 'pointer',
//   //           '&:hover': { backgroundColor: '#f5f5f5' },
//   //           p: 1,
//   //           borderRadius: 1,
//   //         }}
//   //       >
//   //         <Typography variant="subtitle1">
//   //           Tracking Steps ({trackingSteps.length})
//   //         </Typography>
//   //         <Icon sx={{ fontSize: 16 }}>{isExpanded ? '▼' : '▶'}</Icon>
//   //       </Box>
//   //       {isExpanded && (
//   //         <Box sx={{ mt: 1 }}>
//   //           {hasTrackingSteps ? (
//   //             trackingSteps
//   //               .sort((a, b) => new Date(a.date) - new Date(b.date))
//   //               .map((step, index) => (
//   //                 <Box
//   //                   key={index}
//   //                   sx={{
//   //                     ml: 2,
//   //                     my: 1,
//   //                     borderLeft: "3px solid #1976d2",
//   //                     pl: 2,
//   //                     position: "relative",
//   //                   }}
//   //                 >
//   //                   <Box
//   //                     sx={{
//   //                       position: "absolute",
//   //                       left: "-7px",
//   //                       top: "5px",
//   //                       width: "10px",
//   //                       height: "10px",
//   //                       borderRadius: "50%",
//   //                       backgroundColor:
//   //                         step.status === "Rejected" ? "red" : "#1976d2",
//   //                     }}
//   //                   />
//   //                   <Typography>
//   //                     <strong>{step.role}</strong>{" "}
//   //                     <span
//   //                       style={{
//   //                         fontStyle: "italic",
//   //                         color: step.status === "Rejected" ? "red" : "inherit",
//   //                       }}
//   //                     >
//   //                       ({step.status})
//   //                     </span>
//   //                   </Typography>
//   //                   <Typography sx={{ mb: 0.5 }}>{step.remark}</Typography>
//   //                   <Typography variant="caption" color="text.secondary">
//   //                     {new Date(step.date).toLocaleString()}
//   //                   </Typography>
//   //                 </Box>
//   //               ))
//   //           ) : (
//   //             <Typography sx={{ p: 1 }}>
//   //               No tracking info available yet.
//   //             </Typography>
//   //           )}
//   //         </Box>
//   //       )}
//   //     </Box>
//   //   );
//   // };


//   // Updated TrackingSteps component with Purchase Reviews
// const TrackingSteps = ({ indent }) => {
//   const [isExpanded, setIsExpanded] = React.useState(false);
//   const trackingSteps = [];

//   // FLA Step
//   if (
//     indent.remarkByFla &&
//     (indent.flaApprovalDate || indent.status === "REJECTED_BY_FLA")
//   ) {
//     trackingSteps.push({
//       role: "FLA",
//       remark: indent.remarkByFla,
//       date: indent.flaApprovalDate || indent.updatedAt,
//       status: indent.status === "REJECTED_BY_FLA" ? "Rejected" : "Approved",
//       type: "single"
//     });
//   }

//   // SLA Step
//   if (
//     indent.remarkBySla &&
//     (indent.slaApprovalDate || indent.status === "REJECTED_BY_SLA")
//   ) {
//     trackingSteps.push({
//       role: "SLA",
//       remark: indent.remarkBySla,
//       date: indent.slaApprovalDate || indent.updatedAt,
//       status: indent.status === "REJECTED_BY_SLA" ? "Rejected" : "Approved",
//       type: "single"
//     });
//   }

//   // Store Step
//   if (
//     indent.remarkByStore &&
//     (indent.storeApprovalDate || indent.status === "REJECTED_BY_STORE")
//   ) {
//     trackingSteps.push({
//       role: "Store",
//       remark: indent.remarkByStore,
//       date: indent.storeApprovalDate || indent.updatedAt,
//       status: indent.status === "REJECTED_BY_STORE" ? "Rejected" : "Approved",
//       type: "single"
//     });
//   }

//   // Finance Step
//   if (
//     indent.remarkByFinance &&
//     (indent.financeApprovalDate || indent.status === "REJECTED_BY_FINANCE")
//   ) {
//     trackingSteps.push({
//       role: "Finance",
//       remark: indent.remarkByFinance,
//       date: indent.financeApprovalDate || indent.updatedAt,
//       status: indent.status === "REJECTED_BY_FINANCE" ? "Rejected" : "Approved",
//       type: "single"
//     });
//   }

//   // Purchase Reviews - Multiple entries
//   if (indent.purchaseReviews && indent.purchaseReviews.length > 0) {
//     // Sort reviews by date (newest first)
//     const sortedReviews = [...indent.purchaseReviews].sort(
//       (a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)
//     );
    
//     sortedReviews.forEach((review, index) => {
//       trackingSteps.push({
//         role: "Purchase",
//         remark: review.comment,
//         date: review.reviewDate,
//         status: "Review Added",
//         reviewer: review.reviewer,
//         type: "review",
//         reviewIndex: index + 1
//       });
//     });
//   }

//   // Purchase Final Step (if completed or rejected)
//   if (
//     indent.remarkByPurchase &&
//     (indent.purchaseCompletionDate || indent.status === "PURCHASE_REJECTED")
//   ) {
//     trackingSteps.push({
//       role: "Purchase",
//       remark: indent.remarkByPurchase,
//       date: indent.purchaseCompletionDate || indent.updatedAt,
//       status: indent.status === "PURCHASE_REJECTED" ? "Rejected" : "Completed",
//       type: "single"
//     });
//   }

//   // User Inspection
//   if (indent.remarkByUser && indent.userInspectionDate) {
//     trackingSteps.push({
//       role: "User",
//       remark: indent.remarkByUser,
//       date: indent.userInspectionDate,
//       status: "Inspection Done",
//       type: "single"
//     });
//   }

//   // GFR Note
//   if (indent.gfrNote && indent.gfrCreatedAt) {
//     trackingSteps.push({
//       role: "Purchase",
//       remark: indent.gfrNote,
//       date: indent.gfrCreatedAt,
//       status: "GFR Submitted",
//       type: "single"
//     });
//   }

//   // Payment Done
//   if (
//     indent.paymentNote &&
//     (indent.paymentCreatedAt || indent.status === "PAYMENT_REJECTED")
//   ) {
//     trackingSteps.push({
//       role: "Finance",
//       remark: indent.paymentNote,
//       date: indent.paymentCreatedAt,
//       status: indent.status === "PAYMENT_REJECTED" ? "Rejected" : "Payment Done",
//       type: "single"
//     });
//   }

//   // Sort all steps by date
//   trackingSteps.sort((a, b) => new Date(a.date) - new Date(b.date));

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Approved":
//       case "Completed":
//       case "Inspection Done":
//       case "GFR Submitted":
//       case "Payment Done":
//         return "#4caf50";
//       case "Rejected":
//         return "#f44336";
//       case "Review Added":
//         return "#2196f3";
//       default:
//         return "#ff9800";
//     }
//   };

//   const getRoleIcon = (role) => {
//     switch (role) {
//       case "FLA":
//         return "👤";
//       case "SLA":
//         return "👥";
//       case "Store":
//         return "🏪";
//       case "Finance":
//         return "💰";
//       case "Purchase":
//         return "🛒";
//       case "User":
//         return "🔍";
//       default:
//         return "📝";
//     }
//   };

//   return (
//     <Box>
//       <Button
//         onClick={() => setIsExpanded(!isExpanded)}
//         sx={{
//           color: "primary.main",
//           textTransform: "none",
//           fontWeight: 600,
//           mb: 1,
//         }}
//       >
//         {isExpanded ? "Hide" : "Show"} Tracking Details ({trackingSteps.length} steps)
//       </Button>
      
//       <Collapse in={isExpanded}>
//         <Box sx={{ pl: 2, borderLeft: "2px solid #e0e0e0" }}>
//           {trackingSteps.length === 0 ? (
//             <Typography color="text.secondary" sx={{ py: 1 }}>
//               No tracking information available yet.
//             </Typography>
//           ) : (
//             trackingSteps.map((step, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   display: "flex",
//                   alignItems: "flex-start",
//                   mb: 2,
//                   pb: 2,
//                   borderBottom: index < trackingSteps.length - 1 ? "1px solid #f0f0f0" : "none",
//                 }}
//               >
//                 <Box
//                   sx={{
//                     minWidth: 40,
//                     height: 40,
//                     borderRadius: "50%",
//                     backgroundColor: getStatusColor(step.status),
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     mr: 2,
//                     fontSize: "18px",
//                   }}
//                 >
//                   {getRoleIcon(step.role)}
//                 </Box>
                
//                 <Box sx={{ flex: 1 }}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       flexWrap: "wrap",
//                       gap: 1,
//                       mb: 1,
//                     }}
//                   >
//                     <Typography
//                       variant="subtitle2"
//                       sx={{
//                         fontWeight: 600,
//                         color: "primary.main",
//                       }}
//                     >
//                       {step.role}
//                     </Typography>
                    
//                     {step.type === "review" && (
//                       <Chip
//                         label={`Review #${step.reviewIndex}`}
//                         size="small"
//                         color="primary"
//                         variant="outlined"
//                       />
//                     )}
                    
//                     <Chip
//                       label={step.status}
//                       size="small"
//                       sx={{
//                         backgroundColor: getStatusColor(step.status),
//                         color: "white",
//                         fontWeight: 500,
//                       }}
//                     />
                    
//                     <Typography
//                       variant="caption"
//                       color="text.secondary"
//                       sx={{ ml: "auto" }}
//                     >
//                       {new Date(step.date).toLocaleString()}
//                     </Typography>
//                   </Box>
                  
//                   {step.reviewer && (
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       sx={{ mb: 0.5, fontStyle: "italic" }}
//                     >
//                       Reviewed by: {step.reviewer}
//                     </Typography>
//                   )}
                  
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       backgroundColor: "#f8f9fa",
//                       padding: 1,
//                       borderRadius: 1,
//                       border: "1px solid #e9ecef",
//                     }}
//                   >
//                     {step.remark}
//                   </Typography>
//                 </Box>
//               </Box>
//             ))
//           )}
//         </Box>
//       </Collapse>
//     </Box>
//   );
// };
//   return (
//     <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)', p: 2 }}>
//       <Paper elevation={6} sx={{ borderRadius: 4, maxWidth: 700, width: '100%', p: { xs: 2, sm: 4 }, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}>
//         <CardContent>
//           <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//             <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
//               <FontAwesomeIcon icon={faUser} />
//             </Avatar>
//             <Typography variant="h5" fontWeight={700} color="primary.main">
//               User Panel
//             </Typography>
//           </Box>

//           <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }} textColor="primary" indicatorColor="primary">
//             <Tab label="Request Indent" />
//             <Tab label="Pending Inspections" />
//             <Tab label="Track Indents" />
//           </Tabs>

//           {status.message && (
//             <Alert severity={status.type} sx={{ mb: 2 }}>
//               {status.message}
//             </Alert>
//           )}

//           {tab === 0 && (
//             <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Project Name"
//                     value={projectName}
//                     onChange={(e) => setProjectName(e.target.value)}
//                     fullWidth
//                     margin="normal"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Item Name"
//                     margin="normal"
//                     value={itemName}
//                     onChange={(e) => setItemName(e.target.value)}
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Quantity"
//                     margin="normal"
//                     type="number"
//                     value={quantity}
//                     onChange={(e) => setQuantity(e.target.value)}
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Per Piece Cost"
//                     margin="normal"
//                     type="number"
//                     value={perPieceCost}
//                     onChange={(e) => setPerPieceCost(e.target.value)}
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Total Cost"
//                     value={totalCost}
//                     InputProps={{ readOnly: true }}
//                     fullWidth
//                     margin="normal"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Department"
//                     margin="normal"
//                     value={department}
//                     onChange={(e) => setDepartment(e.target.value)}
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Description"
//                     margin="normal"
//                     multiline
//                     rows={3}
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Purpose"
//                     margin="normal"
//                     value={purpose}
//                     onChange={(e) => setPurpose(e.target.value)}
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Specification/Model Details"
//                     margin="normal"
//                     value={specification}
//                     onChange={(e) => setSpecification(e.target.value)}
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
//                     <FormControl>
//                       <RadioGroup
//                         row
//                         value={recipientType}
//                         onChange={(e) => setRecipientType(e.target.value)}
//                       >
//                         <FormControlLabel value="FLA" control={<Radio />} label="FLA" />
//                         <FormControlLabel value="SLA" control={<Radio />} label="SLA" />
//                       </RadioGroup>
//                     </FormControl>
//                     <TextField
//                       select
//                       fullWidth
//                       label={`Select ${recipientType}`}
//                       value={selectedRecipientId}
//                       onChange={(e) => setSelectedRecipientId(e.target.value)}
//                       required
//                       sx={{ minWidth: 180 }}
//                     >
//                       {recipientList.map((user) => (
//                         <MenuItem key={user.id} value={user.id}>
//                           {user.username}
//                         </MenuItem>
//                       ))}
//                     </TextField>
//                   </Box>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Box sx={{ position: 'relative', mt: 2 }}>
//                     <Button
//                       type="submit"
//                       variant="contained"
//                       color="primary"
//                       fullWidth
//                       size="large"
//                       disabled={loading}
//                       sx={{ fontWeight: 700, borderRadius: 2, py: 1.5, fontSize: 18, boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)' }}
//                     >
//                       {loading ? <CircularProgress size={26} color="inherit" /> : 'Submit Indent'}
//                     </Button>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Box>
//           )}

//           {tab === 1 && (
//             <Box>
//               {pendingInspections.length === 0 ? (
//                 <Typography>No pending items for inspection.</Typography>
//               ) : (
//                 pendingInspections.map((indent) => (
//                   <InspectionItem
//                     key={indent.id}
//                     indent={indent}
//                     onConfirm={async (id, remark) => {
//                       try {
//                         await axios.post(`/indent/${id}/confirm-inspection`, { remark });
//                         setStatus({ type: "success", message: "Product confirmed OK!" });
//                         setSnackbar({ open: true, message: 'Product confirmed OK!', severity: 'success' });
//                         setPendingInspections((prev) => prev.filter((i) => i.id !== id));
//                       } catch (err) {
//                         // console.error(err);
//                         setStatus({ type: "error", message: "Failed to confirm inspection" });
//                         setSnackbar({ open: true, message: 'Failed to confirm inspection', severity: 'error' });
//                         throw err;
//                       }
//                     }}
//                   />
//                 ))
//               )}
//             </Box>
//           )}

//           {tab === 2 && (
//             <Box>
//               {allIndents.length === 0 ? (
//                 <Typography>No indents found.</Typography>
//               ) : (
//                 allIndents.map((indent) => (
//                   <Card key={indent.id} sx={{ my: 2, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(25, 118, 210, 0.08)' }}>
//                     <CardContent>
//                       <Typography variant="h6" color="primary.main" fontWeight={600} gutterBottom>
//                         Project Name: {indent.projectName}
//                       </Typography>
//                       <Grid container spacing={1}>
//                         <Grid item xs={12} sm={6}>
//                           <Typography><strong>Item Name:</strong> {indent.itemName}</Typography>
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <Typography><strong>Department:</strong> {indent.department}</Typography>
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <Typography><strong>Quantity:</strong> {indent.quantity}</Typography>
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <Typography><strong>Status:</strong> <span style={{ color: getStatusColor(indent.status) }}>{indent.status}</span></Typography>
//                         </Grid>
//                         <Grid item xs={12}>
//                           <Typography><strong>Description:</strong> {indent.description}</Typography>
//                         </Grid>
//                         <Grid item xs={12}>
//                           <Typography><strong>Created:</strong> {new Date(indent.createdAt).toLocaleString()}</Typography>
//                         </Grid>
//                       </Grid>
//                       <Box sx={{ mt: 2 }}>
//                         <Typography variant="subtitle1" gutterBottom>
//                           Tracking Progress:
//                         </Typography>
//                         {/* Collapsible TrackingSteps */}
//                         <TrackingSteps indent={indent} />
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 ))
//               )}
//             </Box>
//           )}

//           <Snackbar
//             open={snackbar.open}
//             autoHideDuration={4000}
//             onClose={() => setSnackbar({ ...snackbar, open: false })}
//             anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//           >
//             <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
//               {snackbar.message}
//             </Alert>
//           </Snackbar>
//         </CardContent>
//       </Paper>
//     </Box>
//   );
// };

// export default UserIndentRequest;
