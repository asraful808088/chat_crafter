import axios from "axios";

export default async function createBot(name, callback) {
  try {
    const data = { name };

    const response = await axios.post(
      `${window.location.protocol}//${window.location.host}/api/bot/create`,
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
