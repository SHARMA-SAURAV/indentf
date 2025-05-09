import React, { useEffect, useState } from "react";
import {
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


  useEffect(() => {
    const fetchIndents = async () => {
      try {
        const res = await axios.get("/indent/user/all");
        setAllIndents(res.data);
      } catch (err) {
        console.error("Error fetching indents", err);
      }
    };
    if (tab === 2) fetchIndents(); // Only fetch when tab is selected
  }, [tab]);

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
    fetchPendingInspections();
  }, []);

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

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setStatus({ type: "", message: "" });
  };

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
                <Card key={indent.id} sx={{ my: 2 }}>
                  <CardContent>
                    <Typography><strong>Item:</strong> {indent.itemName}</Typography>
                    <Typography><strong>Quantity:</strong> {indent.quantity}</Typography>
                    <Typography><strong>Description:</strong> {indent.description}</Typography>

                    <Button
                      variant="outlined"
                      sx={{ mt: 2 }}
                      onClick={async () => {
                        try {
                          await axios.post(`/indent/${indent.id}/confirm-inspection`);
                          setStatus({ type: "success", message: "Product confirmed OK!" });
                          setPendingInspections((prev) =>
                            prev.filter((i) => i.id !== indent.id)
                          );
                        } catch (err) {
                          console.error(err);
                          setStatus({
                            type: "error",
                            message: "Failed to confirm inspection",
                          });
                        }
                      }}
                    >
                      Confirm Product is OK
                    </Button>
                  </CardContent>
                </Card>
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
            <Typography><strong>Quantity:</strong> {indent.quantity}</Typography>
            <Typography><strong>Description:</strong> {indent.description}</Typography>
            <Typography><strong>Status:</strong> {indent.status}</Typography>
            <Typography><strong>Created:</strong> {new Date(indent.createdAt).toLocaleString()}</Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Tracking:</Typography>
              {indent.tracking && indent.tracking.length > 0 ? (
                indent.tracking.map((step, index) => (
                  <Box key={index} sx={{ ml: 2, my: 1 }}>
                    <Typography><strong>{step.role}:</strong> {step.remark}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(step.date).toLocaleString()}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography>No tracking info yet.</Typography>
              )}
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
