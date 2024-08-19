import React from 'react';

const FormattedDate = ({ date }) => {
  const formatDate = (dateString) => {
    // Divide la cadena de fecha en año, mes y día
    const [year, month, day] = dateString.split('-');
    // Devuelve la fecha en formato dd/mm/aaaa
    return `${day}/${month}/${year}`;
  };

  return <span>{formatDate(date)}</span>;
};

export default FormattedDate;
