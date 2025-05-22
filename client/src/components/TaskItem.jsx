import { useState } from 'react';
import api from '../axiosConfig'

export function TaskItem({ task, editTask }) {
  const [isEditing, setIsEditing] = useState(false); // State that will determine if we are editing the task or not
  const [newText, setNewText] = useState(task.taskDesc); // State that will be the text of the task (will either be a paragraph or input)

  // When the item is saved, call the patch method with the new text
  function handleSave() {
    editTask(task, newText);
    setIsEditing(false);
  };

  function handleComplete() {
    api.patch(`/groups/${task.groupId}/tasks/${task.id}`, { completed: !task.completed })
    .then().catch(err => {console.log(err)})
  }

  return (
    <li>
      <div className="flex items-center space-x-1 justify-between w-full border-b-1 p-2">
        {isEditing ? (
            // If we are editing the task, turn the text into an input and put a save button that will update the task
          <>
            <input
              className="bg-white text-black rounded-2xl text-center mb-1"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
            <button 
            className="bg-gray-950 p-2 rounded-2xl border-1"
            onClick={handleSave}>Save</button>
            <button
            className="bg-gray-950 p-2 rounded-2xl border-1"
            onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
            // If we are not editing the task (default), just show it as a paragraph
          <>
            <p className='flex-grow text-left break-words whitespace-normal w-50'
            onClick={handleComplete}>{

              task.completed == true ? (<del className='text-green-300'>{task.taskDesc}</del>) : (task.taskDesc)

            }</p>
            <button className='size-5' onClick={() => setIsEditing(true)}>✏️</button>
            <button onClick={() => editTask(task, null)}>❌</button>
          </>
        )}
      </div>
      <p className='text-left mb-2'>Created by: {task.creator}</p>
    </li>
  );
}