import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function StockHistoryPage() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get("stock-logs/");
        setLogs(response.data);
      } catch (err) {
        setError("Failed to load stock history.");
      }
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <Navbar />
      <h1>Stock History</h1>
      {error && <p>{error}</p>}
      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            {log.item_name} | Change: {log.change_amount} | User: {log.user_name} | Time: {log.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StockHistoryPage;