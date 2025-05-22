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













// import React, { useEffect, useState } from "react";
// import axios from "../api/api";
// import {
//   Card, CardContent, Typography, Button, TextField, Box, CircularProgress,
//   Dialog, DialogTitle, DialogContent, DialogActions
// } from "@mui/material";

// const SLAView = () => {
//   const [indents, setIndents] = useState([]);
//   const [remarks, setRemarks] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [openReject, setOpenReject] = useState(false);
//   const [rejectingIndentId, setRejectingIndentId] = useState(null);

//   const fetchIndents = async () => {
//     try {
//       const res = await axios.get("/indent/sla/pending", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setIndents(res.data);
//     } catch (err) {
//       console.error("Error fetching indents", err);
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
//       await axios.post("/indent/sla/approve", { indentId, remark });
//       alert("Indent approved and forwarded to Store");
//       fetchIndents();
//     } catch (err) {
//       console.error("Approval failed", err);
//       alert("Something went wrong.");
//     }
//   };

//   const handleOpenReject = (indentId) => {
//     setRejectingIndentId(indentId);
//     setOpenReject(true);
//   };

//   const handleReject = async () => {
//     const remark = remarks[rejectingIndentId] || "";
//     try {
//       await axios.post("/indent/sla/reject", {
//         indentId: rejectingIndentId,
//         remark,
//       });
//       alert("Indent rejected by SLA");
//       setOpenReject(false);
//       setRejectingIndentId(null);
//       fetchIndents();
//     } catch (err) {
//       console.error("Rejection failed", err);
//       alert("Failed to reject indent.");
//     }
//   };

//   if (loading) return <CircularProgress />;

//   return (
//     <Box p={2}>
//       <Typography variant="h5" gutterBottom>
//         SLA Approval Panel
//       </Typography>
//       {indents.length === 0 ? (
//         <Typography>No pending indents for SLA</Typography>
//       ) : (
//         indents.map((indent) => (
//           <Card key={indent.id} sx={{ my: 2 }}>
//             <CardContent>
//               <Typography variant="h6">{indent.itemName}</Typography>
//               <Typography>Quantity: {indent.quantity}</Typography>
//               <Typography>Cost per piece: ₹{indent.perPieceCost}</Typography>
//               <Typography>Description: {indent.description}</Typography>

//               <TextField
//                 label="SLA Remark"
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
//                   color="primary"
//                   onClick={() => handleApprove(indent.id)}
//                 >
//                   Approve and Forward
//                 </Button>

//                 <Button
//                   variant="outlined"
//                   color="error"
//                   onClick={() => handleOpenReject(indent.id)}
//                 >
//                   Reject
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>
//         ))
//       )}

//       {/* Reject Remark Dialog */}
//       <Dialog open={openReject} onClose={() => setOpenReject(false)}>
//         <DialogTitle>Reject Indent</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Rejection Remark"
//             multiline
//             rows={4}
//             fullWidth
//             value={remarks[rejectingIndentId] || ""}
//             onChange={(e) =>
//               setRemarks({ ...remarks, [rejectingIndentId]: e.target.value })
//             }
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenReject(false)}>Cancel</Button>
//           <Button variant="contained" color="error" onClick={handleReject}>
//             Confirm Reject
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default SLAView;



import React, { useEffect, useState } from "react";
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

  const fetchIndents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/indent/sla/pending", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIndents(res.data);
    } catch (err) {
      console.error("Error fetching indents", err);
      setError("Failed to load pending indents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndents();
  }, []);

  const handleRemarkChange = (id, value) => {
    setRemarks((prev) => ({ ...prev, [id]: value }));
  };

  const handleApprove = async (indentId) => {
    const confirm = window.confirm("Are you sure you want to approve this indent?");
    if (!confirm) return;

    setActionLoading(true);
    try {
      await axios.post(
        "/indent/sla/approve",
        {
          indentId,
          remark: remarks[indentId] || "",
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Indent approved and forwarded to Store");
      fetchIndents();
    } catch (err) {
      console.error("Approval failed", err);
      alert("Something went wrong while approving.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const confirm = window.confirm("Are you sure you want to reject this indent?");
    if (!confirm) return;

    setActionLoading(true);
    try {
      await axios.post(
        "/indent/sla/reject",
        {
          indentId: rejectingIndentId,
          remark: remarks[rejectingIndentId] || "",
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Indent rejected by SLA");
      handleCloseReject();
      fetchIndents();
    } catch (err) {
      console.error("Rejection failed", err);
      alert("Failed to reject indent.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenReject = (indentId) => {
    setRejectingIndentId(indentId);
    setOpenReject(true);
  };

  const handleCloseReject = () => {
    setOpenReject(false);
    setRejectingIndentId(null);
  };

  const IndentCard = ({ indent }) => (
    <Card sx={{ my: 2, backgroundColor: CARD_BG }}>
      <CardContent>
      

<Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>
  <strong>Project Name:</strong> {indent.projectName}
</Typography>

<Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>
  <strong>Item Name:</strong> {indent.itemName}
</Typography>
<Typography sx={{ color: TEXT_COLOR }}>
  <strong>Indent Id:</strong> {indent.id}
</Typography>
<Typography sx={{ color: TEXT_COLOR }}>
  <strong>Quantity:</strong> {indent.quantity}
</Typography>

<Typography sx={{ color: TEXT_COLOR }}>
  <strong>PerPieceCost:</strong> {indent.perPieceCost}
</Typography>

<Typography sx={{ color: TEXT_COLOR }}>
  <strong>Total Cost:</strong> {indent.totalCost}
</Typography>

<Typography sx={{ color: TEXT_COLOR }}>
  <strong>Department:</strong> {indent.department}
</Typography>

<Typography sx={{ color: TEXT_COLOR }}>
  <strong>Indent Status:</strong> {indent.status}
</Typography>

<Typography sx={{ color: TEXT_COLOR }}>
  <strong>Description:</strong> {indent.description}
</Typography>


        <TextField
          label="SLA Remark"
          fullWidth
          multiline
          rows={2}
          sx={{ mt: 2 }}
          value={remarks[indent.id] || ""}
          onChange={(e) => handleRemarkChange(indent.id, e.target.value)}
          disabled={actionLoading}
        />

        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: ACCENT_COLOR }}
            onClick={() => handleApprove(indent.id)}
            disabled={actionLoading}
          >
            Approve and Forward
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleOpenReject(indent.id)}
            disabled={actionLoading}
          >
            Reject
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box p={2}>
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
            indents.map((indent) => (
              <IndentCard key={indent.id} indent={indent} />
            ))
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
