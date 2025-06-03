import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
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
  IconButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import axios from "../api/api";
// import InspectionItem from "./InspectionItem";

const UserIndentRequest = () => {
  const [tab, setTab] = useState(0);
  // Remove single item states
  // Add multi-item state
  const [items, setItems] = useState([
    {
      itemName: "",
      quantity: "",
      perPieceCost: "",
      description: "",
      purpose: "",
      specification: "",
      department: "",
      file: null,
      fileStatus: "",
    },
  ]);
  const [projectName, setProjectName] = useState("");
  const [recipientType, setRecipientType] = useState("FLA");
  const [recipientList, setRecipientList] = useState([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [openTrackingIdx, setOpenTrackingIdx] = useState(null);
  const [pendingInspections, setPendingInspections] = useState([]);
  const [allIndents, setAllIndents] = useState([]);
  const [flaList, setFlaList] = useState([]); // if not already present

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

  // Multi-item handlers
  const handleItemChange = (idx, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const handleFileChange = (idx, file) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx
          ? { ...item, file, fileStatus: file ? `Selected: ${file.name}` : "" }
          : item
      )
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        itemName: "",
        quantity: "",
        perPieceCost: "",
        description: "",
        purpose: "",
        specification: "",
        department: "",
        file: null,
        fileStatus: "",
      },
    ]);
  };

  const removeItem = (idx) => {
    setItems((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev
    );
  };

  // Calculate total cost for all items
  const totalCost = items.reduce((sum, item) => {
    const q = parseInt(item.quantity);
    const p = parseInt(item.perPieceCost);
    return sum + (isNaN(q) || isNaN(p) ? 0 : q * p);
  }, 0);

  // Submit handler for multi-item, multi-file
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSnackbar({
      open: true,
      message: "Submitting indent...",
      severity: "info",
    });
    try {
      // Prepare indentData (excluding files) in the required structure
      const indentData = {
        projectName,
        recipientType,
        recipientId: selectedRecipientId,
        purpose: items[0]?.purpose || "",
        department: items[0]?.department || "",
        description: items[0]?.description || "",
        category: items[0]?.category || "",
        totalCost,
        items: items.map(
          ({
            itemName,
            description,
            quantity,
            perPieceCost,
            category,
            purpose,
            specification,
            specificationModelDetails,
          }) => ({
            itemName,
            description,
            quantity: parseInt(quantity),
            perPieceCost: parseInt(perPieceCost),
            category: category || "",
            purpose: purpose || "",
            specificationModelDetails:
              specificationModelDetails || specification || "",
          })
        ),
      };
      const formData = new FormData();
      formData.append("indentData", JSON.stringify(indentData));
      // Append all files (backend expects at least one file, but may support multiple)
      items.forEach((item, idx) => {
        if (item.file) {
          formData.append("file", item.file, item.file.name);
        }
      });
      await axios.post("/indent/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setSnackbar({
            open: true,
            message: `Uploading... ${percent}%`,
            severity: "info",
          });
        },
      });
      setStatus({ type: "success", message: "Indent submitted successfully!" });
      setSnackbar({
        open: true,
        message: "Indent submitted successfully!",
        severity: "success",
      });
      // Reset form
      setProjectName("");
      setSelectedRecipientId("");
      setRecipientType("FLA");
      setItems([
        {
          itemName: "",
          quantity: "",
          perPieceCost: "",
          description: "",
          purpose: "",
          specification: "",
          department: "",
          file: null,
          fileStatus: "",
        },
      ]);
    } catch (err) {
      setStatus({ type: "error", message: "Failed to submit indent." });
      setSnackbar({
        open: true,
        message: "Failed to submit indent.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
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
        type: "single",
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
        type: "single",
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
        type: "single",
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
        type: "single",
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
          reviewIndex: index + 1,
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
        status:
          indent.status === "PURCHASE_REJECTED" ? "Rejected" : "Completed",
        type: "single",
      });
    }

    // User Inspection
    if (indent.remarkByUser && indent.userInspectionDate) {
      trackingSteps.push({
        role: "User",
        remark: indent.remarkByUser,
        date: indent.userInspectionDate,
        status: "Inspection Done",
        type: "single",
      });
    }

    // GFR Note
    if (indent.gfrNote && indent.gfrCreatedAt) {
      trackingSteps.push({
        role: "Purchase",
        remark: indent.gfrNote,
        date: indent.gfrCreatedAt,
        status: "GFR Submitted",
        type: "single",
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
        type: "single",
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
          {isExpanded ? "Hide" : "Show"} Tracking Details (
          {trackingSteps.length} steps)
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
                    borderBottom:
                      index < trackingSteps.length - 1
                        ? "1px solid #f0f0f0"
                        : "none",
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
    <Table size="small" sx={{ background: "#f8fafc", borderRadius: 2, mt: 1 }}>
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
          <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
            Reviewer
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {steps.map((step, idx) => (
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
            <TableCell>{step.reviewer || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "80vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          borderRadius: 4,
          maxWidth: 700,
          width: "100%",
          p: { xs: 2, sm: 4 },
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
              <FontAwesomeIcon icon={faUser} />
            </Avatar>
            <Typography variant="h5" fontWeight={700} color="primary.main">
              User Panel
            </Typography>
          </Box>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            sx={{ mb: 2 }}
            textColor="primary"
            indicatorColor="primary"
          >
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
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 2 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <FormControl>
                      <RadioGroup
                        row
                        value={recipientType}
                        onChange={(e) => setRecipientType(e.target.value)}
                      >
                        <FormControlLabel
                          value="FLA"
                          control={<Radio />}
                          label="FLA"
                        />
                        <FormControlLabel
                          value="SLA"
                          control={<Radio />}
                          label="SLA"
                        />
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
                {/* Multi-item section */}
                {items.map((item, idx) => (
                  <Grid
                    item
                    xs={12}
                    key={idx}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      mb: 2,
                      p: 2,
                      background: "#f9f9fb",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        color="primary.main"
                      >
                        Item #{idx + 1}
                      </Typography>
                      {items.length > 1 && (
                        <Button
                          color="error"
                          size="small"
                          onClick={() => removeItem(idx)}
                          sx={{ minWidth: 0, px: 1 }}
                        >
                          Remove
                        </Button>
                      )}
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Item Name"
                          margin="normal"
                          value={item.itemName}
                          onChange={(e) =>
                            handleItemChange(idx, "itemName", e.target.value)
                          }
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Quantity"
                          margin="normal"
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(idx, "quantity", e.target.value)
                          }
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Per Piece Cost"
                          margin="normal"
                          type="number"
                          value={item.perPieceCost}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              "perPieceCost",
                              e.target.value
                            )
                          }
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Department"
                          margin="normal"
                          value={item.department}
                          onChange={(e) =>
                            handleItemChange(idx, "department", e.target.value)
                          }
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Purpose"
                          margin="normal"
                          value={item.purpose}
                          onChange={(e) =>
                            handleItemChange(idx, "purpose", e.target.value)
                          }
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Specification/Model Details"
                          margin="normal"
                          value={item.specification}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              "specification",
                              e.target.value
                            )
                          }
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Description"
                          margin="normal"
                          multiline
                          rows={2}
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(idx, "description", e.target.value)
                          }
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                          variant="outlined"
                          component="label"
                          fullWidth
                          sx={{ mt: 1 }}
                        >
                          {item.file
                            ? `Change File (${item.file.name})`
                            : "Upload File"}
                          <input
                            type="file"
                            hidden
                            onChange={(e) =>
                              handleFileChange(idx, e.target.files[0])
                            }
                          />
                        </Button>
                        {item.fileStatus && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ ml: 1 }}
                          >
                            {item.fileStatus}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={addItem}
                    sx={{ borderRadius: 2, mb: 2 }}
                  >
                    + Add Another Item
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Total Cost"
                    value={totalCost}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ position: "relative", mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      disabled={loading}
                      sx={{
                        fontWeight: 700,
                        borderRadius: 2,
                        py: 1.5,
                        fontSize: 18,
                        boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={26} color="inherit" />
                      ) : (
                        "Submit Indent"
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
          {/* {tab === 1 && (
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
          )} */}
          // Replace the existing Tab 1 section with this:
          {tab === 1 && (
            <Box>
              {pendingInspections.length === 0 ? (
                <Typography>No pending items for inspection.</Typography>
              ) : (
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 3,
                    boxShadow: "none",
                    background: "transparent",
                    mt: 2,
                  }}
                >
                  <Table
                    sx={{ minWidth: 900, background: "transparent" }}
                    aria-label="pending inspections table"
                  >
                    <TableHead>
                      <TableRow
                        sx={{
                          background:
                            "linear-gradient(90deg, #e3f2fd 60%, #fce4ec 100%)",
                        }}
                      >
                        <TableCell
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          Indent ID
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          Project Name
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          Items
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          Total Cost
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          Department
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingInspections.map((indent) => (
                        <TableRow
                          key={indent.id}
                          hover
                          sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                        >
                          <TableCell sx={{ fontWeight: 600 }}>
                            {indent.indentNumber}
                          </TableCell>
                          <TableCell>{indent.projectName}</TableCell>
                          <TableCell>
                            <Box>
                              {indent.items?.map((item, idx) => (
                                <Chip
                                  key={idx}
                                  label={`${item.itemName} (${item.quantity})`}
                                  size="small"
                                  sx={{ mr: 0.5, mb: 0.5 }}
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "green" }}>
                            ₹{indent.totalIndentCost || indent.displayTotalCost}
                          </TableCell>
                          <TableCell>{indent.department}</TableCell>
                          <TableCell>
                            <Chip
                              label="Pending Inspection"
                              sx={{
                                backgroundColor: "#ff9800",
                                color: "white",
                                fontWeight: 500,
                              }}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={async () => {
                                try {
                                  await axios.post(
                                    `/indent/${indent.id}/confirm-inspection`,
                                    {
                                      remark:
                                        "Product inspection completed successfully",
                                    }
                                  );
                                  setStatus({
                                    type: "success",
                                    message: "Product confirmed OK!",
                                  });
                                  setSnackbar({
                                    open: true,
                                    message: "Product confirmed OK!",
                                    severity: "success",
                                  });
                                  setPendingInspections((prev) =>
                                    prev.filter((i) => i.id !== indent.id)
                                  );
                                } catch (err) {
                                  setStatus({
                                    type: "error",
                                    message: "Failed to confirm inspection",
                                  });
                                  setSnackbar({
                                    open: true,
                                    message: "Failed to confirm inspection",
                                    severity: "error",
                                  });
                                }
                              }}
                            >
                              Confirm OK
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
          {tab === 2 && (
            <Box>
              {allIndents.length === 0 ? (
                <Typography>No indents found.</Typography>
              ) : (
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 3,
                    boxShadow: "none",
                    background: "transparent",
                    mt: 2,
                  }}
                >
                  <Table
                    sx={{ minWidth: 900, background: "transparent" }}
                    aria-label="track indents table"
                  >
                    <TableHead>
                      <TableRow
                        sx={{
                          background:
                            "linear-gradient(90deg, #e3f2fd 60%, #fce4ec 100%)",
                        }}
                      >
                        <TableCell />
                        <TableCell
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          Indent ID
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          Project
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          Item
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          Department
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          Quantity
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          Total Cost
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: "primary.main" }}
                        >
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allIndents.map((indent, idx) => {
                        // Build tracking steps array (reuse logic from TrackingSteps)
                        const trackingSteps = [];
                        if (
                          indent.remarkByFla &&
                          (indent.flaApprovalDate ||
                            indent.status === "REJECTED_BY_FLA")
                        ) {
                          trackingSteps.push({
                            role: "FLA",
                            remark: indent.remarkByFla,
                            date: indent.flaApprovalDate || indent.updatedAt,
                            status:
                              indent.status === "REJECTED_BY_FLA"
                                ? "Rejected"
                                : "Approved",
                          });
                        }
                        if (
                          indent.remarkBySla &&
                          (indent.slaApprovalDate ||
                            indent.status === "REJECTED_BY_SLA")
                        ) {
                          trackingSteps.push({
                            role: "SLA",
                            remark: indent.remarkBySla,
                            date: indent.slaApprovalDate || indent.updatedAt,
                            status:
                              indent.status === "REJECTED_BY_SLA"
                                ? "Rejected"
                                : "Approved",
                          });
                        }
                        if (
                          indent.remarkByStore &&
                          (indent.storeApprovalDate ||
                            indent.status === "REJECTED_BY_STORE")
                        ) {
                          trackingSteps.push({
                            role: "Store",
                            remark: indent.remarkByStore,
                            date: indent.storeApprovalDate || indent.updatedAt,
                            status:
                              indent.status === "REJECTED_BY_STORE"
                                ? "Rejected"
                                : "Approved",
                          });
                        }
                        if (
                          indent.remarkByFinance &&
                          (indent.financeApprovalDate ||
                            indent.status === "REJECTED_BY_FINANCE")
                        ) {
                          trackingSteps.push({
                            role: "Finance",
                            remark: indent.remarkByFinance,
                            date:
                              indent.financeApprovalDate || indent.updatedAt,
                            status:
                              indent.status === "REJECTED_BY_FINANCE"
                                ? "Rejected"
                                : "Approved",
                          });
                        }
                        if (
                          indent.purchaseReviews &&
                          indent.purchaseReviews.length > 0
                        ) {
                          const sortedReviews = [
                            ...indent.purchaseReviews,
                          ].sort(
                            (a, b) =>
                              new Date(b.reviewDate) - new Date(a.reviewDate)
                          );
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
                        if (
                          indent.remarkByPurchase &&
                          (indent.purchaseCompletionDate ||
                            indent.status === "PURCHASE_REJECTED")
                        ) {
                          trackingSteps.push({
                            role: "Purchase",
                            remark: indent.remarkByPurchase,
                            date:
                              indent.purchaseCompletionDate || indent.updatedAt,
                            status:
                              indent.status === "PURCHASE_REJECTED"
                                ? "Rejected"
                                : "Completed",
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
                        if (
                          indent.paymentNote &&
                          (indent.paymentCreatedAt ||
                            indent.status === "PAYMENT_REJECTED")
                        ) {
                          trackingSteps.push({
                            role: "Finance",
                            remark: indent.paymentNote,
                            date: indent.paymentCreatedAt,
                            status:
                              indent.status === "PAYMENT_REJECTED"
                                ? "Rejected"
                                : "Payment Done",
                          });
                        }
                        trackingSteps.sort(
                          (a, b) => new Date(a.date) - new Date(b.date)
                        );
                        const isOpen = openTrackingIdx === idx;
                        return (
                          <React.Fragment key={indent.id}>
                            <TableRow
                              hover
                              sx={{
                                background: isOpen ? "#f3e5f5" : "transparent",
                                transition: "background 0.2s",
                              }}
                            >
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    setOpenTrackingIdx(isOpen ? null : idx)
                                  }
                                >
                                  {isOpen ? (
                                    <KeyboardArrowUp
                                      sx={{ color: "primary.main" }}
                                    />
                                  ) : (
                                    <KeyboardArrowDown
                                      sx={{ color: "primary.main" }}
                                    />
                                  )}
                                </IconButton>
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>
                                {indent.id}
                              </TableCell>
                              <TableCell>{indent.projectName}</TableCell>
                              <TableCell>{indent.itemName}</TableCell>
                              <TableCell>{indent.department}</TableCell>
                              <TableCell>{indent.quantity}</TableCell>
                              <TableCell>₹{indent.totalCost}</TableCell>
                              <TableCell
                                sx={{
                                  color: indent.status
                                    .toLowerCase()
                                    .includes("rejected")
                                    ? "#d32f2f"
                                    : "#1976d2",
                                  fontWeight: 700,
                                }}
                              >
                                {indent.status}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                style={{
                                  paddingBottom: 0,
                                  paddingTop: 0,
                                  background: "#f8fafc",
                                }}
                                colSpan={8}
                              >
                                <Collapse
                                  in={isOpen}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <Box sx={{ pl: 1, pr: 1, pb: 2, pt: 2 }}>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: 700,
                                        color: "primary.main",
                                        mb: 1,
                                      }}
                                    >
                                      Tracking Steps
                                    </Typography>
                                    {trackingSteps.length > 0 ? (
                                      <TrackingStepsTable
                                        steps={trackingSteps}
                                      />
                                    ) : (
                                      <Typography
                                        sx={{
                                          color: "#888",
                                          fontStyle: "italic",
                                          py: 2,
                                        }}
                                      >
                                        No tracking steps available for this
                                        indent.
                                      </Typography>
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
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </CardContent>
      </Paper>
    </Box>
  );
};

export default UserIndentRequest;
