// // // src/pages/StoreView.jsx
// // import React, { useEffect, useState } from "react";
// // import axios from "../api/api";
// // import {
// //   Card,
// //   CardContent,
// //   Typography,
// //   Button,
// //   TextField,
// //   Box,
// //   CircularProgress,
// // } from "@mui/material";

// // const StoreView = () => {
// //   const [indents, setIndents] = useState([]);
// //   const [remarks, setRemarks] = useState({});
// //   const [loading, setLoading] = useState(true);

// //   const fetchIndents = async () => {
// //     try {
// //       const res = await axios.get("/indent/store/pending", {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem("token")}`,
// //         },
// //       });
// //       setIndents(res.data);
// //     } catch (err) {
// //       console.error("Error fetching store indents", err);
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
// //         "/indent/store/approve",
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
// //       alert("Indent approved and forwarded to Finance");
// //       fetchIndents(); // refresh
// //     } catch (err) {
// //       console.error("Approval failed", err);
// //       alert("Something went wrong.");
// //     }
// //   };

// //   if (loading) return <CircularProgress />;

// //   return (
// //     <Box p={2}>
// //       <Typography variant="h5" gutterBottom>
// //         Store Approval Panel
// //       </Typography>
// //       {indents.length === 0 ? (
// //         <Typography>No pending indents for Store</Typography>
// //       ) : (
// //         indents.map((indent) => (
// //           <Card key={indent.id} sx={{ my: 2 }}>
// //             <CardContent>
// //               <Typography variant="h6">{indent.itemName}</Typography>
// //               <Typography>Quantity: {indent.quantity}</Typography>
// //               <Typography>Cost per piece: ₹{indent.perPieceCost}</Typography>
// //               <Typography>Description: {indent.description}</Typography>

// //               <TextField
// //                 label="Store Remark"
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
// //                 Approve and Forward to Finance
// //               </Button>
// //             </CardContent>
// //           </Card>
// //         ))
// //       )}
// //     </Box>
// //   );
// // };

// // export default StoreView;














// // src/pages/StoreView.jsx
// import React, { useEffect, useState } from "react";
// import axios from "../api/api";
// import {
//   Card, CardContent, Typography, Button, TextField, Box, CircularProgress,
//   Dialog, DialogTitle, DialogContent, DialogActions
// } from "@mui/material";

// const StoreView = () => {
//   const [indents, setIndents] = useState([]);
//   const [remarks, setRemarks] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
//   const [selectedIndentId, setSelectedIndentId] = useState(null);

//   const fetchIndents = async () => {
//     try {
//       const res = await axios.get("/indent/store/pending", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setIndents(res.data);
//     } catch (err) {
//       console.error("Error fetching store indents", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchIndents();
//   }, []);

//   const handleApprove = async (indentId) => {
//     const remark = remarks[indentId] || "";
//     try {
//       await axios.post(
//         "/indent/store/approve",
//         { indentId, remark },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       alert("Indent approved and forwarded to Finance");
//       fetchIndents(); // refresh
//     } catch (err) {
//       console.error("Approval failed", err);
//       alert("Something went wrong.");
//     }
//   };

//   const handleReject = async () => {
//     try {
//       await axios.post(
//         "/indent/store/reject",
//         {
//           indentId: selectedIndentId,
//           remark: remarks[selectedIndentId] || "",
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       alert("Indent rejected by Store");
//       setRejectDialogOpen(false);
//       fetchIndents();
//     } catch (err) {
//       console.error("Rejection failed", err);
//       alert("Something went wrong.");
//     }
//   };

//   if (loading) return <CircularProgress />;

//   return (
//     <Box p={2}>
//       <Typography variant="h5" gutterBottom>
//         Store Approval Panel
//       </Typography>
//       {indents.length === 0 ? (
//         <Typography>No pending indents for Store</Typography>
//       ) : (
//         indents.map((indent) => (
//           <Card key={indent.id} sx={{ my: 2 }}>
//             <CardContent>
//               <Typography variant="h6">{indent.itemName}</Typography>
//               <Typography>Quantity: {indent.quantity}</Typography>
//               <Typography>Cost per piece: ₹{indent.perPieceCost}</Typography>
//               <Typography>Description: {indent.description}</Typography>

