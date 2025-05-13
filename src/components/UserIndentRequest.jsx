import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,

  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import axios from "../api/api";
import InspectionItem from "./InspectionItem";

const UserIndentRequest = () => {
  const [tab, setTab] = useState(0);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [perPieceCost, setPerPieceCost] = useState("");
  const [description, setDescription] = useState("");
  const [flaList, setFlaList] = useState([]);
  const [selectedFla, setSelectedFla] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [pendingInspections, setPendingInspections] = useState([]);
  const [allIndents, setAllIndents] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setStatus({ type: "", message: "" });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "orange";
      case "approved":
      case "completed":
      case "inspected":
        return "green";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  useEffect(() => {
    const fetchFLAs = async () => {
      try {
        const res = await axios.get("/auth/users/by-role?role=FLA");
        setFlaList(res.data);
      } catch (err) {
        console.error("Error fetching FLAs", err);
      }
    };
    fetchFLAs();
  }, []);

  useEffect(() => {
    const fetchPendingInspections = async () => {
      try {
        const res = await axios.get("/indent/user/pending-inspection");
        setPendingInspections(res.data);
      } catch (err) {
        console.error("Error fetching pending inspections", err);
      }
    };
    if (tab === 1) fetchPendingInspections();
  }, [tab]);

  useEffect(() => {
    const fetchIndents = async () => {
      try {
        const res = await axios.get("/indent/user/all");
        setAllIndents(res.data);
      } catch (err) {
        console.error("Error fetching indents", err);
      }
    };
    if (tab === 2) fetchIndents();
  }, [tab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        itemName,
        quantity: parseInt(quantity),
        perPieceCost: parseInt(perPieceCost),
        description,
        flaId: selectedFla,
      };
      await axios.post("/indent/create", body);
      setStatus({ type: "success", message: "Indent submitted successfully!" });

      // Reset form
      setItemName("");
      setQuantity("");
      setPerPieceCost("");
      setDescription("");
      setSelectedFla("");
    } catch (err) {
      console.error("Failed to submit indent", err);
      setStatus({ type: "error", message: "Failed to submit indent." });
    }
  };

  //  console.log("indnet tracking--------",indent.tracking);

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          User Panel
        </Typography>

        <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Request Indent" />
          <Tab label="Pending Inspections" />
          <Tab label="Track Indents" />
        </Tabs>

        {status.message && (
          <Alert severity={status.type} sx={{ mb: 2 }}>
            {status.message}
          </Alert>
        )}

        {tab === 0 && (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Item Name"
              margin="normal"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Quantity"
              margin="normal"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Per Piece Cost"
              margin="normal"
              type="number"
              value={perPieceCost}
              onChange={(e) => setPerPieceCost(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <TextField
              select
              fullWidth
              label="Select FLA"
              margin="normal"
              value={selectedFla}
              onChange={(e) => setSelectedFla(e.target.value)}
              required
            >
              {flaList.map((fla) => (
                <MenuItem key={fla.id} value={fla.id}>
                  {fla.username}
                </MenuItem>
              ))}
            </TextField>
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Submit Indent
            </Button>
          </Box>
        )}

  {tab === 1 && (
          <Box>
            {pendingInspections.length === 0 ? (
              <Typography>No pending items for inspection.</Typography>
            ) : (
              pendingInspections.map((indent) => (
                <InspectionItem 
                  key={indent.id} 
                  indent={indent}
                  onConfirm={async (id, remark) => {
                    try {
                      await axios.post(`/indent/${id}/confirm-inspection`, { remark });
                      setStatus({
                        type: "success",
                        message: "Product confirmed OK!",
                      });
                      setPendingInspections((prev) =>
                        prev.filter((i) => i.id !== id)
                      );
                    } catch (err) {
                      console.error(err);
                      setStatus({
                        type: "error",
                        message: "Failed to confirm inspection",
                      });
                      throw err;
                    }
                  }}
                />
              ))
            )}
          </Box>
        )}

        {tab === 2 && (
          <Box>
            {allIndents.length === 0 ? (
              <Typography>No indents found.</Typography>
            ) : (
              allIndents.map((indent) => (
                <Card key={indent.id} sx={{ my: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{indent.itemName}</Typography>
                    <Typography>
                      <strong>Quantity:</strong> {indent.quantity}
                    </Typography>
                    <Typography>
                      <strong>Description:</strong> {indent.description}
                    </Typography>
                    <Typography>
                      <strong>Status:</strong>{" "}
                      <span style={{ color: getStatusColor(indent.status) }}>
                        {indent.status}
                      </span>
                    </Typography>
                    <Typography>
                      <strong>Created:</strong>{" "}
                      {new Date(indent.createdAt).toLocaleString()}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Tracking Progress:
                      </Typography>


                      
                      {/* Updated tracking progress section */}
                      {(() => {
                        const trackingSteps = [];

                        // FLA Step
                        if (indent.remarkByFla && indent.flaApprovalDate) {
                          trackingSteps.push({
                            role: "FLA",
                            remark: indent.remarkByFla,
                            date: indent.flaApprovalDate,
                            status: "Approved",
                          });
                        }

                        // SLA Step
                        if (indent.remarkBySla && indent.slaApprovalDate) {
                          trackingSteps.push({
                            role: "SLA",
                            remark: indent.remarkBySla,
                            date: indent.slaApprovalDate,
                            status: "Approved",
                          });
                        }

                        // Store Step
                        if (indent.remarkByStore && indent.storeApprovalDate) {
                          trackingSteps.push({
                            role: "Store",
                            remark: indent.remarkByStore,
                            date: indent.storeApprovalDate,
                            status: "Approved",
                          });
                        }

                        // Finance Step
                        if (indent.remarkByFinance && indent.financeApprovalDate) {
                          trackingSteps.push({
                            role: "Finance",
                            remark: indent.remarkByFinance,
                            date: indent.financeApprovalDate,
                            status: "Approved",
                          });
                        }

                        // Purchase Step
                        if (indent.remarkByPurchase && indent.purchaseCompletionDate) {
                          trackingSteps.push({
                            role: "Purchase",
                            remark: indent.remarkByPurchase,
                            date: indent.purchaseCompletionDate,
                            status: "Completed",
                          });
                        }

                        // Additional remarks
                       if (indent.remarkByUser && indent.userInspectionDate) {
                          trackingSteps.push({
                            role: "User",
                            remark: indent.remarkByUser,
                            date: indent.userInspectionDate,
                            status: "Inspection Done",
                          });
                        }

                         if (indent.gfrNote && indent.gfrCreatedAt) {
                          trackingSteps.push({
                            role: "Purchase",
                            remark: indent.gfrNote,
                            date: indent.gfrCreatedAt,
                            status: "PENDING_FINANCE_PAYMENT",
                          });
                        }

                         if (indent.paymentNote && indent.paymentCreatedAt) {
                          trackingSteps.push({
                            role: "Finance",
                            remark: indent.paymentNote,
                            date: indent.paymentCreatedAt,
                            status: "Completed Payment ",
                          });
                        }

                        return trackingSteps.length > 0 ? (
                          trackingSteps
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map((step, index) => (
                              <Box
                                key={index}
                                sx={{
                                  ml: 2,
                                  my: 1,
                                  borderLeft: "3px solid #1976d2",
                                  pl: 2,
                                  position: "relative",
                                }}
                              >
                                <Box
                                  sx={{
                                    position: "absolute",
                                    left: "-7px",
                                    top: "5px",
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: "#1976d2",
                                  }}
                                />
                                <Typography>
                                  <strong>{step.role}</strong>{" "}
                                  <span style={{ fontStyle: "italic" }}>
                                    ({step.status})
                                  </span>
                                </Typography>
                                <Typography sx={{ mb: 0.5 }}>
                                  {step.remark}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(step.date).toLocaleString()}
                                </Typography>
                              </Box>
                            ))
                        ) : (
                          <Typography>No tracking info available yet.</Typography>
                        );
                      })()}
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UserIndentRequest;





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
//   Tabs,
//   Tab,
// } from "@mui/material";
// import axios from "../api/api";

// const UserIndentRequest = () => {
//   const myIndents = indents.filter(indent => indent.requestedBy?.id === currentUser.id);

// const pendingInspection = myIndents.filter(indent =>
//   indent.status === "PENDING_USER_INSPECTION" && !indent.userInspectionDate
// );

// const completed = myIndents.filter(indent =>
//   indent.status === "PAYMENT_COMPLETED"
// );

//   const [tab, setTab] = useState(0);
//   const [itemName, setItemName] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [perPieceCost, setPerPieceCost] = useState("");
//   const [description, setDescription] = useState("");
//   const [flaList, setFlaList] = useState([]);
//   const [selectedFla, setSelectedFla] = useState("");
//   const [status, setStatus] = useState({ type: "", message: "" });
//   const [pendingInspections, setPendingInspections] = useState([]);
//   const [allIndents, setAllIndents] = useState([]);
//   const [selectedIndentId, setSelectedIndentId] = useState(null);

//   const handleChange = (event, newValue) => setTab(newValue);

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case "pending":
//         return "orange";
//       case "approved":
//       case "completed":
//       case "inspected":
//         return "green";
//       case "rejected":
//         return "red";
//       default:
//         return "gray";
//     }
//   };

//   useEffect(() => {
//     const fetchIndents = async () => {
//       try {
//         const res = await axios.get("/indent/user/all");
//         setAllIndents(res.data);
//       } catch (err) {
//         console.error("Error fetching indents", err);
//       }
//     };
//     if (tab === 2) fetchIndents(); // Only fetch when tab is selected
//   }, [tab]);

//   useEffect(() => {
//     const fetchFLAs = async () => {
//       try {
//         const res = await axios.get("/auth/users/by-role?role=FLA");
//         setFlaList(res.data);
//       } catch (err) {
//         console.error("Error fetching FLAs", err);
//       }
//     };
//     fetchFLAs();
//   }, []);

//   useEffect(() => {
//     const fetchPendingInspections = async () => {
//       try {
//         const res = await axios.get("/indent/user/pending-inspection");
//         setPendingInspections(res.data);
//       } catch (err) {
//         console.error("Error fetching pending inspections", err);
//       }
//     };
//     fetchPendingInspections();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const body = {
//         itemName,
//         quantity: parseInt(quantity),
//         perPieceCost: parseInt(perPieceCost),
//         description,
//         flaId: selectedFla,
//       };
//       await axios.post("/indent/create", body);
//       setStatus({ type: "success", message: "Indent submitted successfully!" });

//       // Reset form
//       setItemName("");
//       setQuantity("");
//       setPerPieceCost("");
//       setDescription("");
//       setSelectedFla("");
//     } catch (err) {
//       console.error("Failed to submit indent", err);
//       setStatus({ type: "error", message: "Failed to submit indent." });
//     }
//   };

//   const handleTabChange = (event, newValue) => {
//     setTab(newValue);
//     setStatus({ type: "", message: "" });
//   };

//   return (
//     <Card sx={{ mt: 4 }}>
//       <CardContent>
//         <Typography variant="h5" gutterBottom>
//           User Panel
//         </Typography>

//         <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
//           <Tab label="Request Indent" />
//           <Tab label="Pending Inspections" />
//           <Tab label="Track Indents" />
//         </Tabs>

//         {status.message && (
//           <Alert severity={status.type} sx={{ mb: 2 }}>
//             {status.message}
//           </Alert>
//         )}

//         {tab === 0 && (
//           <Box component="form" onSubmit={handleSubmit} noValidate>
//             <TextField
//               fullWidth
//               label="Item Name"
//               margin="normal"
//               value={itemName}
//               onChange={(e) => setItemName(e.target.value)}
//               required
//             />

//             <TextField
//               fullWidth
//               label="Quantity"
//               margin="normal"
//               type="number"
//               value={quantity}
//               onChange={(e) => setQuantity(e.target.value)}
//               required
//             />

//             <TextField
//               fullWidth
//               label="Per Piece Cost"
//               margin="normal"
//               type="number"
//               value={perPieceCost}
//               onChange={(e) => setPerPieceCost(e.target.value)}
//               required
//             />

//             <TextField
//               fullWidth
//               label="Description"
//               margin="normal"
//               multiline
//               rows={3}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               required
//             />

//             <TextField
//               select
//               fullWidth
//               label="Select FLA"
//               margin="normal"
//               value={selectedFla}
//               onChange={(e) => setSelectedFla(e.target.value)}
//               required
//             >
//               {flaList.map((fla) => (
//                 <MenuItem key={fla.id} value={fla.id}>
//                   {fla.username}
//                 </MenuItem>
//               ))}
//             </TextField>

//             <Button type="submit" variant="contained" sx={{ mt: 2 }}>
//               Submit Indent
//             </Button>
//           </Box>
//         )}

//         {tab === 1 && (
//           <Box>
//             {pendingInspections.length === 0 ? (
//               <Typography>No pending items for inspection.</Typography>
//             ) : (
//               pendingInspections.map((indent) => (
//                 <Card key={indent.id} sx={{ my: 2 }}>
//                   <CardContent>
//                     <Typography>
//                       <strong>Item:</strong> {indent.itemName}
//                     </Typography>
//                     <Typography>
//                       <strong>Quantity:</strong> {indent.quantity}
//                     </Typography>
//                     <Typography>
//                       <strong>Description:</strong> {indent.description}
//                     </Typography>

//                     <Button
//                       variant="outlined"
//                       sx={{ mt: 2 }}
//                       onClick={async () => {
//                         try {
//                           await axios.post(
//                             `/indent/${indent.id}/confirm-inspection`
//                           );
//                           setStatus({
//                             type: "success",
//                             message: "Product confirmed OK!",
//                           });
//                           setPendingInspections((prev) =>
//                             prev.filter((i) => i.id !== indent.id)
//                           );
//                         } catch (err) {
//                           console.error(err);
//                           setStatus({
//                             type: "error",
//                             message: "Failed to confirm inspection",
//                           });
//                         }
//                       }}
//                     >
//                       Confirm Product is OK
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ))
//             )}
//           </Box>
//         )}
//         {tab === 2 && (
//           <Box>
//             {allIndents.length === 0 ? (
//               <Typography>No indents found.</Typography>
//             ) : (
//               allIndents.map((indent) => (
//                 <Card key={indent.id} sx={{ my: 2 }}>
//                   <CardContent>
//                     <Typography variant="h6">{indent.itemName}</Typography>
//                     <Typography>
//                       <strong>Quantity:</strong> {indent.quantity}
//                     </Typography>
//                     <Typography>
//                       <strong>Description:</strong> {indent.description}
//                     </Typography>
//                     <Typography>
//                       <strong>Status:</strong>{" "}
//                       <span style={{ color: getStatusColor(indent.status) }}>
//                         {indent.status}
//                       </span>
//                     </Typography>
//                     <Typography>
//                       <strong>Created:</strong>{" "}
//                       {new Date(indent.createdAt).toLocaleString()}
//                     </Typography>

//                     <Box sx={{ mt: 2 }}>
//                       <Typography variant="subtitle1" gutterBottom>
//                         Tracking Progress:
//                       </Typography>
//                       {indent.tracking && indent.tracking.length > 0 ? (
//                         [...indent.tracking]
//                           .sort((a, b) => new Date(a.date) - new Date(b.date))
//                           .map((step, index) => (
//                             <Box
//                               key={index}
//                               sx={{
//                                 ml: 2,
//                                 my: 1,
//                                 borderLeft: "3px solid #1976d2",
//                                 pl: 2,
//                                 position: "relative",
//                               }}
//                             >
//                               <Box
//                                 sx={{
//                                   position: "absolute",
//                                   left: "-7px",
//                                   top: "5px",
//                                   width: "10px",
//                                   height: "10px",
//                                   borderRadius: "50%",
//                                   backgroundColor: "#1976d2",
//                                 }}
//                               />
//                               <Typography>
//                                 <strong>{step.role}</strong>{" "}
//                                 <span style={{ fontStyle: "italic" }}>
//                                   ({step.status})
//                                 </span>
//                               </Typography>
//                               <Typography sx={{ mb: 0.5 }}>
//                                 {step.remark}
//                               </Typography>
//                               <Typography
//                                 variant="caption"
//                                 color="text.secondary"
//                               >
//                                 {new Date(step.date).toLocaleString()}
//                               </Typography>
//                             </Box>
//                           ))
//                       ) : (
//                         <Typography>No tracking info available yet.</Typography>
//                       )}
//                     </Box>
//                   </CardContent>
//                 </Card>
//               ))
//             )}





            
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default UserIndentRequest;

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
// } from "@mui/material";
// import axios from "../api/api";

// const UserIndentRequest = () => {
//   const [itemName, setItemName] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [perPieceCost, setPerPieceCost] = useState("");
//   const [description, setDescription] = useState("");
//   const [flaList, setFlaList] = useState([]);
//   const [selectedFla, setSelectedFla] = useState("");
//   const [status, setStatus] = useState({ type: "", message: "" });
//   const [pendingInspections, setPendingInspections] = useState([]);

//   // Fetch list of FLA users
//   useEffect(() => {
//     const fetchFLAs = async () => {
//       try {
//         const res = await axios.get("/auth/users/by-role?role=FLA");
//         setFlaList(res.data);
//       } catch (err) {
//         console.error("Error fetching FLAs", err);
//       }
//     };
//     fetchFLAs();
//   }, []);

//   useEffect(() => {
//     const fetchPendingInspections = async () => {
//       try {
//         const res = await axios.get("/indent/user/pending-inspection");
//         setPendingInspections(res.data);
//       } catch (err) {
//         console.error("Error fetching pending inspections", err);
//       }
//     };
//     fetchPendingInspections();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const body = {
//         itemName,
//         quantity: parseInt(quantity),
//         perPieceCost: parseInt(perPieceCost),
//         description,
//         flaId: selectedFla,
//       };
//       await axios.post("/indent/create", body);
//       setStatus({ type: "success", message: "Indent submitted successfully!" });

//       // Reset form
//       setItemName("");
//       setQuantity("");
//       setPerPieceCost("");
//       setDescription("");
//       setSelectedFla("");
//     } catch (err) {
//       console.error("Failed to submit indent", err);
//       setStatus({ type: "error", message: "Failed to submit indent." });
//     }
//   };

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h6" gutterBottom>
//           Request Indent
//         </Typography>

//         {status.message && (
//           <Alert severity={status.type} sx={{ mb: 2 }}>
//             {status.message}
//           </Alert>
//         )}

//         <Box component="form" onSubmit={handleSubmit} noValidate>
//           <TextField
//             fullWidth
//             label="Item Name"
//             margin="normal"
//             value={itemName}
//             onChange={(e) => setItemName(e.target.value)}
//             required
//           />

//           <TextField
//             fullWidth
//             label="Quantity"
//             margin="normal"
//             type="number"
//             value={quantity}
//             onChange={(e) => setQuantity(e.target.value)}
//             required
//           />

//           <TextField
//             fullWidth
//             label="Per Piece Cost"
//             margin="normal"
//             type="number"
//             value={perPieceCost}
//             onChange={(e) => setPerPieceCost(e.target.value)}
//             required
//           />

//           <TextField
//             fullWidth
//             label="Description"
//             margin="normal"
//             multiline
//             rows={3}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//           />

//           <TextField
//             select
//             fullWidth
//             label="Select FLA"
//             margin="normal"
//             value={selectedFla}
//             onChange={(e) => setSelectedFla(e.target.value)}
//             required
//           >
//             {flaList.map((fla) => (
//               <MenuItem key={fla.id} value={fla.id}>
//                 {fla.username}
//               </MenuItem>
//             ))}
//           </TextField>

//           <Button type="submit" variant="contained" sx={{ mt: 2 }}>
//             Submit Indent
//           </Button>
//         </Box>

//         <Box sx={{ mt: 4 }}>
//   <Typography variant="h6" gutterBottom>
//     Pending Product Inspections
//   </Typography>

//   {pendingInspections.length === 0 ? (
//     <Typography>No pending items for inspection.</Typography>
//   ) : (
//     pendingInspections.map((indent) => (
//       <Card key={indent.id} sx={{ my: 2 }}>
//         <CardContent>
//           <Typography><strong>Item:</strong> {indent.itemName}</Typography>
//           <Typography><strong>Quantity:</strong> {indent.quantity}</Typography>
//           <Typography><strong>Description:</strong> {indent.description}</Typography>

//           <Button
//             variant="outlined"
//             sx={{ mt: 2 }}
//             onClick={async () => {
//               try {
//                 await axios.post(`/indent/${indent.id}/confirm-inspection`);
//                 setStatus({ type: "success", message: "Product confirmed OK!" });
//                 setPendingInspections(prev => prev.filter(i => i.id !== indent.id));
//               } catch (err) {
//                 console.error(err);
//                 setStatus({ type: "error", message: "Failed to confirm inspection" });
//               }
//             }}
//           >
//             Confirm Product is OK
//           </Button>
//         </CardContent>
//       </Card>
//     ))
//   )}
// </Box>

//       </CardContent>
//     </Card>
//   );
// };

// export default UserIndentRequest;
