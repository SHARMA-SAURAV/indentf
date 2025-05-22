// import React, { useEffect, useState } from "react";
// import axios from "../api/api";
// import {
//   Container,
//   Typography,
//   Card,
//   CardContent,
//   CardHeader,
//   TextField,
//   Button,
//   Grid,
//   Divider,
//   Box,
//   Alert,
//   Tabs,
//   Tab,
// } from "@mui/material";

// const PurchasePanel = () => {
//   const [tab, setTab] = useState(0);
//   const [indents, setIndents] = useState([]);
//   const [remarkMap, setRemarkMap] = useState({});
//   const [gfrIndents, setGfrIndents] = useState([]);
//   const [gfrNoteMap, setGfrNoteMap] = useState({});
//   const [status, setStatus] = useState("");

//   useEffect(() => {
//     fetchPendingIndents();
//     fetchPendingGFRIndents();
//   }, []);

//   const handleTabChange = (event, newValue) => setTab(newValue);

//   const fetchPendingIndents = async () => {
//     try {
//       const res = await axios.get("/indent/purchase/pending");
//       setIndents(res.data);
//     } catch (err) {
//       console.error("Failed to fetch purchase indents", err);
//     }
//   };

//   const fetchPendingGFRIndents = async () => {
//     try {
//       const res = await axios.get("/indent/purchase/gfr/pending");
//       setGfrIndents(res.data);
//     } catch (err) {
//       console.error("Failed to fetch GFR indents", err);
//     }
//   };

//   const handleRemarkChange = (id, value) => {
//     setRemarkMap((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleComplete = async (id) => {
//     try {
//       await axios.post("/indent/purchase/complete", {
//         indentId: id,
//         remark: remarkMap[id] || "",
//       });
//       alert("Indent marked as COMPLETED.");
//       fetchPendingIndents();
//     } catch (err) {
//       alert("Error completing indent.");
//     }
//   };

// const handleReject = async (id) => {
//   const confirm = window.confirm("Are you sure you want to reject this indent?");
//   if (!confirm) return;

//   try {
//     await axios.post("/indent/purchase/reject", {
//       indentId: id,
//       remark: remarkMap[id] || "",
//     });
//     alert("Indent rejected by Purchase.");
//     fetchPendingIndents();
//   } catch (err) {
//     console.error("Failed to reject indent:", err);
//     alert("Error rejecting indent.");
//   }
// };
  


//   const handleGfrNoteChange = (id, value) => {
//     setGfrNoteMap((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleSubmitGFR = async (id) => {
//     try {
//       await axios.post("/indent/purchase/gfr/submit", {
//         indentId: id,
//         gfrNote: gfrNoteMap[id] || "",
//       });
//       setStatus("GFR submitted successfully.");
//       fetchPendingGFRIndents();
//     } catch (err) {
//       console.error("GFR submission failed", err);
//       setStatus("Error submitting GFR.");
//     }
//   };

//   return (
//     <Container maxWidth="md" sx={{ mt: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Purchase Panel
//       </Typography>

//       <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
//         <Tab label="Pending Indents" />
//         <Tab label="GFR Submission" />
//       </Tabs>

//       {tab === 0 && (
//         <>
//           {indents.length === 0 ? (
//             <Typography>No indents at Purchase stage.</Typography>
//           ) : (
//             indents.map((indent) => (
//               <Card key={indent.id} sx={{ mb: 3 }}>
//                 <CardHeader subheader={indent.itemName} />
//                 <CardContent>
//                   <Grid container spacing={2}>
//                     <Grid item xs={6}>
//                       <Typography>
//                         <strong>Quantity:</strong> {indent.quantity}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography>
//                         <strong>Department:</strong>{" "}
//                         {indent.requestedBy?.department || "N/A"}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField
//                         fullWidth
//                         multiline
//                         label="Purchase Remark"
//                         value={remarkMap[indent.id] || ""}
//                         onChange={(e) =>
//                           handleRemarkChange(indent.id, e.target.value)
//                         }
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Box display="flex" justifyContent="flex-end">
//                         <Button
//                           variant="contained"
//                           color="primary"
//                           onClick={() => handleComplete(indent.id)}
//                         >
//                           Mark as Completed
//                         </Button>
//                         <Button
//                           variant="outlined"
//                           color="error"
//                           onClick={() => handleReject(indent.id)}
//                         >
//                           Reject
//                         </Button>
//                       </Box>
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </>
//       )}

//       {tab === 1 && (
//         <>
//           {status && (
//             <Alert severity="info" sx={{ mb: 2 }}>
//               {status}
//             </Alert>
//           )}

