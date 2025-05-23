import api from '../axiosConfig'

export function GroupItem({group, enterGroup, onLeave}) {

    function leaveGroup(groupId) {
        api.delete(`/groups/${groupId}`).then(() => onLeave(groupId)).catch(err => {console.log(err)})
    }

    return (
        <li>
            <div className="flex items-center justify-between w-full border-b p-2 mt-3">
            <p className='flex-grow text-left break-words whitespace-normal w-45'>{group.name}</p>
            <div className="flex space-x-0 text">
                <button onClick={() => enterGroup(group.id)} id="btn">Enter</button>
                <button onClick={() => leaveGroup(group.id)} id="btn">Leave</button>
            </div>
            </div>
            <p className='text-left text-xs'> <u>Members:</u> {group.members.map((member) => {
                return (<span key={member.userId}>{member.email} </span>)
            })} </p>
        </li>
    )
}