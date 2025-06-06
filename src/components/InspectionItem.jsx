// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   MenuItem,
//   Alert,
//   Box,
//   Tabs,
//   Tab,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import axios from "../api/api";

// // New component for inspection items
// const InspectionItem = ({ indent, onConfirm }) => {
//   const [remark, setRemark] = useState("");
//   const [openDialog, setOpenDialog] = useState(false);

//   const handleConfirm = async () => {
//     try {
//       await onConfirm(indent.id, remark);
//       setOpenDialog(false);
//     } catch (error) {
//       // Error handling done in parent
//     }
//   };

//   return (
//     <Card sx={{ my: 2 }}>
//       <CardContent>
//         <Typography>
//           <strong>Item:</strong> {indent.itemName}
//         </Typography>
//         <Typography>
//           <strong>Quantity:</strong> {indent.quantity}
//         </Typography>
//         <Typography>
//           <strong>Description:</strong> {indent.description}
//         </Typography>
        
//         <Button
//           variant="outlined"
//           sx={{ mt: 2 }}
//           onClick={() => setOpenDialog(true)}
//         >
//           Confirm Product is OK
//         </Button>

//         <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//           <DialogTitle>Add Inspection Remark</DialogTitle>
//           <DialogContent>
//             <TextField
//               autoFocus
//               margin="dense"
//               label="Inspection Remark"
//               fullWidth
//               multiline
//               rows={3}
//               value={remark}
//               onChange={(e) => setRemark(e.target.value)}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//             <Button onClick={handleConfirm} variant="contained">
//               Confirm
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </CardContent>
//     </Card>
//   );
// };
// export default InspectionItem;



import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Box,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "../api/api";
 


// New component for inspection items
const InspectionItem = ({ indent, onConfirm }) => {
  const [remark, setRemark] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleConfirm = async () => {
    try {
      await onConfirm(indent.id, remark);
      setOpenDialog(false);
    } catch (error) {
      // Error handling done in parent
    }  
  };

  return (
    <Card sx={{ my: 2 }}>
      <CardContent>
       
       <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
         <strong>Project Name:</strong> {indent.projectName}
       </Typography>
       
         <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
         <strong>Item Name:</strong> {indent.itemName}
       </Typography>
                      
                      <Typography><strong>Quantity:</strong> {indent.quantity}</Typography>
                       <Typography><strong>PerPieceCost:</strong> {indent.perPieceCost}</Typography>
                      <Typography><strong>total Cost:</strong> {indent.totalCost}</Typography>
                      <Typography><strong>Department:</strong> {indent.department}</Typography>
                     
                      <Typography><strong>Indent Status:</strong> {indent.status}</Typography>
                       <Typography><strong>Description:</strong> {indent.description}</Typography>
                      
        
        
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => setOpenDialog(true)}
        >
          Confirm Product is OK
        </Button>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Add Inspection Remark</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Inspection Remark"
              fullWidth
              multiline
              rows={3}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirm} variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};
export default InspectionItem;



