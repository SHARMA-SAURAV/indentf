import React, { useEffect, useState } from "react";
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
        console.error(`Error fetching ${recipientType}s`, err);
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
        console.error("Error fetching FLAs", err);
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
        console.error("Error fetching pending inspections", err);
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
        console.error("Error fetching indents", err);
      }
    };
    if (tab === 2) fetchIndents();
  }, [tab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      console.error("Failed to submit indent", err);
      setStatus({ type: "error", message: "Failed to submit indent." });
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
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          User Panel
        </Typography>

        <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
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
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              fullWidth
              label="Item Name"
              margin="normal"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Quantity"
              margin="normal"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Per Piece Cost"
              margin="normal"
              type="number"
              value={perPieceCost}
              onChange={(e) => setPerPieceCost(e.target.value)}
              required
            />
            <TextField
              label="Total Cost"
              value={totalCost}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              margin="normal"
            />
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
            {/* const [recipientType, setRecipientType] = useState('FLA'); const
            [recipientList, setRecipientList] = useState([]); const
            [selectedRecipientId, setSelectedRecipientId] = useState(''); */}
            {/* // Update form UI */}
            <Box sx={{ mb: 2 }}>
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
              >
                {recipientList.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <TextField
              fullWidth
              label="Purpose"
              margin="normal"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Specification/Model Details"
              margin="normal"
              value={specification}
              onChange={(e) => setSpecification(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Department"
              margin="normal"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Submit Indent
            </Button>
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
                      await axios.post(`/indent/${id}/confirm-inspection`, {
                        remark,
                      });
                      setStatus({
                        type: "success",
                        message: "Product confirmed OK!",
                      });
                      setPendingInspections((prev) =>
                        prev.filter((i) => i.id !== id)
                      );
                    } catch (err) {
                      console.error(err);
                      setStatus({
                        type: "error",
                        message: "Failed to confirm inspection",
                      });
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
                <Card key={indent.id} sx={{ my: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{indent.itemName}</Typography>
                    <Typography>
                      <strong>Quantity:</strong> {indent.quantity}
                    </Typography>
                    <Typography>
                      <strong>Description:</strong> {indent.description}
                    </Typography>
                    <Typography>
                      <strong>Status:</strong>{" "}
                      <span style={{ color: getStatusColor(indent.status) }}>
                        {indent.status}
                      </span>
                    </Typography>
                    <Typography>
                      <strong>Created:</strong>{" "}
                      {new Date(indent.createdAt).toLocaleString()}
                    </Typography>
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
      </CardContent>
    </Card>
  );
};

export default UserIndentRequest;