//               <TextField
//                 label="Store Remark"
//                 fullWidth
//                 multiline
//                 rows={2}
//                 sx={{ mt: 2 }}
//                 value={remarks[indent.id] || ""}
//                 onChange={(e) =>
//                   setRemarks({ ...remarks, [indent.id]: e.target.value })
//                 }
//               />
//               <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
//                 <Button
//                   variant="contained"
//                   color="success"
//                   onClick={() => handleApprove(indent.id)}
//                 >
//                   Approve and Forward to Finance
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="error"
//                   onClick={() => {
//                     setSelectedIndentId(indent.id);
//                     setRejectDialogOpen(true);
//                   }}
//                 >
//                   Reject
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>
//         ))
//       )}

//       {/* Reject Dialog */}
//       <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
//         <DialogTitle>Reject Indent</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Rejection Remark"
//             fullWidth
//             multiline
//             rows={3}
//             value={remarks[selectedIndentId] || ""}
//             onChange={(e) =>
//               setRemarks({ ...remarks, [selectedIndentId]: e.target.value })
//             }
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleReject} color="error" variant="contained">
//             Submit Rejection
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default StoreView;



// src/pages/StoreView.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Grid,
} from "@mui/material";

const GRADIENT_BG = "linear-gradient(135deg, #FAFAFA 0%, #EDEDED 100%)";
const CARD_BG = "rgba(255, 255, 255, 0.95)";
const TEXT_COLOR = "#444950";
const ACCENT_COLOR = "#0d47a1";
const SUBTEXT_COLOR = "#8E99A3";
const SHADOW_COLOR = "rgba(92, 107, 192, 0.25)";

const inputFieldSx = {
  backgroundColor: "#fff",
  input: { color: TEXT_COLOR },
  textarea: { color: TEXT_COLOR },
  label: { color: SUBTEXT_COLOR },
  "& label.Mui-focused": { color: ACCENT_COLOR },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: ACCENT_COLOR },
    "&:hover fieldset": { borderColor: ACCENT_COLOR },
    "&.Mui-focused fieldset": { borderColor: ACCENT_COLOR },
  },
};

