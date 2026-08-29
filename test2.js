fetch("http://localhost:3000/api/unknown", { method: "POST" })
  .then(async res => {
    console.log("Status:", res.status, "ok:", res.ok);
    console.log("Body:", await res.text());
  });
