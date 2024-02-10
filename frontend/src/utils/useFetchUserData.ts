// useFetchUserData.js

import { useState, useEffect } from 'react';
import { API_URL } from "../constants";
interface UserData {
  user: {
    email: string;
    subscription_balance: number
  };
}

const useFetchUserData = (session) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  useEffect(() => {
    if (!session) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            access_token: session.access_token,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("There was a problem fetching user data:", error);
      }
    };

    fetchUserData();
  }, [session]);

  return userData;
};

export default useFetchUserData;
