import { useState, useEffect } from "react";
import { createClient, Session } from "@supabase/supabase-js";
import Login from "./Login";
import GroupList from "./GroupList";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../constants";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Main() {
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
    return <GroupList session={session} />;
  } else {
    return <Login />;
  }
}
