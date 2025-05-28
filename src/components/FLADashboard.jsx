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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Icon,
  Tabs,
  Tab,
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
  const [tab, setTab] = useState(0);
  const [allIndents, setAllIndents] = useState([]);
  const [openTrackingIdx, setOpenTrackingIdx] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [dialog, setDialog] = useState({ open: false, type: "", indentId: null });

  useEffect(() => {
    fetchIndents();
    fetchSLAs();
  }, []);

  useEffect(() => {
    if (tab === 1) fetchAllIndents();
  }, [tab]);

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

  const fetchAllIndents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/track/fla/all");
      setAllIndents(res.data);
    } catch {
      showSnackbar("Failed to load all indents.", "error");
    } finally {
      setLoading(false);
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

  const TrackingSteps = ({ indent }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const trackingSteps = [];

    if (indent.remarkByFla && (indent.flaApprovalDate || indent.status === "REJECTED_BY_FLA")) {
      trackingSteps.push({
        role: "FLA",
        remark: indent.remarkByFla,
        date: indent.flaApprovalDate || indent.updatedAt,
        status: indent.status === "REJECTED_BY_FLA" ? "Rejected" : "Approved",
      });
    }
    if (indent.remarkBySla && (indent.slaApprovalDate || indent.status === "REJECTED_BY_SLA")) {
      trackingSteps.push({
        role: "SLA",
        remark: indent.remarkBySla,
        date: indent.slaApprovalDate || indent.updatedAt,
        status: indent.status === "REJECTED_BY_SLA" ? "Rejected" : "Approved",
      });
    }
    if (indent.remarkByStore && (indent.storeApprovalDate || indent.status === "REJECTED_BY_STORE")) {
      trackingSteps.push({
        role: "Store",
        remark: indent.remarkByStore,
        date: indent.storeApprovalDate || indent.updatedAt,
        status: indent.status === "REJECTED_BY_STORE" ? "Rejected" : "Approved",
      });
    }
    if (indent.remarkByFinance && (indent.financeApprovalDate || indent.status === "REJECTED_BY_FINANCE")) {
      trackingSteps.push({
        role: "Finance",
        remark: indent.remarkByFinance,
        date: indent.financeApprovalDate || indent.updatedAt,
        status: indent.status === "REJECTED_BY_FINANCE" ? "Rejected" : "Approved",
      });
    }
    if (indent.remarkByPurchase && (indent.purchaseCompletionDate || indent.status === "REJECTED_BY_PURCHASE")) {
      trackingSteps.push({
        role: "Purchase",
        remark: indent.remarkByPurchase,
        date: indent.purchaseCompletionDate || indent.updatedAt,
        status: indent.status === "REJECTED_BY_PURCHASE" ? "Rejected" : "Completed",
      });
    }
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
        status: "GFR Submitted",
      });
    }
    if (indent.paymentNote && (indent.paymentCreatedAt || indent.status === "PAYMENT_REJECTED")) {
      trackingSteps.push({
        role: "Finance",
        remark: indent.paymentNote,
        date: indent.paymentCreatedAt,
        status: indent.status === "PAYMENT_REJECTED" ? "Rejected" : "Payment Done",
      });
    }
    const hasTrackingSteps = trackingSteps.length > 0;
    return (
      <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 1 }}>
        <Box
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            '&:hover': { backgroundColor: '#f5f5f5' },
            p: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant="subtitle1">
            Tracking Steps ({trackingSteps.length})
          </Typography>
          <Icon sx={{ fontSize: 16 }}>{isExpanded ? 'expand_less' : 'expand_more'}</Icon>
        </Box>
        {isExpanded && (
          <Box sx={{ mt: 1 }}>
            {hasTrackingSteps ? (
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
                        backgroundColor:
                          step.status === "Rejected" ? "red" : "#1976d2",
                      }}
                    />
                    <Typography>
                      <strong>{step.role}</strong>{" "}
                      <span
                        style={{
                          fontStyle: "italic",
                          color: step.status === "Rejected" ? "red" : "inherit",
                        }}
                      >
                        ({step.status})
                      </span>
                    </Typography>
                    <Typography sx={{ mb: 0.5 }}>{step.remark}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(step.date).toLocaleString()}
                    </Typography>
                  </Box>
                ))
            ) : (
              <Typography sx={{ p: 1 }}>
                No tracking info available yet.
              </Typography>
            )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        background: COLORS.background,
        minHeight: "100vh",
        p: isMobile ? 2 : 6,
        fontFamily: "'Roboto', sans-serif",
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        ml: '-50vw',
        mr: '-50vw',
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
          textShadow: '0 2px 12px #e3eafc',
        }}
      >
        <FontAwesomeIcon icon={faUser} /> FLA Dashboard
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <CircularProgress color="primary" size={48} thickness={5} />
        </Box>
      )}

      {!loading && indents.length === 0 && (
        <Typography
          variant="body1"
          sx={{ color: COLORS.textSecondary, textAlign: "center", mt: 8, fontSize: 20, fontWeight: 500 }}
        >
          No pending indents.
        </Typography>
      )}

      <Box sx={{ mb: 4 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="primary" indicatorColor="primary" sx={{ mb: 2 }}>
          <Tab label="Pending Indents" />
          <Tab label="Track Indents" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={4}>
          {indents.map((indent) => {
            const remark = remarks[indent.id]?.trim();
            const sla = selectedSla[indent.id];
            return (
              <Card
                key={indent.id}
                elevation={6}
                sx={{
                  width: 480,
                  minWidth: 320,
                  mb: 5,
                  backgroundColor: COLORS.cardBg,
                  borderRadius: 4,
                  boxShadow: '0 3px 18px rgba(26, 35, 126, 0.13)',
                  transition: "transform 0.3s, box-shadow 0.3s",
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.025)',
                    boxShadow: '0 10px 32px rgba(26, 35, 126, 0.18)'
                  },
                  border: '1.5px solid #e3eafc',
                  mx: 'auto',
                }}
                tabIndex={0}
                role="region"
                aria-labelledby={`indent-title-${indent.id}`}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Box sx={{
                      bgcolor: COLORS.accent,
                      color: 'white',
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 22,
                      boxShadow: '0 2px 8px #0d47a133',
                    }}>
                      {indent.itemName?.[0]?.toUpperCase() || '?'}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: COLORS.accent, fontWeight: 700 }}>
                       Project Name: {indent.projectName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "black", fontWeight: 700 }}>
                        Item Name: {indent.itemName}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack spacing={0.5} mb={2}>
                    <Typography variant="body2" sx={{ color: COLORS.textPrimary }} >
                      <strong>Indent Id:</strong> {indent.id}
                    </Typography>
                    <Typography variant="body2" sx={{ color: COLORS.textPrimary  }}>
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
                      <strong>Status:</strong> {indent.status}
                    </Typography>
                    <Typography variant="body2" sx={{ color: COLORS.textPrimary }}>
                      <strong>Description:</strong> {indent.description}
                    </Typography>
                  </Stack>
                  <TextField
                    label="Remark"
                    fullWidth
                    margin="normal"
                    size="small"
                    multiline
                    rows={3}
                    value={remarks[indent.id] || ""}
                    onChange={(e) => setRemarks({ ...remarks, [indent.id]: e.target.value })}
                    required
                    sx={{ background: '#f6f8fa', borderRadius: 2, mb: 1 }}
                  />
                  <TextField
                    select
                    label="Select SLA"
                    fullWidth
                    margin="normal"
                    size="small"
                    value={selectedSla[indent.id] || ""}
                    onChange={(e) => setSelectedSla({ ...selectedSla, [indent.id]: e.target.value })}
                    displayEmpty
                    required
                    sx={{ background: '#f6f8fa', borderRadius: 2 }}
                  >
                    <MenuItem disabled value="">
                      -- Select SLA --
                    </MenuItem>
                    {slaList.map((sla) => (
                      <MenuItem key={sla.id} value={sla.id} sx={{ fontWeight: 600 }}>
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
                        fontWeight: 700,
                        px: 3,
                        borderRadius: 2,
                        boxShadow: '0 2px 8px #0d47a122',
                        '&:hover': { backgroundColor: '#3F51B5' },
                      }}
                      disabled={!sla || !remark || loading}
                      onClick={() => openDialog("approve", indent.id)}
                    >
                      Approve & Forward
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{
                        fontWeight: 700,
                        px: 3,
                        borderRadius: 2,
                        borderWidth: 2,
                        boxShadow: '0 2px 8px #d32f2f22',
                      }}
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
        </Stack>
      )}

      {tab === 1 && (
        <Box sx={{ width: '100vw', position: 'relative', left: '50%', right: '50%', ml: '-50vw', mr: '-50vw', px: { xs: 0, md: 4 }, py: 2, background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)' }}>
          {allIndents.length === 0 ? (
            <Typography>No indents found.</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 24px 0 rgba(25, 118, 210, 0.10)', maxWidth: '98vw', mx: 'auto', mt: 2 }}>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Item Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Project</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allIndents.map((indent, idx) => (
                    <React.Fragment key={indent.id}>
                      <TableRow
                        hover
                        sx={{ cursor: 'pointer', transition: 'background 0.2s', '&:hover': { background: '#e3f2fd' } }}
                        onClick={() => setOpenTrackingIdx(idx === openTrackingIdx ? null : idx)}
                      >
                        <TableCell>{indent.itemName}</TableCell>
                        <TableCell>{indent.projectName}</TableCell>
                        <TableCell>{indent.department}</TableCell>
                        <TableCell>{indent.quantity}</TableCell>
                        <TableCell>
                          <span style={{ color: COLORS.accent, fontWeight: 600 }}>{indent.status}</span>
                        </TableCell>
                        <TableCell>{new Date(indent.createdAt).toLocaleString()}</TableCell>
                        {/* <TableCell>
                          <Icon>{openTrackingIdx === idx ? 'expand_less' : 'expand_more'}</Icon>
                        </TableCell> */}
                      </TableRow>
                      {openTrackingIdx === idx && (
                        <TableRow>
                          <TableCell colSpan={7} sx={{ background: '#f3e5f5', p: 2 }}>
                            <TrackingSteps indent={indent} />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={dialog.open}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {dialog.type === "approve" ? "Approve Indent" : "Reject Indent"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialog.type === "approve"
              ? "Are you sure you want to approve and forward this indent?"
              : "Are you sure you want to reject this indent?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              dialog.type === "approve"
                ? handleApprove(dialog.indentId)
                : handleReject(dialog.indentId);
            }}
            color="primary"
            autoFocus
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : dialog.type === "approve" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FLADashboard;



