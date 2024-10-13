import { useState, useEffect } from "react";
import api from "../api";
import Team from "../components/Team";
import "../styles/Home.css";
import axios from 'axios';

function Home() {
    const [teams, setTeams] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [nflPlayers, setNflPlayers] = useState([]); // State for NFL players
    const [inputValue, setInputValue] = useState(""); // State for input value
    const [suggestions, setSuggestions] = useState([]); // State for suggestions

    useEffect(() => {
        getTeams(); // Fetch teams on component mount
        fetchNflPlayers(); // Fetch NFL players from the API
    }, []);

    // Function to fetch teams from the API
    const getTeams = () => {
        api
            .get("/api/teams/")
            .then((res) => res.data)
            .then((data) => { 
                setTeams(data); 
                console.log(data); 
            })
            .catch((err) => alert(err));
    };

    // Function to fetch NFL players from the API
    const fetchNflPlayers = async () => {
        const options = {
            method: 'GET',
            url: 'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLPlayerList',
            headers: {
                'x-rapidapi-key': '352fbe4c98msh95a0ba7d165a788p1446fdjsn2be06375cc09',
                'x-rapidapi-host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            console.log("NFL Players Data:", response.data); // Log the response data
            setNflPlayers(response.data); // Set NFL players to state
        } catch (error) {
            console.error("Error fetching NFL players:", error);
            alert("Failed to fetch NFL players.");
        }
    };

    // Function to delete a team
    const deleteTeam = (id) => {
        api
            .delete(`/api/teams/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Team deleted!");
                else alert("Failed to delete team.");
                getTeams(); // Refresh teams after deletion
            })
            .catch((error) => alert(error));
    };

    // Function to create a team
    const createTeam = (e) => {
        e.preventDefault();
        const teamData = { content, title };
    
        console.log("Submitting team data:", teamData); // Log for debugging
        api.post("/api/teams/", teamData)
            .then((res) => {
                if (res.status === 201) {
                    alert("Team created!");
                } else {
                    alert("Failed to make team.");
                }
                getTeams(); // Refresh teams after creation
            })
            .catch((err) => {
                console.error("Error creating team:", JSON.stringify(err.response.data, null, 2)); // Log detailed error response
                alert("Failed to create team: " + (err.response.data.message || "Unknown error"));
            });
    };
    
    // Function to handle input change for player name
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        // Filter suggestions based on input
        const filteredSuggestions = nflPlayers.filter(player =>
            player.espn_name.toLowerCase().includes(value.toLowerCase()) // Adjust based on the API response
        );
        setSuggestions(filteredSuggestions); // Update suggestions
    };

    // Function to handle suggestion click
    const handleSuggestionClick = (name) => {
        setInputValue(name); // Set input value to selected suggestion
        setSuggestions([]); // Clear suggestions
    };

    return (
        <div>
            <div>
                <h2>Teams</h2>
                {teams.map((team) => (
                    <Team team={team} onDelete={deleteTeam} key={team.id} />
                ))}
            </div>
            <h2>Enter a Player</h2>
            <form onSubmit={createTeam}>
                <label htmlFor="title">Player Name:</label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={handleInputChange}
                    value={inputValue}
                />
                {suggestions.length > 0 && (
                    <ul>
                        {suggestions.map((player, index) => (
                            <li key={index} onClick={() => handleSuggestionClick(player.espn_name)}> {/* Adjust based on the API response */}
                                {player.espn_name} {/* Adjust based on the API response */}
                            </li>
                        ))}
                    </ul>
                )}
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
