import React, { useState } from "react";

function Generate() {
  const [excelData, setExcelData] = useState([]);
  const [organisation, setOrganisation] = useState("");
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(false);

  // Upload Excel
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/upload-excel", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setExcelData(data);
      alert("Excel uploaded successfully!");
    } catch (err) {
      alert("Failed to upload Excel file!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Save data to DB
  const handleGenerate = async () => {
    if (!organisation || !course) {
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
        await fetch("http://localhost:5000/generate-db", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: row.name,
            skills: row.skills,
            organisation,
            course,
          }),
        });
      }

      alert("All certificates saved successfully!");
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
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

        <label>Organisation Name:</label>
        <input
          type="text"
          placeholder="Enter organisation name"
          value={organisation}
          onChange={(e) => setOrganisation(e.target.value)}
        />

        <label>Course Name:</label>
        <input
          type="text"
          placeholder="Enter course name"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Processing..." : "Generate Certificates"}
        </button>
      </div>

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
