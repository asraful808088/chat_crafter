import axios from "axios";

export default async function addalternative(info, callback) {
  try {
    const data = { ...info };

    const response = await axios.post(
      `${window.location.protocol}//${window.location.host}/api/alternative/add_alternative`,
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
