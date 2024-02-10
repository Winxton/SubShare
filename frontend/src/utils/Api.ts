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
        data.id,
       
        
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
            groupData.subscription.cost,
            groupData.subscription.billing_date
          ),
          groupData.friends,
          groupData.id,
         
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
            groupData.subscription.cost,
            groupData.subscription.billing_date
          ),
          groupData.friends,
          groupData.id,
          
        );
      });
    });
}
