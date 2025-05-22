import api from '../axiosConfig'

export function GroupItem({group, enterGroup, onLeave}) {
    function leaveGroup(groupId) {
        api.delete(`/groups/${groupId}`).then(() => onLeave(groupId)).catch(err => {console.log(err)})
    }
    return (
        <li>
            <div>
                <p>{group.name}</p>
                <button onClick={() => enterGroup(group.id)} id='btn'>Enter</button>
                <button onClick={() => leaveGroup(group.id)} id='btn'>Leave</button>
            </div>
        </li>
    )
}