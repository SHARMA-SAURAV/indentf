// src/pages/SLAView.jsx
import React, { useEffect, useState } from "react";
// import axios from "axios";
import axios from "../api/api";
import {
  Card, CardContent, Typography, Button, TextField, Box, CircularProgress
} from "@mui/material";

const SLAView = () => {
  const [indents, setIndents] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchIndents = async () => {
    try {
      const res = await axios.get("/indent/sla/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIndents(res.data);
    } catch (err) {
      console.error("Error fetching indents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndents();
  }, []);

  const handleApprove = async (indentId) => {
    const remark = remarks[indentId] || "";
    try {
      await axios.post(
        "/indent/sla/approve",
        {
          indentId,
          remark,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Indent approved and forwarded to Store");
      fetchIndents(); // Refresh list
    } catch (err) {
      console.error("Approval failed", err);
      alert("Something went wrong.");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        SLA Approval Panel
      </Typography>
      {indents.length === 0 ? (
        <Typography>No pending indents for SLA</Typography>
      ) : (
        indents.map((indent) => (
          <Card key={indent.id} sx={{ my: 2 }}>
            <CardContent>
              <Typography variant="h6">{indent.itemName}</Typography>
              <Typography>Quantity: {indent.quantity}</Typography>
              <Typography>Cost per piece: ₹{indent.perPieceCost}</Typography>
              <Typography>Description: {indent.description}</Typography>

              <TextField
                label="SLA Remark"
                fullWidth
                multiline
                rows={2}
                sx={{ mt: 2 }}
                value={remarks[indent.id] || ""}
                onChange={(e) =>
                  setRemarks({ ...remarks, [indent.id]: e.target.value })
                }
              />
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => handleApprove(indent.id)}
              >
                Approve and Forward to Store
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default SLAView;
