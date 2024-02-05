import { API_URL } from "../constants";
import { Friend } from "../models/Friend";
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
          data.subscription.cost
        ),
        data.friends,
        data.id
      );
    });
}

export function acceptInvite(groupId: number, accessToken: string) {
  return fetch(`${API_URL}/accept_invite/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
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
      console.error("Error deleting group:", error);
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
            groupData.subscription.cost
          ),
          groupData.friends,
          groupData.id
        );
      });
    });
}

export function getInvitedGroups(requestOptions: any) {
  return fetch(`${API_URL}/groups`, requestOptions)
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
            groupData.subscription.cost
          ),
          groupData.friends,
          groupData.id
        );
      });
    });
}
export function sendGroupInviteEmail(
  senderName: Friend,
  recipient: string[],
  groupName: string
): Promise<any> {
  return fetch(`${API_URL}/send-invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ senderName, recipient, groupName }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
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
