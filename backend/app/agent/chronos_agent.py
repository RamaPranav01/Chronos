import asyncio
from typing import AsyncGenerator
from app.schemas.missions import MissionRequest
from app.schemas.agent import AgentStep, StepType
from app.agent.tools.multimodal import MultiModalAnalysisTool
from app.agent.tools.excavator import WebExcavatorTool
from app.agent.tools.knowledge_graph import KnowledgeGraphTool

class ChronosAgent:
    def __init__(self, mission: MissionRequest):
        self.mission = mission
        self.analyzer = MultiModalAnalysisTool()
        self.excavator = WebExcavatorTool()
        self.memory = KnowledgeGraphTool()

    async def run(self) -> AsyncGenerator[AgentStep, None]:
        try:
            yield AgentStep(step_type=StepType.THOUGHT, payload={"message": f"Mission received. Objective: '{self.mission.objective}'"})

            yield AgentStep(step_type=StepType.ACTION, payload={"message": f"Excavating {self.mission.target_url}..."})
            page_content = await self.excavator.scrape_text(str(self.mission.target_url))
            
            yield AgentStep(step_type=StepType.THOUGHT, payload={"message": "Sifting through raw data to find significant artifacts..."})
            artifacts = await self.excavator.find_artifacts(page_content, self.mission.objective)
            
            if not artifacts:
                yield AgentStep(step_type=StepType.ERROR, payload={"message": "Excavation complete, but no significant artifacts found on the page."})
                return

            yield AgentStep(step_type=StepType.RESULT, payload={"message": f"Found {len(artifacts)} potential artifacts."})
            
            all_findings = []
            for i, artifact in enumerate(artifacts):
                yield AgentStep(step_type=StepType.THOUGHT, payload={"message": f"Analyzing artifact #{i+1}: '{artifact[:80]}...'"})
                analysis_result = await self.analyzer.analyze_text(artifact) # This is our real Gemini call
                
                # --- NEW: Add findings to the Knowledge Graph ---
                if 'slang_definitions' in analysis_result:
                    for term, definition in analysis_result['slang_definitions'].items():
                        await self.memory.add_entity(name=term, entity_type="Slang")
                        await self.memory.add_entity(name=artifact, entity_type="Artifact")
                        await self.memory.add_relationship(source_name=artifact, target_name=term, relationship_type="CONTAINS_SLANG")

                all_findings.append({"artifact": artifact, "analysis": analysis_result})
                yield AgentStep(step_type=StepType.RESULT, payload={"message": f"Analysis of artifact #{i+1} complete.", "data": analysis_result})

            yield AgentStep(step_type=StepType.THOUGHT, payload={"message": "All artifacts analyzed. Synthesizing the final report..."})
            
            # TODO: Add a final Gemini call to synthesize a narrative summary from `all_findings`
            
            final_report = {
                "title": f"Digital Anthropology Report for {self.mission.target_url}",
                "summary": "The agent has completed its analysis. Key findings are listed below.",
                "key_findings": all_findings
            }
            yield AgentStep(step_type=StepType.FINAL_REPORT, payload=final_report)

        except Exception as e:
            yield AgentStep(step_type=StepType.ERROR, payload={"message": f"A critical error occurred in the agent: {e}"})
        finally:
            # Important: Close the database connection
            await self.memory.close()