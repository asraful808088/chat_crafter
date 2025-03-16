import axios from "axios";

export default async function getebotStatus(callback) {
  try {
    const response = await axios.get(
      `${window.location.protocol}//${window.location.host}/api/active_bot/get`
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
