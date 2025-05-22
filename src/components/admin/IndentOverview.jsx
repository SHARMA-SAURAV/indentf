// import React, { useEffect, useState } from "react";
// import { Box, Typography, Paper, Divider } from "@mui/material";
// import axios from "../../api/api"; // Adjust path if your axios instance is elsewhere

// const IndentOverview = () => {
//   const [data, setData] = useState({});

//   const fetchIndents = async () => {
//     try {
//       const res = await axios.get("/api/admin/all-indents");
//       const json = res.data;
//       console.log("ADMIN panel JSON response:------", json);
//       setData(json);
//     } catch (err) {
//       console.error("Error fetching indents:", err);
//     }
//   };

//   useEffect(() => {
//     fetchIndents();
//   }, []);

//   return (
//     <Box p={3}>
//       <Typography variant="h5" gutterBottom>
//         All Indents (Grouped by User)
//       </Typography>

//       {Object.entries(data).map(([username, indents]) => (
//         <Paper key={username} sx={{ p: 2, my: 3 }}>
//           <Typography variant="h6" color="primary">
//             {username}
//           </Typography>

//           <Divider sx={{ my: 1 }} />

//           {indents.map((indent) => (
//             <Box key={indent.indentId} sx={{ mb: 2 }}>
//               <Typography variant="subtitle1">
//                 <strong>Project:</strong> {indent.projectName}
//               </Typography>
//               <Typography variant="body2">
//                 <strong>Item:</strong> {indent.itemName} |{" "}
//                 <strong>Qty:</strong> {indent.quantity} |{" "}
//                 <strong>Status:</strong> {indent.status}
//               </Typography>
//               <Typography variant="body2">
//                 <strong>Purpose:</strong> {indent.purpose}
//               </Typography>
//               <Typography variant="body2">
//                 <strong>Description:</strong> {indent.description}
//               </Typography>
//               <Typography variant="body2">
//                 <strong>Total Cost:</strong> ₹{indent.totalCost}
//               </Typography>

//               <Typography variant="body2" sx={{ mt: 1 }}>
//                 <strong>FLA Remark:</strong> {indent.remarkByFla || "—"} <br />
//                 <strong>SLA Remark:</strong> {indent.remarkBySla || "—"} <br />
//                 <strong>Store Remark:</strong> {indent.remarkByStore || "—"} <br />
//                 <strong>Finance Remark:</strong> {indent.remarkByFinance || "—"} <br />
//                 <strong>Purchase Remark:</strong> {indent.remarkByPurchase || "—"}
//               </Typography>

//               <Divider sx={{ mt: 2 }} />
//             </Box>
//           ))}
//         </Paper>
//       ))}
//     </Box>
//   );
// };

// export default IndentOverview;




import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import axios from 'axios';

export default function IndentOverview() {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get('/api/admin/all-indents').then(res => setData(res.data));
  }, []);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">All Indents by User</Typography>
      {Object.entries(data).map(([username, indents]) => (
        <Paper key={username} sx={{ p: 2, mt: 2 }}>
          <Typography variant="subtitle1"><strong>{username}</strong></Typography>
          <Divider sx={{ my: 1 }} />
          {indents.map(indent => (
            <Box key={indent.indentId} sx={{ mb: 2 }}>
              <Typography>Project: {indent.projectName}</Typography>
              <Typography>Item: {indent.itemName}</Typography>
              <Typography>Status: {indent.status}</Typography>
              <Typography>Fla Remark: {indent.remarkByFla}</Typography>
              <Typography>Sla Remark: {indent.remarkBySla}</Typography>
              <Typography>Store Remark: {indent.remarkByStore}</Typography>
              <Typography>Finance Remark: {indent.remarkByFinance}</Typography>
              <Typography>Purchase Remark: {indent.remarkByPurchase}</Typography>
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}
        </Paper>
      ))}
    </Box>
  );
}
