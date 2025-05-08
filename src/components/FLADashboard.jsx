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
  Divider,
} from "@mui/material";
import axios from "../api/api";

const FLADashboard = () => {
  const [indents, setIndents] = useState([]);
  const [slaList, setSlaList] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [selectedSla, setSelectedSla] = useState({});
  const [status, setStatus] = useState("");

  // Fetch SLA list and pending indents
  useEffect(() => {
    fetchIndents();
    fetchSLAs();
  }, []);

  const fetchIndents = async () => {
    try {
      const res = await axios.get("/indent/fla/pending");
      setIndents(res.data);
    } catch (err) {
      console.error("Failed to load indents", err);
    }
  };

  

  const fetchSLAs = async () => {
    try {
      const res = await axios.get("/auth/users/by-role?role=SLA");
      setSlaList(res.data);
    } catch (err) {
      console.error("Failed to load SLA list", err);
    }
  };

  const handleApprove = async (indentId) => {
    try {
      const payload = {
        indentId,
        remark: remarks[indentId] || "",
        slaId: selectedSla[indentId],
      };
      console.log("Indent ID:", indentId);
      console.log("Selected SLA ID:", selectedSla[indentId]);
      console.log("Remark:", remarks[indentId]);
      await axios.post("/indent/fla/approve", payload);
      setStatus("Indent approved and forwarded.");
      fetchIndents(); // Refresh list
    } catch (err) {
      console.error("Error approving indent", err);
      setStatus("Failed to approve.");
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          FLA Dashboard - Pending Indents
        </Typography>

        {status && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {status}
          </Alert>
        )}

        {indents.length === 0 ? (
          <Typography>No pending indents.</Typography>
        ) : (
          indents.map((indent) => (
            <Box
              key={indent.id}
              sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}
            >
              <Typography>
                <strong>Item:</strong> {indent.itemName}
              </Typography>
              <Typography>
                <strong>Quantity:</strong> {indent.quantity}
              </Typography>
              <Typography>
                <strong>Description:</strong> {indent.description}
              </Typography>

              <TextField
                label="Remark"
                fullWidth
                margin="normal"
                value={remarks[indent.id] || ""}
                onChange={(e) =>
                  setRemarks({ ...remarks, [indent.id]: e.target.value })
                }
              />

              <TextField
                select
                label="Select SLA"
                fullWidth
                margin="normal"
                value={selectedSla[indent.id] || ""}
                onChange={(e) =>
                  setSelectedSla({
                    ...selectedSla,
                    [indent.id]: e.target.value,
                  })
                }
              >
                {slaList.map((sla) => (
                  <MenuItem key={sla.id} value={sla.id}>
                    {sla.username}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                onClick={() => handleApprove(indent.id)}
              >
                Approve and Forward
              </Button>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default FLADashboard;
