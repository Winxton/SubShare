import { API_URL } from "../constants";
import { Group } from "../models/Group";
import { Subscription } from "../models/Subscription";

export function deleteGroup(groupId: string) {
  // Send a DELETE request to your API to delete the group
  return fetch(`${API_URL}/groups/${groupId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response;
    })
    .catch((error) => {
      console.error("Error deleting group:", error);
    });
}

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
          data.subscription.billing_date
        ),
        data.friends,
        data.id
      );
    });
}

export function getAcceptedGroups(requestOptions: any) {
  return fetch(`${API_URL}/groups?accepted=true`, requestOptions)
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
            groupData.subscription.billing_date
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
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse the response body as JSON
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
export function settleUp(
  friendId: string,
  amount: number,
  accessToken: string
) {
  const data = amount;
  const requestOptions = {
    method: "PUT", // HTTP request method
    headers: {
      "Content-Type": "application/json", // Set the content type to JSON
      access_token: accessToken,
    },
    body: JSON.stringify(data), // Convert the data object to a JSON string
  };
  return fetch(`${API_URL}/friends/${friendId}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse the response body as JSON
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
