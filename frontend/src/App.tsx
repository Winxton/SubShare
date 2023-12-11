import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { createClient, Session } from "@supabase/supabase-js";

import Login from "./components/Login";
import GroupList from "./components/GroupList";
import ViewGroup from "./components/ViewGroup";

const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;

if (!supabaseAnonKey) {
  throw new Error("REACT_APP_SUPABASE_ANON_KEY is not set");
}
if (!supabaseUrl) {
  throw new Error("REACT_APP_SUPABASE_URL is not set");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (session) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<GroupList session={session} />} />
          <Route
            path="/view-group/:groupName"
            element={<ViewGroup session={session} />}
          />
        </Routes>
      </Router>
    );
  } else {
    return <Login />;
  }
}

export default App;
