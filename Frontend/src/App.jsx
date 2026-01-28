import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Play } from 'lucide-react';

const API_URL = "https://stress-starain-curve-project.onrender.com"; // Cambiar por la URL de Render tras el deploy

function App() {
  const [data, setData] = useState([]);
  const [inputs, setInputs] = useState({ E: 210000, Sy: 250, Et: 2000, emax: 0.1 });

  const fetchCurve = async () => {
    try {
      const res = await axios.post(`${API_URL}/calculate`, inputs);
      setData(res.data);
    } catch (err) {
      alert("Error: Asegúrate de que el backend de Python esté corriendo.");
    }
  };

  const exportCSV = () => {
    const headers = "Strain,Stress\n";
    const rows = data.map(d => `${d.strain},${d.stress}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'curva_plastica.csv';
    a.click();
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh', fontFamily: 'Arial' }}>
      <h2 style={{ color: '#555' }}>Cálculo de la curva plástica</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '20px' }}>
        
        {/* COLUMNA VERDE: Parámetros */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {Object.keys(inputs).map((key) => (
            <div key={key}>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>{key}</label>
              <input
                type="number"
                value={inputs[key]}
                onChange={(e) => setInputs({ ...inputs, [key]: parseFloat(e.target.value) })}
                style={{ width: '100%', padding: '10px', border: '2px solid #28a745', borderRadius: '4px' }}
              />
            </div>
          ))}
          <button onClick={fetchCurve} style={{ padding: '12px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Play size={16} /> Calcular Curva
          </button>
        </div>

        {/* COLUMNA AMARILLA: Tabla */}
        <div style={{ border: '2px solid #ffc107', borderRadius: '4px', backgroundColor: 'white', padding: '10px' }}>
          <button onClick={exportCSV} style={{ width: '100%', padding: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', marginBottom: '10px', cursor: 'pointer' }}>
            <Download size={14} /> Export data
          </button>
          <div style={{ height: '400px', overflowY: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#eee', position: 'sticky', top: 0 }}>
                <tr><th style={{ padding: '5px' }}>Stress</th><th style={{ padding: '5px' }}>Strain</th></tr>
              </thead>
              <tbody>
                {data.map((point, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '5px' }}>{point.stress}</td>
                    <td style={{ padding: '5px' }}>{point.strain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLUMNA GRÁFICA */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="strain" label={{ value: 'Strain (ε)', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Stress (σ)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line type="monotone" dataKey="stress" stroke="#007bff" dot={false} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default App;