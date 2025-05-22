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
                    value={addTxt}
                    placeholder="My Group"
                    onChange={e => setAddTxt(e.target.value)}/>
                </form>
            </div>
            <div>
                <p>Join Group</p>
                <form onSubmit={handleJoin}>
                    <input type="text"
                    value={joinTxt}
                    placeholder="Enter Group ID"
                    onChange={e => setJoinTxt(e.target.value)}/>
                </form>
            </div>
            <p>{error}</p>
        </>
    )

}