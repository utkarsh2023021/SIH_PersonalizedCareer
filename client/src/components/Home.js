import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const auth = useContext(AuthContext);
  const user = auth?.user;

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Welcome to the Digital Guidance Platform</h1>
      {user ? <p>You are logged in as {user.name}</p> : <p>Please log in to see personalized suggestions.</p>}
    </div>
  );
}
