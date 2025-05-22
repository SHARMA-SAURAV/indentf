// import React, { useEffect, useState } from "react";
// import axios from "../api/api";
// import {
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   Grid,
//   Tabs,
//   Tab,
//   Box,
// } from "@mui/material";

// const TabPanel = ({ children, value, index }) => {
//   return (
//     <div hidden={value !== index}>
//       {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
//     </div>
//   );
// };

// const FinanceView = () => {
//   const [tabIndex, setTabIndex] = useState(0);
//   const [approvalIndents, setApprovalIndents] = useState([]);
//   const [paymentIndents, setPaymentIndents] = useState([]);
//   const [remarks, setRemarks] = useState({});
//   const [paymentNotes, setPaymentNotes] = useState({});

//   useEffect(() => {
//     fetchApprovalIndents();
//     fetchPaymentIndents();
//   }, []);

//   const fetchApprovalIndents = async () => {
//     try {
//       const res = await axios.get("/indent/finance/pending");
//       console.log("Approval indents response:", res.data); // <- add this
//       setApprovalIndents(res.data);
//     } catch (err) {
//       console.error("Failed to fetch approval indents:", err);
//       setApprovalIndents([]); // fallback to empty array
//     }
//   };

//   const fetchPaymentIndents = async () => {
//     try {
//       const res = await axios.get("/indent/finance/payment/pending");
//       console.log("Payment indents response:", res.data); // <- add this
//       setPaymentIndents(res.data);
//     } catch (err) {
//       console.error("Failed to fetch payment indents:", err);
//       setPaymentIndents([]); // fallback to empty array
//     }
//   };

//   const handleRemarkChange = (id, value) => {
//     setRemarks((prev) => ({ ...prev, [id]: value }));
//   };

//   const handlePaymentNoteChange = (id, value) => {
//     setPaymentNotes((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleApprove = async (id) => {
//     try {
//       await axios.post("/indent/finance/approve", {
//         indentId: id,
//         remark: remarks[id] || "",
//       });
//       setApprovalIndents((prev) => prev.filter((i) => i.id !== id));
//     } catch (err) {
//       console.error("Approval failed:", err);
//     }
//   };

//   const handleReject = async (id) => {
//     const confirm = window.confirm(
//       "Are you sure you want to reject this indent?"
//     );
//     if (!confirm) return;

//     try {
//       await axios.post("/indent/finance/reject", {
//         indentId: id,
//         remark: remarks[id] || "",
//       });
//       alert("Indent rejected.");
//       setApprovalIndents((prev) => prev.filter((i) => i.id !== id));
//     } catch (err) {
//       console.error("Rejection failed:", err);
//       alert("Failed to reject indent.");
//     }
//   };

//   const handlePaymentComplete = async (id) => {
//     try {
//       await axios.post("/indent/finance/payment/submit", {
//         indentId: id,
//         paymentNote: paymentNotes[id] || "",
//       });
//       alert("Payment marked as completed.");
//       setPaymentIndents((prev) => prev.filter((i) => i.id !== id));
//     } catch (err) {
//       alert("Error submitting payment");
//       console.error("Payment submission failed:", err);
//     }
//   };


//   const handlePaymentReject = async (id) => {
//   const confirm = window.confirm("Are you sure you want to reject this payment?");
//   if (!confirm) return;

//   try {
//     await axios.post('/indent/finance/payment/reject', {
//       indentId: id,
//       paymentNote: paymentNotes[id] || ''
//     });
//     alert("Payment rejected.");
//     setPaymentIndents(prev => prev.filter(i => i.id !== id));
//   } catch (err) {
//     console.error('Payment rejection failed:', err);
//     alert('Failed to reject payment.');
//   }
// };



//   return (
//     <Box sx={{ padding: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Finance Panel
//       </Typography>

//       <Tabs
//         value={tabIndex}
//         onChange={(e, val) => setTabIndex(val)}
//         sx={{ mb: 2 }}
//       >
//         <Tab label="Approve & Forward" />
//         <Tab label="Mark Payment Done" />
//       </Tabs>

//       <TabPanel value={tabIndex} index={0}>
//         {approvalIndents.length === 0 ? (
//           <Typography>No pending approvals</Typography>
//         ) : (
//           approvalIndents.map((indent) => (
//             <Card key={indent.id} sx={{ mb: 2 }}>
//               <CardContent>
//                 <Typography variant="h6">Item: {indent.itemName}</Typography>
//                 <Typography>Description: {indent.description}</Typography>
//                 <Typography>Quantity: {indent.quantity}</Typography>
//                 <Typography>Cost: ₹{indent.perPieceCost}</Typography>
//                 <Typography>
//                   Requested By: {indent.requestedBy?.name}
//                 </Typography>
//                 <Typography>Approved By Store: {indent.store?.name}</Typography>

//                 <Grid container spacing={2} sx={{ mt: 2 }}>
//                   <Grid item xs={8}>
//                     <TextField
//                       label="Finance Remark"
//                       fullWidth
//                       value={remarks[indent.id] || ""}
//                       onChange={(e) =>
//                         handleRemarkChange(indent.id, e.target.value)
//                       }
//                     />
//                   </Grid>
//                   <Grid item xs={4}>
//                     <Button
//                       variant="contained"
//                       onClick={() => handleApprove(indent.id)}
//                     >
//                       Approve & Forward
//                     </Button>
//                   </Grid>

