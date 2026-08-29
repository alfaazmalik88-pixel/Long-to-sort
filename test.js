fetch("http://localhost:3000/api/render", { method: "POST" })
  .then(async res => {
    console.log("Status:", res.status, "ok:", res.ok);
    try {
      const data = await res.json();
      console.log(data);
    } catch (e) {
      console.log("Error:", e.message);
    }
  });
