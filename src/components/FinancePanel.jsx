// // src/components/FinancePanel.jsx
// import React, { useEffect, useState } from "react";
// import axios from "../api/api";
// const FinancePanel = () => {
//   const [indents, setIndents] = useState([]);
//   const [remarks, setRemarks] = useState({});

//   useEffect(() => {
//     fetchPendingIndents();
//   }, []);

//   const fetchPendingIndents = async () => {
//     try {
//       const res = await axios.get("/indent/finance/pending");
//       setIndents(res.data);
//     } catch (error) {
//       console.error("Error fetching finance pending indents:", error);
//     }
//   };

//   const handleRemarkChange = (id, value) => {
//     setRemarks(prev => ({ ...prev, [id]: value }));
//   };

//   const handleApprove = async (indentId) => {
//     try {
//       const remark = remarks[indentId] || "";
//       await axios.post("/indent/finance/approve", {
//         indentId,
//         remark,
//       });
//       alert("Approved and forwarded to Purchase");
//       fetchPendingIndents(); // Refresh list
//     } catch (error) {
//       console.error("Error approving indent:", error);
//       alert("Approval failed");
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Pending Indents for Finance</h2>
//       {indents.length === 0 ? (
//         <p>No indents pending at Finance level.</p>
//       ) : (
//         <div className="space-y-4">
//           {indents.map(indent => (
//             <div key={indent.id} className="p-4 border rounded-lg shadow-sm bg-white">
//               <p><strong>Item:</strong> {indent.itemName}</p>
//               <p><strong>Quantity:</strong> {indent.quantity}</p>
//               <p><strong>Cost/Unit:</strong> ₹{indent.perPieceCost}</p>
//               <p><strong>Description:</strong> {indent.description}</p>

//               <textarea
//                 placeholder="Enter finance remark..."
//                 className="mt-2 w-full p-2 border rounded"
//                 value={remarks[indent.id] || ""}
//                 onChange={(e) => handleRemarkChange(indent.id, e.target.value)}
//               />

//               <button
//                 className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
//                 onClick={() => handleApprove(indent.id)}
//               >
//                 Approve & Forward to Purchase
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FinancePanel;
