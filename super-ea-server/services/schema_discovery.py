from sqlalchemy import inspect, Engine
from typing import List, Dict

class SchemaDiscovery:
    def __init__(self, engine: Engine):
        self.engine = engine
        self.inspector = inspect(engine)


    def get_all_table_names(self) -> List[str]:
        """Returns a list of all table names in the database."""
        return self.inspector.get_table_names()

    def get_table_schema(self, table_name: str) -> str:
        """
        Introspects the table and returns a text representation
        formatted for the Gemini System Prompt.
        """
        if not self.inspector.has_table(table_name):
            raise ValueError(f"Table '{table_name}' not found in database.")

        columns = self.inspector.get_columns(table_name)
        pk_constraint = self.inspector.get_pk_constraint(table_name)
        pks = pk_constraint.get('constrained_columns', [])
        
        # Get ENUM types from PostgreSQL
        enum_values = self._get_enum_values()

        schema_text = f"Target Table: {table_name}\nColumns:\n"
        
        for col in columns:
            col_name = col['name']
            col_type = col['type']
            col_type_str = str(col_type)
            is_pk = " (PRIMARY KEY)" if col_name in pks else ""
            nullable = "NULL" if col['nullable'] else "NOT NULL"
            
            # Check if this is an ENUM type and append allowed values
            enum_hint = ""
            for enum_name, values in enum_values.items():
                if enum_name.lower() in col_type_str.lower():
                    enum_hint = f" ALLOWED VALUES: {values}"
                    break
            
            schema_text += f"- {col_name} ({col_type}) {nullable}{is_pk}{enum_hint}\n"

        return schema_text
    
    def _get_enum_values(self) -> dict:
        """
        Retrieves all ENUM types and their values from PostgreSQL.
        Returns a dict mapping enum_name -> list of allowed values.
        """
        enum_values = {}
        try:
            from sqlalchemy import text
            with self.engine.connect() as conn:
                # Query PostgreSQL for ENUM types
                result = conn.execute(text("""
                    SELECT t.typname AS enum_name, e.enumlabel AS enum_value
                    FROM pg_type t
                    JOIN pg_enum e ON t.oid = e.enumtypid
                    ORDER BY t.typname, e.enumsortorder
                """))
                for row in result:
                    enum_name = row[0]
                    enum_value = row[1]
                    if enum_name not in enum_values:
                        enum_values[enum_name] = []
                    enum_values[enum_name].append(enum_value)
        except Exception as e:
            print(f"Could not retrieve ENUM values: {e}")
        return enum_values

    def get_structure_for_prompt(self, table_name: str) -> str:
        """
        Returns a compressed version specifically for Gemini to generate JSON.
        Includes hints for Node.js/Express ecosystems (camelCase, JSONB).
        """
        raw_schema = self.get_table_schema(table_name)
        return (
            f"STRICT DATABASE SCHEMA REQUIRED (Node.js/Postgres Target):\n{raw_schema}\n"
            f"CONTEXT: This database likely powers a Node.js/Express app (possibly using Prisma or TypeORM).\n"
            f"- Respect camelCase column names if present.\n"
            f"- For JSON/JSONB columns, provide valid stringified JSON objects.\n"
            f"- For 'createdAt'/'updatedAt' timestamps, use ISO 8601 strings if the format isn't strictly enforced by DB types.\n"
            f"You MUST generate a JSON object where update keys match these column names exactly. "
            f"Ensure data types are compatible (e.g., string for VARCHAR, int for INTEGER)."
        )
