import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/health")
      .then((res) => setStatus(`${res.data.app}: ${res.data.status}`))
      .catch(() => setStatus("Backend not reachable"));
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>StudyTwin AI</h1>
      <p>Backend status: {status}</p>
    </div>
  );
}

export default App;