//                   <Grid item xs={3}>
//                     <Button
//                       variant="outlined"
//                       color="error"
//                       onClick={() => handleReject(indent.id)}
//                     >
//                       Reject
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </TabPanel>

//       <TabPanel value={tabIndex} index={1}>
//         {paymentIndents.length === 0 ? (
//           <Typography>No pending payments</Typography>
//         ) : (
//           paymentIndents.map((indent) => (
//             <Card key={indent.id} sx={{ mb: 2 }}>
//               <CardContent>
//                 <Typography variant="h6">Item: {indent.itemName}</Typography>
//                 <Typography>Description: {indent.description}</Typography>
//                 <Typography>Quantity: {indent.quantity}</Typography>
//                 <Typography>GFR Note: {indent.paymentNote}</Typography>
//                 <Typography>
//                   Requested By: {indent.requestedBy?.name}
//                 </Typography>

//                 <Grid container spacing={2} sx={{ mt: 2 }}>
//                   <Grid item xs={8}>
//                     <TextField
//                       label="Payment Note"
//                       fullWidth
//                       value={paymentNotes[indent.id] || ""}
//                       onChange={(e) =>
//                         handlePaymentNoteChange(indent.id, e.target.value)
//                       }
//                     />
//                   </Grid>
//                   <Grid item xs={4}>
//                     <Button
//                       variant="contained"
//                       color="success"
//                       onClick={() => handlePaymentComplete(indent.id)}
//                     >
//                       Mark as Paid
//                     </Button>
//                   </Grid>
//                   <Grid item xs={3}>
//                     <Button
//                       variant="outlined"
//                       color="error"
//                       onClick={() => handlePaymentReject(indent.id)}
//                     >
//                       Reject Payment
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </TabPanel>
//     </Box>
//   );
// };

// export default FinanceView;

import React, { useEffect, useState } from "react";
import axios from "../api/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Tabs,
  Tab,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

// Color constants from your input
const GRADIENT_BG = "linear-gradient(135deg, #FAFAFA 0%, #EDEDED 100%)"; // ultra-soft gray gradient
const CARD_BG = "rgba(255, 255, 255, 0.95)"; // subtle translucency for cleaner cards
const TEXT_COLOR = "#444950"; // deep soft gray — elegant and readable
const ACCENT_COLOR = "#0d47a1"; // soothing lavender-blue, more inviting than navy
const SUBTEXT_COLOR = "#8E99A3"; // polished light gray-blue for captions/notes

