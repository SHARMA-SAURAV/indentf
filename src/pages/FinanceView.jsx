import React, { useEffect, useState } from 'react';
import axios from "../api/api";
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
} from '@mui/material';

const TabPanel = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    aria-labelledby={`finance-tab-${index}`}
    id={`finance-tabpanel-${index}`}
  >
    {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
  </div>
);

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
      setApprovalIndents(res.data);
    } catch (err) {
      console.error('Failed to fetch approval indents:', err);
    }
  };

  const fetchPaymentIndents = async () => {
    try {
      const res = await axios.get('/indent/finance/payment/pending');
      setPaymentIndents(res.data);
    } catch (err) {
      console.error('Failed to fetch payment indents:', err);
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
      alert('Indent has been approved and forwarded successfully.');
    } catch (err) {
      alert('Approval failed. Kindly retry.');
      console.error('Approval error:', err);
    }
  };

  const handlePaymentComplete = async (id) => {
    try {
      await axios.post('/indent/finance/payment/submit', {
        indentId: id,
        gfrNote: paymentNotes[id] || ''
      });
      setPaymentIndents(prev => prev.filter(i => i.id !== id));
      alert('Payment status updated successfully.');
    } catch (err) {
      alert('Payment submission failed. Kindly retry.');
      console.error('Payment update error:', err);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: '#f9fafb',
        width: '100vw',
        height: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        color: '#1a237e',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: '#0d47a1',
          letterSpacing: 1,
        }}
      >
        Finance Operations Dashboard
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={(e, val) => setTabIndex(val)}
        aria-label="Finance tabs"
        sx={{
          mb: 3,
          backgroundColor: '#ffffff',
          borderRadius: 1,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '.MuiTabs-indicator': { backgroundColor: '#0d47a1' }
        }}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab
          label="Pending Approvals"
          id="finance-tab-0"
          aria-controls="finance-tabpanel-0"
          sx={{ fontWeight: 600, color: '#1565c0' }}
        />
        <Tab
          label="Pending Payments"
          id="finance-tab-1"
          aria-controls="finance-tabpanel-1"
          sx={{ fontWeight: 600, color: '#1565c0' }}
        />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        {approvalIndents.length === 0 ? (
          <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
            No indents are currently awaiting approval.
          </Typography>
        ) : (
          approvalIndents.map(indent => (
            <Card
              key={indent.id}
              sx={{
                mb: 3,
                p: 2,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                borderRadius: 2,
                backgroundColor: '#ffffff'
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#0d47a1' }}>
                  Project: {indent.projectName}
                </Typography>
                <Typography><strong>Item Name:</strong> {indent.itemName}</Typography>
                <Typography><strong>Quantity:</strong> {indent.quantity}</Typography>
                <Typography><strong>Cost:</strong> ₹{indent.perPieceCost}</Typography>
                <Typography sx={{ mb: 1 }}><strong>Description:</strong> {indent.description}</Typography>

                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <TextField
                      label="Approval Remarks"
                      placeholder="Enter remarks for finance approval"
                      fullWidth
                      variant="outlined"
                      multiline
                      minRows={2}
                      size="small"
                      value={remarks[indent.id] || ''}
                      onChange={(e) => handleRemarkChange(indent.id, e.target.value)}
                      FormHelperTextProps={{ sx: { color: 'inherit' } }}
                      sx={{
                        '& .MuiInputBase-root': {
                          fontSize: '0.9rem',
                          padding: '10px 12px',
                          color: '#1a237e',
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '0.85rem',
                          color: '#1565c0',
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#90caf9',
                          },
                          '&:hover fieldset': {
                            borderColor: '#0d47a1',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#0d47a1',
                          },
                        },
                        '& .MuiFormHelperText-root': {
                          color: 'inherit',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleApprove(indent.id)}
                      sx={{
                        height: 40,
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        backgroundColor: '#0d47a1',
                        '&:hover': {
                          backgroundColor: '#08306b',
                        },
                      }}
                      color="primary"
                    >
                      Approve and Forward
                    </Button>
                  </Grid>
                </Grid>

              </CardContent>
            </Card>
          ))
        )}
      </TabPanel>

      {/* Add payment indents tab panel if needed */}
    </Box>
  );
};

export default FinanceView;
