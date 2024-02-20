import React from 'react';
import UsersAdmin from '../../components/UsersAdmin/UsersAdmin';
import PointsItemsAdmin from '../../components/PointsItemsAdmin/PointsItemsAdmin';
import RedeemableItemsAdmin from '../../components/RedeemableItemsAdmin/RedeemableItemsAdmin';



const Admin = () => {
  return (
    <div className="admin-container">
      <h1>Panel de Administración</h1>
      <UsersAdmin />
      <PointsItemsAdmin />
      <RedeemableItemsAdmin />
    </div>
  );
};

export default Admin;
