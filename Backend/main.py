from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np

app = FastAPI()

# Permitir conexión desde el frontend de React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class MaterialInput(BaseModel):
    E: float   # Módulo elástico
    Sy: float  # Límite elástico
    Et: float  # Módulo tangente
    emax: float # Deformación máxima

@app.post("/calculate")
async def calculate_curve(data: MaterialInput):
    # Deformación en el límite elástico
    yield_strain = data.Sy / data.E
    
    # Generar 100 puntos de deformación (Strain)
    strains = np.linspace(0, data.emax, 100)
    results = []

    for eps in strains:
        if eps <= yield_strain:
            # Región Elástica: Ley de Hooke
            sig = eps * data.E
        else:
            # Región Plástica: Endurecimiento lineal
            sig = data.Sy + (eps - yield_strain) * data.Et
        
        results.append({
            "strain": round(float(eps), 5),
            "stress": round(float(sig), 2)
        })
    
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)