import axios from "axios";

export default async function deleteSelecteItem({name,of},callback) {
  try {
    const response = await axios.delete(
      `${window.location.protocol}//${window.location.host}/api/deleteSelector/delete?name=${name}&of=${of}`
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
