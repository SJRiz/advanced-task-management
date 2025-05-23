from flask import request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask_socketio import join_room, leave_room
from config import app, db, socketio
from models import Task, User, Group, GroupMember
from flask_migrate import Migrate
migrate = Migrate(app, db)

# Used to hash passwords
bcrypt = Bcrypt(app)

# Used to see if the user is in the group
def check_membership(user_id, group_id):
    # Check if the group exists
    group = Group.query.get(group_id)
    if not group:
        return jsonify({"message": "Group not found"}), 404

    # Check if the user is already a member
    existing_member = GroupMember.query.filter_by(user_id=user_id, group_id=group_id).first()
    if not existing_member:
        return jsonify({"message": "You are not in this group"}), 403

############################## LISTENERS ##################################

@socketio.on('join_group')
def join_handler(data):
    group_id = data['group_id']
    join_room(str(group_id))
    print("user joined")

@socketio.on('leave_group')
def leave_handler(data):
    group_id = data['group_id']
    leave_room(str(group_id))
    print("user left")

############################## AUTH API ##################################
# Route to create a new user
@app.route("/register", methods=["POST"])
def register_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    # Filter by email in the DB and see if it exists
    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"message": "User already exists"}), 400
    
    # Hash the password, and create a new user
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })

# Route to login
@app.route("/login", methods=["POST"])
def login_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    user = User.query.filter_by(email=email).first()

    # See if the email exists and if the password matches
    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Unauthorized"}), 401

    # Return an access token that can be used to access ur groups
    access_token = create_access_token(identity=user.id)
    return jsonify({
    "access_token": access_token,
    "email": email
})

# Test route to see if the token works
@app.route("/verify", methods=["GET"])
@jwt_required()
def verify_token():
    current_user = get_jwt_identity()
    return jsonify({"user": current_user}), 200


############################## GROUP API ##################################
# Get method to get all the groups the user is in
@app.route("/groups", methods=["GET"])
@jwt_required()
def get_groups():
    user_id = get_jwt_identity()
    try:
        memberships = GroupMember.query.filter_by(user_id=user_id).all()
        groups = [membership.group.to_dict() for membership in memberships]
        return jsonify({"groups": groups})
    
    except Exception as err:
        return jsonify({"message": str(err)}), 400

# Post method to create a new group
@app.route("/groups", methods=["POST"])
@jwt_required()
def create_group():
    user_id = get_jwt_identity()
    try:
        data = request.json
        name = data.get("name")
        if not name:
            return jsonify({"message": "Invalid group name"}), 400
        
        # Create the group
        new_group = Group(name=name)
        db.session.add(new_group)
        db.session.commit()

        # Create the group member
        new_member = GroupMember(user_id=user_id, group_id=new_group.id)
        db.session.add(new_member)
        db.session.commit()

        return jsonify({"group": new_group.to_dict()}), 201
    
    except Exception as err:
        return jsonify({"message": str(err)}), 400

# Post method to join a group (create a new group member)
@app.route("/groups/<int:id>", methods=["POST"])
@jwt_required()
def join_group(id):
    user_id = get_jwt_identity()
    try:
        group = Group.query.get(id)
        if not group:
            return jsonify({"message": "Group not found"}), 404

        # Check if the user is already a member
        existing_member = GroupMember.query.filter_by(user_id=user_id, group_id=id).first()
        if existing_member:
            return jsonify({"message": "You are already in this group"}), 400

        # Add the new group member
        new_member = GroupMember(user_id=user_id, group_id=id)
        db.session.add(new_member)
        db.session.commit()

        return jsonify({"message": "Success"}), 201

    except Exception as err:
        return jsonify({"message": str(err)}), 400
    
# Delete method to leave a group (remove a group member)
@app.route("/groups/<int:id>", methods=["DELETE"])
@jwt_required()
def leave_group(id):
    user_id = get_jwt_identity()
    try:
        check_membership(user_id=user_id, group_id=id)

        group = Group.query.get(id)
        existing_member = GroupMember.query.filter_by(user_id=user_id, group_id=id).first()
        db.session.delete(existing_member)
        db.session.commit()

        # If the group has no members, then delete the group
        if not group.members:
            db.session.delete(group)
            db.session.commit()
            print("deleted empty group")

        return jsonify({"message": "Success"}), 204

    except Exception as err:
        return jsonify({"message": str(err)}), 400

############################## TASK API ##################################
# Get/Read method to get all the tasks made by a group
@app.route("/groups/<int:group_id>/tasks", methods=["GET"])
@jwt_required()
def get_tasks(group_id):
    user_id = get_jwt_identity()
    try:
        check_membership(user_id=user_id, group_id=group_id)

        tasks = Task.query.filter_by(group_id=group_id).all()
        tasks_list = [task.to_dict() for task in tasks]
        return jsonify({"tasks": tasks_list})
    
    except Exception as err:
        return jsonify({"message": str(err)}), 400

    
# Post/Create method to create a task associated with the user
@app.route("/groups/<int:group_id>/tasks", methods=["POST"])
@jwt_required()
def create_task(group_id):
    user_id = get_jwt_identity()
    try:
        check_membership(user_id=user_id, group_id=group_id)

        data = request.json
        task_desc = data.get("taskDesc")
        if not task_desc:
            return jsonify({"message": "Invalid task"}), 400
        
        new_task = Task(task_desc=task_desc, creator_id=user_id, group_id=group_id)
        db.session.add(new_task)
        db.session.commit()

        user = User.query.get(user_id)
        socketio.emit('task_changed', {
            'userEmail': user.email
        }, room=str(group_id))

        return jsonify({
            "id": new_task.id,
            "taskDesc": new_task.task_desc
        }), 201
    
    except Exception as err:
        return jsonify({"message": str(err)}), 400

# Patch/Update method to update a task description
@app.route("/groups/<int:group_id>/tasks/<int:id>", methods=["PATCH"])
@jwt_required()
def update_task(group_id, id):
    user_id = get_jwt_identity()
    try:
        check_membership(user_id=user_id, group_id=group_id)
        task = Task.query.get(id)
        if not task or task.group_id != group_id:
            return jsonify({"message": "Task not found"}), 404
        
        task.task_desc = request.json.get("taskDesc", task.task_desc)
        task.completed = request.json.get("completed", task.completed)
        db.session.commit()

        user = User.query.get(user_id)
        socketio.emit('task_changed', {
            'userEmail': user.email
        }, room=str(group_id))

        return jsonify(task.to_dict()), 200
    
    except Exception as err:
        return jsonify({"message": str(err)}), 400

# Delete method to delete a task associated with a user
@app.route("/groups/<int:group_id>/tasks/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_task(group_id, id):
    user_id = get_jwt_identity()
    try:
        check_membership(user_id=user_id, group_id=group_id)
        task = Task.query.get(id)
        if not task or task.group_id != group_id:
            return jsonify({"message": "Task not found"}), 404
        
        db.session.delete(task)
        db.session.commit()

        user = User.query.get(user_id)
        socketio.emit('task_changed', {
            'userEmail': user.email
        }, room=str(group_id))

        return jsonify({})
    
    except Exception as err:
        return jsonify({"message": str(err)}), 400

if __name__ == "__main__":
    import eventlet
    eventlet.monkey_patch()

    with app.app_context():
        db.create_all()

    socketio.run(app, host="0.0.0.0", port=5000)