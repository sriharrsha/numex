import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import BusinessNameGenerator from "./components/BusinessNameGenerator";

// BACKEND_URL and API constants are removed to use relative paths for Vercel deployment.
// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// const API = `${BACKEND_URL}/api`;

const Home = () => {
  const helloWorldApi = async () => {
    try {
      // Updated to use a relative path to a defined health check endpoint
      const response = await axios.get(`/api/health`); 
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting /api/health`);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return <BusinessNameGenerator />;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
