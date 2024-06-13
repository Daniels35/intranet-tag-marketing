import React from 'react';
import './Tools.css';

const tools = [
    "Generador de códigos QR",
    "Chatbot parrillas redes",
    "Chatbot pauta",
    "Chatbot blogs",
    "Cotización Automatica"
];

const Tools = () => {
  return (
    <div className="tools-container">
      <h2>Herramientas</h2>
      <ul className="tools-list">
        {tools.map((tool, index) => (
          <li key={index} className="tool-item">
            {tool} <span className="coming-soon">Coming Soon</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tools;