const FinanceView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tabIndex, setTabIndex] = useState(0);
  const [approvalIndents, setApprovalIndents] = useState([]);
  const [paymentIndents, setPaymentIndents] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [paymentNotes, setPaymentNotes] = useState({});

  useEffect(() => {
    fetchApprovalIndents();
    fetchPaymentIndents();
  }, []);

  const fetchApprovalIndents = async () => {
    try {
      const res = await axios.get("/indent/finance/pending");
      setApprovalIndents(res.data);
    } catch (err) {
      console.error("Failed to fetch approval indents:", err);
      setApprovalIndents([]);
    }
  };

  const fetchPaymentIndents = async () => {
    try {
      const res = await axios.get("/indent/finance/payment/pending");
      setPaymentIndents(res.data);
    } catch (err) {
      console.error("Failed to fetch payment indents:", err);
      setPaymentIndents([]);
    }
  };

  const handleRemarkChange = (id, value) => {
    setRemarks((prev) => ({ ...prev, [id]: value }));
  };

  const handlePaymentNoteChange = (id, value) => {
    setPaymentNotes((prev) => ({ ...prev, [id]: value }));
  };

  const handleApprove = async (id) => {
    try {
      await axios.post("/indent/finance/approve", {
        indentId: id,
        remark: remarks[id] || "",
      });
      setApprovalIndents((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Failed to approve indent.");
    }
  };

  const handleReject = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to reject this indent?"
    );
    if (!confirm) return;

    try {
      await axios.post("/indent/finance/reject", {
        indentId: id,
        remark: remarks[id] || "",
      });
      alert("Indent rejected.");
      setApprovalIndents((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Rejection failed:", err);
      alert("Failed to reject indent.");
    }
  };

  const handlePaymentComplete = async (id) => {
    try {
      await axios.post("/indent/finance/payment/submit", {
        indentId: id,
        paymentNote: paymentNotes[id] || "",
      });
      alert("Payment marked as completed.");
      setPaymentIndents((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert("Error submitting payment");
      console.error("Payment submission failed:", err);
    }
  };

  const handlePaymentReject = async (id) => {
    const confirm = window.confirm("Are you sure you want to reject this payment?");
    if (!confirm) return;

    try {
      await axios.post('/indent/finance/payment/reject', {
        indentId: id,
        paymentNote: paymentNotes[id] || ''
      });
      alert("Payment rejected.");
      setPaymentIndents(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Payment rejection failed:', err);
      alert('Failed to reject payment.');
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: GRADIENT_BG,
        padding: 2,
        flexDirection: "column",
      }}
    >
      {/* Title moved outside white card */}
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{
          mb: 3,
          color: ACCENT_COLOR,
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: 1.2,
          width: "90%",
          maxWidth: 900,
        }}
      >
      <FontAwesomeIcon icon={faCoins} />
        Finance Dashboard
      </Typography>
      <Box
        sx={{
          width: "90%",
          maxWidth: 900,
          bgcolor: CARD_BG,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          overflowY: "auto",
          maxHeight: "90vh",
          color: TEXT_COLOR,
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(e, val) => setTabIndex(val)}
          sx={{ mb: 2 }}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            label="Approve & Forward"
            sx={{ color: SUBTEXT_COLOR, fontWeight: 600 }}
          />
          <Tab
            label="Mark Payment Done"
            sx={{ color: SUBTEXT_COLOR, fontWeight: 600 }}
          />
        </Tabs>

        <TabPanel value={tabIndex} index={0}>
          {approvalIndents.length === 0 ? (
            <Typography sx={{ color: SUBTEXT_COLOR }}>
              No pending approvals
            </Typography>
          ) : (
            approvalIndents.map((indent) => (
              <Card
                key={indent.id}
                sx={{ mb: 2, bgcolor: CARD_BG, color: TEXT_COLOR }}
                elevation={1}
              >
                <CardContent>
                  

<Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>
  <strong>Project Name:</strong> {indent.projectName}
</Typography>

<Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>
  <strong>Item Name:</strong> {indent.itemName}
</Typography>

<Typography>
  <strong>Indent Id:</strong> {indent.id}
</Typography>

<Typography>
  <strong>Quantity:</strong> {indent.quantity}
</Typography>

<Typography>
  <strong>PerPieceCost:</strong> {indent.perPieceCost}
</Typography>

<Typography>
  <strong>Total Cost:</strong> {indent.totalCost}
</Typography>

<Typography>
  <strong>Department:</strong> {indent.department}
</Typography>

<Typography>
  <strong>Indent Status:</strong> {indent.status}
</Typography>

<Typography>
  <strong>Description:</strong> {indent.description}
</Typography>


                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={8}>
                      <TextField
                        label="Finance Remark"
                        fullWidth
                        value={remarks[indent.id] || ""}
                        onChange={(e) =>
                          handleRemarkChange(indent.id, e.target.value)
                        }
                        size="small"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      display="flex"
                      alignItems="center"
                      gap={1}
                      justifyContent="flex-end"
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleApprove(indent.id)}
                        sx={{ bgcolor: ACCENT_COLOR }}
                      >
                        Approve & Forward
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleReject(indent.id)}
                      >
                        Reject
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))
          )}
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          {paymentIndents.length === 0 ? (
            <Typography sx={{ color: SUBTEXT_COLOR }}>
              No pending payments
            </Typography>
          ) : (
            paymentIndents.map((indent) => (
              <Card
                key={indent.id}
                sx={{ mb: 2, bgcolor: CARD_BG, color: TEXT_COLOR }}
                elevation={1}
              >
                <CardContent>
                <Typography>
                    <strong>Indent Id:</strong> {indent.id}
                  </Typography>

                  <Typography>
                    <strong>Project Name:</strong> {indent.projectName}
                  </Typography>
                  <Typography>
                    <strong>Item Name:</strong> {indent.itemName}
                  </Typography>
                  <Typography>
                    <strong>Quantity:</strong> {indent.quantity}
                  </Typography>
                  <Typography>
                    <strong>PerPieceCost:</strong> {indent.perPieceCost}
                  </Typography>
                  <Typography>
                    <strong>totalCost:</strong> {indent.totalCost}
                  </Typography>
                  <Typography>
                    <strong>Department:</strong> {indent.department}
                  </Typography>
                  <Typography>
                    <strong>Description:</strong> {indent.description}
                  </Typography>

                  <Typography sx={{ color: SUBTEXT_COLOR, mt: 1 }}>
                    <strong>GFR Note:</strong> {indent.paymentNote}
                  </Typography>
                  <Typography sx={{ color: SUBTEXT_COLOR }}>
                    <strong>Requested Amount:</strong> {indent.amountRequested}
                  </Typography>

                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={8}>
                      <TextField
                        label="Payment Note"
                        fullWidth
                        value={paymentNotes[indent.id] || ""}
                        onChange={(e) =>
                          handlePaymentNoteChange(indent.id, e.target.value)
                        }
                        size="small"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      display="flex"
                      alignItems="center"
                      gap={1}
                      justifyContent="flex-end"
                    >
                      <Button
                        variant="contained"
                        onClick={() => handlePaymentComplete(indent.id)}
                        sx={{ bgcolor: ACCENT_COLOR }}
                      >
                        Mark as Completed
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handlePaymentReject(indent.id)}
                      >
                        Reject
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))
          )}
        </TabPanel>
      </Box>
    </Box>
  );
};

export default FinanceView;
