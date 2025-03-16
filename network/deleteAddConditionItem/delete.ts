import axios from "axios";

export default async function deleteAddConditionItem(info, callback) {
  try {
    const data = { ...info };

    const response = await axios.delete(
      `${window.location.protocol}//${window.location.host}/api/deleteAddConditionItem/delete?name=${data.name}&type=${data.type}&id=${data.id}`,
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
