export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { srn, password } = req.body;

  if (!srn || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  try {
    const response = await fetch(
      "https://pesu-auth.onrender.com/authenticate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: srn,
          password,
          profile: true
        })
      }
    );

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(401).json({
      status: false,
      message: "Authentication failed"+(err.message ? ": " + err.message : "")
    });
  }
}
