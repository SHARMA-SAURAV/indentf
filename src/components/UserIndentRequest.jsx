import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import axios from "../api/api";

const UserIndentRequest = () => {
  const [tab, setTab] = useState(0);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [perPieceCost, setPerPieceCost] = useState("");
  const [description, setDescription] = useState("");
  const [flaList, setFlaList] = useState([]);
  const [selectedFla, setSelectedFla] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [pendingInspections, setPendingInspections] = useState([]);
  const [allIndents, setAllIndents] = useState([]);

  useEffect(() => {
    const fetchIndents = async () => {
      try {
        const res = await axios.get("/indent/user/all");
        setAllIndents(res.data);
      } catch (err) {
        console.error("Error fetching indents", err);
      }
    };
    if (tab === 2) fetchIndents(); // Only fetch when tab is selected
  }, [tab]);

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
    fetchPendingInspections();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        itemName,
        quantity: parseInt(quantity),
        perPieceCost: parseInt(perPieceCost),
        description,
        flaId: selectedFla,
      };
      await axios.post("/indent/create", body);
      setStatus({ type: "success", message: "Indent submitted successfully!" });

      // Reset form
      setItemName("");
      setQuantity("");
      setPerPieceCost("");
      setDescription("");
      setSelectedFla("");
    } catch (err) {
      console.error("Failed to submit indent", err);
      setStatus({ type: "error", message: "Failed to submit indent." });
    }
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setStatus({ type: "", message: "" });
  };

  // Polling function to fetch and update tracking data at each level
  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedIndents = await Promise.all(
        allIndents.map(async (indent) => {
          try {
            const res = await axios.get(`/indent/${indent.id}/tracking`);
            return { ...indent, tracking: res.data };
          } catch (err) {
            console.error("Error fetching tracking data", err);
            return indent;
          }
        })
      );
      setAllIndents(updatedIndents);
    }, 5000); // Poll every 5 seconds for updates

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [allIndents]);

  return (
    <Card sx={{ mt: 4, borderRadius: 2, boxShadow: 3 }}>
      <CardContent sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
          User Panel
        </Typography>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{ mb: 2, borderBottom: 2, borderColor: "divider" }}
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
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Item Name"
              margin="normal"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
              variant="outlined"
              sx={{ backgroundColor: "#f9f9f9" }}
            />

            <TextField
              fullWidth
              label="Quantity"
              margin="normal"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              variant="outlined"
              sx={{ backgroundColor: "#f9f9f9" }}
            />

            <TextField
              fullWidth
              label="Per Piece Cost"
              margin="normal"
              type="number"
              value={perPieceCost}
              onChange={(e) => setPerPieceCost(e.target.value)}
              required
              variant="outlined"
              sx={{ backgroundColor: "#f9f9f9" }}
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
              variant="outlined"
              sx={{ backgroundColor: "#f9f9f9" }}
            />

            <TextField
              select
              fullWidth
              label="Select FLA"
              margin="normal"
              value={selectedFla}
              onChange={(e) => setSelectedFla(e.target.value)}
              required
              variant="outlined"
              sx={{ backgroundColor: "#f9f9f9" }}
            >
              {flaList.map((fla) => (
                <MenuItem key={fla.id} value={fla.id}>
                  {fla.username}
                </MenuItem>
              ))}
            </TextField>
            <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor: "#3f51b5", color: "#fff" }}>
              Submit Indent
            </Button>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ mt: 2 }}>
            {pendingInspections.length === 0 ? (
              <Typography>No pending items for inspection.</Typography>
            ) : (
              pendingInspections.map((indent) => (
                <Card key={indent.id} sx={{ my: 2, borderRadius: 2, boxShadow: 1 }}>
                  <CardContent>
                    <Typography><strong>Item:</strong> {indent.itemName}</Typography>
                    <Typography><strong>Quantity:</strong> {indent.quantity}</Typography>
                    <Typography><strong>Description:</strong> {indent.description}</Typography>

                    <Button
                      variant="outlined"
                      sx={{ mt: 2, borderColor: "#4caf50", color: "#4caf50", borderRadius: 1 }}
                      onClick={async () => {
                        try {
                          await axios.post(`/indent/${indent.id}/confirm-inspection`);
                          setStatus({ type: "success", message: "Product confirmed OK!" });
                          setPendingInspections((prev) =>
                            prev.filter((i) => i.id !== indent.id)
                          );
                        } catch (err) {
                          console.error(err);
                          setStatus({
                            type: "error",
                            message: "Failed to confirm inspection",
                          });
                        }
                      }}
                    >
                      Confirm Product is OK
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}

        {tab === 2 && (
          <Box sx={{ mt: 2 }}>
            {allIndents.length === 0 ? (
              <Typography>No indents found.</Typography>
            ) : (
              allIndents.map((indent) => (
                <Card key={indent.id} sx={{ my: 2, borderRadius: 2, boxShadow: 1 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>{indent.itemName}</Typography>
                    <Typography><strong>Quantity:</strong> {indent.quantity}</Typography>
                    <Typography><strong>Description:</strong> {indent.description}</Typography>
                    <Typography><strong>Status:</strong> {indent.status}</Typography>
                    <Typography><strong>Created:</strong> {new Date(indent.createdAt).toLocaleString()}</Typography>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Tracking:</Typography>

                      {["FLA", "SLA", "STORE", "FINANCE", "PURCHASE"].map((role) => {
                        const step = indent.tracking?.find(
                          (entry) => entry.role?.trim().toUpperCase() === role
                        );

                        return (
                          <Box key={role} sx={{ ml: 2, my: 1 }}>
                            <Typography>
                              <strong>{role}:</strong>{" "}
                              {step?.remark || (
                                <span style={{ color: "gray" }}>Pending...</span>
                              )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {step?.date
                                ? new Date(step.date).toLocaleString()
                                : "Awaiting update"}
                            </Typography>
                          </Box>
                        );
                      })}

                      {/* Final status check */}
                      {indent.status === "PAYMENT_COMPLETED" && (
                        <Box sx={{ ml: 2, mt: 2 }}>
                          <Typography sx={{ color: "green", fontWeight: "bold" }}>
                            ✅ Payment Completed – Indent fully processed.
                          </Typography>
                        </Box>
                      )}
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
