// import React, { useEffect, useState } from "react";
// import axios from "../api/api";
// import {
//   Box,
//   Typography,
//   Grid,
//   Paper,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Chip,
//   Divider,
//   Tabs,
//   Tab,
//   Avatar,
// } from "@mui/material";

// const roles = ["USER", "FLA", "SLA", "STORE", "FINANCE", "PURCHASE", "ADMIN"];

// const AdminPanel = () => {
//   const [tabIndex, setTabIndex] = useState(0);
//   const [users, setUsers] = useState([]);
//   const [indents, setIndents] = useState({});
//   const [openAddUser, setOpenAddUser] = useState(false);
//   const [newUser, setNewUser] = useState({
//     username: "",
//     email: "",
//     password: "",
//     name: "",
//     phone: "",
//     department: "",
//     designation: "",
//     employeeId: "",
//     sex: "",
//     roles: [],
//   });

//   useEffect(() => {
//     fetchUsers();
//     fetchIndents();
//   }, []);

//   const fetchUsers = async () => {
//     const res = await axios.get("/admin/users");
//     setUsers(res.data);
//   };

//   const fetchIndents = async () => {
//     const res = await axios.get("/admin/all-indents-with-remarks");
//     setIndents(res.data);
//   };

//   const handleAddUser = async () => {
//     await axios.post("/auth/register", newUser);
//     fetchUsers();
//     setOpenAddUser(false);
//     setNewUser({
//       username: "",
//       email: "",
//       password: "",
//       name: "",
//       phone: "",
//       department: "",
//       designation: "",
//       employeeId: "",
//       sex: "",
//       roles: [],
//     });
//   };

//   // const handleDeleteUser = async (id) => {
//   //   console.log("Deleting user with ID:", id);
//   //   await axios.delete(`/admin/users/${id}`);
//   //   fetchUsers();
//   // };

//   const handleTabChange = (event, newValue) => {
//     setTabIndex(newValue);
//   };

//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom>
//         Admin Dashboard
//       </Typography>

//       <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 3 }}>
//         <Tab label="Users" />
//         <Tab label="Add User" />
//         <Tab label="Indents Overview" />
//       </Tabs>

