import axios from "axios";

export default async function updatePatternItem(info, callback) {
  try {
    const data = { ...info };

    const response = await axios.put(
      `${window.location.protocol}//${window.location.host}/api/updatePatternItem/update`,
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
