import axios from "axios";

export default async function patternBuild(info, callback) {
  try {
    const data = { ...info };

    const response = await axios.post(
      `${window.location.protocol}//${window.location.host}/api/patternBuild/build`,
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
