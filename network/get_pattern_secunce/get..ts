import axios from "axios";

export default async function getePatternSecqunce(name, callback) {
  try {
    const response = await axios.get(
      `${window.location.protocol}//${window.location.host}/api/getPatternSecqunce/get?name=${name}`
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
