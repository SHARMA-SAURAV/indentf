




// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   MenuItem,
//   Alert,
//   Box,
//   Divider,
//   Stack,
// } from "@mui/material";
// import axios from "../api/api";

// const FLADashboard = () => {
//   const [indents, setIndents] = useState([]);
//   const [slaList, setSlaList] = useState([]);
//   const [remarks, setRemarks] = useState({});
//   const [selectedSla, setSelectedSla] = useState({});
//   const [status, setStatus] = useState("");

//   useEffect(() => {
//     fetchIndents();
//     fetchSLAs();
//   }, []);

//   const fetchIndents = async () => {
//     try {
//       const res = await axios.get("/indent/fla/pending");
//       setIndents(res.data);
//     } catch (err) {
//       console.error("Failed to load indents", err);
//     }
//   };

//   const fetchSLAs = async () => {
//     try {
//       const res = await axios.get("/auth/users/by-role?role=SLA");
//       setSlaList(res.data);
//     } catch (err) {
//       console.error("Failed to load SLA list", err);
//     }
//   };

//   const handleApprove = async (indentId) => {
//     try {
//       const payload = {
//         indentId,
//         remark: remarks[indentId] || "",
//         slaId: selectedSla[indentId],
//       };
//       await axios.post("/indent/fla/approve", payload);
//       setStatus("Indent approved and forwarded.");
//       fetchIndents();
//     } catch (err) {
//       console.error("Error approving indent", err);
//       setStatus("Failed to approve.");
//     }
//   };

//   const handleReject = async (indentId) => {
//     try {
//       const payload = {
//         indentId,
//         remark: remarks[indentId] || "",
//       };
//       await axios.post("/indent/fla/reject", payload);
//       setStatus("Indent rejected successfully.");
//       fetchIndents();
//     } catch (err) {
//       console.error("Error rejecting indent", err);
//       setStatus("Failed to reject indent.");
//     }
//   };

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h6" gutterBottom>
//           FLA Dashboard - Pending Indents
//         </Typography>

//         {status && (
//           <Alert severity="info" sx={{ mb: 2 }}>
//             {status}
//           </Alert>
//         )}

//         {indents.length === 0 ? (
//           <Typography>No pending indents.</Typography>
//         ) : (
//           indents.map((indent) => (
//             <Box
//               key={indent.id}
//               sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}
//             >
//               <Typography><strong>Item:</strong> {indent.itemName}</Typography>
//               <Typography><strong>Quantity:</strong> {indent.quantity}</Typography>
//               <Typography><strong>Description:</strong> {indent.description}</Typography>

//               <TextField
//                 label="Remark"
//                 fullWidth
//                 margin="normal"
//                 value={remarks[indent.id] || ""}
//                 onChange={(e) =>
//                   setRemarks({ ...remarks, [indent.id]: e.target.value })
//                 }
//               />

//               <TextField
//                 select
//                 label="Select SLA"
//                 fullWidth
//                 margin="normal"
//                 value={selectedSla[indent.id] || ""}
//                 onChange={(e) =>
//                   setSelectedSla({
//                     ...selectedSla,
//                     [indent.id]: e.target.value,
//                   })
//                 }
//               >
//                 {slaList.map((sla) => (
//                   <MenuItem key={sla.id} value={sla.id}>
//                     {sla.username}
//                   </MenuItem>
//                 ))}
//               </TextField>

//               <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
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
//                   onClick={() => handleReject(indent.id)}
//                 >
//                   Reject
//                 </Button>
//               </Stack>

//               <Divider sx={{ mt: 3 }} />
//             </Box>
//           ))
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default FLADashboard;








import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";



import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import axios from "../api/api";

const COLORS = {
  background: "linear-gradient(135deg, #FAFAFA 0%, #EDEDED 100%)",
  cardBg: "rgba(255, 255, 255, 0.95)",
  textPrimary: "#444950",
  textSecondary: "#8E99A3",
  accent: "#0d47a1",
  error: "#D32F2F",
  success: "#2E7D32",
};

const FLADashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [indents, setIndents] = useState([]);
  const [slaList, setSlaList] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [selectedSla, setSelectedSla] = useState({});
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [dialog, setDialog] = useState({ open: false, type: "", indentId: null });

  useEffect(() => {
    fetchIndents();
    fetchSLAs();
  }, []);

  const fetchIndents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/indent/fla/pending");
      setIndents(res.data);
    } catch {
      showSnackbar("Failed to load indents.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchSLAs = async () => {
    try {
      const res = await axios.get("/auth/users/by-role?role=SLA");
      setSlaList(res.data);
    } catch {
      showSnackbar("Failed to load SLA list.", "error");
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const openDialog = (type, indentId) => {
    setDialog({ open: true, type, indentId });
  };

  const closeDialog = () => {
    setDialog({ open: false, type: "", indentId: null });
  };

  const handleApprove = async (indentId) => {
    if (!selectedSla[indentId]) {
      showSnackbar("Please select an SLA before approving.", "error");
      closeDialog();
      return;
    }
    if (!remarks[indentId]?.trim()) {
      showSnackbar("Please provide a remark before approving.", "error");
      closeDialog();
      return;
    }
    try {
      setLoading(true);
      const payload = {
        indentId,
        remark: remarks[indentId],
        slaId: selectedSla[indentId],
      };
      await axios.post("/indent/fla/approve", payload);
      showSnackbar("Indent approved and forwarded.", "success");
      fetchIndents();
    } catch {
      showSnackbar("Failed to approve indent.", "error");
    } finally {
      setLoading(false);
      closeDialog();
    }
  };

  const handleReject = async (indentId) => {
    if (!remarks[indentId]?.trim()) {
      showSnackbar("Please provide a remark before rejecting.", "error");
      closeDialog();
      return;
    }
    try {
      setLoading(true);
      const payload = {
        indentId,
        remark: remarks[indentId],
      };
      await axios.post("/indent/fla/reject", payload);
      showSnackbar("Indent rejected successfully.", "success");
      fetchIndents();
    } catch {
      showSnackbar("Failed to reject indent.", "error");
    } finally {
      setLoading(false);
      closeDialog();
    }
  };

  return (
    <Box
      sx={{
        background: COLORS.background,
        minHeight: "100vh",
        p: isMobile ? 2 : 6,
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Typography
  variant={isMobile ? "h5" : "h4"}
  sx={{
    mb: 5,
    color: COLORS.accent,
    fontWeight: 700,
    textAlign: "center",
    letterSpacing: 1.2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  }}
>
  <FontAwesomeIcon icon={faUser} />
  FLA Dashboard
</Typography>


      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {!loading && indents.length === 0 && (
        <Typography
          variant="body1"
          sx={{ color: COLORS.textSecondary, textAlign: "center", mt: 8 }}
        >
          No pending indents.
        </Typography>
      )}

      {indents.map((indent) => {
        const remark = remarks[indent.id]?.trim();
        const sla = selectedSla[indent.id];

        return (
          <Card
            key={indent.id}
            elevation={6}
            sx={{
              maxWidth: 720,
              mx: "auto",
              mb: 5,
              backgroundColor: COLORS.cardBg,
              borderRadius: 3,
              boxShadow: `0 3px 10px rgba(26, 35, 126, 0.2)`,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: `0 10px 30px rgba(26, 35, 126, 0.4)`,
              },
            }}
            tabIndex={0}
            role="region"
            aria-labelledby={`indent-title-${indent.id}`}
          >
            <CardContent>
  <Stack direction="row" spacing={4} flexWrap="wrap" mb={2}></Stack>

  

  <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
  <strong>Project Name:</strong> {indent.projectName}
</Typography>

  <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
  <strong>Item Name:</strong> {indent.itemName}
</Typography>



<Typography variant="body2" sx={{ color: COLORS.textPrimary, fontWeight: 400 }}>
    <strong>Indent Id:</strong> {indent.id}
  </Typography>
  <Typography variant="body2" sx={{ color: COLORS.textPrimary }}>
  <strong>Department:</strong> {indent.department}
</Typography>
  

<Typography variant="body2" sx={{ color: COLORS.textPrimary }}>
  <strong>Quantity:</strong> {indent.quantity}
</Typography>

<Typography variant="body2" sx={{ color: COLORS.textPrimary }}>
  <strong>Per Piece Cost:</strong> {indent.perPieceCost}
</Typography>

<Typography variant="body2" sx={{ color: COLORS.textPrimary }}>
  <strong>Total Cost:</strong> {indent.perPieceCost * indent.quantity}
</Typography>

<Typography variant="body2" sx={{ color: COLORS.textPrimary }}>
  <strong>Indent Status:</strong> {indent.status}
</Typography>

<Typography variant="body2" sx={{ color: COLORS.textPrimary }}>
  <strong>Description:</strong> {indent.description}
</Typography>



              <TextField
                label="Remark"
                fullWidth
                margin="normal"
                size="small"
                multiline
                minRows={2}
                value={remarks[indent.id] || ""}
                onChange={(e) =>
                  setRemarks({ ...remarks, [indent.id]: e.target.value })
                }
                required
              />

              <TextField
                select
                label="Select SLA"
                fullWidth
                margin="normal"
                size="small"
                value={selectedSla[indent.id] || ""}
                onChange={(e) =>
                  setSelectedSla({ ...selectedSla, [indent.id]: e.target.value })
                }
                displayEmpty
                required
              >
                <MenuItem disabled value="">
                  -- Select SLA --
                </MenuItem>
                {slaList.map((sla) => (
                  <MenuItem key={sla.id} value={sla.id}>
                    {sla.username}
                  </MenuItem>
                ))}
              </TextField>

              <Stack
                direction={isMobile ? "column" : "row"}
                spacing={2}
                sx={{ mt: 3 }}
                justifyContent="flex-end"
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: COLORS.accent,
                    "&:hover": { backgroundColor: "#3F51B5" },
                  }}
                  disabled={!sla || !remark || loading}
                  onClick={() => openDialog("approve", indent.id)}
                >
                  Approve & Forward
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  disabled={!remark || loading}
                  onClick={() => openDialog("reject", indent.id)}
                >
                  Reject
                </Button>
              </Stack>
            </CardContent>
          </Card>
        );
      })}

      <Dialog open={dialog.open} onClose={closeDialog}>
        <DialogTitle>
          {dialog.type === "approve" ? "Confirm Approve" : "Confirm Reject"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialog.type === "approve"
              ? "Are you sure you want to approve and forward this indent?"
              : "Are you sure you want to reject this indent?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() =>
              dialog.type === "approve"
                ? handleApprove(dialog.indentId)
                : handleReject(dialog.indentId)
            }
            color={dialog.type === "approve" ? "primary" : "error"}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FLADashboard;
