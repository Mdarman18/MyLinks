import { userUrl } from "../api/axios";

export const loadContent = async () => {
  try {
    const res = await userUrl.get("/get");
    return res.data.user;
  } catch (err) {
    console.log(err);
  }
};
export const addData = async (from) => {
  try {
    const res = await userUrl.post("/add", from);
    return res.data.user;
  } catch (error) {
    console.log(error);
  }
};

export const deleteData = async (itemId) => {
  try {
    const res = await userUrl.delete(`/delete/${itemId}`);

    return res.data.user;
  } catch (error) {
    console.log(error);
  }
};

export const handleisPinned = async (itemId) => {
  try {
    const res = await userUrl.post(`/isPinned/${itemId}`);

    return res.data.user;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdate = async (itemId, from) => {
  try {
    const res = await userUrl.put(`/update/${itemId}`, from);
    console.log(res.data);
    return res.data.user;
  } catch (error) {
    console.log(error);
  }
};
