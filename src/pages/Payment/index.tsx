import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/navbar";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = (location.state as any)?.plan;
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [success, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("screenshot", file);
    if (plan && plan.credits) {
      formData.append("credits", plan.credits.toString());
    }
    try {
      const response = await fetch("https://api.freezygig.com/api/payments/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (response.ok) {
        setSuccess(true);
        setFile(null);
      }
    } catch (err) {
      console.error("Error uploading payment proof:", err);
    } finally {
      setUploading(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="payment-page">
      <Navbar />
      <div className="payment-container">
        <h1 className="payment-title">Complete Your Payment</h1>
        {plan && (
          <div className="plan-info">
            <div><strong>Package:</strong> {plan.label}</div>
            <div><strong>Credits:</strong> {plan.credits}</div>
            <div><strong>Price:</strong> Rs. {plan.price}</div>
          </div>
        )}
        <div className="timer">Time left: {minutes}:{seconds.toString().padStart(2, "0")}</div>
        <div className="bank-section">
          <h2>Bank Details</h2>
          <ul className="bank-list">
            <li>
              <strong>Easypaisa:</strong> +92 3369240911
            </li>
            <li>
              <strong>Jazzcash:</strong> +92 3259975406
            </li>
            <li>
              <strong>Sadapay IBAN:</strong> PK72 SADA 0000 0032 5997 5406<br />
              <strong>For local transfers:</strong> +92 3259975406
            </li>
          </ul>
        </div>
        <form className="upload-form" onSubmit={handleUpload}>
          <label className="upload-label">
            Upload Payment Screenshot
            <input type="file" accept="image/*" onChange={handleFileChange} required />
          </label>
          <button className="upload-btn" type="submit" disabled={uploading || !file}>
            {uploading ? "Uploading..." : "Submit Proof"}
          </button>
        </form>
        {success && <div className="success-msg">Payment proof uploaded! We will verify and credit your account soon.</div>}
      </div>
    </div>
  );
};

export default Payment; 