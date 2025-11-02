import React, { useEffect, useState } from "react";

function Certificates() {
  const [certificates, setCertificates] = useState([]);

  // ✅ Automatically choose the right backend (Render when deployed, localhost when testing)
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/certificates`);
      if (!res.ok) throw new Error("Failed to fetch certificates");
      const data = await res.json();
      setCertificates(data);
    } catch (err) {
      console.error("❌ Error fetching certificates:", err);
    }
  };

  const handleDownload = async (cert) => {
    try {
      const res = await fetch(`${API_BASE_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cert.name,
          skills: cert.skills,
          organisation: cert.organisation,
          course: cert.course,
        }),
      });

      if (!res.ok) throw new Error("Failed to download PDF");

      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${cert.name}-certificate.pdf`;
      link.click();
    } catch (err) {
      console.error("❌ Download failed:", err);
      alert("Failed to download certificate!");
    }
  };

  return (
    <div className="certificates-page">
      <h1 className="heading">Generated Certificates</h1>

      {certificates.length === 0 ? (
        <p>No certificates found. Generate some first!</p>
      ) : (
        <table border="1" className="cert-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Course</th>
              <th>Skills</th>
              <th>Organisation</th>
              <th>Date Issued</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.certificate_id}>
                <td>{cert.certificate_id}</td>
                <td>{cert.name}</td>
                <td>{cert.course}</td>
                <td>{cert.skills}</td>
                <td>{cert.organisation}</td>
                <td>
                  {new Date(cert.date_issued).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <button onClick={() => handleDownload(cert)}>
                    ⬇️ Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Certificates;
