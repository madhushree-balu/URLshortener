import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Dashboard() {

    const [originalUrl, setOriginalUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
     
    const[urls, setUrls] = useState([]);

    const navigate = useNavigate();


    const handleShorten = async (e) => {

        e.preventDefault();

        const token = localStorage.getItem("token");

        try {

            const response = await api.post(
                "shorten_url/",
                {
                    original_url: originalUrl
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            setShortUrl(response.data.short_url);
            setOriginalUrl("");

            fetchurls();

        } catch (error) {

            console.log(error);

        }

    };

    const fetchurls = async () => {

        const token = localStorage.getItem("token");

        try{

            const response = await api.get(
                "all_urls/",
                {
                    headers : {
                        Authorization: token
                    }
                    }
            );
        
        setUrls(response.data.urls);}

        catch (error) {

            console.log(error);     
        }
    };

    useEffect (() => {
        fetchurls();
    }, []);

    useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
    }

}, []);

    const deleteUrl = async (shortUrl) => {

    const token = localStorage.getItem("token");

            try {

                const response = await api.delete(
                    `delete_url/${shortUrl}/`,
                    {
                        headers: {
                            Authorization: token
                        }
                    }
                );

                console.log(response.data);

                fetchurls();

            } catch (error) {

                console.log(error);

            }

        };

        const handleLogout = () => {

                localStorage.removeItem("token");

                navigate("/login");

            };

        const  copyUrl = (shortUrl) => {
            const fullurl = `http://127.0.0.1:8000/users/${shortUrl}/`;
            navigator.clipboard.writeText(fullurl);
            alert("Shortened URL copied to clipboard!");
        }

    return (
        <>
            <h1>Dashboard</h1>

            <input
                type="text"
                placeholder="Enter Original URL"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
            />

            <button onClick={handleShorten}>
                Shorten
            </button>

            {shortUrl && (
                <p>Shortened URL: {shortUrl}</p>
            )}

            <h2>My URLs</h2>

            {urls.length === 0 ? (
                <p>No URLs Found</p>
            ) : (
                urls.map((url) => (
                    <div key={url.short_url}>
                        <p>
                            <strong>Original URL:</strong> {url.original_url}
                        </p>

                        <p>
                            <strong>Short URL:</strong> 
                            <a href={`http://127.0.0.1:8000/users/${url.short_url}/`}
                            target="_blank"
                            rel="noopener noreferrer">
                            {`http://127.0.0.1:8000/users/${url.short_url}/`}
                        </a>


                        </p>

                        <p>
                            <strong>Click Count:</strong> {url.click_count}
                        </p>

                        <p>
                            <strong>Created At:</strong> {url.created_at}
                        </p>

                        <button onClick={() =>
                            copyUrl(url.short_url)
                        }>
                            Copy URL
                        </button>

                        <button onClick={() => deleteUrl(url.short_url)}>
                            Delete
                        </button>

                        <hr />
                    </div>
                ))
            )}
                        
                        

            <button onClick={handleLogout}>
                Logout
            </button>
        </>
    );
}

export default Dashboard;