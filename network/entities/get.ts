import axios from "axios";

export default async function geteEntitiesList( route = "entities",item,callback) {
  if (!item) {
    return
  }
  try {
    const response = await axios.get(
      `${window.location.protocol}//${window.location.host}/api/${route.toLocaleLowerCase()}/entitiesget?item=${item}`
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
