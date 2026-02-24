from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
import uuid

from database import get_admin_db_session, Category
from schemas import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter()


@router.get("", response_model=List[CategoryResponse])
@router.get("/", response_model=List[CategoryResponse])
def get_categories(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_admin_db_session)
):
    categories = db.query(Category).offset(skip).limit(limit).all()
    return categories


@router.post("", response_model=CategoryResponse)
@router.post("/", response_model=CategoryResponse)
def create_category(
    category: CategoryCreate, db: Session = Depends(get_admin_db_session)
):
    # Check if a category with same name or slug already exists
    existing = db.query(Category).filter(
        (Category.name == category.name) | (Category.slug == category.slug)
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Category with this name or slug already exists")
        
    category_id = str(uuid.uuid4())
    db_category = Category(
        id=category_id,
        name=category.name,
        slug=category.slug,
        description=category.description
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: str, db: Session = Depends(get_admin_db_session)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: str,
    category_update: CategoryUpdate,
    db: Session = Depends(get_admin_db_session),
):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    if category_update.name is not None:
        db_category.name = category_update.name
    if category_update.slug is not None:
        db_category.slug = category_update.slug
    if category_update.description is not None:
        db_category.description = category_update.description

    db.commit()
    db.refresh(db_category)
    return db_category


@router.delete("/{category_id}")
def delete_category(category_id: str, db: Session = Depends(get_admin_db_session)):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(db_category)
    db.commit()
    return {"status": "success", "message": "Category deleted"}
