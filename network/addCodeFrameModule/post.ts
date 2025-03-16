import axios from "axios";

export default async function addCodeFrameModule(info, callback) {
  try {
    const data = { ...info };

    const response = await axios.post(
      `${window.location.protocol}//${window.location.host}/api/addCodeFrameModule/post`,
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
