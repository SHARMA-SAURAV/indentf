import React, { useEffect, useState } from "react";
import axios from "../api/api";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Divider,
  Tabs,
  Tab,
  Avatar,
} from "@mui/material";

const roles = ["USER", "FLA", "SLA", "STORE", "FINANCE", "PURCHASE", "ADMIN"];

const AdminPanel = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [users, setUsers] = useState([]);
  const [indents, setIndents] = useState({});
  const [openAddUser, setOpenAddUser] = useState(false);
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

  useEffect(() => {
    fetchUsers();
    fetchIndents();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("/admin/users");
    setUsers(res.data);
  };

  const fetchIndents = async () => {
    const res = await axios.get("/admin/all-indents-with-remarks");
    setIndents(res.data);
  };

  const handleAddUser = async () => {
    await axios.post("/auth/register", newUser);
    fetchUsers();
    setOpenAddUser(false);
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

  const handleDeleteUser = async (id) => {
    await axios.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Admin Dashboard
      </Typography>

      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Users" />
        <Tab label="Add User" />
        <Tab label="Indents Overview" />
      </Tabs>

      {/* Users Tab */}
      {tabIndex === 0 && (
        <Grid container spacing={2}>
          {users.map((user, idx) => (
            <Grid item xs={12} md={6} key={user._id}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  boxShadow: 3,
                  background: "#f9f9fb",
                  borderRadius: 2,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#1976d2",
                    width: 56,
                    height: 56,
                    fontSize: 24,
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
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600 }}
                    gutterBottom
                  >
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
                  <Box sx={{ my: 1 }}>
                    {user.roles.map((role) => (
                      <Chip
                        key={role}
                        label={role}
                        sx={{ mr: 1, mb: 0.5 }}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteUser(user._id)}
                  sx={{ ml: 2 }}
                >
                  Delete
                </Button>
              </Paper>
              {idx !== users.length - 1 && (
                <Divider sx={{ my: 2 }} variant="middle" />
              )}
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add User Tab */}
      {tabIndex === 1 && (
        <Box component={Paper} sx={{ p: 3, maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            Add New User
          </Typography>
          <TextField
            margin="dense"
            label="Username"
            fullWidth
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Department"
            fullWidth
            value={newUser.department}
            onChange={(e) =>
              setNewUser({ ...newUser, department: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Designation"
            fullWidth
            value={newUser.designation}
            onChange={(e) =>
              setNewUser({ ...newUser, designation: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Employee ID"
            fullWidth
            value={newUser.employeeId}
            onChange={(e) =>
              setNewUser({ ...newUser, employeeId: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Sex"
            fullWidth
            value={newUser.sex}
            onChange={(e) => setNewUser({ ...newUser, sex: e.target.value })}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Roles</InputLabel>
            <Select
              multiple
              value={newUser.roles}
              onChange={(e) =>
                setNewUser({ ...newUser, roles: e.target.value })
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
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
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleAddUser}>
              Create
            </Button>
          </Box>
        </Box>
      )}

      {/* Indents Tab */}
      {tabIndex === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            All Indents with Remarks (Grouped by User)
          </Typography>
          {Object.entries(indents).map(([username, indentList]) => (
            <Box key={username} sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                {username}
              </Typography>
              {indentList.map((indent) => (
                <Paper key={indent._id} sx={{ p: 2, mb: 1 }}>
                  <Typography>Item: {indent.itemName}</Typography>
                  <Typography>Status: {indent.status}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Remarks:
                  </Typography>
                  <ul>
                    {indent.remarks?.map((remark, idx) => (
                      <li key={idx}>
                        <strong>{remark.role}:</strong> {remark.text}
                      </li>
                    ))}
                  </ul>
                </Paper>
              ))}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
export default AdminPanel;

