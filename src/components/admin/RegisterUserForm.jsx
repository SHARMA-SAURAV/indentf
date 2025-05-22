import React, { useState } from 'react';
import {
  TextField, Button, Box, MenuItem, Typography
} from '@mui/material';
import axios from 'axios';

export default function RegisterUserForm({ onSuccess }) {
  const [form, setForm] = useState({
    username: '', email: '', password: '', name: '', phone: '',
    department: '', designation: '', employeeId: '', sex: '',
    roles: ['USER']
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/auth/register', form);
      alert('User registered successfully');
      onSuccess();
    } catch (err) {
      alert('Error registering user');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Register New User</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
        {['username', 'email', 'password', 'name', 'phone', 'department', 'designation', 'employeeId', 'sex'].map(field => (
          <TextField
            key={field}
            label={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
          />
        ))}
        <TextField
          select
          name="roles"
          label="Role"
          value={form.roles[0]}
          onChange={(e) => setForm(prev => ({ ...prev, roles: [e.target.value] }))}
        >
          {['USER', 'FLA', 'SLA', 'STORE', 'FINANCE', 'PURCHASE', 'ADMIN'].map(role => (
            <MenuItem key={role} value={role}>{role}</MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={handleSubmit}>Register</Button>
      </Box>
    </Box>
  );
}
