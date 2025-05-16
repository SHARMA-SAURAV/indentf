import React, { useEffect, useState } from "react";
import axios from "../api/api"; // Adjust this import path to your axios instance
import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Grid,
  Alert,
  Tabs,
  Tab,
  Box,
} from "@mui/material";

const PurchasePanel = () => {
  const [tab, setTab] = useState(0);
  const [indents, setIndents] = useState([]);
  const [remarkMap, setRemarkMap] = useState({});
  const [gfrIndents, setGfrIndents] = useState([]);
  const [gfrNoteMap, setGfrNoteMap] = useState({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchPendingIndents();
    fetchPendingGFRIndents();
  }, []);

  const handleTabChange = (event, newValue) => setTab(newValue);

  const fetchPendingIndents = async () => {
    try {
      const res = await axios.get("/indent/purchase/pending");
      setIndents(res.data);
    } catch (err) {
      console.error("Failed to fetch purchase indents", err);
    }
  };

  const fetchPendingGFRIndents = async () => {
    try {
      const res = await axios.get("/indent/purchase/gfr/pending");
      setGfrIndents(res.data);
    } catch (err) {
      console.error("Failed to fetch GFR indents", err);
    }
  };

  const handleRemarkChange = (id, value) => {
    setRemarkMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleComplete = async (id) => {
    try {
      await axios.post("/indent/purchase/complete", {
        indentId: id,
        remark: remarkMap[id] || "",
      });
      alert("Indent marked as COMPLETED.");
      fetchPendingIndents();
    } catch (err) {
      alert("Error completing indent.");
    }
  };

  const handleGfrNoteChange = (id, value) => {
    setGfrNoteMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitGFR = async (id) => {
    try {
      await axios.post("/indent/purchase/gfr/submit", {
        indentId: id,
        gfrNote: gfrNoteMap[id] || "",
      });
      setStatus("GFR submitted successfully.");
      fetchPendingGFRIndents();
    } catch (err) {
      console.error("GFR submission failed", err);
      setStatus("Error submitting GFR.");
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        p: 4,
        bgcolor: "#fafafa",
        boxSizing: "border-box",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 700,
          color: "#1a237e",
          letterSpacing: 1,
        }}
      >
        Purchase Panel
      </Typography>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          borderBottom: 1,
          borderColor: "divider",
          "& .MuiTabs-indicator": {
            backgroundColor: "#3949ab",
            height: 3,
          },
          "& .MuiTab-root": {
            fontWeight: 600,
            textTransform: "none",
            fontSize: "1rem",
            color: "#3949ab",
          },
          "& .Mui-selected": {
            color: "#1a237e",
          },
        }}
      >
        <Tab label="Pending Indents" />
        <Tab label="GFR Submission" />
      </Tabs>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          pr: 1,
        }}
      >
        {tab === 0 && (
          <>
            {indents.length === 0 ? (
              <Typography
                sx={{
                  color: "#757575",
                  fontStyle: "italic",
                  textAlign: "center",
                  mt: 4,
                }}
              >
                No indents at Purchase stage.
              </Typography>
            ) : (
              indents.map((indent) => (
                <Card
                  key={indent.id}
                  sx={{
                    mb: 3,
                    boxShadow:
                      "0 2px 8px rgba(63, 81, 181, 0.1), 0 1px 3px rgba(63, 81, 181, 0.06)",
                    borderRadius: 2,
                  }}
                >
                  <CardHeader
                    subheader={
                      <Typography
                        component="span"
                        fontWeight="bold"
                        color="#283593"
                      >
                        Item: {indent.itemName}
                      </Typography>
                    }
                    sx={{ pb: 0 }}
                  />
                  <CardContent sx={{ pt: 1 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography
                          variant="body2"
                          sx={{ mb: 0.5, color: "#424242" }}
                        >
                          <strong>Quantity:</strong> {indent.quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body2"
                          sx={{ mb: 0.5, color: "#424242" }}
                        >
                          <strong>Department:</strong>{" "}
                          {indent.requestedBy?.department || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          margin="dense"
                          label="Purchase Remark"
                          variant="outlined"
                          value={remarkMap[indent.id] || ""}
                          onChange={(e) =>
                            handleRemarkChange(indent.id, e.target.value)
                          }
                          sx={{
                            bgcolor: "white",
                            borderRadius: 1,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          display="flex"
                          justifyContent="flex-end"
                          sx={{ mt: 2 }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{
                              textTransform: "none",
                              fontWeight: 600,
                              bgcolor: "#3949ab",
                              "&:hover": { bgcolor: "#303f9f" },
                            }}
                            onClick={() => handleComplete(indent.id)}
                          >
                            Mark as Completed
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))
            )}
          </>
        )}

        {tab === 1 && (
          <>
            {status && (
              <Alert
                severity="info"
                sx={{ mb: 2, fontWeight: 600, bgcolor: "#e8eaf6", color: "#1a237e" }}
              >
                {status}
              </Alert>
            )}

            {gfrIndents.length === 0 ? (
              <Typography
                sx={{
                  color: "#757575",
                  fontStyle: "italic",
                  textAlign: "center",
                  mt: 4,
                }}
              >
                No indents awaiting GFR submission.
              </Typography>
            ) : (
              gfrIndents.map((indent) => (
                <Card
                  key={indent.id}
                  sx={{
                    mb: 3,
                    boxShadow:
                      "0 2px 8px rgba(63, 81, 181, 0.1), 0 1px 3px rgba(63, 81, 181, 0.06)",
                    borderRadius: 2,
                  }}
                >
                  <CardHeader
                    subheader={
                      <Typography
                        fontWeight="bold"
                        color="#283593"
                      >
                        {indent.itemName}
                      </Typography>
                    }
                    sx={{ pb: 0 }}
                  />
                  <CardContent sx={{ pt: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ mb: 0.5, color: "#424242" }}
                    >
                      <strong>Project Name:</strong> {indent.projectName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mb: 0.5, color: "#424242" }}
                    >
                      <strong>Quantity:</strong> {indent.quantity}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mb: 0.5, color: "#424242" }}
                    >
                      <strong>Cost per piece:</strong> ₹{indent.perPieceCost}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mb: 0.5, color: "#424242" }}
                    >
                      <strong>Description:</strong> {indent.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, color: "#424242" }}
                    >
                      <strong>Approved By:</strong>{" "}
                      {indent.approvedBy?.username || "N/A"}
                    </Typography>

                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      margin="dense"
                      label="GFR Note"
                      variant="outlined"
                      value={gfrNoteMap[indent.id] || ""}
                      onChange={(e) =>
                        handleGfrNoteChange(indent.id, e.target.value)
                      }
                      sx={{
                        bgcolor: "white",
                        borderRadius: 1,
                      }}
                    />

                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      sx={{ mt: 2 }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          bgcolor: "#3949ab",
                          "&:hover": { bgcolor: "#303f9f" },
                        }}
                        onClick={() => handleSubmitGFR(indent.id)}
                      >
                        Submit GFR
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default PurchasePanel;
