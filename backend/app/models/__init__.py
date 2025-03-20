from app.models.user import User
from app.models.todo import Todo
from sqlalchemy.orm import relationship

# Add User.todos relationship
User.todos = relationship("Todo", back_populates="owner")