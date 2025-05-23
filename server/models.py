from config import db
from uuid import uuid4

# Creates an ID
def get_uuid():
    return uuid4().hex

# User model created from log in
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)

# Group model that will be linked to the tasks, and holds group members
class Group(db.Model):
    __tablename__ = "groups"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "members": [
                {
                    "userId": member.user.id,
                    "email": member.user.email
                } for member in self.members
            ]
        }

# Group member model that is part of the group model
class GroupMember(db.Model):
    __tablename__ = "group_members"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(32), db.ForeignKey("users.id"), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey("groups.id"), nullable=False)

    user = db.relationship("User", backref="group_memberships")
    group = db.relationship("Group", backref="members")

# Task model that will be stored in the database
class Task(db.Model):
    __tablename__ = "tasks"
    id = db.Column(db.Integer, primary_key=True)
    task_desc = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False, nullable=False)

    creator_id = db.Column(db.String(345), db.ForeignKey("users.id"), nullable=False)
    creator = db.relationship("User", backref="created_tasks")

    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'), nullable=False)
    group = db.relationship("Group", backref="tasks")

    def to_dict(self):
        return {
            "id": self.id,
            "taskDesc": self.task_desc,
            "completed": self.completed,
            "creator": self.creator.email,
            "groupId": self.group_id
        }