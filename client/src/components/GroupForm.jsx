import { useState } from "react";

export function GroupForm({addGroup, joinGroup, error}) {
    const [addTxt, setAddTxt] = useState("")
    const [joinTxt, setJoinTxt] = useState("")

    function handleAdd(e) {
        e.preventDefault()
        addGroup(addTxt)
        setAddTxt("")
    }

    function handleJoin(e) {
        e.preventDefault()
        joinGroup(joinTxt)
        setJoinTxt("")
    }

    return (
        <>
            <div>
                <p>Create Group</p>
                <form onSubmit={handleAdd}>
                    <input type="text"
                    className="bg-white text-black rounded-2xl text-center mb-4 mt-2 w-40"
                    value={addTxt}
                    placeholder="My Group"
                    onChange={e => setAddTxt(e.target.value)}/>
                </form>
            </div>
            <div className="border-b-1 mb-4">
                <p>Join Group</p>
                <form onSubmit={handleJoin}>
                    <input type="text"
                    className="bg-white text-black rounded-2xl text-center mb-5 mt-2 w-40"
                    value={joinTxt}
                    placeholder="Enter Group ID"
                    onChange={e => setJoinTxt(e.target.value)}/>
                </form>
            </div>
            <p>{error}</p>
        </>
    )

}