//           {gfrIndents.length === 0 ? (
//             <Typography>No indents awaiting GFR submission.</Typography>
//           ) : (
//             gfrIndents.map((indent) => (
//               <Card key={indent.id} sx={{ mb: 3 }}>
//                 <CardHeader subheader={indent.itemName} />
//                 <CardContent>
//                   <Typography>
//                     <strong>Quantity:</strong> {indent.quantity}
//                   </Typography>
//                   <Typography>
//                     <strong>Approved By:</strong>{" "}
//                     {indent.approvedBy?.username || "N/A"}
//                   </Typography>

//                   <TextField
//                     fullWidth
//                     multiline
//                     rows={3}
//                     label="GFR Note"
//                     value={gfrNoteMap[indent.id] || ""}
//                     onChange={(e) =>
//                       handleGfrNoteChange(indent.id, e.target.value)
//                     }
//                     sx={{ mt: 2 }}
//                   />

//                   <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
//                     <Button
//                       variant="contained"
//                       onClick={() => handleSubmitGFR(indent.id)}
//                     >
//                       Submit GFR
//                     </Button>
//                   </Box>
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </>
//       )}
//     </Container>
//   );
// };

// export default PurchasePanel;

// // import React, { useEffect, useState } from "react";
// // import axios from "../api/api";
// // import {
// //   Container,
// //   Typography,
// //   Card,
// //   CardContent,
// //   CardHeader,
// //   TextField,
// //   Button,
// //   Grid,
// //   Divider,
// //   Box,
// //   Alert,
// // } from "@mui/material";

// // const PurchasePanel = () => {
// //   const [indents, setIndents] = useState([]);
// //   const [remarkMap, setRemarkMap] = useState({});

// //   const [gfrIndents, setGfrIndents] = useState([]);
// //   const [gfrNoteMap, setGfrNoteMap] = useState({});
// //   const [status, setStatus] = useState("");

// //   useEffect(() => {
// //     fetchPendingIndents();
// //     fetchPendingGFRIndents();
// //   }, []);

// //   const fetchPendingIndents = async () => {
// //     try {
// //       const res = await axios.get("/indent/purchase/pending");
// //       setIndents(res.data);
// //     } catch (err) {
// //       console.error("Failed to fetch purchase indents", err);
// //     }
// //   };

// //   const fetchPendingGFRIndents = async () => {
// //     try {
// //       const res = await axios.get("/indent/purchase/gfr/pending");
// //       setGfrIndents(res.data);
// //     } catch (err) {
// //       console.error("Failed to fetch GFR indents", err);
// //     }
// //   };

// //   const handleRemarkChange = (id, value) => {
// //     setRemarkMap((prev) => ({ ...prev, [id]: value }));
// //   };

// //   const handleComplete = async (id) => {
// //     try {
// //       await axios.post("/indent/purchase/complete", {
// //         indentId: id,
// //         remark: remarkMap[id] || "",
// //       });
// //       alert("Indent marked as COMPLETED.");
// //       fetchPendingIndents();
// //     } catch (err) {
// //       alert("Error completing indent.");
// //     }
// //   };

// //   const handleGfrNoteChange = (id, value) => {
// //     setGfrNoteMap((prev) => ({ ...prev, [id]: value }));
// //   };

// //   const handleSubmitGFR = async (id) => {
// //     try {
// //       await axios.post("/indent/purchase/gfr/submit", {
// //         indentId: id,
// //         gfrNote: gfrNoteMap[id] || "",
// //       });
// //       setStatus("GFR submitted successfully.");
// //       fetchPendingGFRIndents();
// //     } catch (err) {
// //       console.error("GFR submission failed", err);
// //       setStatus("Error submitting GFR.");
// //     }
// //   };

// //   return (
// //     <Container maxWidth="md" sx={{ mt: 4 }}>
// //       <Typography variant="h4" gutterBottom>
// //         Purchase Panel – Pending Indents
// //       </Typography>

// //       {indents.length === 0 ? (
// //         <Typography>No indents at Purchase stage.</Typography>
// //       ) : (
// //         indents.map((indent) => (
// //           <Card key={indent.id} sx={{ mb: 3 }}>
// //             <CardHeader subheader={indent.itemName} />
// //             <CardContent>
// //               <Grid container spacing={2}>
// //                 <Grid item xs={6}>
// //                   <Typography variant="body1">
// //                     <strong>Quantity:</strong> {indent.quantity}
// //                   </Typography>
// //                 </Grid>
// //                 <Grid item xs={6}>
// //                   <Typography variant="body1">
// //                     <strong>Department:</strong>{" "}
// //                     {indent.requestedBy?.department || "N/A"}
// //                   </Typography>
// //                 </Grid>

