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
  Paper,
  Chip,
  Grow,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import axios from "../api/api";

const FLADashboard = () => {
  const [indents, setIndents] = useState([]);
  const [slaList, setSlaList] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [selectedSla, setSelectedSla] = useState({});
  const [status, setStatus] = useState("");

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
      await axios.post("/indent/fla/approve", payload);
      setStatus("✅ Indent approved and forwarded.");
      fetchIndents(); // Refresh list
    } catch (err) {
      console.error("Error approving indent", err);
      setStatus("❌ Failed to approve.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "1000px",
        margin: "auto",
        mt: 5,
        px: 2,
        background: "linear-gradient(135deg, #f0f4ff, #e9f7ef)",
        borderRadius: 4,
        boxShadow: 4,
        pb: 4,
      }}
    >
      <Card elevation={6} sx={{ borderRadius: 4, mt: -4 }}>
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              color: "#2f4f4f",
              mb: 3,
              mt: 2,
            }}
          >
             FLA Dashboard – Pending Indents
          </Typography>

          {status && (
            <Alert severity="info" sx={{ mb: 2, fontWeight: 500 }}>
              {status}
            </Alert>
          )}

          {indents.length === 0 ? (
            <Typography sx={{ mt: 3, textAlign: "center", fontSize: 18 }}>
               No pending indents.
            </Typography>
          ) : (
            indents.map((indent, index) => (
              <Grow in key={indent.id} timeout={500 + index * 300}>
                <Paper
                  elevation={4}
                  sx={{
                    mb: 4,
                    p: 3,
                    borderRadius: 3,
                    background: "#ffffff",
                    transition: "transform 0.3s ease, box-shadow 0.3s",
                    "&:hover": {
                      transform: "scale(1.01)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    },
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
                    <Chip
                      label={`Indent ID: ${indent.id}`}
                      color="primary"
                      variant="outlined"
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "gray", fontStyle: "italic" }}
                    >
                      Pending Approval
                    </Typography>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {indent.itemName}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>📦 Quantity: {indent.quantity}</Typography>
                  <Typography sx={{ mb: 2 }}>📝 {indent.description}</Typography>

                  <TextField
                    label="Add a Remark"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    value={remarks[indent.id] || ""}
                    onChange={(e) =>
                      setRemarks({ ...remarks, [indent.id]: e.target.value })
                    }
                  />

                  <TextField
                    select
                    label="Assign SLA"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    value={selectedSla[indent.id] || ""}
                    onChange={(e) =>
                      setSelectedSla({
                        ...selectedSla,
                        [indent.id]: e.target.value,
                      })
                    }
                    sx={{ mt: 2 }}
                  >
                    {slaList.map((sla) => (
                      <MenuItem key={sla.id} value={sla.id}>
                        👤 {sla.username}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    endIcon={<Send />}
                    sx={{
                      mt: 3,
                      py: 1.3,
                      fontSize: 16,
                      fontWeight: "bold",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#28a745",
                      },
                    }}
                    onClick={() => handleApprove(indent.id)}
                  >
                    Approve & Forward
                  </Button>
                </Paper>
              </Grow>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default FLADashboard;
