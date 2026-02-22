from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORS configuration to allow React to communicate with Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data structure representing the inputs sent by React
class CurveParameters(BaseModel):
    E: float
    Sy: float
    Et: float
    emax: float
    modelType: str
    numPoints: int

@app.post("/calculate")
def calculate_curve(params: CurveParameters):
    data_points = []
    
    # We ensure there are at least 2 points to avoid division by zero
    points = max(2, params.numPoints) 
    strain_step = params.emax / (points - 1)
    
    current_strain = 0.0
    for _ in range(points):
        
        # Apply the specific math based on the selected model
        if params.modelType == "Nelson":
            current_stress = params.E * current_strain
        elif params.modelType == "Fracture fit":
            current_stress = (params.E * current_strain) * 0.8
        elif params.modelType == "Considere":
            current_stress = (params.E * current_strain) * 0.5
        else:
            current_stress = params.E * current_strain
            
        data_points.append({
            "strain": round(current_strain, 4),
            "stress": round(current_stress, 2)
        })
        current_strain += strain_step
        
    return data_points