//       {/* Users Tab */}
//       {tabIndex === 0 && (
//         <Grid container spacing={2}>
//           {users.map((user, idx) => (
//             <Grid item xs={12} md={6} key={user._id}>
//               <Paper
//                 sx={{
//                   p: 2,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 2,
//                   boxShadow: 3,
//                   background: "#f9f9fb",
//                   borderRadius: 2,
//                 }}
//               >
//                 <Avatar
//                   sx={{
//                     bgcolor: "#1976d2",
//                     width: 56,
//                     height: 56,
//                     fontSize: 24,
//                   }}
//                 >
//                   {user.name
//                     ? user.name
//                         .split(" ")
//                         .map((n) => n[0])
//                         .join("")
//                         .toUpperCase()
//                         .slice(0, 2)
//                     : user.username.slice(0, 2).toUpperCase()}
//                 </Avatar>
//                 <Box sx={{ flex: 1 }}>
//                   <Typography
//                     variant="h6"
//                     sx={{ fontWeight: 600 }}
//                     gutterBottom
//                   >
//                     {user.name || user.username}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                    Username: {user.username}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Email: {user.email}
//                   </Typography>
//                   {user.department && (
//                     <Typography variant="body2" color="text.secondary">
//                       Dept: {user.department}
//                     </Typography>
//                   )}
//                   <Box sx={{ my: 1 }}>
//                     {user.roles.map((role) => (
//                       <Chip
//                         key={role}
//                         label={role}
//                         sx={{ mr: 1, mb: 0.5 }}
//                         color="primary"
//                         variant="outlined"
//                       />
//                     ))}
//                   </Box>
//                 </Box>
//                 {/* <Button
//                   variant="outlined"
//                   color="error"
//                   onClick={() => handleDeleteUser(user.id)}
//                   sx={{ ml: 2 }}
//                 >
//                   Delete
//                 </Button> */}
//               </Paper>
//               {idx !== users.length - 1 && (
//                 <Divider sx={{ my: 2 }} variant="middle" />
//               )}
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {/* Add User Tab */}
//       {tabIndex === 1 && (
//         <Box component={Paper} sx={{ p: 3, maxWidth: 600 }}>
//           <Typography variant="h6" gutterBottom>
//             Add New User
//           </Typography>
//           <TextField
//             margin="dense"
//             label="Username"
//             fullWidth
//             value={newUser.username}
//             onChange={(e) =>
//               setNewUser({ ...newUser, username: e.target.value })
//             }
//           />
//           <TextField
//             margin="dense"
//             label="Email"
//             fullWidth
//             value={newUser.email}
//             onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
//           />
//           <TextField
//             margin="dense"
//             label="Password"
//             type="password"
//             fullWidth
//             value={newUser.password}
//             onChange={(e) =>
//               setNewUser({ ...newUser, password: e.target.value })
//             }
//           />
//           <TextField
//             margin="dense"
//             label="Name"
//             fullWidth
//             value={newUser.name}
//             onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
//           />
//           <TextField
//             margin="dense"
//             label="Phone"
//             fullWidth
//             value={newUser.phone}
//             onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
//           />
//           <TextField
//             margin="dense"
//             label="Department"
//             fullWidth
//             value={newUser.department}
//             onChange={(e) =>
//               setNewUser({ ...newUser, department: e.target.value })
//             }
//           />
//           <TextField
//             margin="dense"
//             label="Designation"
//             fullWidth
//             value={newUser.designation}
//             onChange={(e) =>
//               setNewUser({ ...newUser, designation: e.target.value })
//             }
//           />
//           <TextField
//             margin="dense"
//             label="Employee ID"
//             fullWidth
//             value={newUser.employeeId}
//             onChange={(e) =>
//               setNewUser({ ...newUser, employeeId: e.target.value })
//             }
//           />
//           <TextField
//             margin="dense"
//             label="Sex"
//             fullWidth
//             value={newUser.sex}
//             onChange={(e) => setNewUser({ ...newUser, sex: e.target.value })}
//           />
//           <FormControl fullWidth sx={{ mt: 2 }}>
//             <InputLabel>Roles</InputLabel>
//             <Select
//               multiple
//               value={newUser.roles}
//               onChange={(e) =>
//                 setNewUser({ ...newUser, roles: e.target.value })
//               }
//               renderValue={(selected) => (
//                 <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                   {selected.map((value) => (
//                     <Chip key={value} label={value} />
//                   ))}
//                 </Box>
//               )}
//             >
//               {roles.map((role) => (
//                 <MenuItem key={role} value={role}>
//                   {role}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <Box sx={{ mt: 2 }}>
//             <Button variant="contained" onClick={handleAddUser}>
//               Create
//             </Button>
//           </Box>
//         </Box>
//       )}

//       {/* Indents Tab */}
//       {tabIndex === 2 && (
//         <Box>
//           <Typography variant="h6" gutterBottom>
//             All Indents with Remarks (Grouped by User)
//           </Typography>
//           {Object.entries(indents).map(([username, indentList]) => (
//             <Box key={username} sx={{ mb: 3 }}>
//               <Typography
//                 variant="subtitle1"
//                 sx={{ fontWeight: "bold", mb: 1 }}
//               >
//                 {username}
//               </Typography>
//               {indentList.map((indent) => (
//                 <Paper key={indent._id} sx={{ p: 2, mb: 1 }}>
//                   <Typography>Item: {indent.itemName}</Typography>
//                   <Typography>Status: {indent.status}</Typography>
//                   <Typography variant="body2" sx={{ mt: 1 }}>
//                     Remarks:
//                   </Typography>
//                   <ul>
//                     {indent.remarks?.map((remark, idx) => (
//                       <li key={idx}>
//                         <strong>{remark.role}:</strong> {remark.text}
//                       </li>
//                     ))}
//                   </ul>
//                 </Paper>
//               ))}
//             </Box>
//           ))}
//         </Box>
//       )}
//     </Box>
//   );
// };
// export default AdminPanel;







import React, { useEffect, useState } from "react";
import axios from "../api/api";
import '@fortawesome/fontawesome-free/css/all.min.css';


