from database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def sql_alchemy_to_dict(obj):
    return {column.name: getattr(obj, column.name) for column in obj.__table__.columns}