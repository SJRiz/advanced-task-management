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
                    onChange={e => setAddTxt(e.target.value)}/>
                </form>
            </div>
            <div>
                <p>Join Group</p>
                <form onSubmit={handleJoin}>
                    <input type="text"
                    value={joinTxt}
                    onChange={e => setJoinTxt(e.target.value)}/>
                </form>
            </div>
            <p>{error}</p>
        </>
    )

}