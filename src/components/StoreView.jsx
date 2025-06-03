// // src/pages/StoreView.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import axios from "../api/api";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser } from "@fortawesome/free-solid-svg-icons";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   TextField,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Fade,
//   Grid,
//   Tabs,
//   Tab,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Collapse,
//   IconButton
// } from "@mui/material";
// import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

// const GRADIENT_BG = "linear-gradient(135deg, #FAFAFA 0%, #EDEDED 100%)";
// const CARD_BG = "rgba(255, 255, 255, 0.95)";
// const TEXT_COLOR = "#444950";
// const ACCENT_COLOR = "#0d47a1";
// const SUBTEXT_COLOR = "#8E99A3";
// const SHADOW_COLOR = "rgba(92, 107, 192, 0.25)";

// const inputFieldSx = {
//   backgroundColor: "#fff",
//   input: { color: TEXT_COLOR },
//   textarea: { color: TEXT_COLOR },
//   label: { color: SUBTEXT_COLOR },
//   "& label.Mui-focused": { color: ACCENT_COLOR },
//   "& .MuiOutlinedInput-root": {
//     "& fieldset": { borderColor: ACCENT_COLOR },
//     "&:hover fieldset": { borderColor: ACCENT_COLOR },
//     "&.Mui-focused fieldset": { borderColor: ACCENT_COLOR },
//   },
// };

// const IndentCard = ({
//   indent,
//   remark,
//   onRemarkChange,
//   onApprove,
//   onRejectClick,
//   index,
//   actionLoading,
//   approvingId,
// }) => (
//   <Fade in timeout={500 + index * 150} key={indent.id}>
//     <Card
//       sx={{
//         my: 3,
//         background: '#fff',
//         borderRadius: 5,
//         boxShadow: '0 8px 32px 0 rgba(13,71,161,0.10)',
//         border: 'none',
//         maxWidth: 480,
//         minWidth: 320,
//         position: 'relative',
//         overflow: 'hidden',
//         p: 0,
//         transition: 'box-shadow 0.25s, transform 0.18s',
//         '&:hover': {
//           boxShadow: '0 16px 48px 0 rgba(13,71,161,0.18)',
//           transform: 'scale(1.018)',
//         },
//       }}
//     >
//       <CardContent sx={{ p: 4, pb: 3 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//           <Box sx={{
//             bgcolor: '#1976d2',
//             color: '#fff',
//             width: 54,
//             height: 54,
//             borderRadius: '50%',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontWeight: 700,
//             fontSize: 26,
//             mr: 2,
//             boxShadow: '0 2px 8px #1976d222',
//           }}>
//             {indent.itemName?.[0]?.toUpperCase() || '?'}
//           </Box>
//           <Box>
//             <Typography sx={{ fontWeight: 700, fontSize: 20, color: '#0d47a1', lineHeight: 1 }}>Project Name: {indent.projectName}</Typography>
//             <Typography sx={{ color: '#black', fontWeight: 700, fontSize: 15, mt: 0.2 }}>Item Name: {indent.itemName}</Typography>
//           </Box>
//         </Box>
//         <Box sx={{ mb: 1.5 }}>
//           <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Indent Id:</b> {indent.id}</Typography>
//           <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Department:</b> {indent.department}</Typography>
//           <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Quantity:</b> {indent.quantity}</Typography>
//           <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Per Piece Cost:</b> {indent.perPieceCost}</Typography>
//           <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Total Cost:</b> {indent.totalCost}</Typography>
//           <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Status:</b> {indent.status}</Typography>
//           <Typography sx={{ fontSize: 15, color: '#222', mb: 0.5 }}><b>Description:</b> {indent.description}</Typography>
//         </Box>
//         <TextField
//           label="Store Remark *"
//           fullWidth
//           required
//           multiline
//           rows={2}
//           sx={{ background: '#f6f8fa', borderRadius: 2, mb: 1, fontWeight: 500 }}
//           value={remark || ""}
//           onChange={(e) => onRemarkChange(indent.id, e.target.value)}
//         />
//         <Box sx={{ mt: 2.5, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
//           <Button
//             variant="contained"
//             sx={{
//               background: remark && remark.trim() !== '' ? 'linear-gradient(90deg, #0d47a1 60%, #42a5f5 100%)' : '#b0b8c1',
//               fontWeight: 800,
//               px: 3,
//               borderRadius: 2,
//               boxShadow: '0 2px 8px #0d47a122',
//               textTransform: 'none',
//               fontSize: 16,
//               letterSpacing: 0.5,
//               minWidth: 170,
//               transition: 'all 0.18s',
//               '&:hover': remark && remark.trim() !== '' ? { background: 'linear-gradient(90deg, #1565c0 60%, #64b5f6 100%)', transform: 'translateY(-2px) scale(1.03)' } : {},
//             }}
//             onClick={() => onApprove(indent.id)}
//             disabled={actionLoading || !remark || remark.trim() === ''}
//             endIcon={actionLoading && approvingId === indent.id ? <CircularProgress size={20} color="inherit" /> : null}
//           >
//             {actionLoading && approvingId === indent.id ? 'Processing...' : 'Approve & Forward'}
//           </Button>
//           <Button
//             variant="outlined"
//             color="error"
//             sx={{
//               fontWeight: 800,
//               px: 3,
//               borderRadius: 2,
//               borderWidth: 2,
//               boxShadow: '0 2px 8px #d32f2f22',
//               textTransform: 'none',
//               fontSize: 16,
//               letterSpacing: 0.5,
//               minWidth: 120,
//               transition: 'all 0.18s',
//               '&:hover': { background: '#fff0f0', transform: 'translateY(-2px) scale(1.03)' },
//             }}
//             onClick={() => onRejectClick(indent.id)}
//             disabled={actionLoading}
//           >
//             Reject
//           </Button>
//         </Box>
//       </CardContent>
//     </Card>
//   </Fade>
// );

