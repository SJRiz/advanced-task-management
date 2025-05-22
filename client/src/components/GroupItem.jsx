import api from '../axiosConfig'

export function GroupItem({group, enterGroup, onLeave}) {
    function leaveGroup(groupId) {
        api.delete(`/groups/${groupId}`).then(() => onLeave(groupId)).catch(err => {console.log(err)})
    }
    return (
        <li>
            <div className="flex items-center justify-between w-full border-b p-2">
            <p>{group.name}</p>
            <div className="flex space-x-0 text"> {/* <- Buttons side-by-side with no gap */}
                <button onClick={() => enterGroup(group.id)} id="btn">Enter</button>
                <button onClick={() => leaveGroup(group.id)} id="btn">Leave</button>
            </div>
            </div>
        </li>
    )
}