import React, { useState } from "react";
import DonorDashboard from "./pages/DonorDashboard";

function App() {
  const [user, setUser] = useState({ role: "Donor" }); // Force user to test

  if (!user) return <div>Loading AuthPage...</div>;

  switch (user.role) {
    case "Donor":
      return <DonorDashboard user={user} />;
    default:
      return <div>Invalid role</div>;
  }
}

export default App;