// const RejectDialog = ({
//   open,
//   onClose,
//   onSubmit,
//   remark,
//   onRemarkChange,
//   accentColor,
//   cardBg,
//   textColor,
//   subTextColor,
// }) => (
//   <Dialog
//     open={open}
//     onClose={onClose}
//     PaperProps={{
//       sx: { backgroundColor: cardBg, color: textColor, borderRadius: 2 },
//     }}
//   >
//     <DialogTitle sx={{ color: accentColor }}>Reject Indent</DialogTitle>
//     <DialogContent>
//       <TextField
//         label="Rejection Remark"
//         fullWidth
//         multiline
//         rows={3}
//         sx={{
//           mt: 1,
//           backgroundColor: "#fff",
//           input: { color: textColor },
//           textarea: { color: textColor },
//           label: { color: subTextColor },
//           "& label.Mui-focused": { color: accentColor },
//           "& .MuiOutlinedInput-root": {
//             "& fieldset": { borderColor: accentColor },
//             "&:hover fieldset": { borderColor: accentColor },
//             "&.Mui-focused fieldset": { borderColor: accentColor },
//           },
//         }}
//         value={remark || ""}
//         onChange={(e) => onRemarkChange(e.target.value)}
//       />
//     </DialogContent>
//     <DialogActions>
//       <Button onClick={onClose} sx={{ color: accentColor }}>
//         Cancel
//       </Button>
//       <Button
//         onClick={onSubmit}
//         variant="contained"
//         color="error"
//         sx={{ backgroundColor: "#d32f2f", "&:hover": { backgroundColor: "#c62828" } }}
//       >
//         Submit Rejection
//       </Button>
//     </DialogActions>
//   </Dialog>
// );

