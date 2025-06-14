// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import RoleSelector from '@/components/RoleSelector';
// import { useApp } from '@/contexts/AppContext';

// const RoleSelection: React.FC = () => {
//   const { userRole, isAuthenticated } = useApp();
//   const navigate = useNavigate();

//   // Log the current role for debugging
//   useEffect(() => {
//     console.log('Current user role:', userRole);
//   }, [userRole]);

//   // Handle role selection
//   const handleRoleSelect = (role: string) => {
//     console.log('Role selected:', role);
//     // Navigation is handled in the RoleSelector component
//   };

//   return (
//     <div className="container mx-auto py-12">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold">Select Your Role</h1>
//         <p className="text-muted-foreground mt-2">
//           Choose how you want to use the platform today
//         </p>
//       </div>

//       <RoleSelector onRoleSelect={handleRoleSelect} />
//     </div>
//   );
// };

// export default RoleSelection;
