export function GroupItem({group, enterGroup}) {
    return (
        <li>
            <div>
                <p>{group.name}</p>
                <button onClick={() => enterGroup(group.id)}>Enter</button>
            </div>
        </li>
    )
}