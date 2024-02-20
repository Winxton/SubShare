import { API_URL } from "../constants";
import { Friend } from "../models/Friend";
import { Group } from "../models/Group";
import { Subscription } from "../models/Subscription";

export function disbandGroup(groupId: string, accessToken: string) {
  // Send a DELETE request to your API to delete the group
  return fetch(`${API_URL}/groups/${groupId}`, {
    method: "PUT",
    headers: {
      access_token: accessToken,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response;
    })
    .catch((error) => {
      console.error("Error disbanding group:", error);
    });
}
// get single group to view
export function getGroup(groupId: string, accessToken: string) {
  return fetch(`${API_URL}/groups/${groupId}`, {
    headers: {
      access_token: accessToken,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    })
    .then((data) => {
      return new Group(
        new Subscription(
          data.subscription.name,
          data.subscription.image,
          data.subscription.cost,
          data.subscription.billing_date,
          data.subscription.next_billing_date
        ),
        data.friends,
        data.id
      );
    });
}
// get all groups based on active status
export function getGroups(requestOptions: any, active: boolean) {
  return fetch(`${API_URL}/groups?active=${active}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    })
    .then((data) => {
      return data.map((groupData: any) => {
        return new Group(
          new Subscription(
            groupData.subscription.name,
            groupData.subscription.image,
            groupData.subscription.cost,
            groupData.subscription.billing_date,
            groupData.subscription.next_billing_date
          ),
          groupData.friends,
          groupData.id
        );
      });
    });
}

export function createGroup(group: Group, accessToken: string) {
  // Create an object with the data you want to send in the request body
  const data = {
    subscription: group.subscription,
    friends: group.friends,
  };
  // Create the request configuration object
  const requestOptions = {
    method: "POST", // HTTP request method
    headers: {
      "Content-Type": "application/json", // Set the content type to JSON
      access_token: accessToken,
    },
    body: JSON.stringify(data), // Convert the data object to a JSON string
  };
  // Send the POST request using the fetch function
  return fetch(`${API_URL}/groups`, requestOptions)
    .then((response) => {
      // Check if the response was ok
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Check the content type to decide how to parse the response
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        return response.json(); // If JSON, parse as JSON
      } else {
        return response.text(); // If not, return text to avoid parsing issues
      }
    })
    .then((data) => {
      console.log("Response:", data);
      // Handle the response here (whether it's JSON or text)
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
