import React, {useState} from 'react';
import UsersAdmin from '../../components/UsersAdmin/UsersAdmin';
import PointsItemsAdmin from '../../components/PointsItemsAdmin/PointsItemsAdmin';
import RedeemableItemsAdmin from '../../components/RedeemableItemsAdmin/RedeemableItemsAdmin';
import AddPointsToList from '../../components/AddPointsToList/AddPointsToList';

import Modal from '../../components/Modal/Modal';
import './Admin.css'

const Admin = () => {


  const [usersOpen, setUser] = useState(false);
  const [pointsOpen, setPoints] = useState(false);
  const [redeemableItemOpen, setredeemableItem] = useState(false);
  const [addPointsToListOpen, setAddPointsToList] = useState(false);

  const [addPointsModalOpen, setAddPointsModalOpen] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);



  const openAddPoints = (user) => {
    setSelectedUser(user);
    setAddPointsModalOpen(true);
  };

  return (
    <>
    <div className="admin-container">
      <div className='admin-container-users'>
        <AddPointsToList openAddPoints={openAddPoints} />
      </div>

      <div className='admin-container-items-left'>
       <h2 className='title-item-admin' onClick={(e) => { e.stopPropagation(); setPoints(true);}}>Administración de Items de Puntos</h2>
       <h2 className='title-item-admin' onClick={(e) => { e.stopPropagation(); setredeemableItem(true);}}>Administración de Items Canjeables</h2>
      </div>

      {/* Modales */}
      <Modal isVisible={usersOpen} onClose={() => setUser(false)}>
       <UsersAdmin />
      </Modal>

      <Modal isVisible={pointsOpen} onClose={() => setPoints(false)}>
      <PointsItemsAdmin />
      </Modal>

      <Modal isVisible={redeemableItemOpen} onClose={() => setredeemableItem(false)}>
      <RedeemableItemsAdmin />
      </Modal>

      <Modal isVisible={addPointsToListOpen} onClose={() => setAddPointsToList(false)}>
      <AddPointsToList />
      </Modal>
    </div>

      
    </>
  );
};

export default Admin;
