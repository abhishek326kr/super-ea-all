import uuid
from database import AdminSessionLocal, Category

def seed_categories():
    db = AdminSessionLocal()
    categories_to_seed = [
        {"id": str(uuid.uuid4()), "name": "pre-built bots", "slug": "pre-built-bots", "description": "Pre-configured and ready-to-run bots."},
        {"id": str(uuid.uuid4()), "name": "self-develop-bots", "slug": "self-develop-bots", "description": "Guides and tools for building your own EA."}
    ]
    
    # Simple check if table exists
    try:
        db.query(Category).first()
    except Exception as e:
        print(f"Table might not exist yet. Error: {e}")
        from database import admin_engine, Base
        Base.metadata.create_all(bind=admin_engine)
        print("Created tables.")

    for cat_data in categories_to_seed:
        existing = db.query(Category).filter_by(name=cat_data["name"]).first()
        if not existing:
            new_cat = Category(**cat_data)
            db.add(new_cat)
            print(f"Added category: {cat_data['name']}")
        else:
            print(f"Category '{cat_data['name']}' already exists.")
            
    db.commit()
    db.close()
    
if __name__ == "__main__":
    seed_categories()
