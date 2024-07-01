import React from 'react';
import { Link } from 'react-router-dom';
import tools from './toolsList';
import './Tools.css';

const Tools = () => {
  return (
    <div className="tools-container">
      <h2>Herramientas</h2>
      <ul className="tools-list">
        {tools.map((tool, index) => (
          <li key={index} className="tool-item">
            <Link to={`/tools/${tool.component}`}>
              {tool.name} {tool.component ? '' : <span className="coming-soon">Coming Soon</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tools;
