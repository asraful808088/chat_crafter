import axios from "axios";

export default async function updateEntitiesItem(info, callback) {
  try {
    const data = { ...info };

    const response = await axios.put(
      `${window.location.protocol}//${window.location.host}/api/addEntities/updateEntitiesItem`,
      data
    );
    if (callback) {
      callback(response.data);
    }
  } catch (error) {
    if (callback) {
      callback(null, error.response);
    }
  }
}
