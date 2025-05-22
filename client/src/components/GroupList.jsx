import {GroupItem} from "./GroupItem"

export function GroupList({groups, enterGroup}) {
    return (
        <div>
            <ul>
                {
                    groups.length < 1 ? (<p>You are currently in no groups. Create or join one to get started</p>)
                    :
                    (groups.map(group => {
                        return(
                            <GroupItem
                            group={group}
                            key={group.id}
                            enterGroup={enterGroup}/>
                        )
                    }))
                }
            </ul>
        </div>
    )
}