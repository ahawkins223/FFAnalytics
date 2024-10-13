import React from "react"
import "../styles/Team.css"

function Team({team, onDelete}) {
    const formattedDate = new Date(team.created_at).toLocaleDateString("en-US")

    return <div className="team-container">
        <p className="team-title">{team.title}</p>
        <p className="team-content">{team.content}</p>
        <p className="team-date">{formattedDate}</p>
        <button className="delete-button" onClick={() => onDelete(team.id)}>
            Delete
        </button>
    </div>
}

export default Team