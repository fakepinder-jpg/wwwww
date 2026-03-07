import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import strapiService from '../services/strapi';

const Dashboard = ({ onNavigate, onOpenBoard }) => {
  const [boards, setBoards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: null });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBoardId, setEditBoardId] = useState(null);
  const [editBoardName, setEditBoardName] = useState('');

  useEffect(() => {
    loadBoards();
  }, []);

  const showConfirm = (message, onConfirm) => {
    setConfirmModal({ isOpen: true, message, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmModal({ isOpen: false, message: '', onConfirm: null });
  };

  const loadBoards = async () => {
    try {
      setLoading(true);
      const data = await strapiService.getBoards();
      setBoards(data);
    } catch (err) {
      setNotification({ message: 'Erreur lors du chargement des tableaux', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!boardName.trim()) return;
    try {
      const newBoard = await strapiService.createBoard(boardName);
      setBoards([...boards, newBoard]);
      setIsModalOpen(false);
      setBoardName('');
      setNotification({ message: 'Tableau créé avec succès', type: 'success' });
    } catch (err) {
      setNotification({ message: 'Erreur lors de la création du tableau', type: 'error' });
    }
  };

  const handleDeleteAllBoards = () => {
    if (boards.length === 0) return;
    showConfirm(`Supprimer les ${boards.length} tableau(x) et tout leur contenu ?`, async () => {
      const previousBoards = boards;
      setBoards([]);
      try {
        await Promise.all(boards.map(b => strapiService.deleteBoard(b.id)));
        setNotification({ message: 'Tous les tableaux supprimés', type: 'success' });
      } catch (err) {
        setBoards(previousBoards);
        setNotification({ message: 'Erreur lors de la suppression', type: 'error' });
      }
    });
  };

  const handleDeleteBoard = (e, boardId) => {
    e.stopPropagation();
    showConfirm('Supprimer ce tableau et tout son contenu ?', async () => {
      try {
        await strapiService.deleteBoard(boardId);
        setBoards(boards.filter(b => b.id !== boardId));
        setNotification({ message: 'Tableau supprimé', type: 'success' });
      } catch (err) {
        setNotification({ message: 'Erreur lors de la suppression', type: 'error' });
      }
    });
  };

  const openEditBoard = (e, board) => {
    e.stopPropagation();
    setEditBoardId(board.id);
    setEditBoardName(board.title);
    setIsEditModalOpen(true);
  };

  const handleEditBoard = async (e) => {
    e.preventDefault();
    if (!editBoardName.trim()) return;
    try {
      await strapiService.updateBoard(editBoardId, editBoardName);
      setBoards(boards.map(b => b.id === editBoardId ? { ...b, title: editBoardName } : b));
      setIsEditModalOpen(false);
      setEditBoardId(null);
      setEditBoardName('');
      setNotification({ message: 'Tableau renommé', type: 'success' });
    } catch (err) {
      setNotification({ message: 'Erreur lors de la modification', type: 'error' });
    }
  };

  return (
    <div className="page">
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Mes tableaux</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="add-board-btn" onClick={() => setIsModalOpen(true)}>
              + Nouveau tableau
            </button>
            {boards.length > 0 && (
              <button className="board-action-btn" onClick={handleDeleteAllBoards}>
                Tout supprimer
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading">Chargement des tableaux...</div>
        ) : (
          <div className="boards-grid">
            {boards.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                <p style={{ fontSize: '1.25rem', color: 'var(--gray)' }}>
                  Aucun tableau pour le moment. Creez-en un pour commencer !
                </p>
              </div>
            ) : (
              boards.map((board) => (
                <div key={board.id} className="board-card" onClick={() => onOpenBoard(board)}>
                  <h3>{board.title}</h3>
                  <div className="board-card-actions">
                    <button className="board-action-btn" onClick={(e) => openEditBoard(e, board)}>
                      Modifier
                    </button>
                    <button className="board-action-btn" onClick={(e) => handleDeleteBoard(e, board.id)}>
                      Supprimer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Footer />

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: 'success' })}
      />

      <Modal isOpen={confirmModal.isOpen} onClose={closeConfirm} title="Confirmer">
        <p style={{ marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.6' }}>
          {confirmModal.message}
        </p>
        <div className="modal-actions">
          <button
            className="auth-btn"
            onClick={() => { confirmModal.onConfirm?.(); closeConfirm(); }}
          >
            Confirmer
          </button>
          <button className="delete-btn" onClick={closeConfirm}>
            Annuler
          </button>
        </div>
      </Modal>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau tableau">
        <form onSubmit={handleCreateBoard}>
          <div className="form-group">
            <label htmlFor="boardName">Nom du tableau</label>
            <input
              type="text"
              id="boardName"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-btn">Créer</button>
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditBoardId(null); }}
        title="Modifier le tableau"
      >
        <form onSubmit={handleEditBoard}>
          <div className="form-group">
            <label htmlFor="editBoardName">Nom du tableau</label>
            <input
              type="text"
              id="editBoardName"
              value={editBoardName}
              onChange={(e) => setEditBoardName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-btn">Enregistrer</button>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
