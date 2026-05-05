import { useState } from "react";

function App() {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    const data = {
      userId: Number(userId),
      amount: Number(amount),
      location: location,
    };

    try {
      const res = await fetch("http://localhost:8085/transaction",  {
        method: "POST",
        headers: {
          "Content-Type": "application/json",


          
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setResult(result.status);
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Fraud Detection System</h2>

      <input
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <br /><br />

      <button onClick={handleSubmit}>Check Fraud</button>

      <h3>Result: {result}</h3>
    </div>
  );
}

export default App;