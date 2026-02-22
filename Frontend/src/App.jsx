import React, { useState } from 'react';
import axios from 'axios';
import { Play, Trash2 } from 'lucide-react';
import Plot from 'react-plotly.js'; 
import logoImg from './assets/logo.png';

function App() {
  const [inputs, setInputs] = useState({ 
    materialName: '', 
    E: 210000, 
    Sy: 250, 
    Et: 2000, 
    emax: 0.1, 
    modelType: 'Option 1',
    numPoints: 20 
  });
  
  const [materials, setMaterials] = useState([]);

  const handleInputChange = (e, key) => {
    if (key === 'materialName') {
      setInputs({ ...inputs, [key]: e.target.value });
    } else {
      setInputs({ ...inputs, [key]: parseFloat(e.target.value) || 0 });
    }
  };

  const blockInvalidChars = (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleCalculate = async () => {
    if (materials.length >= 10) {
      alert("It is necessary to reset to free up memory. Please note that all data will be lost.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/calculate', inputs);
      
      const finalName = inputs.materialName.trim() !== '' 
        ? inputs.materialName 
        : `Material ${materials.length + 1}`;

      const newMaterial = {
        id: Date.now(),
        name: finalName,
        data: response.data,
        visible: true 
      };

      setMaterials([...materials, newMaterial]);
      setInputs({ ...inputs, materialName: '' });

    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Make sure the Python backend is running on port 8000!");
    }
  };

  const handleClear = () => {
    const userConfirmed = window.confirm("Are you sure you want to clear all data in memory?");
    if (userConfirmed) {
      setMaterials([]); 
    }
  };

  const toggleVisibility = (id) => {
    setMaterials(materials.map(mat => 
      mat.id === id ? { ...mat, visible: !mat.visible } : mat
    ));
  };

  const exportToCSV = () => {
    if (materials.length === 0) {
      alert("No data to export. Please calculate first.");
      return;
    }
    
    let csvContent = "Material,Strain,Stress\n";
    
    materials.forEach(mat => {
      mat.data.forEach(point => {
        csvContent += `${mat.name},${point.strain},${point.stress}\n`;
      });
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "stress_strain_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const latestMaterial = materials[materials.length - 1];

  const baseStyles = `
    .app-wrapper {
      width: 100vw; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box;
      background-color: #ffffff; display: flex; flex-direction: column; font-family: Arial, sans-serif;
    }

    .header-container {
      display: flex; align-items: center; justify-content: flex-start; 
      border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 10px;
    }
    .header-logo { height: 60px; width: auto; display: block; }
    .header-divider { width: 1px; height: 40px; background-color: #ccc; margin: 0 5px; }
    .header-title { margin: 0; font-size: 22px; color: #333; }

    .main-container {
      display: flex; flex-direction: row; justify-content: space-between; gap: 20px; width: 100%; margin-top: 20px;
    }

    .column-inputs { flex: 0.7; display: flex; flex-direction: column; }
    .column-table { flex: 1.2; display: flex; flex-direction: column; }
    .column-graph { flex: 1.8; display: flex; flex-direction: column; }

    .gray-box {
      border: none; border-radius: 16px; background-color: #f2f2f2; width: 100%; min-height: 400px; 
      padding: 20px; box-sizing: border-box;
    }

    .input-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; }
    .input-label { font-weight: bold; width: 50px; color: #333; }
    .input-unit { font-size: 12px; width: 45px; text-align: left; color: #666; }
    
    .input-field {
      flex: 1; padding: 8px; margin: 0 10px; border: none; 
      border-radius: 8px; background-color: #ffffff; color: #0056b3; font-weight: bold; 
    }
    .input-field:focus { outline: 2px solid #0056b3; outline-offset: -2px; }

    input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    input[type=number] { -moz-appearance: textfield; }
    
    .radio-group { margin-top: 20px; padding: 15px; border: none; border-radius: 8px; background-color: #ffffff; width: fit-content; }

    .action-buttons { display: flex; gap: 10px; margin-top: 20px; }
    .btn-calc, .btn-clear {
      padding: 10px 15px; cursor: pointer; border: none; border-radius: 8px; background-color: #ffffff; 
      display: flex; align-items: center; justify-content: center; font-weight: bold; transition: background-color 0.2s;
    }
    .btn-calc { flex: 1; gap: 8px; color: #2e7d32; }
    .btn-calc:hover { background-color: #e8f5e9; }
    .btn-clear { color: #c62828; }
    .btn-clear:hover { background-color: #ffebee; }

    .btn-export {
      padding: 8px 16px; background-color: #f2f2f2; border: none; border-radius: 8px; 
      cursor: pointer; font-weight: bold; font-size: 13px; color: #333; transition: all 0.2s;
    }
    .btn-export:hover { background-color: #0056b3; color: #ffffff; }

    .table-container { height: 350px; overflow-y: auto; border-radius: 8px; background-color: #ffffff; }
    .data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .data-table th { background-color: #e0e0e0; color: #333; padding: 10px; position: sticky; top: 0; text-align: center; }
    .data-table td { padding: 8px; text-align: center; border-bottom: 1px solid #f2f2f2; color: #555; }

    .dropdown-container {
      margin-top: 10px; 
      background-color: #f2f2f2; 
      border-radius: 8px; 
      padding: 10px;
      width: 50%; 
      box-sizing: border-box; 
    }
    .dropdown-summary {
      cursor: pointer; font-weight: bold; color: #333; outline: none; user-select: none;
    }
    .checkbox-list {
      display: flex; flex-direction: column; gap: 8px; margin-top: 10px; 
      padding-top: 10px; border-top: 1px solid #ccc;
    }
    .checkbox-item {
      display: flex; align-items: center; gap: 8px; font-size: 14px; color: #333;
    }

    @media (max-width: 800px) {
      .main-container { flex-direction: column; }
      .column-inputs, .column-table, .column-graph { width: 100%; }
      .dropdown-container { width: 100%; } 
    }
  `;

  return (
    <div className="app-wrapper">
      <style>{baseStyles}</style>
      
      <div className="header-container">
        <img src={logoImg} alt="Company Logo" className="header-logo" />
        <div className="header-divider"></div>
        <h1 className="header-title">Title</h1>
      </div>

      <div className="main-container">
        
        <div className="column-inputs">
          <div className="gray-box">
            
            <div className="input-row">
              <span className="input-label">Name</span>
              <input
                type="text"
                className="input-field"
                placeholder="Optional"
                value={inputs.materialName}
                onChange={(e) => handleInputChange(e, 'materialName')}
              />
              <span className="input-unit"></span>
            </div>

            {['E', 'Sy', 'Et', 'emax'].map((key) => (
              <div className="input-row" key={key}>
                <span className="input-label">{key === 'E' ? 'E_1' : key}</span>
                <input
                  type="number"
                  className="input-field"
                  value={inputs[key]}
                  onChange={(e) => handleInputChange(e, key)}
                  onKeyDown={blockInvalidChars} 
                />
                <span className="input-unit">{key === 'emax' ? 'mm/mm' : 'MPa'}</span>
              </div>
            ))}

            <div className="radio-group">
              {['Option 1', 'Option 2', 'Option 3'].map((opt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <input 
                    type="radio" 
                    name="modelType" 
                    value={opt}
                    checked={inputs.modelType === opt}
                    onChange={(e) => setInputs({ ...inputs, modelType: e.target.value })}
                    style={{ accentColor: '#2e7d32' }} 
                  />
                  <label style={{ fontSize: '14px', color: '#333' }}>{opt}</label>
                </div>
              ))}
            </div>

            <div className="input-row" style={{ marginTop: '20px' }}>
              <span className="input-label">Points</span>
              <input
                type="number"
                className="input-field"
                value={inputs.numPoints}
                onChange={(e) => handleInputChange(e, 'numPoints')}
                onKeyDown={blockInvalidChars} 
              />
              <span className="input-unit">qty</span>
            </div>
            
            <div className="action-buttons">
              <button className="btn-calc" onClick={handleCalculate}>
                <Play size={18} /> Calculate
              </button>
              <button className="btn-clear" onClick={handleClear}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="column-table">
          <div className="gray-box" style={{ padding: '15px' }}>
             <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
               {latestMaterial ? `Viewing: ${latestMaterial.name}` : 'No Data'}
             </p>
             <div className="table-container">
               <table className="data-table">
                 <thead>
                   <tr>
                     <th>Strain (ε)</th>
                     <th>Stress (σ)</th>
                   </tr>
                 </thead>
                 <tbody>
                   {latestMaterial ? (
                     latestMaterial.data.map((point, index) => (
                       <tr key={index}>
                         <td>{point.strain}</td>
                         <td>{point.stress}</td>
                       </tr>
                     ))
                   ) : (
                     <tr>
                       <td colSpan="2" style={{ padding: '30px', color: '#aaa' }}>
                         No data to display. Click Calculate.
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
          <div style={{ textAlign: 'right', marginTop: '10px' }}>
             <button className="btn-export" onClick={exportToCSV}>
               Export Data (CSV)
             </button>
          </div>
        </div>

        <div className="column-graph">
          <div className="gray-box" style={{ padding: '10px' }}>
            {materials.length > 0 ? (
              <Plot
                data={materials.filter(m => m.visible).map((mat) => ({
                    x: mat.data.map(d => d.strain),
                    y: mat.data.map(d => d.stress),
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: mat.name,
                    marker: { size: 6 },
                    line: { width: 2, shape: 'linear' }
                }))}
                layout={{
                  autosize: true,
                  margin: { l: 70, r: 20, t: 30, b: 60 }, 
                  paper_bgcolor: 'transparent', 
                  plot_bgcolor: 'transparent',
                  xaxis: { 
                    title: { text: 'Strain', font: { size: 14 } }, 
                    automargin: true, 
                    zerolinecolor: '#ccc', gridcolor: '#e0e0e0',
                    fixedrange: true, rangemode: 'nonnegative',
                    exponentformat: 'none', /* --- REMOVES 'k' AND 'M' SUFFIXES --- */
                    tickformat: ',' /* --- ADDS COMMA SEPARATOR FOR THOUSANDS --- */
                  },
                  yaxis: { 
                    title: { text: 'Stress', font: { size: 14 } }, 
                    automargin: true, 
                    zerolinecolor: '#ccc', gridcolor: '#e0e0e0',
                    fixedrange: true, rangemode: 'nonnegative',
                    exponentformat: 'none', /* --- REMOVES 'k' AND 'M' SUFFIXES --- */
                    tickformat: ',' /* --- ADDS COMMA SEPARATOR FOR THOUSANDS --- */
                  },
                  showlegend: true,
                  legend: { x: 0, y: 1 } 
                }}
                useResizeHandler={true}
                style={{ width: '100%', height: '370px' }}
                config={{ 
                  responsive: true, displaylogo: false, 
                  modeBarButtonsToRemove: ['lasso2d', 'select2d', 'zoom2d', 'pan2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d'] 
                }}
              />
            ) : (
              <p style={{ color: '#999', textAlign: 'center', marginTop: '40%' }}>
                Graph will appear here after calculation.
              </p>
            )}
          </div>

          {materials.length > 0 && (
            <details className="dropdown-container">
              <summary className="dropdown-summary">Active Materials ({materials.filter(m => m.visible).length}/{materials.length})</summary>
              <div className="checkbox-list">
                {materials.map(mat => (
                  <label key={mat.id} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      checked={mat.visible} 
                      onChange={() => toggleVisibility(mat.id)} 
                      style={{ accentColor: '#2e7d32' }} 
                    />
                    {mat.name}
                  </label>
                ))}
              </div>
            </details>
          )}

        </div>

      </div>
    </div>
  );
}

export default App;