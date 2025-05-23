// // // src/pages/SLAView.jsx
// // import React, { useEffect, useState } from "react";
// // // import axios from "axios";
// // import axios from "../api/api";
// // import {
// //   Card, CardContent, Typography, Button, TextField, Box, CircularProgress
// // } from "@mui/material";

// // const SLAView = () => {
// //   const [indents, setIndents] = useState([]);
// //   const [remarks, setRemarks] = useState({});
// //   const [loading, setLoading] = useState(true);

// //   const fetchIndents = async () => {
// //     try {
// //       const res = await axios.get("/indent/sla/pending", {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem("token")}`,
// //         },
// //       });
// //       setIndents(res.data);
// //     } catch (err) {
// //       console.error("Error fetching indents", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchIndents();
// //   }, []);

// //   const handleApprove = async (indentId) => {
// //     const remark = remarks[indentId] || "";
// //     try {
// //       await axios.post(
// //         "/indent/sla/approve",
// //         {
// //           indentId,
// //           remark,
// //         },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //           },
// //         }
// //       );
// //       alert("Indent approved and forwarded to Store");
// //       fetchIndents(); // Refresh list
// //     } catch (err) {
// //       console.error("Approval failed", err);
// //       alert("Something went wrong.");
// //     }
// //   };

// //   if (loading) return <CircularProgress />;

// //   return (
// //     <Box p={2}>
// //       <Typography variant="h5" gutterBottom>
// //         SLA Approval Panel
// //       </Typography>
// //       {indents.length === 0 ? (
// //         <Typography>No pending indents for SLA</Typography>
// //       ) : (
// //         indents.map((indent) => (
// //           <Card key={indent.id} sx={{ my: 2 }}>
// //             <CardContent>
// //               <Typography variant="h6">{indent.itemName}</Typography>
// //               <Typography>Quantity: {indent.quantity}</Typography>
// //               <Typography>Cost per piece: ₹{indent.perPieceCost}</Typography>
// //               <Typography>Description: {indent.description}</Typography>

// //               <TextField
// //                 label="SLA Remark"
// //                 fullWidth
// //                 multiline
// //                 rows={2}
// //                 sx={{ mt: 2 }}
// //                 value={remarks[indent.id] || ""}
// //                 onChange={(e) =>
// //                   setRemarks({ ...remarks, [indent.id]: e.target.value })
// //                 }
// //               />
// //               <Button
// //                 variant="contained"
// //                 sx={{ mt: 2 }}
// //                 onClick={() => handleApprove(indent.id)}
// //               >
// //                 Approve and Forward to Store
// //               </Button>
// //             </CardContent>
// //           </Card>
// //         ))
// //       )}
// //     </Box>
// //   );
// // };

// // export default SLAView;













// // import React, { useEffect, useState } from "react";
// // import axios from "../api/api";
// // import {
// //   Card, CardContent, Typography, Button, TextField, Box, CircularProgress,
// //   Dialog, DialogTitle, DialogContent, DialogActions
// // } from "@mui/material";

// // const SLAView = () => {
// //   const [indents, setIndents] = useState([]);
// //   const [remarks, setRemarks] = useState({});
// //   const [loading, setLoading] = useState(true);
// //   const [openReject, setOpenReject] = useState(false);
// //   const [rejectingIndentId, setRejectingIndentId] = useState(null);

// //   const fetchIndents = async () => {
// //     try {
// //       const res = await axios.get("/indent/sla/pending", {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem("token")}`,
// //         },
// //       });
// //       setIndents(res.data);
// //     } catch (err) {
// //       console.error("Error fetching indents", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchIndents();
// //   }, []);

// //   const handleApprove = async (indentId) => {
// //     const remark = remarks[indentId] || "";
// //     try {
// //       await axios.post("/indent/sla/approve", { indentId, remark });
// //       alert("Indent approved and forwarded to Store");
// //       fetchIndents();
// //     } catch (err) {
// //       console.error("Approval failed", err);
// //       alert("Something went wrong.");
// //     }
// //   };

// //   const handleOpenReject = (indentId) => {
// //     setRejectingIndentId(indentId);
// //     setOpenReject(true);
// //   };

// //   const handleReject = async () => {
// //     const remark = remarks[rejectingIndentId] || "";
// //     try {
// //       await axios.post("/indent/sla/reject", {
// //         indentId: rejectingIndentId,
// //         remark,
// //       });
// //       alert("Indent rejected by SLA");
// //       setOpenReject(false);
// //       setRejectingIndentId(null);
// //       fetchIndents();
// //     } catch (err) {
// //       console.error("Rejection failed", err);
// //       alert("Failed to reject indent.");
// //     }
// //   };

// //   if (loading) return <CircularProgress />;

