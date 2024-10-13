import { useState, useEffect } from "react";
import api from "../api";
import Team from "../components/Team"
import "../styles/Home.css"

function Home() {
    const [teams, setTeams] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        getTeams();
    }, [])

    const getTeams = () => {
        api
            .get("/api/teams/")
            .then((res) => res.data)
            .then((data) => { setTeams(data); console.log(data) })
            .catch((err) => alert(err));
    };

    const deleteTeam = (id) => {
        api
            .delete(`/api/teams/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Team deleted!");
                else alert("Failed to delete team.");
                getTeams();
            })
            .catch((error) => alert(error));
    };

    const createTeam = (e) => {
        e.preventDefault()
        api
            .post("/api/teams/", {content, title})
            .then((res) => {
                if (res.status === 201) alert("Team created!")
                else alert("Failed to make team.")
                getTeams();
            })
            .catch((err) => alert(err));
    };

    return (
    <div>
        <div>
            <h2>TEAMS</h2>
            {teams.map((team) => (
                <Team team={team} onDelete={deleteTeam} key={team.id} />
            ))}
        </div>
        <h2>Enter a Team</h2>
        <form onSubmit={createTeam}>
            <label htmlFor="title">Title:</label>
            <br />
            <input
                type="text"
                id="title"
                name="title"
                required
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />
            <label htmlFor="content">Content:</label>
            <br />
            <textarea 
                id="content"
                name="content" 
                required 
                value={content} 
                onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <br />
            <input type="submit" value="Submit"></input>
        </form>
    </div>
    );
    }

export default Home;