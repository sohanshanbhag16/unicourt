import axios from "axios";

export async function pesuLogin(srn, password) {
  const res = await axios.post("/api/pesu-login", {
    srn,
    password
  });

  return res.data;
}