// //                 <Grid item xs={12}>
// //                   <TextField
// //                     fullWidth
// //                     multiline
// //                     label="Purchase Remark"
// //                     value={remarkMap[indent.id] || ""}
// //                     onChange={(e) =>
// //                       handleRemarkChange(indent.id, e.target.value)
// //                     }
// //                   />
// //                 </Grid>

// //                 <Grid item xs={12}>
// //                   <Box display="flex" justifyContent="flex-end">
// //                     <Button
// //                       variant="contained"
// //                       color="primary"
// //                       onClick={() => handleComplete(indent.id)}
// //                     >
// //                       Mark as Completed
// //                     </Button>
// //                   </Box>
// //                 </Grid>
// //               </Grid>
// //             </CardContent>
// //           </Card>
// //         ))
// //       )}

// //       <Divider sx={{ my: 4 }} />

// //       <Typography variant="h5" gutterBottom>
// //         GFR Generation – Indents Ready
// //       </Typography>

// //       {status && (
// //         <Alert severity="info" sx={{ mb: 2 }}>
// //           {status}
// //         </Alert>
// //       )}

// //       {gfrIndents.length === 0 ? (
// //         <Typography>No indents awaiting GFR submission.</Typography>
// //       ) : (
// //         gfrIndents.map((indent) => (
// //           <Card key={indent.id} sx={{ mb: 3 }}>
// //             <CardHeader subheader={indent.itemName} />
// //             <CardContent>
// //               <Typography>
// //                 <strong>Quantity:</strong> {indent.quantity}
// //               </Typography>
// //               <Typography>
// //                 <strong>Approved By:</strong> {indent.approvedBy?.username || "N/A"}
// //               </Typography>

// //               <TextField
// //                 fullWidth
// //                 multiline
// //                 rows={3}
// //                 label="GFR Note"
// //                 value={gfrNoteMap[indent.id] || ""}
// //                 onChange={(e) => handleGfrNoteChange(indent.id, e.target.value)}
// //                 sx={{ mt: 2 }}
// //               />

// //               <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
// //                 <Button
// //                   variant="contained"
// //                   onClick={() => handleSubmitGFR(indent.id)}
// //                 >
// //                   Submit GFR
// //                 </Button>
// //               </Box>
// //             </CardContent>
// //           </Card>
// //         ))
// //       )}
// //     </Container>
// //   );
// // };

// // export default PurchasePanel;

// // import React, { useEffect, useState } from "react";
// // // import axios from "@/api/axios";
// // import axios from "../api/api";

// // import {
// //   Container,
// //   Typography,
// //   Card,
// //   CardContent,
// //   CardHeader,
// //   TextField,
// //   Button,
// //   Grid,
// //   Divider,
// //   Box,
// // } from "@mui/material";

// // const PurchasePanel = () => {
// //   const [indents, setIndents] = useState([]);
// //   const [remarkMap, setRemarkMap] = useState({});

// //   useEffect(() => {
// //     fetchPendingIndents();
// //   }, []);

// //   const fetchPendingIndents = async () => {
// //     try {
// //       const res = await axios.get("/indent/purchase/pending");
// //       setIndents(res.data);
// //     } catch (err) {
// //       console.error("Failed to fetch purchase indents", err);
// //     }
// //   };

// //   const handleRemarkChange = (id, value) => {
// //     setRemarkMap((prev) => ({ ...prev, [id]: value }));
// //   };

// //   const handleComplete = async (id) => {
// //     try {
// //       await axios.post("/indent/purchase/complete", {
// //         indentId: id,
// //         remark: remarkMap[id] || "",
// //       });
// //       alert("Indent marked as COMPLETED.");
// //       fetchPendingIndents();
// //     } catch (err) {
// //       alert("Error completing indent.");
// //     }
// //   };

// //   return (
// //     <Container maxWidth="md" sx={{ mt: 4 }}>
// //       <Typography variant="h4" gutterBottom>
// //         Purchase Panel – Pending Indents
// //       </Typography>