// const TrackingStepsTable = ({ steps }) => (
//   <Table size="small" sx={{ background: '#f8fafc', borderRadius: 2, mt: 1 }}>
//     <TableHead>
//       <TableRow>
//         <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Role</TableCell>
//         <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Remark</TableCell>
//         <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Status</TableCell>
//         <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Date</TableCell>
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {steps.map((step, idx) => (
//         <TableRow key={idx}>
//           <TableCell sx={{ fontWeight: 600 }}>{step.role}</TableCell>
//           <TableCell>{step.remark}</TableCell>
//           <TableCell sx={{ color: step.status.includes('Rejected') ? '#d32f2f' : '#388e3c', fontWeight: 600 }}>{step.status}</TableCell>
//           <TableCell sx={{ color: '#666' }}>{new Date(step.date).toLocaleString()}</TableCell>
//         </TableRow>
//       ))}
//     </TableBody>
//   </Table>
// );

// const getTrackingSteps = (indent) => {
//   const trackingSteps = [];
//   if (indent.remarkByFla && (indent.flaApprovalDate || indent.status === "REJECTED_BY_FLA")) {
//     trackingSteps.push({
//       role: "FLA",
//       remark: indent.remarkByFla,
//       date: indent.flaApprovalDate || indent.updatedAt,
//       status: indent.status === "REJECTED_BY_FLA" ? "Rejected" : "Approved",
//     });
//   }
//   if (indent.remarkBySla && (indent.slaApprovalDate || indent.status === "REJECTED_BY_SLA")) {
//     trackingSteps.push({
//       role: "SLA",
//       remark: indent.remarkBySla,
//       date: indent.slaApprovalDate || indent.updatedAt,
//       status: indent.status === "REJECTED_BY_SLA" ? "Rejected" : "Approved",
//     });
//   }
//   if (indent.remarkByStore && (indent.storeApprovalDate || indent.status === "REJECTED_BY_STORE")) {
//     trackingSteps.push({
//       role: "Store",
//       remark: indent.remarkByStore,
//       date: indent.storeApprovalDate || indent.updatedAt,
//       status: indent.status === "REJECTED_BY_STORE" ? "Rejected" : "Approved",
//     });
//   }
//   if (indent.remarkByFinance && (indent.financeApprovalDate || indent.status === "REJECTED_BY_FINANCE")) {
//     trackingSteps.push({
//       role: "Finance",
//       remark: indent.remarkByFinance,
//       date: indent.financeApprovalDate || indent.updatedAt,
//       status: indent.status === "REJECTED_BY_FINANCE" ? "Rejected" : "Approved",
//     });
//   }
//   if (indent.remarkByPurchase && (indent.purchaseCompletionDate || indent.status === "REJECTED_BY_PURCHASE")) {
//     trackingSteps.push({
//       role: "Purchase",
//       remark: indent.remarkByPurchase,
//       date: indent.purchaseCompletionDate || indent.updatedAt,
//       status: indent.status === "REJECTED_BY_PURCHASE" ? "Rejected" : "Completed",
//     });
//   }
//   if (indent.remarkByUser && indent.userInspectionDate) {
//     trackingSteps.push({
//       role: "User",
//       remark: indent.remarkByUser,
//       date: indent.userInspectionDate,
//       status: "Inspection Done",
//     });
//   }
//   if (indent.gfrNote && indent.gfrCreatedAt) {
//     trackingSteps.push({
//       role: "Purchase",
//       remark: indent.gfrNote,
//       date: indent.gfrCreatedAt,
//       status: "GFR Submitted",
//     });
//   }
//   if (indent.paymentNote && (indent.paymentCreatedAt || indent.status === "PAYMENT_REJECTED")) {
//     trackingSteps.push({
//       role: "Finance",
//       remark: indent.paymentNote,
//       date: indent.paymentCreatedAt,
//       status: indent.status === "PAYMENT_REJECTED" ? "Rejected" : "Payment Done",
//     });
//   }
//   return trackingSteps;
// };

// const TrackingStepsStore = ({ indent }) => {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const trackingSteps = getTrackingSteps(indent);
//   const hasTrackingSteps = trackingSteps.length > 0;
//   return (
//     <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 1 }}>
//       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
//         <Typography sx={{ fontWeight: 600, color: '#333', fontSize: 16 }}>Tracking Steps</Typography>
//         {isExpanded ? (
//           <KeyboardArrowUp onClick={() => setIsExpanded((prev) => !prev)} sx={{ cursor: 'pointer', color: ACCENT_COLOR, fontSize: 28 }} />
//         ) : (
//           <KeyboardArrowDown onClick={() => setIsExpanded((prev) => !prev)} sx={{ cursor: 'pointer', color: ACCENT_COLOR, fontSize: 28 }} />
//         )}
//       </Box>
//       {isExpanded && hasTrackingSteps && (
//         <Box sx={{ pl: 2, pr: 1, pb: 1, borderTop: '1px solid #ddd' }}>
//           <TrackingStepsTable steps={trackingSteps} />
//         </Box>
//       )}
//       {!hasTrackingSteps && (
//         <Typography sx={{ color: '#777', fontSize: 14, textAlign: 'center', py: 2 }}>
//           No tracking steps available for this indent.
//         </Typography>
//       )}
//     </Box>
//   );
// };

// const StoreView = () => {
//   const [indents, setIndents] = useState([]);
//   const [remarks, setRemarks] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
//   const [selectedIndentId, setSelectedIndentId] = useState(null);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [approvingId, setApprovingId] = useState(null);
//   const [tab, setTab] = useState(0);
//   const [trackIndents, setTrackIndents] = useState([]);
//   const [trackLoading, setTrackLoading] = useState(false);
//   const [trackError, setTrackError] = useState(null);
//   const [openTrackingIdx, setOpenTrackingIdx] = useState(null);

//   const fetchIndents = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("/indent/store/pending", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setIndents(res.data);
//     } catch (err) {
//       console.error("Error fetching store indents", err);
//       alert("Failed to load indents, please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchIndents();
//   }, [fetchIndents]);

//   const handleApprove = useCallback(
//     async (indentId) => {
//       const remark = remarks[indentId] || "";
//       if (!remark || remark.trim() === "") {
//         alert("Remark is required to approve.");
//         return;
//       }
//       setActionLoading(true);
//       setApprovingId(indentId);
//       try {
//         await axios.post(
//           "/indent/store/approve",
//           { indentId, remark },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         alert("Indent approved and forwarded to Finance");
//         fetchIndents();
//       } catch (err) {
//         console.error("Approval failed", err);
//         alert("Something went wrong during approval.");
//       } finally {
//         setActionLoading(false);
//         setApprovingId(null);
//       }
//     },
//     [remarks, fetchIndents]
//   );

//   const handleReject = useCallback(async () => {
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
//       alert("Something went wrong during rejection.");
//     }
//   }, [remarks, selectedIndentId, fetchIndents]);

//   const handleRemarkChange = useCallback(
//     (indentId, value) => {
//       setRemarks((prev) => ({ ...prev, [indentId]: value }));
//     },
//     []
//   );

//   const handleDialogRemarkChange = useCallback((value) => {
//     if (selectedIndentId !== null) {
//       setRemarks((prev) => ({ ...prev, [selectedIndentId]: value }));
//     }
//   }, [selectedIndentId]);

//   const openRejectDialog = useCallback((indentId) => {
//     setSelectedIndentId(indentId);
//     setRejectDialogOpen(true);
//   }, []);

//   const closeRejectDialog = useCallback(() => {
//     setRejectDialogOpen(false);
//     setSelectedIndentId(null);
//   }, []);

//   const fetchTrackIndents = useCallback(async () => {
//     setTrackLoading(true);
//     setTrackError(null);
//     try {
//       const res = await axios.get("/track/store/all", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setTrackIndents(res.data);
//     } catch (err) {
//       setTrackError("Failed to load tracked indents. Please try again.");
//     } finally {
//       setTrackLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (tab === 1) fetchTrackIndents();
//   }, [tab, fetchTrackIndents]);

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           minHeight: "100vh",
//           background: GRADIENT_BG,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <CircularProgress sx={{ color: ACCENT_COLOR }} />
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #f8fafc 0%, #e3eafc 100%)",
//         py: { xs: 3, md: 6 },
//         px: { xs: 1, md: 6 },
//         fontFamily: "'Roboto', sans-serif",
//         width: '100vw',
//         position: 'relative',
//         left: '50%',
//         right: '50%',
//         ml: '-50vw',
//         mr: '-50vw',
//       }}
//     >
//       <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
//         <Typography variant="h4" gutterBottom sx={{ color: ACCENT_COLOR, fontWeight: "bold", letterSpacing: 1.2, textShadow: '0 2px 12px #e3eafc', display: 'flex', alignItems: 'center', gap: 1 }}>
//           <FontAwesomeIcon icon={faUser} /> Store Dashboard
//         </Typography>
//       </Box>
//       <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="primary" indicatorColor="primary" sx={{ mb: 2 }}>
//         <Tab label="Pending Indents" />
//         <Tab label="Track Indents" />
//       </Tabs>
//       {tab === 0 && (
//         <>
//           {indents.length === 0 ? (
//             <Typography sx={{ mt: 4, color: SUBTEXT_COLOR, textAlign: "center", fontWeight: 600, fontSize: 22 }}>
//               No pending indents for Store
//             </Typography>
//           ) : (
//             <Grid container spacing={4} justifyContent="center">
//               {indents.map((indent, index) => (
//                 <Grid item xs={12} sm={6} md={6} lg={5} xl={4} key={indent.id} display="flex" justifyContent="center">
//                   <IndentCard
//                     indent={indent}
//                     remark={remarks[indent.id]}
//                     onRemarkChange={handleRemarkChange}
//                     onApprove={handleApprove}
//                     onRejectClick={openRejectDialog}
//                     index={index}
//                     actionLoading={actionLoading}
//                     approvingId={approvingId}
//                   />
//                 </Grid>
//               ))}
//             </Grid>
//           )}
//         </>
//       )}
//       {tab === 1 && (
//         <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', background: '#fff', borderRadius: 3, boxShadow: '0 2px 16px #0d47a122', p: { xs: 1, md: 3 }, mt: 2 }}>
//           {trackLoading ? (
//             <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
//           ) : trackError ? (
//             <Typography variant="h6" align="center" mt={4} color="error" fontWeight={600}>{trackError}</Typography>
//           ) : trackIndents.length === 0 ? (
//             <Typography sx={{ color: SUBTEXT_COLOR, textAlign: 'center', fontWeight: 600, fontSize: 20, py: 4 }}>No indents found.</Typography>
//           ) : (
//             <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', background: 'transparent' }}>
//               <Table sx={{ minWidth: 900, background: 'transparent' }} aria-label="track indents table">
//                 <TableHead>
//                   <TableRow sx={{ background: 'linear-gradient(90deg, #e3f2fd 60%, #fce4ec 100%)' }}>
//                     <TableCell />
//                     <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Indent ID</TableCell>
//                     <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Project</TableCell>
//                     <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Item</TableCell>
//                     <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Department</TableCell>
//                     <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Quantity</TableCell>
//                     <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Total Cost</TableCell>
//                     <TableCell sx={{ fontWeight: 700, color: ACCENT_COLOR }}>Status</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {trackIndents.map((indent, idx) => {
//                     const isOpen = openTrackingIdx === idx;
//                     const steps = getTrackingSteps(indent);
//                     return (
//                       <React.Fragment key={indent.id}>
//                         <TableRow hover sx={{ background: isOpen ? '#f3e5f5' : 'transparent', transition: 'background 0.2s' }}>
//                           <TableCell>
//                             <IconButton size="small" onClick={() => setOpenTrackingIdx(isOpen ? null : idx)}>
//                               {isOpen ? <KeyboardArrowUp sx={{ color: ACCENT_COLOR }} /> : <KeyboardArrowDown sx={{ color: ACCENT_COLOR }} />}
//                             </IconButton>
//                           </TableCell>
//                           <TableCell sx={{ fontWeight: 600 }}>{indent.id}</TableCell>
//                           <TableCell>{indent.projectName}</TableCell>
//                           <TableCell>{indent.itemName}</TableCell>
//                           <TableCell>{indent.department}</TableCell>
//                           <TableCell>{indent.quantity}</TableCell>
//                           <TableCell>₹{indent.totalCost}</TableCell>
//                           <TableCell sx={{ color: indent.status.includes('REJECTED') ? '#d32f2f' : '#1976d2', fontWeight: 700 }}>{indent.status}</TableCell>
//                         </TableRow>
//                         <TableRow>
//                           <TableCell style={{ paddingBottom: 0, paddingTop: 0, background: '#f8fafc' }} colSpan={8}>
//                             <Collapse in={isOpen} timeout="auto" unmountOnExit>
//                               <Box sx={{ pl: 1, pr: 1, pb: 2, pt: 2 }}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 700, color: ACCENT_COLOR, mb: 1 }}>Tracking Steps</Typography>
//                                 {steps.length > 0 ? (
//                                   <TrackingStepsTable steps={steps} />
//                                 ) : (
//                                   <Typography sx={{ color: '#888', fontStyle: 'italic', py: 2 }}>No tracking steps available for this indent.</Typography>
//                                 )}
//                               </Box>
//                             </Collapse>
//                           </TableCell>
//                         </TableRow>
//                       </React.Fragment>
//                     );
//                   })}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//         </Box>
//       )}
//       <RejectDialog
//         open={rejectDialogOpen}
//         onClose={closeRejectDialog}
//         onSubmit={handleReject}
//         remark={remarks[selectedIndentId]}
//         onRemarkChange={handleDialogRemarkChange}
//         accentColor={ACCENT_COLOR}
//         cardBg={CARD_BG}
//         textColor={TEXT_COLOR}
//         subTextColor={SUBTEXT_COLOR}
//       />
//     </Box>
//   );
// };

// export default StoreView;























import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCheck, faTimes, faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";
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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Chip,
  Checkbox,
  FormControlLabel,
  Grid,
  Divider
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp, ShoppingCart, Assignment } from "@mui/icons-material";
import axios from "../api/api";

const GRADIENT_BG = "linear-gradient(135deg, #FAFAFA 0%, #EDEDED 100%)";
const ACCENT_COLOR = "#0d47a1";
const SUCCESS_COLOR = "#4caf50";
const ERROR_COLOR = "#f44336";

const ProductRow = ({ product, indentId, onApprovalChange, onRemarkChange, approvedProducts, rejectedProducts, remarks }) => {
  const isApproved = approvedProducts[indentId]?.includes(product.id);
  const isRejected = rejectedProducts[indentId]?.includes(product.id);
  const remarkValue = remarks[indentId]?.[product.id] || "";

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED_BY_SLA': return SUCCESS_COLOR;
      case 'REJECTED_BY_SLA': return ERROR_COLOR;
      default: return '#ff9800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'APPROVED_BY_SLA': return 'SLA Approved';
      case 'REJECTED_BY_SLA': return 'SLA Rejected';
      default: return status;
    }
  };

  return (
    <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' } }}>
      <TableCell sx={{ minWidth: 180 }}>
        <Typography variant="subtitle2" fontWeight={600}>{product.itemName}</Typography>
        <Typography variant="caption" color="text.secondary">{product.description}</Typography>
      </TableCell>
      <TableCell>{product.category || 'N/A'}</TableCell>
      <TableCell align="center" sx={{ fontWeight: 600 }}>{product.quantity}</TableCell>
      <TableCell align="right" sx={{ fontWeight: 600 }}>₹{product.perPieceCost?.toLocaleString()}</TableCell>
      <TableCell align="right" sx={{ fontWeight: 700, color: ACCENT_COLOR }}>₹{product.totalCost?.toLocaleString()}</TableCell>
      <TableCell>
        <Chip 
          label={getStatusText(product.productStatus)} 
          size="small" 
          sx={{ 
            backgroundColor: getStatusColor(product.productStatus),
            color: 'white',
            fontWeight: 600
          }}
        />
      </TableCell>
      <TableCell sx={{ minWidth: 200 }}>
        <Typography variant="caption" color="text.secondary">
          SLA: {product.slaRemarks || 'No remarks'}
        </Typography>
      </TableCell>
      <TableCell sx={{ minWidth: 250 }}>
        {product.productStatus === 'APPROVED_BY_SLA' && (
          <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isApproved}
                    onChange={(e) => onApprovalChange(indentId, product.id, 'approve', e.target.checked)}
                    color="success"
                    size="small"
                  />
                }
                label="Approve"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isRejected}
                    onChange={(e) => onApprovalChange(indentId, product.id, 'reject', e.target.checked)}
                    color="error"
                    size="small"
                  />
                }
                label="Reject"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
            </Box>
            <TextField
              size="small"
              placeholder="Store remarks..."
              value={remarkValue}
              onChange={(e) => onRemarkChange(indentId, product.id, e.target.value)}
              multiline
              rows={2}
              sx={{ mt: 1 }}
            />
          </Box>
        )}
        {product.productStatus === 'REJECTED_BY_SLA' && (
          <Chip label="Already Rejected by SLA" color="error" size="small" />
        )}
      </TableCell>
    </TableRow>
  );
};

