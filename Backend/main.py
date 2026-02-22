from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CurveParameters(BaseModel):
    E: float
    Sy: float
    Et: float
    emax: float
    modelType: str
    numPoints: int  # --- NEW: Receives the number of data points ---

@app.post("/calculate")
def calculate_curve(params: CurveParameters):
    data_points = []
    
    # We ensure there are at least 2 points to avoid division by zero errors
    points = max(2, params.numPoints) 
    
    # The step size is the max strain divided by the number of intervals (points - 1)
    strain_step = params.emax / (points - 1)
    
    current_strain = 0.0
    for _ in range(points):
        if params.modelType == "Option 1":
            current_stress = params.E * current_strain
        elif params.modelType == "Option 2":
            current_stress = (params.E * current_strain) * 0.8
        elif params.modelType == "Option 3":
            current_stress = (params.E * current_strain) * 0.5
        else:
            current_stress = params.E * current_strain
            
        data_points.append({
            "strain": round(current_strain, 4),
            "stress": round(current_stress, 2)
        })
        current_strain += strain_step
        
    return data_points