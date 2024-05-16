import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaExchangeAlt } from "react-icons/fa";
import "./Currency.css";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [currencies, setCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://api.exchangerate-api.com/v4/latest/USD")
      .then((response) => {
        setCurrencies([...Object.keys(response.data.rates)]);
        setExchangeRate(response.data.rates[toCurrency]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching exchange rates", error);
        setIsLoading(false);
      });
  }, [toCurrency]);

  const convertCurrency = () => {
    setIsLoading(true);
    axios
      .get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
      .then((response) => {
        setExchangeRate(response.data.rates[toCurrency]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching exchange rates", error);
        setIsLoading(false);
      });
  };

  const handleAmountChange = (e) => setAmount(e.target.value);
  const handleFromCurrencyChange = (e) => setFromCurrency(e.target.value);
  const handleToCurrencyChange = (e) => setToCurrency(e.target.value);

  return (
    <div className="currency-converter">
      <div className="input-group">
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          disabled={isLoading}
        />
        <select
          value={fromCurrency}
          onChange={handleFromCurrencyChange}
          disabled={isLoading}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div className="icon-group">
        <FaExchangeAlt onClick={convertCurrency} size={30} />
      </div>
      <div className="input-group">
        <input
          type="text"
          value={isLoading ? "..." : (amount * exchangeRate).toFixed(2)}
          disabled
        />
        <select
          value={toCurrency}
          onChange={handleToCurrencyChange}
          disabled={isLoading}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CurrencyConverter;
