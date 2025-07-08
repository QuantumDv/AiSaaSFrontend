import { useEffect, useState } from "react";
import "./styles.css";
import Navbar from "../../components/navbar";
import axios from "axios";
import { Link } from "react-router-dom";

function CaptionsPage() {
  const [messages, setMessages] = useState<string | undefined>(undefined);
  const [topic, setTopic] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [style, setStyle] = useState<string>("");
  const [credits, setCredits] = useState<number | null>(null);
  const BASE_URL = import.meta.env.VITE_AIML_BASE_URL;
  const AIML_KEY = import.meta.env.VITE_AIML_API_KEY;

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await axios.get("https://api.freezygig.com/api/auth/user/credits", {
          withCredentials: true,
        });
        setCredits(response.data.credits);
      } catch (err) {
        console.error("Error fetching credits:", err);
        setCredits(null);
      }
    };
    fetchCredits();
  }, []);

  function handleClick(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (credits === 0) {
      setMessages("You have no credits left.");
      setLoading(false);
      return;
    }else if(credits === 1){
      setMessages("You have 1 credit left.");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIML_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: `create a short SEO friendly caption for my insta post about ${topic} with atleast 6 seo friendly tags in ${style} way.`,
          },
        ],
        max_tokens: 512,
        stream: false,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.choices && data.choices.length > 0 && data.choices[0].message) {
          setMessages(data.choices[0].message.content);
          setTopic("");
          setLoading(false);
          axios.post("https://api.freezygig.com/api/captions/deduct-credits", {}, {
            withCredentials: true,
          }).then((res) => {
            console.log(res);
          }).catch((err) => {
            console.error("Error deducting credits:", err);
          });
        } else {
          setMessages("No caption generated.");
          setLoading(false);
        }
      })
      .catch((error) => {
        setMessages("Error fetching caption.");
        console.error("Error fetching caption:", error);
        setLoading(false);
      });
  }

  return (
    <div className="captions-page">
      <Navbar />
      <header className="captions-header">
        SEO Friendly Captions
      </header>

      <form onSubmit={handleClick} className="flex flex-col gap-5">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">What is your post about?</legend>
          <input 
            type="text" 
            className="input" 
            onChange={(e) => setTopic(e.target.value)} 
            value={topic} 
            placeholder="Type your topic here"
            required 
          />
        </fieldset>
        <div className="dropdown dropdown-bottom">
          <div tabIndex={0} role="button" className="btn m-1">{style ? style : 'Choose style'}</div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li onClick={() => setStyle('funny')} value={'funny'}><a>Funny</a></li>
            <li value={'friendly'} onClick={() => setStyle('friendly')}><a>Friendly</a></li>
            <li value={'luxurious'} onClick={() => setStyle('luxurious')}><a>Luxury</a></li>
            <li value={'motivational'} onClick={() => setStyle('motivational')}><a>Motivational</a></li>
            <li value={'emotional'} onClick={() => setStyle('emotional')}><a>Emotional</a></li>
            <li value={'sales'} onClick={() => setStyle('sales')}><a>Sales</a></li>
            <li value={'bold'} onClick={() => setStyle('bold')}><a>Bold</a></li>
            <li value={'confident'} onClick={() => setStyle('confident')}><a>Confident</a></li>
            <li value={'urdu language'} onClick={() => setStyle('urdu language')}><a>Urdu</a></li>
          </ul>
        </div>
        <button className="btn btn-accent" type="submit">
          {loading ? 
          <div className="loader"></div> : 
          "Generate Captions"
          }
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <span>Need more credits? </span>
        <Link to="/pricing" style={{ color: '#007bff', fontWeight: 600, textDecoration: 'underline' }}>
          Buy Credits
        </Link>
      </div>

      {messages && 
        <div className="caption-box">
          <label className="caption-label">Caption Generated:</label>
          <p className="caption-text">{messages}</p>
        </div>
      }
    </div>
  );
}

export default CaptionsPage;