// //       {indents.length === 0 ? (
// //         <Typography>No indents at Purchase stage.</Typography>
// //       ) : (
// //         indents.map((indent) => (
// //           <Card key={indent.id} sx={{ mb: 3 }}>
// //             <CardHeader
// //             //   title={`Indent #${indent.id}`}
// //               subheader={indent.itemName}
// //             />
// //             <CardContent>
// //               <Grid container spacing={2}>
// //                 <Grid item xs={6}>
// //                   <Typography variant="body1">
// //                     <strong>Quantity:</strong> {indent.quantity}
// //                   </Typography>
// //                 </Grid>
// //                 <Grid item xs={6}>
// //                   <Typography variant="body1">
// //                     <strong>Department:</strong>{" "}
// //                     {indent.requestedBy?.department || "N/A"}
// //                   </Typography>
// //                 </Grid>

// //                 <Grid item xs={12}>
// //                   <TextField
// //                     fullWidth
// //                     multiline
// //                     label="Purchase Remark"
// //                     value={remarkMap[indent.id] || ""}
// //                     onChange={(e) =>
// //                       handleRemarkChange(indent.id, e.target.value)
// //                     }
// //                   />
// //                 </Grid>

// //                 <Grid item xs={12}>
// //                   <Box display="flex" justifyContent="flex-end">
// //                     <Button
// //                       variant="contained"
// //                       color="primary"
// //                       onClick={() => handleComplete(indent.id)}
// //                     >
// //                       Mark as Completed
// //                     </Button>
// //                   </Box>
// //                 </Grid>
// //               </Grid>
// //             </CardContent>
// //           </Card>
// //         ))
// //       )}
// //     </Container>
// //   );
// // };

// // export default PurchasePanel;




import React, { useEffect, useState, useCallback } from "react";
import axios from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";



import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  Alert,
  Tabs,
  Tab,
  Grow,
  Fade,
  CircularProgress,
} from "@mui/material";

// Design Tokens
const GRADIENT_BG = "linear-gradient(135deg, #FAFAFA 0%, #EDEDED 100%)";
const CARD_BG = "rgba(255, 255, 255, 0.95)";
const TEXT_COLOR = "#444950";
const ACCENT_COLOR = "#0d47a1";
const SUBTEXT_COLOR = "#8E99A3";

