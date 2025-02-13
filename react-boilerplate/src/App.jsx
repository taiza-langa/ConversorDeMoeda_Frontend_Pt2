import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("BRL");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");

  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    setCurrencies(["USD", "BRL", "EUR", "GBP", "JPY", "UYU"]);
  }, []);

  const handleConvert = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/cambio/converter`, {
        params: { de: fromCurrency, para: toCurrency, valor: amount },
      });

      // Atualizando os valores retornados pelo backend
      setConvertedAmount(response.data.valorConvertido.toFixed(2));
      setExchangeRate(response.data.taxaCambio.toFixed(4));
    } catch (error) {
      console.error("Erro ao converter moeda:", error);
    }
  };

  return (
    <div className="container">
      <h1>Conversor de Moeda</h1>
      
      <div className="form-group">
        <label htmlFor="fromCurrency">Moeda de Origem:</label>
        <select id="fromCurrency" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
          {currencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="toCurrency">Moeda de Destino:</label>
        <select id="toCurrency" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
          {currencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="amount">Valor Original:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
        />
      </div>

      <button onClick={handleConvert}>Converter</button>

      <div className="form-group">
        <label htmlFor="convertedAmount">Valor Convertido:</label>
        <input type="text" id="convertedAmount" value={convertedAmount} readOnly />
      </div>

      <div className="form-group">
        <label htmlFor="exchangeRate">Taxa de Câmbio:</label>
        <input type="text" id="exchangeRate" value={exchangeRate} readOnly />
      </div>
    </div>
  );
}

export default App;
