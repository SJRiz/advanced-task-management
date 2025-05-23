import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig'
import { TaskForm } from '../components/TaskForm'
import { TaskList } from '../components/TaskList'
import { io } from 'socket.io-client'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [notification, setNotification]= useState('')
  const location = useLocation()
  const groupId = location.state?.groupId
  const navigate = useNavigate()

  // Fetch initial tasks
  useEffect(() => {
    api.get(`/groups/${groupId}/tasks`)
      .then(res => setTasks(res.data.tasks))
      .catch(err => console.log(err))
  }, [])

  // Setup SocketIO connections and listeners
  useEffect(() => {
    if (!groupId) return

    const socket = io(import.meta.env.VITE_API_BASE_URL)
    socket.emit('join_group', {group_id: groupId})

    // When any tasks are added to the server, refetch
    socket.on('task_changed', (data) => {
       api.get(`/groups/${groupId}/tasks`)
      .then(res => setTasks(res.data.tasks))
      .catch(err => console.log(err))
      console.log("change detected")

      const { userEmail } = data
      setNotification(`${userEmail} made a change to the tasklist`)
      setTimeout(() => setNotification(''),3000)
    })

    return () => {
      socket.emit('leave_group', {group_id: groupId})
      socket.disconnect()
    }
  }, [groupId])

  function addTask(task) {
    api.post(`/groups/${groupId}/tasks`, { taskDesc: task })
      .then()
      .catch(err => console.log(err))
  }

  function editTask(task, newTxt) {
    let request = newTxt
      ? api.patch(`/groups/${groupId}/tasks/${task.id}`, { taskDesc: newTxt })
      : api.delete(`/groups/${groupId}/tasks/${task.id}`)

    request.then().catch(err => console.log(err))
  }

  function exit() {
    navigate("/")
  }

  return (
    <div>
      <TaskForm addTask={addTask} />
      {notification}
      <TaskList tasks={tasks} editTask={editTask} />
      <p className='mb-2'>Group ID: {groupId} </p>
      <button id="btn" onClick={exit}>Back</button>
    </div>
  )
}