const PurchasePanel = () => {
  const [tab, setTab] = useState(0);
  const [indents, setIndents] = useState([]);
  const [remarkMap, setRemarkMap] = useState({});
  const [gfrIndents, setGfrIndents] = useState([]);
  const [gfrNoteMap, setGfrNoteMap] = useState({});
  const [status, setStatus] = useState("");
  const [loadingIndents, setLoadingIndents] = useState(false);
  const [loadingGfr, setLoadingGfr] = useState(false);

  const fetchPendingIndents = useCallback(async () => {
    try {
      setLoadingIndents(true);
      const res = await axios.get("/indent/purchase/pending");
      setIndents(res.data);
    } catch (err) {
      console.error("Failed to fetch purchase indents", err);
    } finally {
      setLoadingIndents(false);
    }
  }, []);

  const fetchPendingGFRIndents = useCallback(async () => {
    try {
      setLoadingGfr(true);
      const res = await axios.get("/indent/purchase/gfr/pending");
      setGfrIndents(res.data);
    } catch (err) {
      console.error("Failed to fetch GFR indents", err);
    } finally {
      setLoadingGfr(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingIndents();
    fetchPendingGFRIndents();
  }, [fetchPendingIndents, fetchPendingGFRIndents]);

  const handleTabChange = (_, newValue) => setTab(newValue);

  const handleRemarkChange = (id, value) => {
    setRemarkMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleComplete = async (id) => {
    try {
      await axios.post("/indent/purchase/complete", {
        indentId: id,
        remark: remarkMap[id] || "",
      });
      setStatus("Indent marked as COMPLETED.");
      fetchPendingIndents();
      setRemarkMap((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      // Clear status after 4 seconds
      setTimeout(() => setStatus(""), 4000);
    } catch {
      alert("Error completing indent.");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this indent?")) return;

    try {
      await axios.post("/indent/purchase/reject", {
        indentId: id,
        remark: remarkMap[id] || "",
      });
      setStatus("Indent rejected by Purchase.");
      fetchPendingIndents();
      setRemarkMap((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      console.error("Failed to reject indent:", err);
      alert("Error rejecting indent.");
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
      setGfrNoteMap((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      console.error("GFR submission failed", err);
      setStatus("Error submitting GFR.");
      setTimeout(() => setStatus(""), 4000);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        minHeight: "80vh",
        background: GRADIENT_BG,
        borderRadius: 2,
        p: 3,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: ACCENT_COLOR,
          fontWeight: "bold",
        }}
      >
      
      <FontAwesomeIcon icon={faUser} />
        Purchase Dashboard
      </Typography>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        sx={{ mb: 2, color: ACCENT_COLOR, borderBottom: 1, borderColor: "divider" }}
        textColor="inherit"
        indicatorColor="primary"
      >
        <Tab label="Pending Indents" sx={{ color: ACCENT_COLOR }} />
        <Tab label="GFR Submission" sx={{ color: ACCENT_COLOR }} />
      </Tabs>

      {status && (
        <Fade in={!!status} timeout={600}>
          <Alert severity="info" sx={{ mb: 2 }}>
            {status}
          </Alert>
        </Fade>
      )}

      {/* Pending Indents Tab */}
      {tab === 0 && (
        <>
          {loadingIndents ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress color="primary" />
            </Box>
          ) : indents.length === 0 ? (
            <Typography sx={{ color: SUBTEXT_COLOR }}>
              No indents at Purchase stage.
            </Typography>
          ) : (
            indents.map((indent) => (
              <Grow key={indent.id} in timeout={600}>
                <Card sx={{ mb: 3, backgroundColor: CARD_BG, boxShadow: 3 }}>
                  <CardContent sx={{ color: TEXT_COLOR }}>
                 

<Typography variant="body1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
  <strong>Project Name:</strong> {indent.projectName}
</Typography>

<Typography variant="body1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
  <strong>Item Name:</strong> {indent.itemName}
</Typography>

 <Typography variant="body1" gutterBottom>
  <strong>Indent Id:</strong> {indent.id}
</Typography>

<Typography variant="body1" gutterBottom>
  <strong>Department:</strong> {indent.requestedBy?.department || "N/A"}
</Typography>

<Typography variant="body1" gutterBottom>
  <strong>Quantity:</strong> {indent.quantity}
</Typography>

<Typography variant="body1" gutterBottom>
  <strong>PerPieceCost:</strong> {indent.perPieceCost}
</Typography>

<Typography variant="body1" gutterBottom>
  <strong>Total Cost:</strong> {indent.totalCost}
</Typography>

<Typography variant="body1" gutterBottom>
  <strong>Indent Status:</strong> {indent.status}
</Typography>

<Typography variant="body1" gutterBottom>
  <strong>Description:</strong> {indent.description}
</Typography>

                    <TextField
                      fullWidth
                      multiline
                      label="Purchase Remark"
                      value={remarkMap[indent.id] || ""}
                      onChange={(e) => handleRemarkChange(indent.id, e.target.value)}
                      sx={{
                        mt: 2,
                        "& .MuiInputBase-root": { color: TEXT_COLOR },
                      }}
                    />

                    <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                      <Button
                        variant="contained"
                        onClick={() => handleComplete(indent.id)}
                        sx={{ backgroundColor: ACCENT_COLOR }}
                      >
                        Mark as Completed
                      </Button>
                      <Button variant="outlined" color="error" onClick={() => handleReject(indent.id)}>
                        Reject
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            ))
          )}
        </>
      )}

      {/* GFR Submission Tab */}
      {tab === 1 && (
        <>
          {loadingGfr ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress color="primary" />
            </Box>
          ) : gfrIndents.length === 0 ? (
            <Typography sx={{ color: SUBTEXT_COLOR }}>
              No indents awaiting GFR submission.
            </Typography>
          ) : (
            gfrIndents.map((indent) => (
              <Grow key={indent.id} in timeout={600}>
                <Card sx={{ mb: 3, backgroundColor: CARD_BG, boxShadow: 3 }}>
                  <CardHeader subheader={indent.itemName} sx={{ color: ACCENT_COLOR }} />
                  <CardContent sx={{ color: TEXT_COLOR }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Item:</strong> {indent.itemName}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Quantity:</strong> {indent.quantity}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Indent Status:</strong> {indent.status}
                    </Typography>
                    
                    
                    <Typography variant="body1" gutterBottom>
                      <strong>Approved By:</strong> {indent.approvedBy?.username || "N/A"}
                    </Typography>

                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="GFR Note"
                      value={gfrNoteMap[indent.id] || ""}
                      onChange={(e) => handleGfrNoteChange(indent.id, e.target.value)}
                      sx={{
                        mt: 2,
                        "& .MuiInputBase-root": { color: TEXT_COLOR },
                      }}
                    />

                    <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => handleSubmitGFR(indent.id)}
                        sx={{ backgroundColor: ACCENT_COLOR }}
                      >
                        Submit GFR
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            ))
          )}
        </>
      )}
    </Container>
  );
};

export default PurchasePanel;
