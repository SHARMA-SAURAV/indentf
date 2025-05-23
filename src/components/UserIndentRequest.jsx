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
  Paper,
  Grid,
} from "@mui/material";
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
        status:
          indent.status === "REJECTED_BY_FLA" ? "Rejected" : "Approved",
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
        status:
          indent.status === "REJECTED_BY_SLA" ? "Rejected" : "Approved",
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
        status:
          indent.status === "REJECTED_BY_STORE" ? "Rejected" : "Approved",
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
        status:
          indent.status === "REJECTED_BY_FINANCE" ? "Rejected" : "Approved",
      });
    }

    // Purchase Step
    if (
      indent.remarkByPurchase &&
      (indent.purchaseCompletionDate || indent.status === "REJECTED_BY_PURCHASE")
    ) {
      trackingSteps.push({
        role: "Purchase",
        remark: indent.remarkByPurchase,
        date: indent.purchaseCompletionDate || indent.updatedAt,
        status:
          indent.status === "REJECTED_BY_PURCHASE" ? "Rejected" : "Completed",
      });
    }

    // User Inspection
    if (indent.remarkByUser && indent.userInspectionDate) {
      trackingSteps.push({
        role: "User",
        remark: indent.remarkByUser,
        date: indent.userInspectionDate,
        status: "Inspection Done",
      });
    }

    // GFR Note
    if (indent.gfrNote && indent.gfrCreatedAt) {
      trackingSteps.push({
        role: "Purchase",
        remark: indent.gfrNote,
        date: indent.gfrCreatedAt,
        status: "GFR Submitted",
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
        status:
          indent.status === "PAYMENT_REJECTED" ? "Rejected" : "Payment Done",
      });
    }

    const hasTrackingSteps = trackingSteps.length > 0;

    return (
      <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 1 }}>
        <Box
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            '&:hover': { backgroundColor: '#f5f5f5' },
            p: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant="subtitle1">
            Tracking Steps ({trackingSteps.length})
          </Typography>
          <Icon sx={{ fontSize: 16 }}>{isExpanded ? '▼' : '▶'}</Icon>
        </Box>
        {isExpanded && (
          <Box sx={{ mt: 1 }}>
            {hasTrackingSteps ? (
              trackingSteps
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((step, index) => (
                  <Box
                    key={index}
                    sx={{
                      ml: 2,
                      my: 1,
                      borderLeft: "3px solid #1976d2",
                      pl: 2,
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        left: "-7px",
                        top: "5px",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor:
                          step.status === "Rejected" ? "red" : "#1976d2",
                      }}
                    />
                    <Typography>
                      <strong>{step.role}</strong>{" "}
                      <span
                        style={{
                          fontStyle: "italic",
                          color: step.status === "Rejected" ? "red" : "inherit",
                        }}
                      >
                        ({step.status})
                      </span>
                    </Typography>
                    <Typography sx={{ mb: 0.5 }}>{step.remark}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(step.date).toLocaleString()}
                    </Typography>
                  </Box>
                ))
            ) : (
              <Typography sx={{ p: 1 }}>
                No tracking info available yet.
              </Typography>
            )}
          </Box>
        )}
      </Box>
    );
  };

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
                allIndents.map((indent) => (
                  <Card key={indent.id} sx={{ my: 2, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(25, 118, 210, 0.08)' }}>
                    <CardContent>
                      <Typography variant="h6" color="primary.main" fontWeight={600} gutterBottom>
                        Project Name: {indent.projectName}
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                          <Typography><strong>Item Name:</strong> {indent.itemName}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography><strong>Department:</strong> {indent.department}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography><strong>Quantity:</strong> {indent.quantity}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography><strong>Status:</strong> <span style={{ color: getStatusColor(indent.status) }}>{indent.status}</span></Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography><strong>Description:</strong> {indent.description}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography><strong>Created:</strong> {new Date(indent.createdAt).toLocaleString()}</Typography>
                        </Grid>
                      </Grid>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Tracking Progress:
                        </Typography>
                        {/* Collapsible TrackingSteps */}
                        <TrackingSteps indent={indent} />
                      </Box>
                    </CardContent>
                  </Card>
                ))
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
