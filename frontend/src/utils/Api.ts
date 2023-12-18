import { API_URL } from "../constants";

export function deleteGroup(groupId: number) {
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
