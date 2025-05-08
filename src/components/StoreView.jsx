// src/pages/StoreView.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/api";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";

const StoreView = () => {
  const [indents, setIndents] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchIndents = async () => {
    try {
      const res = await axios.get("/indent/store/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIndents(res.data);
    } catch (err) {
      console.error("Error fetching store indents", err);
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
        "/indent/store/approve",
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
      alert("Indent approved and forwarded to Finance");
      fetchIndents(); // refresh
    } catch (err) {
      console.error("Approval failed", err);
      alert("Something went wrong.");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Store Approval Panel
      </Typography>
      {indents.length === 0 ? (
        <Typography>No pending indents for Store</Typography>
      ) : (
        indents.map((indent) => (
          <Card key={indent.id} sx={{ my: 2 }}>
            <CardContent>
              <Typography variant="h6">{indent.itemName}</Typography>
              <Typography>Quantity: {indent.quantity}</Typography>
              <Typography>Cost per piece: ₹{indent.perPieceCost}</Typography>
              <Typography>Description: {indent.description}</Typography>

              <TextField
                label="Store Remark"
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
                Approve and Forward to Finance
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default StoreView;
