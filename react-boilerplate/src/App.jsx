import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("BRL");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  // Mapeamento das bandeiras
  const flagMap = {
    USD: "https://flagcdn.com/w40/us.png",
    BRL: "https://flagcdn.com/w40/br.png",
    EUR: "https://flagcdn.com/w40/eu.png",
    GBP: "https://flagcdn.com/w40/gb.png",
    JPY: "https://flagcdn.com/w40/jp.png",
    UYU: "https://flagcdn.com/w40/uy.png",
  };

  useEffect(() => {
    setCurrencies(["USD", "BRL", "EUR", "GBP", "JPY", "UYU"]);
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetchExchangeRate();
    }
  }, [fromCurrency, toCurrency]);

  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/cambio/converter`, {
        params: { de: fromCurrency, para: toCurrency, valor: 1 },
      });

      if (response.data && response.data.taxaCambio) {
        setExchangeRate(response.data.taxaCambio);
      } else {
        console.error("Resposta da API não contém taxa de câmbio válida:", response.data);
        setExchangeRate(null);
      }
    } catch (error) {
      console.error("Erro ao obter taxa de câmbio:", error);
      setExchangeRate(null);
    }
  };

  // Formata a entrada do valor como moeda (1.000,00)
  const formatCurrency = (value) => {
    if (!value) return "";
    let numericValue = value.replace(/\D/g, ""); // Remove tudo que não for número
    let formattedValue = (Number(numericValue) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    });
    return formattedValue;
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value;
    setAmount(formatCurrency(rawValue));
  };

  const handleConvert = async () => {
    try {
      const numericAmount = parseFloat(amount.replace(/\./g, "").replace(",", "."));

      const response = await axios.get(`http://localhost:8080/cambio/converter`, {
        params: { de: fromCurrency, para: toCurrency, valor: numericAmount },
      });

      setConvertedAmount(response.data.valorConvertido.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      }));
    } catch (error) {
      console.error("Erro ao converter moeda:", error);
    }
  };

  return (
    <div className="container">
      <h1>Conversor de Moeda</h1>
      <p className="exchange-rate">
        {exchangeRate
          ? `1 ${fromCurrency} equivale a ${parseFloat(exchangeRate).toFixed(2)} ${toCurrency}`
          : "Carregando taxa..."}
      </p>

      <div className="quadroUm">
        <div className="currency-box">
          {/* Seleção de moeda de origem */}
          <img src={flagMap[fromCurrency]} alt={fromCurrency} className="flag" />
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>

          {/* Seleção de moeda de destino */}
          <img src={flagMap[toCurrency]} alt={toCurrency} className="flag" />
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        {/* Campo de entrada com máscara de moeda */}
        <div className="form-group">
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Valor Original: "
          />
        </div>
      </div>

      <button onClick={handleConvert}>Converter</button>

      {/* Exibição do valor convertido com formatação correta */}
      <div className="form-group-valor">
        <input
          type="text"
          value={`Valor Convertido: ${convertedAmount}`}
          readOnly
        />
      </div>
    </div>
  );
}

export default App;