import {
  Box,
  Typography,
  Paper,
  Collapse,
  IconButton,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Tabs,
  Tab,
  Avatar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const roles = ["USER", "FLA", "SLA", "STORE", "FINANCE", "PURCHASE", "ADMIN"];

const AdminPanel = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [users, setUsers] = useState([]);
  const [indents, setIndents] = useState({});
  const [expandedUsers, setExpandedUsers] = useState(new Set());

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    phone: "",
    department: "",
    designation: "",
    employeeId: "",
    sex: "",
    roles: [],
  });

  // Fetch users and indents on mount
  useEffect(() => {
    fetchUsers();
    fetchIndents();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      // console.error("Failed to fetch users:", error);
    }
  };

  const fetchIndents = async () => {
    try {
      const res = await axios.get("/admin/all-indents-with-remarks");
      setIndents(res.data);
    } catch (error) {
      // console.error("Failed to fetch indents:", error);
    }
  };

  const handleAddUser = async () => {
    try {
      await axios.post("/auth/register", newUser);
      await fetchUsers();
      resetForm();
      setTabIndex(0); // Switch to Users tab after adding
    } catch (error) {
      // console.error("Failed to add user:", error);
    }
  };

  const resetForm = () => {
    setNewUser({
      username: "",
      email: "",
      password: "",
      name: "",
      phone: "",
      department: "",
      designation: "",
      employeeId: "",
      sex: "",
      roles: [],
    });
  };
  

  

  // Toggle indent expand/collapse
  const toggleExpand = (username) => {
    setExpandedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(username)) {
        newSet.delete(username);
      } else {
        newSet.add(username);
      }
      return newSet;
    });
  };

