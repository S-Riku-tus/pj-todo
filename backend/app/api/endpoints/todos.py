from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.Todo])
def read_todos(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user),
):
    """
    Retrieve todos.
    """
    todos = crud.todo.get_multi_by_owner(
        db=db, owner_id=current_user.id, skip=skip, limit=limit
    )
    return todos


@router.post("/", response_model=schemas.Todo)
def create_todo(
    *,
    db: Session = Depends(deps.get_db),
    todo_in: schemas.TodoCreate,
    current_user: models.User = Depends(deps.get_current_user),
):
    """
    Create new todo.
    """
    todo = crud.todo.create_with_owner(
        db=db, obj_in=todo_in, owner_id=current_user.id
    )
    return todo


@router.put("/{todo_id}", response_model=schemas.Todo)
def update_todo(
    *,
    db: Session = Depends(deps.get_db),
    todo_id: int,
    todo_in: schemas.TodoUpdate,
    current_user: models.User = Depends(deps.get_current_user),
):
    """
    Update a todo.
    """
    todo = crud.todo.get(db=db, id=todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    if todo.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    todo = crud.todo.update(db=db, db_obj=todo, obj_in=todo_in)
    return todo


@router.get("/{todo_id}", response_model=schemas.Todo)
def read_todo(
    *,
    db: Session = Depends(deps.get_db),
    todo_id: int,
    current_user: models.User = Depends(deps.get_current_user),
):
    """
    Get todo by ID.
    """
    todo = crud.todo.get(db=db, id=todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    if todo.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return todo


@router.delete("/{todo_id}", response_model=schemas.Todo)
def delete_todo(
    *,
    db: Session = Depends(deps.get_db),
    todo_id: int,
    current_user: models.User = Depends(deps.get_current_user),
):
    """
    Delete todo.
    """
    todo = crud.todo.get(db=db, id=todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    if todo.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    todo = crud.todo.remove(db=db, id=todo_id)
    return todo 