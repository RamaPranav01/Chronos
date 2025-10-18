from neo4j import AsyncGraphDatabase
from app.core.config import settings

class KnowledgeGraphTool:
    def __init__(self):
        # Update the URI to use the service name from docker-compose
        uri = "bolt://neo4j:7687"
        user = "neo4j"
        password = settings.NEO4J_PASSWORD
        self._driver = AsyncGraphDatabase.driver(uri, auth=(user, password))

    async def close(self):
        await self._driver.close()

    async def add_entity(self, name: str, entity_type: str):
        """Adds a node to the knowledge graph."""
        async with self._driver.session() as session:
            # Using MERGE prevents creating duplicate nodes for the same entity
            await session.run(
                "MERGE (e:Entity {name: $name}) SET e.type = $entity_type",
                name=name,
                entity_type=entity_type,
            )
            print(f"Added/Updated entity: {name} ({entity_type})")

    async def add_relationship(self, source_name: str, target_name: str, relationship_type: str):
        """Adds a relationship between two existing nodes."""
        async with self._driver.session() as session:
            await session.run(
                """
                MATCH (a:Entity {name: $source_name})
                MATCH (b:Entity {name: $target_name})
                MERGE (a)-[r:%s]->(b)
                """ % relationship_type.upper().replace(" ", "_"), # Sanitize relationship type
                source_name=source_name,
                target_name=target_name,
            )
            print(f"Added relationship: {source_name} -[{relationship_type}]-> {target_name}")

    async def query(self, cypher_query: str) -> list:
        """Runs a read-only Cypher query and returns a list of dictionaries."""
        async with self._driver.session() as session:
            result = await session.run(cypher_query)
            # The .data() method correctly fetches all records as a list of dicts.
            records = await result.data()
            return records