const TrackingSteps = ({ indent }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
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
    <Box sx={{ border: '1px solid #eee', borderRadius: 1, p: 1, mt: 1, bgcolor: '#fafafa' }}>
      <Box
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          p: 1,
          borderRadius: 1,
          background: '#f0f4f8',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
          Tracking Steps ({trackingSteps.length})
        </Typography>
        <Typography sx={{ fontSize: 16, color: '#1976d2', ml: 1 }}>{isExpanded ? '▼' : '▶'}</Typography>
      </Box>
      {isExpanded && (
        <Box sx={{ mt: 1 }}>
          {hasTrackingSteps ? (
            trackingSteps
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((step, index) => (
                <Box
                  key={index}
                  sx={{ ml: 2, my: 1, pl: 2, borderLeft: '2px solid #1976d2' }}
                >
                  <Typography sx={{ fontWeight: 600, color: step.status === 'Rejected' ? '#d32f2f' : '#1976d2', fontSize: 15 }}>
                    {step.role} <span style={{ fontStyle: "italic" }}>({step.status})</span>
                  </Typography>
                  <Typography sx={{ mb: 0.5, color: '#333', fontSize: 14 }}>{step.remark || <em>No remark</em>}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {step.date ? new Date(step.date).toLocaleString() : ''}
                  </Typography>
                </Box>
              ))
          ) : (
            <Typography sx={{ p: 1, color: '#888' }}>
              No tracking info available yet.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1976d2", mb: 4 }}
      >
        Admin Dashboard
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={(e, v) => setTabIndex(v)}
        sx={{
          mb: 4,
          borderBottom: 1,
          borderColor: "divider",
          "& .MuiTab-root": { fontWeight: "bold" },
          "& .Mui-selected": { color: "#1976d2" },
        }}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Active users" />
        <Tab label="Add User" />
        <Tab label="Indents Overview" />
      </Tabs>
      {/* === USERS TAB === */}
      {tabIndex === 0 && (
        <Grid container spacing={3}>
          {users.length === 0 ? (
            <Typography sx={{ mx: 2, color: "text.secondary" }}>
              No users found.
            </Typography>
          ) : (
            users.map((user) => (
              <Grid item xs={12} md={6} key={user._id}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    boxShadow:
                      "0 4px 8px rgba(25, 118, 210, 0.1), 0 2px 4px rgba(25, 118, 210, 0.06)",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "#1976d2",
                      width: 64,
                      height: 64,
                      fontSize: 24,
                      fontWeight: "bold",
                    }}
                  >
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : user.username.slice(0, 2).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "600" }}>
                      {user.name || user.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Username: {user.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Email: {user.email}
                    </Typography>
                    {user.department && (
                      <Typography variant="body2" color="text.secondary">
                        Dept: {user.department}
                      </Typography>
                    )}
                    <Box sx={{ mt: 1 }}>
                      {user.roles.map((role) => (
                        <Chip
                          key={role}
                          label={role}
                          color="primary"
                          size="small"
                          sx={{ mr: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Box>
                  
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* === ADD USER TAB === */}
      {tabIndex === 1 && (
        <Box
          component={Paper}
          sx={{
            p: 4,
            maxWidth: 650,
            mx: "auto",
            borderRadius: 3,
            boxShadow:
              "0 8px 16px rgba(25, 118, 210, 0.12), 0 4px 8px rgba(25, 118, 210, 0.06)",
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 3, color: "#1976d2" }}
          >
            Create New User
          </Typography>
          {[
            { label: "Username", key: "username" },
            { label: "Email", key: "email" },
            { label: "Password", key: "password", type: "password" },
            { label: "Name", key: "name" },
            { label: "Phone", key: "phone" },
            { label: "Department", key: "department" },
            { label: "Designation", key: "designation" },
            { label: "Employee ID", key: "employeeId" },
            { label: "Sex", key: "sex" },
          ].map(({ label, key, type }) => (
            <TextField
              key={key}
              margin="dense"
              label={label}
              type={type || "text"}
              fullWidth
              value={newUser[key]}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, [key]: e.target.value }))
              }
              sx={{ mb: 2 }}
            />
          ))}

          <FormControl fullWidth sx={{ mt: 2, mb: 3 }}>
            <InputLabel>Roles</InputLabel>
            <Select
              multiple
              value={newUser.roles}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, roles: e.target.value }))
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((role) => (
                    <Chip key={role} label={role} />
                  ))}
                </Box>
              )}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            onClick={handleAddUser}
            size="large"
          >
            Create User
          </Button>
        </Box>
      )}

      {/* === INDENTS TAB === */}
      
     {tabIndex === 2 && (
  <Box maxWidth="lg" mx="auto" px={{ xs: 2, md: 4 }} py={5}>
    {Object.keys(indents).length === 0 ? (
      <Typography variant="body1" color="text.secondary" align="center">
        No indents available at this time.
      </Typography>
    ) : (
      Object.entries(indents).map(([username, indentList]) => {
        const isExpanded = expandedUsers.has(username);

        return (
          <Box key={username} sx={{ mb: 5 }}>
            {/* Username Header */}
            <Box
              role="button"
              aria-expanded={isExpanded}
              onClick={() => toggleExpand(username)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#E0F2F1",
                px: 3,
                py: 1.5,
                borderRadius: 2,
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                transition: "background-color 0.3s ease",
                '&:hover': {
                  backgroundColor: "#B2DFDB",
                },
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#004D40",
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <i className="fa-solid fa-user" style={{ marginRight: "8px", fontSize: "14px" }}></i>
                  Username: {username}
              </Typography>

              <IconButton
                size="small"
                aria-label={isExpanded ? "Collapse user indents" : "Expand user indents"}
                sx={{ color: "#00796B", transition: "transform 0.3s ease" }}
              >
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

          <Collapse in={isExpanded} timeout={400} unmountOnExit>
  <Box mt={2} sx={{ pl: 1 }}>
    {indentList.map((indent) => (
      <Paper
        key={indent._id}
        elevation={2}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          transition: "all 0.3s ease",
          '&:hover': {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
          },
        }}
      >
        <Typography
  variant="subtitle2"
  sx={{
    fontWeight: 600,
    fontSize: "0.9rem",
    mb: 0.5,
    color: "#0D47A1", // deep blue for emphasis
    letterSpacing: "0.3px",
    display: "flex",
    alignItems: "center",
  }}
>
  <i className="" style={{ marginRight: "8px", fontSize: "13px" }}></i>
  Item Name:&nbsp;
  <span style={{ fontWeight: 500, color: "#333" }}>{indent.itemName}</span>
</Typography>


        <Typography
          variant="body2"
          sx={{ mb: 1.5, fontSize: "0.85rem" }}
        >
          Status: <strong>{indent.status}</strong>
        </Typography>

        <Box sx={{ px: 1, py: 1 }}>
          <TrackingSteps indent={indent} />
        </Box>
      </Paper>
    ))}
  </Box>
</Collapse>

          </Box>
        );
      })
    )}
  </Box>
)}


  
    </Box>
  );
};

export default AdminPanel;
