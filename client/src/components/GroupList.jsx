import {GroupItem} from "./GroupItem"

export function GroupList({groups, enterGroup, onLeave}) {
    return (
        <div>
            <ul className="bg-gray-900 max-h-110 overflow-y-auto rounded-2xl mt-2 p-2 border-1 border-black">
                {
                    groups.length < 1 ? (<p>You are currently in no groups. Create or join one to get started</p>)
                    :
                    (groups.map(group => {
                        return(
                            <GroupItem
                            group={group}
                            key={group.id}
                            onLeave={onLeave}
                            enterGroup={enterGroup}/>
                        )
                    }))
                }
            </ul>
        </div>
    )
}