// //   return (
// //     <Box p={2}>
// //       <Typography variant="h5" gutterBottom>
// //         SLA Approval Panel
// //       </Typography>
// //       {indents.length === 0 ? (
// //         <Typography>No pending indents for SLA</Typography>
// //       ) : (
// //         indents.map((indent) => (
// //           <Card key={indent.id} sx={{ my: 2 }}>
// //             <CardContent>
// //               <Typography variant="h6">{indent.itemName}</Typography>
// //               <Typography>Quantity: {indent.quantity}</Typography>
// //               <Typography>Cost per piece: ₹{indent.perPieceCost}</Typography>
// //               <Typography>Description: {indent.description}</Typography>

// //               <TextField
// //                 label="SLA Remark"
// //                 fullWidth
// //                 multiline
// //                 rows={2}
// //                 sx={{ mt: 2 }}
// //                 value={remarks[indent.id] || ""}
// //                 onChange={(e) =>
// //                   setRemarks({ ...remarks, [indent.id]: e.target.value })
// //                 }
// //               />

// //               <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
// //                 <Button
// //                   variant="contained"
// //                   color="primary"
// //                   onClick={() => handleApprove(indent.id)}
// //                 >
// //                   Approve and Forward
// //                 </Button>

// //                 <Button
// //                   variant="outlined"
// //                   color="error"
// //                   onClick={() => handleOpenReject(indent.id)}
// //                 >
// //                   Reject
// //                 </Button>
// //               </Box>
// //             </CardContent>
// //           </Card>
// //         ))
// //       )}

// //       {/* Reject Remark Dialog */}
// //       <Dialog open={openReject} onClose={() => setOpenReject(false)}>
// //         <DialogTitle>Reject Indent</DialogTitle>
// //         <DialogContent>
// //           <TextField
// //             label="Rejection Remark"
// //             multiline
// //             rows={4}
// //             fullWidth
// //             value={remarks[rejectingIndentId] || ""}
// //             onChange={(e) =>
// //               setRemarks({ ...remarks, [rejectingIndentId]: e.target.value })
// //             }
// //           />
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={() => setOpenReject(false)}>Cancel</Button>
// //           <Button variant="contained" color="error" onClick={handleReject}>
// //             Confirm Reject
// //           </Button>
// //         </DialogActions>
// //       </Dialog>
// //     </Box>
// //   );
// // };

// // export default SLAView;



import React, { useEffect, useState, useCallback } from "react";
import axios from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";

// Theme Constants
const CARD_BG = "rgba(255, 255, 255, 0.95)";
const TEXT_COLOR = "#444950";
const ACCENT_COLOR = "#0d47a1";

const IndentCard = React.memo(({ indent, remark, onRemarkChange, onApprove, onReject, actionLoading }) => (
  <Card
    sx={{
      my: 3,
      mx: 'auto',
      background: '#fff',
      borderRadius: 5,
      boxShadow: '0 8px 32px 0 rgba(13,71,161,0.10)',
      border: 'none',
      maxWidth: 480,
      minWidth: 320,
      position: 'relative',
      overflow: 'hidden',
      p: 0,
      transition: 'box-shadow 0.25s, transform 0.18s',
      '&:hover': {
        boxShadow: '0 16px 48px 0 rgba(13,71,161,0.18)',
        transform: 'scale(1.018)',
      },
    }}
  >
    <CardContent sx={{ p: 4, pb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{
          bgcolor: '#1976d2',
          color: '#fff',
          width: 54,
          height: 54,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 26,
          mr: 2,
          boxShadow: '0 2px 8px #1976d222',
        }}>
          {indent.itemName?.[0]?.toUpperCase() || '?'}
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 20, color: '#0d47a1', lineHeight: 1 }}>Project Name: {indent.projectName}</Typography>
          <Typography sx={{ color: 'Black', fontWeight: 500, fontSize: 15, mt: 0.2 }}>Project:Item Name: {indent.itemName}</Typography>
        </Box>
      </Box>
      <Box sx={{ mb: 1.5 }}>
        <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Indent Id:</b> {indent.id}</Typography>
        <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Department:</b> {indent.department}</Typography>
        <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Quantity:</b> {indent.quantity}</Typography>
        <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Per Piece Cost:</b> {indent.perPieceCost}</Typography>
        <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Total Cost:</b> {indent.totalCost}</Typography>
        <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Status:</b> {indent.status}</Typography>
        <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Description:</b> {indent.description}</Typography>
      </Box>
      <TextField
        label="Remark"
        fullWidth
        margin="normal"
        size="small"
        multiline
        rows={3}
        value={remark || ""}
        onChange={(e) => onRemarkChange(indent.id, e.target.value)}
        sx={{ background: '#f6f8fa', borderRadius: 2, mb: 1 }}
      />
      <Box sx={{ mt: 2.5, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          sx={{
            background: remark ? 'linear-gradient(90deg, #0d47a1 60%, #42a5f5 100%)' : '#b0b8c1',
            fontWeight: 800,
            px: 3,
            borderRadius: 2,
            boxShadow: '0 2px 8px #0d47a122',
            textTransform: 'none',
            fontSize: 16,
            letterSpacing: 0.5,
            minWidth: 170,
            transition: 'all 0.18s',
            '&:hover': remark ? { background: 'linear-gradient(90deg, #1565c0 60%, #64b5f6 100%)', transform: 'translateY(-2px) scale(1.03)' } : {},
          }}
          onClick={() => onApprove(indent.id)}
          disabled={actionLoading || !remark || remark.trim() === ""}
          endIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {actionLoading ? 'Processing...' : 'Approve & Forward'}
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{
            fontWeight: 800,
            px: 3,
            borderRadius: 2,
            borderWidth: 2,
            boxShadow: '0 2px 8px #d32f2f22',
            textTransform: 'none',
            fontSize: 16,
            letterSpacing: 0.5,
            minWidth: 120,
            transition: 'all 0.18s',
            '&:hover': { background: '#fff0f0', transform: 'translateY(-2px) scale(1.03)' },
          }}
          onClick={() => onReject(indent.id)}
          disabled={actionLoading}
        >
          Reject
        </Button>
      </Box>
    </CardContent>
  </Card>
));

