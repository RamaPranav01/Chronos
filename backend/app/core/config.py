from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # This tells Pydantic to look for a .env file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra='ignore')
    
    GOOGLE_API_KEY: str
    NEO4J_PASSWORD: str

settings = Settings()