import React, { useState, useEffect } from 'react';
import './TransactionHistory.css'

const API_URL = process.env.REACT_APP_API_URL;

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${API_URL}/transactionHistory`);
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error al obtener las transacciones:', error);
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Bogota',
      timeZoneName: 'short'
    };
    return new Date(dateString).toLocaleDateString('es-CO', options);
  };

  const filteredTransactions = transactions.filter(transaction => {
    return (
      (filterType === 'all' || transaction.transactionType === filterType) &&
      (filterName === '' || transaction.initiatorName.toLowerCase().includes(filterName.toLowerCase()) || transaction.recipientName.toLowerCase().includes(filterName.toLowerCase()))
    );
  });

  return (
    <div className='transaction-history-points'>
      <h2>Historial de Transacciones</h2>
      
      <div className='transaction-history-points-filter-contain'>
        <label>
          Filtrar por tipo:
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Todos</option>
            <option value="grant">Agregados</option>
            <option value="revoke">Revocados</option>
          </select>
        </label>
        <label>
          Filtrar por nombre:
          <input
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Buscar por nombre"
          />
        </label>
      </div>

      <ul>
        {filteredTransactions.map(transaction => (
          <li key={transaction.id} className={`transaction-item ${transaction.transactionType}`}>
            <div>
              <strong>Fecha:</strong> {formatDate(transaction.date)}
            </div>
            <div>
              {transaction.initiatorName} le 
              {transaction.transactionType === 'grant' ? ' agregó ' : ' revocó '}
              {transaction.points} puntos a {transaction.recipientName}.
            </div>
            <div>
              <strong>Descripción:</strong> {transaction.description}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistoryPage;
