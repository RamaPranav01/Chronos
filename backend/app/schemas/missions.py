from pydantic import BaseModel, HttpUrl

class MissionRequest(BaseModel):
    mission_type: str = "excavate_url"
    target_url: HttpUrl
    objective: str