import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { createClient, Session } from "@supabase/supabase-js";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./constants";
import Login from "./components/Login";
import GroupList from "./components/GroupList";
import ViewGroup from "./components/ViewGroup";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
