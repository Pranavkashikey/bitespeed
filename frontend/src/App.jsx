import { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    const res = await axios.post("http://localhost:3000/identify", {
      email,
      phoneNumber: phone
    });
    setResult(res.data);
  };

  return (
    <div>
      <h1>Bitespeed Identify</h1>

      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />

      <input
        placeholder="Phone"
        onChange={e => setPhone(e.target.value)}
      />

      <button onClick={handleSubmit}>Identify</button>

      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}

export default App;