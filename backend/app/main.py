import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from .schemas.missions import MissionRequest
from .agent.chronos_agent import ChronosAgent
from fastapi.middleware.cors import CORSMiddleware
from .agent.tools.knowledge_graph import KnowledgeGraphTool

app = FastAPI(title="Project Chronos Backend")
origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Chronos Backend is running."}

@app.get("/graph-data")
async def get_graph_data():
    """
    Fetches all nodes and relationships from the Neo4j database
    and formats them for a visualization library like React Flow.
    """
    memory = KnowledgeGraphTool()
    try:
        # Query for all nodes and relationships
        nodes_result = await memory.query("MATCH (n:Entity) RETURN n")
        rels_result = await memory.query("MATCH (n:Entity)-[r]->(m:Entity) RETURN n.name AS source, m.name AS target, type(r) AS label")

        # Format the data into a structure the frontend can easily use
        # This is a common pattern for graph visualization libraries
        formatted_nodes = [{"id": node['n']['name'], "data": {"label": node['n']['name']}, "type": node['n']['type']} for node in nodes_result]
        formatted_edges = [{"id": f"{rel['source']}-{rel['label']}-{rel['target']}", "source": rel['source'], "target": rel['target'], "label": rel['label']} for rel in rels_result]
        
        return {"nodes": formatted_nodes, "edges": formatted_edges}

    finally:
        # Ensure the connection is always closed
        await memory.close()

@app.websocket("/ws/analyze")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Wait for a mission request from the client
            data = await websocket.receive_text()
            mission_data = json.loads(data)
            mission = MissionRequest(**mission_data)
            
            # Create and run the agent for this mission
            agent = ChronosAgent(mission=mission)
            
            # Stream the agent's steps back to the client
            async for step in agent.run():
                await websocket.send_json(step.model_dump())

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"An error occurred: {e}")
        # Optionally send an error message to the client
        error_step = {"step_type": "ERROR", "payload": {"message": str(e)}}
        await websocket.send_json(error_step)
    from .agent.tools.knowledge_graph import KnowledgeGraphTool

    @app.get("/graph-data")
    async def get_graph_data():
        memory = KnowledgeGraphTool()
        # A query to get all nodes and relationships
        nodes = await memory.query("MATCH (n) RETURN n")
        rels = await memory.query("MATCH ()-[r]->() RETURN r")
        await memory.close()
        return {"nodes": nodes, "relationships": rels}