const IndentDetailsTable = ({ 
  indent, 
  expanded, 
  onToggleExpand, 
  onApprovalChange, 
  onRemarkChange, 
  approvedProducts, 
  rejectedProducts, 
  remarks,
  onSubmitReview,
  loading
}) => {
  const eligibleProducts = indent.products?.filter(p => p.productStatus === 'APPROVED_BY_SLA') || [];
  const hasEligibleProducts = eligibleProducts.length > 0;
  const approvedCount = approvedProducts[indent.id]?.length || 0;
  const rejectedCount = rejectedProducts[indent.id]?.length || 0;
  const totalEligible = eligibleProducts.length;

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => onToggleExpand(indent.id)}
          >
            {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Box>
            <Typography variant="subtitle2" fontWeight={600} color={ACCENT_COLOR}>
              {indent.indentNumber}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {indent.id}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2" fontWeight={600}>
            {indent.projectName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {indent.purpose}
          </Typography>
        </TableCell>
        <TableCell>{indent.department || 'N/A'}</TableCell>
        <TableCell>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {indent.requestedBy?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {indent.requestedBy?.designation}
            </Typography>
          </Box>
        </TableCell>
        <TableCell align="center">
          <Chip 
            label={`${indent.products?.length || 0} items`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        </TableCell>
        <TableCell align="right">
          <Typography variant="h6" fontWeight={700} color={ACCENT_COLOR}>
            ₹{indent.totalIndentCost?.toLocaleString()}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip 
            label={indent.status.replace('PENDING_', '')} 
            color="warning" 
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" gutterBottom component="div" sx={{ color: ACCENT_COLOR, fontWeight: 700 }}>
                  Product Details
                </Typography>
                {hasEligibleProducts && (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress: {approvedCount + rejectedCount}/{totalEligible} reviewed
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onSubmitReview(indent.id)}
                      disabled={loading || (approvedCount + rejectedCount === 0)}
                      startIcon={loading ? <CircularProgress size={16} /> : <Assignment />}
                      sx={{ minWidth: 140 }}
                    >
                      {loading ? 'Processing...' : 'Submit Review'}
                    </Button>
                  </Box>
                )}
              </Box>
              
              <TableContainer component={Paper} elevation={1}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Item Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="center">Qty</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Unit Price</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Total Cost</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>SLA Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>SLA Remarks</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Store Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {indent.products?.map((product) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        indentId={indent.id}
                        onApprovalChange={onApprovalChange}
                        onRemarkChange={onRemarkChange}
                        approvedProducts={approvedProducts}
                        rejectedProducts={rejectedProducts}
                        remarks={remarks}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {hasEligibleProducts && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Review Summary for Indent {indent.indentNumber}:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Typography variant="body2">
                      <strong>Approved:</strong> {approvedCount} items
                    </Typography>
                    <Typography variant="body2">
                      <strong>Rejected:</strong> {rejectedCount} items
                    </Typography>
                    <Typography variant="body2">
                      <strong>Pending:</strong> {totalEligible - approvedCount - rejectedCount} items
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const StoreView = () => {
  const [indents, setIndents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [approvedProducts, setApprovedProducts] = useState({});
  const [rejectedProducts, setRejectedProducts] = useState({});
  const [remarks, setRemarks] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [tab, setTab] = useState(0);

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

  const handleToggleExpand = useCallback((indentId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(indentId)) {
        newSet.delete(indentId);
      } else {
        newSet.add(indentId);
      }
      return newSet;
    });
  }, []);

  const handleApprovalChange = useCallback((indentId, productId, action, checked) => {
    if (action === 'approve') {
      setApprovedProducts(prev => {
        const current = prev[indentId] || [];
        if (checked) {
          // Remove from rejected if exists
          setRejectedProducts(prevRej => ({
            ...prevRej,
            [indentId]: (prevRej[indentId] || []).filter(id => id !== productId)
          }));
          return {
            ...prev,
            [indentId]: [...current.filter(id => id !== productId), productId]
          };
        } else {
          return {
            ...prev,
            [indentId]: current.filter(id => id !== productId)
          };
        }
      });
    } else if (action === 'reject') {
      setRejectedProducts(prev => {
        const current = prev[indentId] || [];
        if (checked) {
          // Remove from approved if exists
          setApprovedProducts(prevApp => ({
            ...prevApp,
            [indentId]: (prevApp[indentId] || []).filter(id => id !== productId)
          }));
          return {
            ...prev,
            [indentId]: [...current.filter(id => id !== productId), productId]
          };
        } else {
          return {
            ...prev,
            [indentId]: current.filter(id => id !== productId)
          };
        }
      });
    }
  }, []);

  const handleRemarkChange = useCallback((indentId, productId, value) => {
    setRemarks(prev => ({
      ...prev,
      [indentId]: {
        ...prev[indentId],
        [productId]: value
      }
    }));
  }, []);

  const handleSubmitReview = useCallback(async (indentId) => {
    const approvedIds = approvedProducts[indentId] || [];
    const rejectedIds = rejectedProducts[indentId] || [];
    const indentRemarks = remarks[indentId] || {};

    console.log('Submit review called for indent:', indentId, 'Approved:', approvedIds, 'Rejected:', rejectedIds, 'Remarks:', indentRemarks);

    if (approvedIds.length === 0 && rejectedIds.length === 0) {
      alert("Please approve or reject at least one product before submitting.");
      return;
    }

    setActionLoading(true);
    try {
      await axios.post(
        "/indent/store/review-products",
        {
          indentId: indentId,
          approvedProductIds: approvedIds,
          rejectedProductIds: rejectedIds,
          remarks: indentRemarks
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Store review submitted successfully!");
      setApprovedProducts(prev => ({ ...prev, [indentId]: [] }));
      setRejectedProducts(prev => ({ ...prev, [indentId]: [] }));
      setRemarks(prev => ({ ...prev, [indentId]: {} }));
      fetchIndents();
    } catch (err) {
      console.error("Review submission failed", err);
      alert("Something went wrong during review submission.");
    } finally {
      setActionLoading(false);
    }
  }, [approvedProducts, rejectedProducts, remarks, fetchIndents]);

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
        py: { xs: 3, md: 4 },
        px: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: ACCENT_COLOR, 
            fontWeight: 700, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2 
          }}
        >
          <FontAwesomeIcon icon={faUser} /> Store Dashboard
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Pending Reviews" />
        <Tab label="Track History" />
      </Tabs>

      {tab === 0 && (
        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            {indents.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No pending indents for store review
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell />
                      <TableCell sx={{ fontWeight: 700 }}>Indent No.</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Project</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Requested By</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="center">Items</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Total Cost</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {indents.map((indent) => (
                      <IndentDetailsTable
                        key={indent.id}
                        indent={indent}
                        expanded={expandedRows.has(indent.id)}
                        onToggleExpand={handleToggleExpand}
                        onApprovalChange={handleApprovalChange}
                        onRemarkChange={handleRemarkChange}
                        approvedProducts={approvedProducts}
                        rejectedProducts={rejectedProducts}
                        remarks={remarks}
                        onSubmitReview={handleSubmitReview}
                        loading={actionLoading}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: ACCENT_COLOR }}>
              Tracking History
            </Typography>
            <Typography color="text.secondary">
              Tracking functionality will be implemented here based on your track API endpoint.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default StoreView;