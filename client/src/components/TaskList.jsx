import { TaskItem } from "./TaskItem"

export function TaskList({ tasks, editTask }) {
    return (
        <div>
            <h2 className="text-3xl mt-2 italic">Tasks</h2>
            { tasks.length > 0 ?
            (<ul className="bg-gray-900 max-h-80 overflow-y-auto rounded-2xl mt-2 p-2 border-1 border-black">
                {tasks.map(task => {
                // Load each task in the list using a map
                return (
                    <TaskItem
                    task={task}
                    key={task.id}
                    editTask={editTask}/>
                )
                })}
            </ul>) :
            (<p className="mt-3">No tasks</p>)
            }
        </div>
    )
}