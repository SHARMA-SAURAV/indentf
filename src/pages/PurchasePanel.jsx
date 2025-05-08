import React, { useEffect, useState } from "react";
import axios from "../api/api";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Grid,
  Divider,
  Box,
  Alert,
} from "@mui/material";

const PurchasePanel = () => {
  const [indents, setIndents] = useState([]);
  const [remarkMap, setRemarkMap] = useState({});

  const [gfrIndents, setGfrIndents] = useState([]);
  const [gfrNoteMap, setGfrNoteMap] = useState({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchPendingIndents();
    fetchPendingGFRIndents();
  }, []);

  const fetchPendingIndents = async () => {
    try {
      const res = await axios.get("/indent/purchase/pending");
      setIndents(res.data);
    } catch (err) {
      console.error("Failed to fetch purchase indents", err);
    }
  };

  const fetchPendingGFRIndents = async () => {
    try {
      const res = await axios.get("/indent/purchase/gfr/pending");
      setGfrIndents(res.data);
    } catch (err) {
      console.error("Failed to fetch GFR indents", err);
    }
  };

  const handleRemarkChange = (id, value) => {
    setRemarkMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleComplete = async (id) => {
    try {
      await axios.post("/indent/purchase/complete", {
        indentId: id,
        remark: remarkMap[id] || "",
      });
      alert("Indent marked as COMPLETED.");
      fetchPendingIndents();
    } catch (err) {
      alert("Error completing indent.");
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
    } catch (err) {
      console.error("GFR submission failed", err);
      setStatus("Error submitting GFR.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Purchase Panel – Pending Indents
      </Typography>

      {indents.length === 0 ? (
        <Typography>No indents at Purchase stage.</Typography>
      ) : (
        indents.map((indent) => (
          <Card key={indent.id} sx={{ mb: 3 }}>
            <CardHeader subheader={indent.itemName} />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Quantity:</strong> {indent.quantity}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Department:</strong>{" "}
                    {indent.requestedBy?.department || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    label="Purchase Remark"
                    value={remarkMap[indent.id] || ""}
                    onChange={(e) =>
                      handleRemarkChange(indent.id, e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleComplete(indent.id)}
                    >
                      Mark as Completed
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))
      )}

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom>
        GFR Generation – Indents Ready
      </Typography>

      {status && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {status}
        </Alert>
      )}

      {gfrIndents.length === 0 ? (
        <Typography>No indents awaiting GFR submission.</Typography>
      ) : (
        gfrIndents.map((indent) => (
          <Card key={indent.id} sx={{ mb: 3 }}>
            <CardHeader subheader={indent.itemName} />
            <CardContent>
              <Typography>
                <strong>Quantity:</strong> {indent.quantity}
              </Typography>
              <Typography>
                <strong>Approved By:</strong> {indent.approvedBy?.username || "N/A"}
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="GFR Note"
                value={gfrNoteMap[indent.id] || ""}
                onChange={(e) => handleGfrNoteChange(indent.id, e.target.value)}
                sx={{ mt: 2 }}
              />

              <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => handleSubmitGFR(indent.id)}
                >
                  Submit GFR
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default PurchasePanel;



















// import React, { useEffect, useState } from "react";
// // import axios from "@/api/axios";
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
// } from "@mui/material";

// const PurchasePanel = () => {
//   const [indents, setIndents] = useState([]);
//   const [remarkMap, setRemarkMap] = useState({});

//   useEffect(() => {
//     fetchPendingIndents();
//   }, []);

//   const fetchPendingIndents = async () => {
//     try {
//       const res = await axios.get("/indent/purchase/pending");
//       setIndents(res.data);
//     } catch (err) {
//       console.error("Failed to fetch purchase indents", err);
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

//   return (
//     <Container maxWidth="md" sx={{ mt: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Purchase Panel – Pending Indents
//       </Typography>

//       {indents.length === 0 ? (
//         <Typography>No indents at Purchase stage.</Typography>
//       ) : (
//         indents.map((indent) => (
//           <Card key={indent.id} sx={{ mb: 3 }}>
//             <CardHeader
//             //   title={`Indent #${indent.id}`}
//               subheader={indent.itemName}
//             />
//             <CardContent>
//               <Grid container spacing={2}>
//                 <Grid item xs={6}>
//                   <Typography variant="body1">
//                     <strong>Quantity:</strong> {indent.quantity}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Typography variant="body1">
//                     <strong>Department:</strong>{" "}
//                     {indent.requestedBy?.department || "N/A"}
//                   </Typography>
//                 </Grid>

//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     multiline
//                     label="Purchase Remark"
//                     value={remarkMap[indent.id] || ""}
//                     onChange={(e) =>
//                       handleRemarkChange(indent.id, e.target.value)
//                     }
//                   />
//                 </Grid>

//                 <Grid item xs={12}>
//                   <Box display="flex" justifyContent="flex-end">
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() => handleComplete(indent.id)}
//                     >
//                       Mark as Completed
//                     </Button>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//         ))
//       )}
//     </Container>
//   );
// };

// export default PurchasePanel;
