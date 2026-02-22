import React, { useState } from 'react';
import { Play, Trash2 } from 'lucide-react';

// --- IMPORT RESTORED ---
import logoImg from './assets/logo.png';

function App() {
  const [inputs, setInputs] = useState({ E: 210000, Sy: 250, Et: 2000, emax: 0.1 });

  const handleInputChange = (e, key) => {
    setInputs({ ...inputs, [key]: parseFloat(e.target.value) || 0 });
  };

  const blockInvalidChars = (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const baseStyles = `
    .app-wrapper {
      width: 100vw;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
      background-color: #ffffff; 
      display: flex;
      flex-direction: column;
      font-family: Arial, sans-serif;
    }

    /* --- HEADER STYLES --- */
    .header-container {
      display: flex;
      align-items: center; 
      justify-content: flex-start; 
      border-bottom: 1px solid #eee; 
      padding-bottom: 15px; 
      margin-bottom: 10px;
    }

    .header-logo {
      height: 60px; 
      width: auto;  
      display: block;
    }

    .header-divider {
      width: 1px; 
      height: 40px; 
      background-color: #ccc; 
      margin: 0 5px; 
    }

    .header-title {
      margin: 0; 
      font-size: 22px; 
      color: #333;
    }

    /* --- FLEX PROPORTIONS --- */
    .main-container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 20px;
      width: 100%;
      margin-top: 20px;
    }

    .column-inputs { flex: 0.7; display: flex; flex-direction: column; }
    .column-table { flex: 1.2; display: flex; flex-direction: column; }
    .column-graph { flex: 1.8; display: flex; flex-direction: column; }

    /* --- ROUNDED COLUMNS (NO BORDERS) --- */
    .gray-box {
      border: none; 
      border-radius: 16px; 
      background-color: #f2f2f2; 
      width: 100%;
      min-height: 400px; 
      padding: 20px; 
      box-sizing: border-box;
    }

    /* --- INPUT STYLES --- */
    .input-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
    }
    
    .input-label { font-weight: bold; width: 40px; color: #333; }
    
    .input-unit { 
      font-size: 12px; 
      width: 45px; 
      text-align: left; 
      color: #666; 
    }
    
    .input-field {
      flex: 1;
      padding: 8px;
      margin: 0 10px 0 15px; 
      border: none; 
      border-radius: 8px; 
      background-color: #ffffff; 
      color: #0056b3; 
      font-weight: bold; 
    }
    
    .input-field:focus {
      outline: 2px solid #0056b3;
      outline-offset: -2px;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type=number] {
      -moz-appearance: textfield;
    }
    
    .radio-group {
      margin-top: 20px;
      padding: 15px;
      border: none; 
      border-radius: 8px; 
      background-color: #ffffff;
      width: fit-content;
    }

    /* --- BUTTON STYLES --- */
    .action-buttons { display: flex; gap: 10px; margin-top: 20px; }

    .btn-calc, .btn-clear {
      padding: 10px 15px;
      cursor: pointer;
      border: none; 
      border-radius: 8px; 
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      transition: background-color 0.2s;
    }
    
    .btn-calc { flex: 1; gap: 8px; color: #2e7d32; }
    .btn-calc:hover { background-color: #e8f5e9; }

    .btn-clear { color: #c62828; }
    .btn-clear:hover { background-color: #ffebee; }

    .btn-bottom {
      padding: 8px 16px;
      background-color: #f2f2f2; 
      border: none; 
      border-radius: 8px; 
      cursor: pointer;
      font-weight: bold;
      font-size: 13px;
      color: #333;
      transition: background-color 0.2s;
    }
    .btn-bottom:hover { background-color: #e0e0e0; }

    /* --- RESPONSIVE --- */
    @media (max-width: 800px) {
      .main-container { flex-direction: column; }
      .column-inputs, .column-table, .column-graph { width: 100%; }
    }
  `;

  return (
    <div className="app-wrapper">
      <style>{baseStyles}</style>
      
      {/* --- HEADER --- */}
      <div className="header-container">
        {/* --- IMAGE SOURCED FROM IMPORT --- */}
        <img src={logoImg} alt="Company Logo" className="header-logo" />
        <div className="header-divider"></div>
        <h1 className="header-title">Stress-Strain Curve</h1>
      </div>

      <div className="main-container">
        
        {/* COLUMN 1: Inputs & Controls */}
        <div className="column-inputs">
          <div className="gray-box">
            
            {Object.keys(inputs).map((key) => (
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
                  <input type="radio" name="modelType" defaultChecked={i === 0} style={{ accentColor: '#333' }} />
                  <label style={{ fontSize: '14px', color: '#333' }}>{opt}</label>
                </div>
              ))}
            </div>
            
            <div className="action-buttons">
              <button className="btn-calc">
                <Play size={18} /> Calculate
              </button>
              <button className="btn-clear">
                <Trash2 size={18} />
              </button>
            </div>

          </div>
        </div>

        {/* COLUMN 2: Table */}
        <div className="column-table">
          <div className="gray-box">
             <p style={{color: '#999', textAlign: 'center', marginTop: '50%'}}>Table area placeholder</p>
          </div>
          <div style={{ textAlign: 'right', marginTop: '10px' }}>
             <button className="btn-bottom">
               Export Data (CSV)
             </button>
          </div>
        </div>

        {/* COLUMN 3: Graph */}
        <div className="column-graph">
          <div className="gray-box">
             <p style={{color: '#999', textAlign: 'center', marginTop: '50%'}}>Graph area placeholder</p>
          </div>
          <div style={{ textAlign: 'right', marginTop: '10px' }}>
             <button className="btn-bottom">
               Save Image
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;