const SLAView = () => {
  const [indents, setIndents] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [rejectingIndentId, setRejectingIndentId] = useState(null);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchIndents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/indent/sla/pending", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIndents(res.data);
    } catch (err) {
      // console.error("Error fetching indents", err);
      setError("Failed to load pending indents. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndents();
  }, [fetchIndents]);

  const handleRemarkChange = useCallback((id, value) => {
    setRemarks((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleApprove = useCallback(async (indentId) => {
    if (!remarks[indentId] || remarks[indentId].trim() === "") {
      alert("Remark is required to approve.");
      return;
    }
    const confirmApprove = window.confirm("Are you sure you want to approve this indent?");
    if (!confirmApprove) return;
    setActionLoading(true);
    try {
      await axios.post(
        "/indent/sla/approve",
        {
          indentId,
          remark: remarks[indentId],
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Indent approved and forwarded to Store");
      fetchIndents();
    } catch (err) {
      // console.error("Approval failed", err);
      alert("Something went wrong while approving.");
    } finally {
      setActionLoading(false);
    }
  }, [remarks, fetchIndents]);

  const handleReject = useCallback(async () => {
    if (!remarks[rejectingIndentId] || remarks[rejectingIndentId].trim() === "") {
      alert("Remark is required to reject.");
      return;
    }
    const confirmReject = window.confirm("Are you sure you want to reject this indent?");
    if (!confirmReject) return;
    setActionLoading(true);
    try {
      await axios.post(
        "/indent/sla/reject",
        {
          indentId: rejectingIndentId,
          remark: remarks[rejectingIndentId],
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Indent rejected by SLA");
      handleCloseReject();
      fetchIndents();
    } catch (err) {
      // console.error("Rejection failed", err);
      alert("Failed to reject indent.");
    } finally {
      setActionLoading(false);
    }
  }, [remarks, rejectingIndentId, fetchIndents]);

  const handleOpenReject = useCallback((indentId) => {
    setRejectingIndentId(indentId);
    setOpenReject(true);
  }, []);

  const handleCloseReject = useCallback(() => {
    setOpenReject(false);
    setRejectingIndentId(null);
  }, []);

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e3eafc 100%)',
        minHeight: '100vh',
        py: { xs: 3, md: 6 },
        px: { xs: 1, md: 6 },
        fontFamily: "'Roboto', sans-serif",
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        ml: '-50vw',
        mr: '-50vw',
      }}
    >
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography
          variant="h6"
          align="center"
          mt={4}
          color="error"
          fontWeight={600}
        >
          {error}
        </Typography>
      ) : (
        <>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              mb: 5,
              color: ACCENT_COLOR,
              fontWeight: 700,
              textAlign: "center",
              letterSpacing: 1.2,
            }}
          >
            <FontAwesomeIcon icon={faUser} />
            SLA Dashboard
          </Typography>
          {indents.length === 0 ? (
            <Typography variant="h6" align="center" mt={4}>
              No pending indents for SLA.
            </Typography>
          ) : (
            <Grid container spacing={4} justifyContent="center">
              {indents.map((indent) => (
                <Grid item xs={12} sm={6} md={6} lg={5} xl={4} key={indent.id} display="flex" justifyContent="center">
                  <IndentCard
                    indent={indent}
                    remark={remarks[indent.id]}
                    onRemarkChange={handleRemarkChange}
                    onApprove={handleApprove}
                    onReject={handleOpenReject}
                    actionLoading={actionLoading}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Reject Remark Dialog */}
      <Dialog open={openReject} onClose={handleCloseReject} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Indent</DialogTitle>
        <DialogContent>
          <TextField
            label="Rejection Remark"
            multiline
            rows={4}
            fullWidth
            value={remarks[rejectingIndentId] || ""}
            onChange={(e) => handleRemarkChange(rejectingIndentId, e.target.value)}
            disabled={actionLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReject} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={actionLoading}
          >
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SLAView;