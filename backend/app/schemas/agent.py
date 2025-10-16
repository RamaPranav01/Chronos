from pydantic import BaseModel
from enum import Enum
from typing import Any

class StepType(str, Enum):
    THOUGHT = "THOUGHT"
    ACTION = "ACTION"
    RESULT = "RESULT"
    ERROR = "ERROR"
    FINAL_REPORT = "FINAL_REPORT"

class AgentStep(BaseModel):
    step_type: StepType
    payload: Any