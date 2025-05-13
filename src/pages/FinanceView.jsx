import React, { useEffect, useState } from 'react';
import axios from "../api/api";
import {
  Card, CardContent, Typography, TextField, Button, Grid,
  Tabs, Tab, Box
} from '@mui/material';

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

const FinanceView = () => {
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
      const res = await axios.get('/indent/finance/pending');
      console.log('Approval indents response:', res.data); // <- add this
      setApprovalIndents(res.data);
    } catch (err) {
      console.error('Failed to fetch approval indents:', err);
      setApprovalIndents([]); // fallback to empty array
    }
  };

  const fetchPaymentIndents = async () => {
    try {
      const res = await axios.get('/indent/finance/payment/pending');
      console.log('Payment indents response:', res.data); // <- add this
      setPaymentIndents(res.data);
    } catch (err) {
      console.error('Failed to fetch payment indents:', err);
       setPaymentIndents([]); // fallback to empty array
    }
  };

  const handleRemarkChange = (id, value) => {
    setRemarks(prev => ({ ...prev, [id]: value }));
  };

  const handlePaymentNoteChange = (id, value) => {
    setPaymentNotes(prev => ({ ...prev, [id]: value }));
  };

  const handleApprove = async (id) => {
    try {
      await axios.post('/indent/finance/approve', {
        indentId: id,
        remark: remarks[id] || ''
      });
      setApprovalIndents(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const handlePaymentComplete = async (id) => {
    try {
      await axios.post('/indent/finance/payment/submit', {
        indentId: id,
        paymentNote: paymentNotes[id] || ''
      });
      alert('Payment marked as completed.');
      setPaymentIndents(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      alert('Error submitting payment');
      console.error('Payment submission failed:', err);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Finance Panel</Typography>

      <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} sx={{ mb: 2 }}>
        <Tab label="Approve & Forward" />
        <Tab label="Mark Payment Done" />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        {approvalIndents.length === 0 ? (
          <Typography>No pending approvals</Typography>
        ) : (
          approvalIndents.map(indent => (
            <Card key={indent.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Item: {indent.itemName}</Typography>
                <Typography>Description: {indent.description}</Typography>
                <Typography>Quantity: {indent.quantity}</Typography>
                <Typography>Cost: ₹{indent.perPieceCost}</Typography>
                <Typography>Requested By: {indent.requestedBy?.name}</Typography>
                <Typography>Approved By Store: {indent.store?.name}</Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={8}>
                    <TextField
                      label="Finance Remark"
                      fullWidth
                      value={remarks[indent.id] || ''}
                      onChange={(e) => handleRemarkChange(indent.id, e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button variant="contained" onClick={() => handleApprove(indent.id)}>
                      Approve & Forward
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
          <Typography>No pending payments</Typography>
        ) : (
          paymentIndents.map(indent => (
            <Card key={indent.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Item: {indent.itemName}</Typography>
                <Typography>Description: {indent.description}</Typography>
                <Typography>Quantity: {indent.quantity}</Typography>
                <Typography>GFR Note: {indent.paymentNote}</Typography>
                <Typography>Requested By: {indent.requestedBy?.name}</Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={8}>
                    <TextField
                      label="Payment Note"
                      fullWidth
                      value={paymentNotes[indent.id] || ''}
                      onChange={(e) => handlePaymentNoteChange(indent.id, e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button variant="contained" color="success" onClick={() => handlePaymentComplete(indent.id)}>
                      Mark as Paid
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        )}
      </TabPanel>
    </Box>
  );
};

export default FinanceView;




// yeh sirf dikhane ke liye hai ki kaise hum ek page bana sakte hain jo finance wale indents ko approve karega aur payment ke liye mark karega.
// import React, { useEffect, useState } from 'react';
// import axios from "../api/api";
// import {
//   Card, CardContent, Typography, TextField, Button, Grid, Divider
// } from '@mui/material';

// const FinanceView = () => {
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
//       const res = await axios.get('/indent/finance/pending');
//       setApprovalIndents(res.data);
//     } catch (err) {
//       console.error('Failed to fetch approval indents:', err);
//     }
//   };

//   const fetchPaymentIndents = async () => {
//     try {
//       const res = await axios.get('/indent/finance/payment/pending');
//       setPaymentIndents(res.data);
//     } catch (err) {
//       console.error('Failed to fetch payment indents:', err);
//     }
//   };

//   const handleRemarkChange = (id, value) => {
//     setRemarks(prev => ({ ...prev, [id]: value }));
//   };

//   const handlePaymentNoteChange = (id, value) => {
//     setPaymentNotes(prev => ({ ...prev, [id]: value }));
//   };

//   const handleApprove = async (id) => {
//     try {
//       await axios.post('/indent/finance/approve', {
//         indentId: id,
//         remark: remarks[id] || ''
//       });
//       setApprovalIndents(prev => prev.filter(i => i.id !== id));
//     } catch (err) {
//       console.error('Approval failed:', err);
//     }
//   };

//   const handlePaymentComplete = async (id) => {
//     try {
//       await axios.post('/indent/finance/payment/submit', {
//         indentId: id,
//         paymentNote: paymentNotes[id] || ''
//       });
//       alert('Payment marked as completed.');
//       setPaymentIndents(prev => prev.filter(i => i.id !== id));
//     } catch (err) {
//       alert('Error submitting payment');
//       console.error('Payment submission failed:', err);
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <Typography variant="h4" gutterBottom>Finance Panel</Typography>

//       {/* Section 1: Approve Indents */}
//       <Typography variant="h6" gutterBottom>Approve & Forward to Purchase</Typography>
//       {approvalIndents.length === 0 ? (
//         <Typography>No pending approvals</Typography>
//       ) : (
//         approvalIndents.map(indent => (
//           <Card key={indent.id} style={{ marginBottom: 16 }}>
//             <CardContent>
//               <Typography variant="h6">Item: {indent.itemName}</Typography>
//               <Typography>Description: {indent.description}</Typography>
//               <Typography>Quantity: {indent.quantity}</Typography>
//               <Typography>Cost: ₹{indent.perPieceCost}</Typography>
//               <Typography>Requested By: {indent.requestedBy?.name}</Typography>
//               <Typography>Approved By Store: {indent.store?.name}</Typography>

//               <Grid container spacing={2} style={{ marginTop: 12 }}>
//                 <Grid item xs={8}>
//                   <TextField
//                     label="Finance Remark"
//                     fullWidth
//                     value={remarks[indent.id] || ''}
//                     onChange={(e) => handleRemarkChange(indent.id, e.target.value)}
//                   />
//                 </Grid>
//                 <Grid item xs={4}>
//                   <Button variant="contained" color="primary" onClick={() => handleApprove(indent.id)}>
//                     Approve & Forward
//                   </Button>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//         ))
//       )}

//       <Divider style={{ margin: "24px 0" }} />

//       {/* Section 2: Payment Stage */}
//       <Typography variant="h6" gutterBottom>Payment Pending (Post-GFR)</Typography>
//       {paymentIndents.length === 0 ? (
//         <Typography>No pending payments</Typography>
//       ) : (
//         paymentIndents.map(indent => (
//           <Card key={indent.id} style={{ marginBottom: 16 }}>
//             <CardContent>
//               <Typography variant="h6">Item: {indent.itemName}</Typography>
//               <Typography>Description: {indent.description}</Typography>
//               <Typography>Quantity: {indent.quantity}</Typography>
//               <Typography>GFR Note: {indent.paymentNote}</Typography>
//               <Typography>Requested By: {indent.requestedBy?.name}</Typography>

//               <Grid container spacing={2} style={{ marginTop: 12 }}>
//                 <Grid item xs={8}>
//                   <TextField
//                     label="Payment Note"
//                     fullWidth
//                     value={paymentNotes[indent.id] || ''}
//                     onChange={(e) => handlePaymentNoteChange(indent.id, e.target.value)}
//                   />
//                 </Grid>
//                 <Grid item xs={4}>
//                   <Button variant="contained" color="success" onClick={() => handlePaymentComplete(indent.id)}>
//                     Mark as Paid
//                   </Button>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//         ))
//       )}
//     </div>
//   );
// };

// export default FinanceView;









// import React, { useEffect, useState } from 'react';
// import axios from "../api/api";
// import {
//   Card, CardContent, Typography, TextField, Button, Grid
// } from '@mui/material';

// const FinanceView = () => {
//   const [indents, setIndents] = useState([]);
//   const [remarks, setRemarks] = useState({});

//   useEffect(() => {
//     fetchPendingIndents();
//   }, []);

//   const fetchPendingIndents = async () => {
//     try {
//       const res = await axios.get('/indent/finance/pending');
//       setIndents(res.data);
//     } catch (err) {
//       console.error('Failed to fetch indents:', err);
//     }
//   };

//   const handleRemarkChange = (id, value) => {
//     setRemarks(prev => ({ ...prev, [id]: value }));
//   };

//   const handleApprove = async (id) => {
//     try {
//       await axios.post('/indent/finance/approve', {
//         indentId: id,
//         remark: remarks[id] || ''
//       });
//       setIndents(prev => prev.filter(i => i.id !== id));  // Remove from list
//     } catch (err) {
//       console.error('Approval failed:', err);
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <Typography variant="h4" gutterBottom>Finance Panel</Typography>
//       {indents.length === 0 ? (
//         <Typography>No pending indents</Typography>
//       ) : (
//         indents.map(indent => (
//           <Card key={indent.id} style={{ marginBottom: 16 }}>
//             <CardContent>
//               <Typography variant="h6">Item: {indent.itemName}</Typography>
//               <Typography>Description: {indent.description}</Typography>
//               <Typography>Quantity: {indent.quantity}</Typography>
//               <Typography>Cost: ₹{indent.perPieceCost}</Typography>
//               <Typography>Requested By: {indent.requestedBy?.name}</Typography>
//               <Typography>Approved By Store: {indent.store?.name}</Typography>

//               <Grid container spacing={2} style={{ marginTop: 12 }}>
//                 <Grid item xs={8}>
//                   <TextField
//                     label="Remark"
//                     fullWidth
//                     value={remarks[indent.id] || ''}
//                     onChange={(e) => handleRemarkChange(indent.id, e.target.value)}
//                   />
//                 </Grid>
//                 <Grid item xs={4}>
//                   <Button variant="contained" color="primary" onClick={() => handleApprove(indent.id)}>
//                     Approve & Forward to Purchase
//                   </Button>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//         ))
//       )}
//     </div>
//   );
// };

// export default FinanceView;
