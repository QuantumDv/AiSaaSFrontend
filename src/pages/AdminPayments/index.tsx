import React, { useEffect, useState } from "react";
import "./styles.css";

interface Payment {
  id: string;
  userEmail: string;
  fileUrl: string;
  uploadedAt: string;
  status: string;
}

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState<string | null>(null);

  const backendUrl = "https://api.freezygig.com";

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://api.freezygig.com/api/payments/all", { credentials: "include" });
        const data = await res.json();
        setPayments(data.payments || []);
      } catch (err) {
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleRelease = async (id: string) => {
    setReleasing(id);
    try {
      await fetch(`https://api.freezygig.com/api/payments/release/${id}`, { method: "POST", credentials: "include" });
      setPayments((prev) => prev.map(p => p.id === id ? { ...p, status: "released" } : p));
    } catch (err) {
      // handle error
    } finally {
      setReleasing(null);
    }
  };

  return (
    <div className="admin-payments-page">
      <div className="admin-container">
        <h1 className="admin-title">Payments Admin</h1>
        {loading ? (
          <div className="admin-loading">Loading payments...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Date</th>
                <th>Screenshot</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className={p.status === "released" ? "released-row" : ""}>
                  <td>{p.userEmail}</td>
                  <td>{new Date(p.uploadedAt).toLocaleString()}</td>
                  <td>
                    <a href={backendUrl + p.fileUrl} target="_blank" rel="noopener noreferrer">
                      <img src={backendUrl + p.fileUrl} alt="proof" className="admin-img-thumb" />
                    </a>
                  </td>
                  <td>
                    <span className={`status-badge ${p.status}`}>{p.status}</span>
                  </td>
                  <td>
                    <button
                      className="release-btn"
                      disabled={p.status === "released" || releasing === p.id}
                      onClick={() => handleRelease(p.id)}
                    >
                      {releasing === p.id ? "Releasing..." : "Release Credits"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPayments; 