// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Select,
//   MenuItem,
//   IconButton,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "USER",
//   });

//   const fetchUsers = async () => {
//     const res = await fetch("/admin/users");
//     const data = res.json();
//     setUsers(data);
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleCreate = async () => {
//     const res = await fetch("/admin/users", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });
//     if (res.ok) {
//       fetchUsers();
//       setForm({ name: "", email: "", password: "", role: "USER" });
//     }
//   };

//   const handleDelete = async (userId) => {
//     const res = await fetch(`/admin/users/${userId}`, {
//       method: "DELETE",
//     });
//     if (res.ok) fetchUsers();
//   };

//   const handleRoleChange = async (userId, newRole) => {
//     const res = await fetch(`/admin/users/${userId}/role`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ role: newRole }),
//     });
//     if (res.ok) fetchUsers();
//   };

//   return (
//     <Box>
//       <Typography variant="h6">Create New User</Typography>
//       <Box display="flex" gap={2} mb={2}>
//         <TextField
//           label="Name"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//         />
//         <TextField
//           label="Email"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />
//         <TextField
//           label="Password"
//           type="password"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />
//         <Select
//           value={form.role}
//           onChange={(e) => setForm({ ...form, role: e.target.value })}
//         >
//           <MenuItem value="USER">USER</MenuItem>
//           <MenuItem value="FLA">FLA</MenuItem>
//           <MenuItem value="SLA">SLA</MenuItem>
//           <MenuItem value="STORE">STORE</MenuItem>
//           <MenuItem value="FINANCE">FINANCE</MenuItem>
//           <MenuItem value="PURCHASE">PURCHASE</MenuItem>
//           <MenuItem value="ADMIN">ADMIN</MenuItem>
//         </Select>
//         <Button onClick={handleCreate} variant="contained">
//           Create
//         </Button>
//       </Box>

//       <Typography variant="h6" mt={4}>Users</Typography>
//       <List>
//         {users.map((user) => (
//           <ListItem key={user._id} secondaryAction={
//             <>
//               <Select
//                 value={user.role}
//                 onChange={(e) => handleRoleChange(user._id, e.target.value)}
//                 size="small"
//                 sx={{ mr: 2 }}
//               >
//                 <MenuItem value="USER">USER</MenuItem>
//                 <MenuItem value="FLA">FLA</MenuItem>
//                 <MenuItem value="SLA">SLA</MenuItem>
//                 <MenuItem value="STORE">STORE</MenuItem>
//                 <MenuItem value="FINANCE">FINANCE</MenuItem>
//                 <MenuItem value="PURCHASE">PURCHASE</MenuItem>
//                 <MenuItem value="ADMIN">ADMIN</MenuItem>
//               </Select>
//               <IconButton onClick={() => handleDelete(user._id)}>
//                 <DeleteIcon />
//               </IconButton>
//             </>
//           }>
//             <ListItemText
//               primary={`${user.name} (${user.email})`}
//               secondary={`Role: ${user.role}`}
//             />
//           </ListItem>
//         ))}
//       </List>
//     </Box>
//   );
// };

// export default UserManagement;




import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Select, MenuItem, IconButton, Table, TableHead, TableRow,
  TableCell, TableBody, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
// import RegisterUserForm from '.';
import axios from '../../api/api.js';
import RegisterUserForm from './RegisterUserForm';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const res=  axios.get('/users/all');
    setUsers(res.data)
    console.log("data for admin",res.data);
  }, [refresh]);

  const handleRoleChange = (userId, newRole) => {
    axios.put(`/admin/users/${userId}`, {
      role: [newRole]
    }).then(() => setRefresh(prev => !prev));
  };

  const handleDelete = (id) => {
    axios.delete(`/api/admin/users/${id}`).then(() => setRefresh(prev => !prev));
  };
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">All Users</Typography>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Change Role</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.roles.join(', ')}</TableCell>
                <TableCell>
                  <Select
                    value={user.roles[0]}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    {['USER', 'FLA', 'SLA', 'STORE', 'FINANCE', 'PURCHASE', 'ADMIN'].map(role => (
                      <MenuItem key={role} value={role}>{role}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(user.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <RegisterUserForm onSuccess={() => setRefresh(prev => !prev)} />
    </Box>
  );
}
