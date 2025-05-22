import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../axiosConfig'
import { TaskForm } from '../components/TaskForm'
import { TaskList } from '../components/TaskList'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [refresh, setRefresh] = useState(0)
  const location = useLocation()
  const groupId = location.state?.groupId

  useEffect(() => {
    api.get(`/groups/${groupId}/tasks`)
      .then(res => setTasks(res.data.tasks))
      .catch(err => console.log(err))
  }, [refresh])

  function addTask(task) {
    api.post(`/groups/${groupId}/tasks`, { taskDesc: task })
      .then(() => setRefresh(prev => prev + 1))
      .catch(err => console.log(err))
  }

  function editTask(task, newTxt) {
    let request = newTxt
      ? api.patch(`/groups/${groupId}/tasks/${task.id}`, { taskDesc: newTxt })
      : api.delete(`/groups/${groupId}/tasks/${task.id}`)

    request.then(() => setRefresh(prev => prev + 1)).catch(console.log)
  }

  return (
    <div>
      <TaskForm addTask={addTask} />
      <TaskList tasks={tasks} editTask={editTask} />
    </div>
  )
}
