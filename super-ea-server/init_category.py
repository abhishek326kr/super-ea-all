from database import admin_engine, Category

def init_category_table():
    print("Initializing Category table in admin database...")
    Category.metadata.create_all(bind=admin_engine)
    print("Category table created successfully!")

if __name__ == "__main__":
    init_category_table()
