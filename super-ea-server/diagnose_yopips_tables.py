"""
Script to diagnose the actual table structure in yopips database.
"""
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from services.connection_manager import ConnectionManager
from sqlalchemy import text, inspect

def main():
    print("="*70)
    print("YOPIPS DATABASE TABLE DIAGNOSIS")
    print("="*70)

    cm = ConnectionManager.get_instance()

    try:
        engine = cm.get_engine('yopips')
        config = cm.get_config('yopips')

        print(f"\nYoPips Config:")
        print(f"  ID: {config.id}")
        print(f"  Name: {config.name}")
        print(f"  Configured Table: '{config.target_table_name}'")

        # Get all tables
        inspector = inspect(engine)
        all_tables = inspector.get_table_names()

        print(f"\n{'='*70}")
        print(f"ALL TABLES IN YOPIPS DATABASE ({len(all_tables)} total):")
        print(f"{'='*70}")
        for table in sorted(all_tables):
            print(f"  - {table}")

        # Check for blog-related tables
        print(f"\n{'='*70}")
        print("BLOG-RELATED TABLES:")
        print(f"{'='*70}")
        blog_tables = [t for t in all_tables if 'blog' in t.lower() or 'post' in t.lower()]
        if blog_tables:
            for table in blog_tables:
                print(f"  * {table}")
        else:
            print("  No blog/post tables found")

        # Check exact matches
        target = config.target_table_name or "blog"
        print(f"\n{'='*70}")
        print(f"CHECKING TARGET: '{target}'")
        print(f"{'='*70}")
        print(f"  Exact match '{target}': {'YES' if target in all_tables else 'NO'}")
        print(f"  Exact match 'blog': {'YES' if 'blog' in all_tables else 'NO'}")
        print(f"  Exact match 'Blog': {'YES' if 'Blog' in all_tables else 'NO'}")
        print(f"  Exact match 'blogs': {'YES' if 'blogs' in all_tables else 'NO'}")

        # Case-insensitive search
        case_matches = [t for t in all_tables if t.lower() == target.lower()]
        if case_matches:
            print(f"\n  Case-insensitive matches for '{target}':")
            for match in case_matches:
                print(f"    -> {match}")

        # Try to introspect each blog-related table
        if blog_tables:
            print(f"\n{'='*70}")
            print("INTROSPECTION TEST:")
            print(f"{'='*70}")

            for table in blog_tables:
                print(f"\nTable: {table}")
                try:
                    # Try without schema
                    cols = inspector.get_columns(table)
                    print(f"  SUCCESS (no schema): {len(cols)} columns")
                except Exception as e:
                    print(f"  FAIL (no schema): {e}")

                    # Try with schema
                    try:
                        cols = inspector.get_columns(table, schema='public')
                        print(f"  SUCCESS (with schema='public'): {len(cols)} columns")
                    except Exception as e2:
                        print(f"  FAIL (with schema='public'): {e2}")

        # Direct SQL query to check schema
        print(f"\n{'='*70}")
        print("SCHEMA INFORMATION (via information_schema):")
        print(f"{'='*70}")

        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_schema, table_name, table_type
                FROM information_schema.tables
                WHERE table_name ILIKE '%blog%' OR table_name ILIKE '%post%'
                ORDER BY table_schema, table_name
            """))

            rows = result.fetchall()
            if rows:
                print(f"\nFound {len(rows)} blog/post related tables:")
                for row in rows:
                    print(f"  Schema: {row[0]:15} Table: {row[1]:20} Type: {row[2]}")
            else:
                print("\nNo blog/post tables found via information_schema")

        print(f"\n{'='*70}")
        print("DIAGNOSIS COMPLETE")
        print(f"{'='*70}")

    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