const IndentCard = ({
  indent,
  remark,
  onRemarkChange,
  onApprove,
  onRejectClick,
  index,
  actionLoading,
  approvingId,
}) => (
  <Fade in timeout={500 + index * 150} key={indent.id}>
    <Card
      sx={{
        my: 3,
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
            <Typography sx={{ fontWeight: 700, fontSize: 20, color: '#0d47a1', lineHeight: 1 }}>{indent.itemName}</Typography>
            <Typography sx={{ color: '#b0b8c1', fontWeight: 500, fontSize: 15, mt: 0.2 }}>Project: {indent.projectName}</Typography>
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
          label="Store Remark *"
          fullWidth
          required
          multiline
          rows={2}
          sx={{ background: '#f6f8fa', borderRadius: 2, mb: 1, fontWeight: 500 }}
          value={remark || ""}
          onChange={(e) => onRemarkChange(indent.id, e.target.value)}
        />
        <Box sx={{ mt: 2.5, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            sx={{
              background: remark && remark.trim() !== '' ? 'linear-gradient(90deg, #0d47a1 60%, #42a5f5 100%)' : '#b0b8c1',
              fontWeight: 800,
              px: 3,
              borderRadius: 2,
              boxShadow: '0 2px 8px #0d47a122',
              textTransform: 'none',
              fontSize: 16,
              letterSpacing: 0.5,
              minWidth: 170,
              transition: 'all 0.18s',
              '&:hover': remark && remark.trim() !== '' ? { background: 'linear-gradient(90deg, #1565c0 60%, #64b5f6 100%)', transform: 'translateY(-2px) scale(1.03)' } : {},
            }}
            onClick={() => onApprove(indent.id)}
            disabled={actionLoading || !remark || remark.trim() === ''}
            endIcon={actionLoading && approvingId === indent.id ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {actionLoading && approvingId === indent.id ? 'Processing...' : 'Approve & Forward'}
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
            onClick={() => onRejectClick(indent.id)}
            disabled={actionLoading}
          >
            Reject
          </Button>
        </Box>
      </CardContent>
    </Card>
  </Fade>
);

const RejectDialog = ({
  open,
  onClose,
  onSubmit,
  remark,
  onRemarkChange,
  accentColor,
  cardBg,
  textColor,
  subTextColor,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: { backgroundColor: cardBg, color: textColor, borderRadius: 2 },
    }}
  >
    <DialogTitle sx={{ color: accentColor }}>Reject Indent</DialogTitle>
    <DialogContent>
      <TextField
        label="Rejection Remark"
        fullWidth
        multiline
        rows={3}
        sx={{
          mt: 1,
          backgroundColor: "#fff",
          input: { color: textColor },
          textarea: { color: textColor },
          label: { color: subTextColor },
          "& label.Mui-focused": { color: accentColor },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: accentColor },
            "&:hover fieldset": { borderColor: accentColor },
            "&.Mui-focused fieldset": { borderColor: accentColor },
          },
        }}
        value={remark || ""}
        onChange={(e) => onRemarkChange(e.target.value)}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} sx={{ color: accentColor }}>
        Cancel
      </Button>
      <Button
        onClick={onSubmit}
        variant="contained"
        color="error"
        sx={{ backgroundColor: "#d32f2f", "&:hover": { backgroundColor: "#c62828" } }}
      >
        Submit Rejection
      </Button>
    </DialogActions>
  </Dialog>
);

const StoreView = () => {
  const [indents, setIndents] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedIndentId, setSelectedIndentId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  const fetchIndents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/indent/store/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIndents(res.data);
    } catch (err) {
      console.error("Error fetching store indents", err);
      alert("Failed to load indents, please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndents();
  }, [fetchIndents]);

  const handleApprove = useCallback(
    async (indentId) => {
      const remark = remarks[indentId] || "";
      if (!remark || remark.trim() === "") {
        alert("Remark is required to approve.");
        return;
      }
      setActionLoading(true);
      setApprovingId(indentId);
      try {
        await axios.post(
          "/indent/store/approve",
          { indentId, remark },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert("Indent approved and forwarded to Finance");
        fetchIndents();
      } catch (err) {
        console.error("Approval failed", err);
        alert("Something went wrong during approval.");
      } finally {
        setActionLoading(false);
        setApprovingId(null);
      }
    },
    [remarks, fetchIndents]
  );

  const handleReject = useCallback(async () => {
    try {
      await axios.post(
        "/indent/store/reject",
        {
          indentId: selectedIndentId,
          remark: remarks[selectedIndentId] || "",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Indent rejected by Store");
      setRejectDialogOpen(false);
      fetchIndents();
    } catch (err) {
      console.error("Rejection failed", err);
      alert("Something went wrong during rejection.");
    }
  }, [remarks, selectedIndentId, fetchIndents]);

  const handleRemarkChange = useCallback(
    (indentId, value) => {
      setRemarks((prev) => ({ ...prev, [indentId]: value }));
    },
    []
  );

  const handleDialogRemarkChange = useCallback((value) => {
    if (selectedIndentId !== null) {
      setRemarks((prev) => ({ ...prev, [selectedIndentId]: value }));
    }
  }, [selectedIndentId]);

  const openRejectDialog = useCallback((indentId) => {
    setSelectedIndentId(indentId);
    setRejectDialogOpen(true);
  }, []);

  const closeRejectDialog = useCallback(() => {
    setRejectDialogOpen(false);
    setSelectedIndentId(null);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: GRADIENT_BG,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: ACCENT_COLOR }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e3eafc 100%)",
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
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: ACCENT_COLOR, fontWeight: "bold", letterSpacing: 1.2, textShadow: '0 2px 12px #e3eafc', display: 'flex', alignItems: 'center', gap: 1 }}>
          <FontAwesomeIcon icon={faUser} /> Store Dashboard
        </Typography>
      </Box>
      {indents.length === 0 ? (
        <Typography sx={{ mt: 4, color: SUBTEXT_COLOR, textAlign: "center", fontWeight: 600, fontSize: 22 }}>
          No pending indents for Store
        </Typography>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {indents.map((indent, index) => (
            <Grid item xs={12} sm={6} md={6} lg={5} xl={4} key={indent.id} display="flex" justifyContent="center">
              <IndentCard
                indent={indent}
                remark={remarks[indent.id]}
                onRemarkChange={handleRemarkChange}
                onApprove={handleApprove}
                onRejectClick={openRejectDialog}
                index={index}
                actionLoading={actionLoading}
                approvingId={approvingId}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <RejectDialog
        open={rejectDialogOpen}
        onClose={closeRejectDialog}
        onSubmit={handleReject}
        remark={remarks[selectedIndentId]}
        onRemarkChange={handleDialogRemarkChange}
        accentColor={ACCENT_COLOR}
        cardBg={CARD_BG}
        textColor={TEXT_COLOR}
        subTextColor={SUBTEXT_COLOR}
      />
    </Box>
  );
};

export default StoreView;
