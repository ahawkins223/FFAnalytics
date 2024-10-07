import { useState, useEffect } from "react";
import api from "../api";

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

    return <div>Home</div>;
}

export default Home;