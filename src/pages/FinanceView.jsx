import React, { useEffect, useState } from 'react';
import axios from "../api/api";
import {
  Card, CardContent, Typography, TextField, Button, Grid
} from '@mui/material';

const FinanceView = () => {
  const [indents, setIndents] = useState([]);
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    fetchPendingIndents();
  }, []);

  const fetchPendingIndents = async () => {
    try {
      const res = await axios.get('/indent/finance/pending');
      setIndents(res.data);
    } catch (err) {
      console.error('Failed to fetch indents:', err);
    }
  };

  const handleRemarkChange = (id, value) => {
    setRemarks(prev => ({ ...prev, [id]: value }));
  };

  const handleApprove = async (id) => {
    try {
      await axios.post('/indent/finance/approve', {
        indentId: id,
        remark: remarks[id] || ''
      });
      setIndents(prev => prev.filter(i => i.id !== id));  // Remove from list
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>Finance Panel</Typography>
      {indents.length === 0 ? (
        <Typography>No pending indents</Typography>
      ) : (
        indents.map(indent => (
          <Card key={indent.id} style={{ marginBottom: 16 }}>
            <CardContent>
              <Typography variant="h6">Item: {indent.itemName}</Typography>
              <Typography>Description: {indent.description}</Typography>
              <Typography>Quantity: {indent.quantity}</Typography>
              <Typography>Cost: ₹{indent.perPieceCost}</Typography>
              <Typography>Requested By: {indent.requestedBy?.name}</Typography>
              <Typography>Approved By Store: {indent.store?.name}</Typography>

              <Grid container spacing={2} style={{ marginTop: 12 }}>
                <Grid item xs={8}>
                  <TextField
                    label="Remark"
                    fullWidth
                    value={remarks[indent.id] || ''}
                    onChange={(e) => handleRemarkChange(indent.id, e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button variant="contained" color="primary" onClick={() => handleApprove(indent.id)}>
                    Approve & Forward to Purchase
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default FinanceView;
