import { useState, useEffect } from 'react'
import api from '../axiosConfig'
import { TaskForm } from '../components/TaskForm'
import { TaskList } from '../components/TaskList'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    api.get("https://task-management-1dlj.onrender.com/tasks")
      .then(res => setTasks(res.data.tasks))
      .catch(err => console.log(err))
  }, [refresh])

  function addTask(task) {
    api.post("https://task-management-1dlj.onrender.com/tasks", { taskDesc: task })
      .then(() => setRefresh(prev => prev + 1))
      .catch(err => console.log(err))
  }

  function editTask(task, newTxt) {
    let request = newTxt
      ? api.patch(`https://task-management-1dlj.onrender.com/tasks/${task.id}`, { taskDesc: newTxt })
      : api.delete(`https://task-management-1dlj.onrender.com/tasks/${task.id}`)

    request.then(() => setRefresh(prev => prev + 1)).catch(console.log)
  }

  return (
    <div>
      <TaskForm addTask={addTask} />
      <TaskList tasks={tasks} editTask={editTask} />
    </div>
  )
}
