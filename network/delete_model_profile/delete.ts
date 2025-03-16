import axios from "axios";

export default async function deleteModelProfile(info, callback) {
  try {
    const data = { ...info };

    const response = await axios.delete(
      `${window.location.protocol}//${window.location.host}/api/delete_model_profile/delete?delete=${info.name}`,
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
