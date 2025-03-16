import axios from "axios";

export default async function getGeneratedItems(info, callback) {
  try {
    const data = { ...info };

    const response = await axios.post(
      `${window.location.protocol}//${window.location.host}/api/getGenerated/getGenerarted`,
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
