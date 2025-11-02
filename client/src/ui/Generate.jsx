import React, { useState } from "react";

// ✅ Dynamic backend URL (Render or Localhost)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Generate() {
  const [excelData, setExcelData] = useState([]);
  const [organisation, setOrganisation] = useState("");
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(false);

  // ===========================
  // 📤 Upload Excel File
  // ===========================
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/upload-excel`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload Excel file");

      const data = await res.json();
      setExcelData(data);
      alert("✅ Excel uploaded successfully!");
    } catch (err) {
      console.error("❌ Excel upload failed:", err);
      alert("Failed to upload Excel file. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // 🧾 Generate & Save Certificates
  // ===========================
  const handleGenerate = async () => {
    if (!organisation.trim() || !course.trim()) {
      alert("Please fill organisation and course details!");
      return;
    }

    if (excelData.length === 0) {
      alert("Please upload Excel first!");
      return;
    }

    setLoading(true);

    try {
      for (const row of excelData) {
        const res = await fetch(`${API_BASE_URL}/generate-db`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: row.name,
            skills: row.skills,
            organisation,
            course,
          }),
        });

        if (!res.ok) throw new Error("Failed to save certificate data");
      }

      alert("✅ All certificates saved successfully!");
      window.location.href = "/certificates";
    } catch (err) {
      console.error("❌ Error saving data:", err);
      alert("Failed to generate certificates!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-page">
      <h1 className="heading">Upload Excel & Generate Certificates</h1>

      <div className="form-section">
        <label>Upload Excel:</label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          disabled={loading}
        />

        <label>Organisation Name:</label>
        <input
          type="text"
          placeholder="Enter organisation name"
          value={organisation}
          onChange={(e) => setOrganisation(e.target.value)}
          disabled={loading}
        />

        <label>Course Name:</label>
        <input
          type="text"
          placeholder="Enter course name"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          disabled={loading}
        />

        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Processing..." : "Generate Certificates"}
        </button>
      </div>

      {/* Excel Preview Table */}
      {excelData.length > 0 && (
        <div className="preview-section">
          <h3>Preview Data</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Name</th>
                <th>Skills</th>
              </tr>
            </thead>
            <tbody>
              {excelData.map((row, index) => (
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>{row.skills}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Generate;
