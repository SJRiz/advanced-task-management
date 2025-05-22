import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import api from '../axiosConfig'
import { GroupForm } from '../components/GroupForm';
import { GroupList } from '../components/GroupList';

export default function Groups() {
    const navigate = useNavigate();

    const [groups, setGroups] = useState([])
    const [refresh, setRefresh] = useState(0)
    const [error, setError] = useState("")

    useEffect(() => {
        api.get("/groups")
        .then(res => setGroups(res.data.groups))
        .catch(err => {console.log(err)})
    }, [refresh])

    function addGroup(groupName) {
        api.post("/groups", { name: groupName })
        .then(() => setRefresh(prev => prev + 1))
        .catch(err => {
        const msg = err.response?.data?.message || "Failed to make group"
        setError(msg)})
    }

    function joinGroup(groupId) {
        api.post(`/groups/${groupId}`)
        .then(() => setRefresh(prev => prev + 1))
        .catch(err => {
        const msg = err.response?.data?.message || "Failed to join group"
        setError(msg)})
    }

    function leaveGroup(groupId) {
        setGroups(prevGroups => prevGroups.filter(g => g.id !== groupId));
    }

    function enterGroup(groupId) {
        navigate("/tasks", { state: {groupId} })
    }

    return (
        <div>
            <GroupForm addGroup={addGroup} joinGroup={joinGroup} error={error}/>
            <GroupList groups={groups} enterGroup={enterGroup} onLeave={leaveGroup}/>
        </div>
    )

}