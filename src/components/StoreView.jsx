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
}) => (
  <Fade in timeout={500 + index * 150} key={indent.id}>
    <Card
      sx={{
        my: 3,
        backgroundColor: CARD_BG,
        color: TEXT_COLOR,
        borderRadius: 3,
        boxShadow: `0 4px 12px ${SHADOW_COLOR}`,
      }}
    >
      <CardContent>
      <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>
  <strong>Project Name:</strong> {indent.projectName}
</Typography>

<Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>
  <strong>Item Name:</strong> {indent.itemName}
</Typography>

<Typography><strong>Indent Id:</strong> {indent.id}</Typography>
<Typography><strong>Quantity:</strong> {indent.quantity}</Typography>
<Typography><strong>PerPieceCost:</strong> {indent.perPieceCost}</Typography>
<Typography><strong>Total Cost:</strong> {indent.totalCost}</Typography>
<Typography><strong>Department:</strong> {indent.department}</Typography>
<Typography><strong>Indent Status:</strong> {indent.status}</Typography>
<Typography><strong>Description:</strong> {indent.description}</Typography>

       
        <TextField
          label="Store Remark"
          fullWidth
          multiline
          rows={2}
          sx={inputFieldSx}
          value={remark || ""}
          onChange={(e) => onRemarkChange(indent.id, e.target.value)}
        />

        <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: ACCENT_COLOR,
              "&:hover": { backgroundColor: "#4957a0" },
            }}
            onClick={() => onApprove(indent.id)}
          >
            Approve & Forward
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onRejectClick(indent.id)}
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
        background: GRADIENT_BG,
        padding: 4,
        color: TEXT_COLOR,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: ACCENT_COLOR, fontWeight: "bold" }}>
      <FontAwesomeIcon icon={faUser} />

          Store Dashboard
        </Typography>
      </Box>

      {indents.length === 0 ? (
        <Typography sx={{ mt: 4, color: SUBTEXT_COLOR, textAlign: "center" }}>
          No pending indents for Store
        </Typography>
      ) : (
        indents.map((indent, index) => (
          <IndentCard
            key={indent.id}
            indent={indent}
            remark={remarks[indent.id]}
            onRemarkChange={handleRemarkChange}
            onApprove={handleApprove}
            onRejectClick={openRejectDialog}
            index={index}
          />
        ))
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
