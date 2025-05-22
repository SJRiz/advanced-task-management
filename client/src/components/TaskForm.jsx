import { useState } from "react";

export function TaskForm({addTask}){

    const [txt, setTxt] = useState("")

    // When submitting, prevents the page from reloading and adds the new task to the DB.
    function handleSubmit(e) {
        e.preventDefault()
        addTask(txt)
        setTxt("")
    }

    return (
        <div className="border-b-1 border-t mt-3 p-2 border-gray-500">
            <p className="mt-4">New Task</p>
            <form onSubmit={handleSubmit}>
            <input type="text"
            className="bg-white text-black rounded-2xl text-center mb-2 mt-4 w-80"
            value={txt}
            onChange={e=>setTxt(e.target.value)}/>
            <br/>
            <button type="submit" id="btn">Add</button>
            </form>
        </div>
    )
}