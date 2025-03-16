import axios from "axios";

export default async function getModelProfile(info, callback) {
  try {
    const response = await axios.get(
      `${window.location.protocol}//${window.location.host}/api/get_training_profile/get`
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
