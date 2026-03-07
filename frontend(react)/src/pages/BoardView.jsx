import React, { useState, useEffect, useRef } from 'react';
import Modal from '../components/Modal';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import strapiService from '../services/strapi';

const BoardView = ({ board, onBack }) => {
  const [boardData, setBoardData] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: null });

  const [editingBoardTitle, setEditingBoardTitle] = useState(false);
  const [boardTitleInput, setBoardTitleInput] = useState('');
  const cancelBoardEdit = useRef(false);

  const [editingListId, setEditingListId] = useState(null);
  const [listTitleInput, setListTitleInput] = useState('');
  const cancelListEdit = useRef(false);

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [currentListId, setCurrentListId] = useState(null);
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [cardDueDate, setCardDueDate] = useState('');
  const [cardPendingLabels, setCardPendingLabels] = useState([]);
  const [newCardLabelName, setNewCardLabelName] = useState('');
  const [newCardLabelColor, setNewCardLabelColor] = useState('#2D3436');

  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [editCard, setEditCard] = useState(null);
  const [editCardTitle, setEditCardTitle] = useState('');
  const [editCardDescription, setEditCardDescription] = useState('');
  const [editCardDueDate, setEditCardDueDate] = useState('');
  const [editCardLabels, setEditCardLabels] = useState([]);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#2D3436');

  const [draggedCard, setDraggedCard] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const dragHadMovement = useRef(false);

  const [draggedList, setDraggedList] = useState(null);
  const [listDropTarget, setListDropTarget] = useState(null);

  useEffect(() => {
    if (board) fetchBoard();
  }, [board]);

  const fetchBoard = async () => {
    try {
      setLoading(true);
      const data = await strapiService.getBoard(board.id);
      setBoardData(data);
      setLists(data.lists || []);
    } catch (err) {
      setNotification({ message: 'Erreur lors du chargement du tableau', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const showConfirm = (message, onConfirm) => {
    setConfirmModal({ isOpen: true, message, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmModal({ isOpen: false, message: '', onConfirm: null });
  };

  const startEditBoardTitle = () => {
    cancelBoardEdit.current = false;
    setBoardTitleInput(boardData?.title || '');
    setEditingBoardTitle(true);
  };

  const saveBoardTitle = async () => {
    if (cancelBoardEdit.current) { cancelBoardEdit.current = false; return; }
    setEditingBoardTitle(false);
    if (!boardTitleInput.trim() || boardTitleInput === boardData?.title) return;
    try {
      await strapiService.updateBoard(board.id, boardTitleInput);
      fetchBoard();
    } catch (err) {
      setNotification({ message: 'Erreur lors du renommage du tableau', type: 'error' });
    }
  };

  const handleBoardTitleKeyDown = (e) => {
    if (e.key === 'Enter') e.target.blur();
    if (e.key === 'Escape') { cancelBoardEdit.current = true; setEditingBoardTitle(false); }
  };

  const startEditListTitle = (list) => {
    cancelListEdit.current = false;
    setListTitleInput(list.title);
    setEditingListId(list.id);
  };

  const saveListTitle = async (listId) => {
    if (cancelListEdit.current) { cancelListEdit.current = false; setEditingListId(null); return; }
    setEditingListId(null);
    const list = lists.find(l => l.id === listId);
    if (!listTitleInput.trim() || listTitleInput === list?.title) return;
    try {
      await strapiService.updateList(listId, listTitleInput);
      fetchBoard();
    } catch (err) {
      setNotification({ message: 'Erreur lors du renommage de la liste', type: 'error' });
    }
  };

  const handleListTitleKeyDown = (e) => {
    if (e.key === 'Enter') e.target.blur();
    if (e.key === 'Escape') { cancelListEdit.current = true; setEditingListId(null); }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    try {
      const maxOrder = lists.length > 0 ? Math.max(...lists.map(l => l.order)) : -1;
      await strapiService.createList(board.id, newListTitle, maxOrder + 1);
      setNewListTitle('');
      setIsListModalOpen(false);
      fetchBoard();
      setNotification({ message: 'Liste créée', type: 'success' });
    } catch (err) {
      setNotification({ message: 'Erreur lors de la création de la liste', type: 'error' });
    }
  };

  const handleDeleteList = (e, listId) => {
    e.stopPropagation();
    showConfirm('Supprimer cette liste et toutes ses cartes ?', async () => {
      try {
        await strapiService.deleteList(listId);
        fetchBoard();
        setNotification({ message: 'Liste supprimée', type: 'success' });
      } catch (err) {
        setNotification({ message: 'Erreur lors de la suppression de la liste', type: 'error' });
      }
    });
  };

  const handleDeleteAllLists = () => {
    if (lists.length === 0) return;
    showConfirm(`Supprimer les ${lists.length} liste(s) et toutes leurs cartes ?`, async () => {
      const previousLists = lists;
      setLists([]);
      try {
        await Promise.all(lists.map(l => strapiService.deleteList(l.id)));
        setNotification({ message: 'Toutes les listes supprimées', type: 'success' });
      } catch (err) {
        setLists(previousLists);
        setNotification({ message: 'Erreur lors de la suppression', type: 'error' });
      }
    });
  };

  const openAddCard = (listId) => {
    setCurrentListId(listId);
    setCardTitle('');
    setCardDescription('');
    setCardDueDate('');
    setCardPendingLabels([]);
    setNewCardLabelName('');
    setNewCardLabelColor('#2D3436');
    setIsCardModalOpen(true);
  };

  const handleAddNewCardLabel = () => {
    if (!newCardLabelName.trim()) return;
    setCardPendingLabels([...cardPendingLabels, { name: newCardLabelName.trim(), color: newCardLabelColor }]);
    setNewCardLabelName('');
    setNewCardLabelColor('#2D3436');
  };

  const handleRemoveNewCardLabel = (index) => {
    setCardPendingLabels(cardPendingLabels.filter((_, i) => i !== index));
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!cardTitle.trim()) return;
    try {
      const currentList = lists.find(l => l.id === currentListId);
      const maxOrder = currentList && currentList.cards.length > 0
        ? Math.max(...currentList.cards.map(c => c.order)) : -1;

      const createdLabels = await Promise.all(
        cardPendingLabels.map(l => strapiService.createLabel(l.name, l.color))
      );
      await strapiService.createCard(
        currentListId, cardTitle, cardDescription, maxOrder + 1,
        cardDueDate || null, createdLabels.map(l => l.id)
      );

      setIsCardModalOpen(false);
      fetchBoard();
      setNotification({ message: 'Carte créée', type: 'success' });
    } catch (err) {
      setNotification({ message: 'Erreur lors de la création de la carte', type: 'error' });
    }
  };

  const openEditCard = (card) => {
    if (dragHadMovement.current) return;
    setEditCard(card);
    setEditCardTitle(card.title);
    setEditCardDescription(card.description || '');
    setEditCardDueDate(card.dueDate ? card.dueDate.split('T')[0] : '');
    setEditCardLabels(card.labels || []);
    setNewLabelName('');
    setNewLabelColor('#2D3436');
    setIsEditCardModalOpen(true);
  };

  const handleAddLabel = async () => {
    if (!newLabelName.trim()) return;
    try {
      const label = await strapiService.createLabel(newLabelName.trim(), newLabelColor);
      setEditCardLabels([...editCardLabels, label]);
      setNewLabelName('');
      setNewLabelColor('#2D3436');
    } catch (err) {
      setNotification({ message: 'Erreur lors de la création du label', type: 'error' });
    }
  };

  const handleRemoveLabel = (labelId) => {
    setEditCardLabels(editCardLabels.filter(l => l.id !== labelId));
  };

  const handleUpdateCard = async (e) => {
    e.preventDefault();
    if (!editCardTitle.trim() || !editCard) return;
    try {
      await strapiService.updateCard(editCard.id, {
        title: editCardTitle,
        description: editCardDescription,
        dueDate: editCardDueDate || null,
        labels: editCardLabels.map(l => l.id),
      });
      setIsEditCardModalOpen(false);
      setEditCard(null);
      fetchBoard();
      setNotification({ message: 'Carte mise à jour', type: 'success' });
    } catch (err) {
      setNotification({ message: 'Erreur lors de la mise à jour de la carte', type: 'error' });
    }
  };

  const handleDeleteCard = () => {
    if (!editCard) return;
    setIsEditCardModalOpen(false);
    const cardToDelete = editCard;
    setEditCard(null);
    showConfirm('Supprimer cette carte définitivement ?', async () => {
      try {
        await strapiService.deleteCard(cardToDelete.id);
        fetchBoard();
        setNotification({ message: 'Carte supprimée', type: 'success' });
      } catch (err) {
        setNotification({ message: 'Erreur lors de la suppression de la carte', type: 'error' });
      }
    });
  };

  const handleDeleteCardDirect = (card) => {
    showConfirm('Supprimer cette carte définitivement ?', async () => {
      try {
        await strapiService.deleteCard(card.id);
        fetchBoard();
        setNotification({ message: 'Carte supprimée', type: 'success' });
      } catch (err) {
        setNotification({ message: 'Erreur lors de la suppression de la carte', type: 'error' });
      }
    });
  };

  const handleDragStart = (e, card, listId) => {
    dragHadMovement.current = false;
    setDraggedCard({ card, fromListId: listId });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `card-${card.id}`);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDropTarget(null);
    setTimeout(() => { dragHadMovement.current = false; }, 100);
  };

  const handleColumnDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleCardDragOver = (e, targetCard, listId) => {
    if (draggedList) return;
    e.preventDefault();
    e.stopPropagation();
    dragHadMovement.current = true;
    if (!draggedCard || draggedCard.card.id === targetCard.id) { setDropTarget(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const position = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
    setDropTarget({ listId, cardId: targetCard.id, position });
  };

  const handleDrop = async (e, toListId) => {
    e.preventDefault();
    if (draggedList) return;
    if (!draggedCard) return;

    const { card, fromListId } = draggedCard;
    const previousLists = lists;

    if (fromListId === toListId) {
      const list = lists.find(l => l.id === toListId);
      if (!list) return;
      const cards = [...list.cards];
      const fromIndex = cards.findIndex(c => c.id === card.id);
      if (fromIndex === -1) return;

      let toIndex;
      if (dropTarget?.listId === toListId && dropTarget?.cardId) {
        const targetIndex = cards.findIndex(c => c.id === dropTarget.cardId);
        if (targetIndex === -1) { setDraggedCard(null); setDropTarget(null); return; }
        toIndex = dropTarget.position === 'before' ? targetIndex : targetIndex + 1;
        if (fromIndex < toIndex) toIndex--;
      } else {
        toIndex = cards.length - 1;
      }

      if (fromIndex === toIndex) { setDraggedCard(null); setDropTarget(null); return; }

      const [moved] = cards.splice(fromIndex, 1);
      cards.splice(toIndex, 0, moved);

      setLists(lists.map(l =>
        l.id !== toListId ? l : { ...l, cards: cards.map((c, i) => ({ ...c, order: i })) }
      ));
      setDraggedCard(null);
      setDropTarget(null);

      try {
        await Promise.all(cards.map((c, i) => strapiService.updateCard(c.id, { order: i })));
      } catch (err) {
        setLists(previousLists);
        setNotification({ message: 'Erreur lors du déplacement, position restaurée', type: 'error' });
      }
    } else {
      const targetList = lists.find(l => l.id === toListId);
      const targetCards = targetList?.cards || [];
      let newOrder;
      if (dropTarget?.listId === toListId && dropTarget?.cardId) {
        const targetIndex = targetCards.findIndex(c => c.id === dropTarget.cardId);
        newOrder = dropTarget.position === 'before' ? targetIndex : targetIndex + 1;
      } else {
        newOrder = targetCards.length > 0 ? Math.max(...targetCards.map(c => c.order)) + 1 : 0;
      }

      const movedCard = { ...card, order: newOrder };
      setLists(lists.map(l => {
        if (l.id === fromListId) return { ...l, cards: l.cards.filter(c => c.id !== card.id) };
        if (l.id === toListId) return { ...l, cards: [...l.cards, movedCard].sort((a, b) => a.order - b.order) };
        return l;
      }));
      setDraggedCard(null);
      setDropTarget(null);

      try {
        if (dropTarget?.listId === toListId && dropTarget?.cardId) {
          await Promise.all(
            targetCards.filter((_, i) => i >= newOrder)
              .map((c, i) => strapiService.updateCard(c.id, { order: newOrder + i + 1 }))
          );
        }
        await strapiService.moveCard(card.id, toListId, newOrder);
        fetchBoard();
      } catch (err) {
        setLists(previousLists);
        setNotification({ message: 'Erreur lors du déplacement, position restaurée', type: 'error' });
      }
    }
  };

  const handleListDragStart = (e, list) => {
    setDraggedList(list);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `list-${list.id}`);
    e.stopPropagation();
  };

  const handleListDragEnd = () => {
    setDraggedList(null);
    setListDropTarget(null);
  };

  const handleListDragOver = (e, targetList) => {
    if (!draggedList) return;
    e.preventDefault();
    e.stopPropagation();
    if (draggedList.id === targetList.id) { setListDropTarget(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const position = e.clientX < rect.left + rect.width / 2 ? 'before' : 'after';
    setListDropTarget({ listId: targetList.id, position });
  };

  const handleListDrop = async (e, targetList) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedList) return;

    const previousLists = lists;
    const fromIndex = lists.findIndex(l => l.id === draggedList.id);
    const toIndex = lists.findIndex(l => l.id === targetList.id);

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
      setDraggedList(null); setListDropTarget(null); return;
    }

    let finalIndex = listDropTarget?.position === 'before' ? toIndex : toIndex + 1;
    if (fromIndex < finalIndex) finalIndex--;

    const newLists = [...lists];
    const [moved] = newLists.splice(fromIndex, 1);
    newLists.splice(finalIndex, 0, moved);

    const reorderedLists = newLists.map((l, i) => ({ ...l, order: i }));
    setLists(reorderedLists);
    setDraggedList(null);
    setListDropTarget(null);

    try {
      await Promise.all(reorderedLists.map((l, i) => strapiService.updateListOrder(l.id, i)));
    } catch (err) {
      setLists(previousLists);
      setNotification({ message: 'Erreur lors du déplacement de la liste, position restaurée', type: 'error' });
    }
  };

  const formatDueDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const isOverdue = (dateStr) => new Date(dateStr) < new Date();

  if (!board) return null;

  return (
    <div className="page">
      <div className="dashboard">
        <div className="board-view">
          <div className="board-header">
            {editingBoardTitle ? (
              <input
                type="text"
                className="edit-title-input board-title-input"
                value={boardTitleInput}
                onChange={(e) => setBoardTitleInput(e.target.value)}
                onBlur={saveBoardTitle}
                onKeyDown={handleBoardTitleKeyDown}
                autoFocus
              />
            ) : (
              <h2 className="editable-title" onClick={startEditBoardTitle} title="Cliquer pour renommer">
                {boardData?.title || board.title}
              </h2>
            )}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="add-board-btn" onClick={() => setIsListModalOpen(true)}>
                + Ajouter une liste
              </button>
              {lists.length > 0 && (
                <button className="delete-btn board-header-delete-btn" onClick={handleDeleteAllLists}>
                  Supprimer toutes les listes
                </button>
              )}
              <button className="back-btn" onClick={onBack}>
                Retour aux tableaux
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading">Chargement du tableau...</div>
          ) : (
            <div className="columns-container">
              {lists.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>
                  <p style={{ fontSize: '1.25rem', color: 'var(--gray)' }}>
                    Ce tableau n'a pas encore de listes. Ajoutez-en une pour commencer !
                  </p>
                </div>
              ) : (
                lists.map((list) => {
                  const isListBeingDragged = draggedList?.id === list.id;
                  const listDropClass = listDropTarget?.listId === list.id
                    ? (listDropTarget.position === 'before' ? ' list-drop-before' : ' list-drop-after')
                    : '';

                  return (
                    <div
                      key={list.id}
                      className={`column${isListBeingDragged ? ' dragging-list' : ''}${listDropClass}`}
                      onDragOver={(e) => draggedList ? handleListDragOver(e, list) : handleColumnDragOver(e)}
                      onDrop={(e) => draggedList ? handleListDrop(e, list) : handleDrop(e, list.id)}
                    >
                      <div className="column-header">
                        <div
                          className="column-drag-handle"
                          draggable
                          onDragStart={(e) => handleListDragStart(e, list)}
                          onDragEnd={handleListDragEnd}
                          title="Déplacer la liste"
                        >
                          ⠿
                        </div>
                        {editingListId === list.id ? (
                          <input
                            type="text"
                            className="edit-title-input list-title-input"
                            value={listTitleInput}
                            onChange={(e) => setListTitleInput(e.target.value)}
                            onBlur={() => saveListTitle(list.id)}
                            onKeyDown={handleListTitleKeyDown}
                            autoFocus
                          />
                        ) : (
                          <h3
                            className="editable-title"
                            onClick={() => startEditListTitle(list)}
                            title="Cliquer pour renommer"
                          >
                            {list.title}
                          </h3>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="card-count">
                            {list.cards?.length || 0}
                          </span>
                          <button
                            className="delete-board-btn"
                            onClick={(e) => handleDeleteList(e, list.id)}
                            title="Supprimer la liste"
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      <div className="cards-list">
                        {list.cards && list.cards.map((card) => {
                          const isDropBefore = dropTarget?.listId === list.id && dropTarget?.cardId === card.id && dropTarget?.position === 'before';
                          const isDropAfter = dropTarget?.listId === list.id && dropTarget?.cardId === card.id && dropTarget?.position === 'after';
                          const isBeingDragged = draggedCard?.card.id === card.id;
                          return (
                            <div key={card.id} className="card-wrapper">
                              {isDropBefore && <div className="drop-indicator" />}
                                <div
                                className={`card${isBeingDragged ? ' dragging' : ''}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, card, list.id)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => handleCardDragOver(e, card, list.id)}
                                onClick={() => openEditCard(card)}
                              >
                                {card.labels && card.labels.length > 0 && (
                                  <div className="card-labels">
                                    {card.labels.map(label => (
                                      <span key={label.id} className="card-label" style={{ background: label.color }}>
                                        {label.name}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <h4>{card.title}</h4>
                                {card.description && <p>{card.description}</p>}
                                {card.dueDate && (
                                  <span className={`card-due-date${isOverdue(card.dueDate) ? ' overdue' : ''}`}>
                                    {formatDueDate(card.dueDate)}
                                  </span>
                                )}
                                <div className="card-actions" onMouseDown={(e) => e.stopPropagation()}>
                                  <button
                                    className="card-action-btn"
                                    onClick={(e) => { e.stopPropagation(); openEditCard(card); }}
                                  >
                                    Modifier
                                  </button>
                                  <button
                                    className="card-action-btn card-action-delete"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteCardDirect(card); }}
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              </div>
                              {isDropAfter && <div className="drop-indicator" />}
                            </div>
                          );
                        })}
                      </div>

                      <button className="add-card-btn" onClick={() => openAddCard(list.id)}>
                        + Ajouter une carte
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
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
          <button className="auth-btn" onClick={() => { confirmModal.onConfirm?.(); closeConfirm(); }}>
            Confirmer
          </button>
          <button className="delete-btn" onClick={closeConfirm}>Annuler</button>
        </div>
      </Modal>

      <Modal isOpen={isListModalOpen} onClose={() => setIsListModalOpen(false)} title="Nouvelle liste">
        <form onSubmit={handleCreateList}>
          <div className="form-group">
            <label htmlFor="listTitle">Nom de la liste</label>
            <input type="text" id="listTitle" value={newListTitle} onChange={(e) => setNewListTitle(e.target.value)} required />
          </div>
          <button type="submit" className="auth-btn">Créer</button>
        </form>
      </Modal>

      <Modal isOpen={isCardModalOpen} onClose={() => setIsCardModalOpen(false)} title="Nouvelle carte">
        <form onSubmit={handleCreateCard}>
          <div className="form-group">
            <label htmlFor="cardTitle">Titre</label>
            <input type="text" id="cardTitle" value={cardTitle} onChange={(e) => setCardTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="cardDescription">Description</label>
            <textarea id="cardDescription" value={cardDescription} onChange={(e) => setCardDescription(e.target.value)} rows={3} />
          </div>
          <div className="form-group">
            <label htmlFor="cardDueDate">Date d'échéance</label>
            <input type="date" id="cardDueDate" value={cardDueDate} onChange={(e) => setCardDueDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Labels</label>
            <div className="label-list">
              {cardPendingLabels.map((label, index) => (
                <span key={index} className="card-label" style={{ background: label.color }}>
                  {label.name}
                  <button type="button" onClick={() => handleRemoveNewCardLabel(index)}>×</button>
                </span>
              ))}
            </div>
            <div className="label-add">
              <input type="text" placeholder="Nom du label" value={newCardLabelName} onChange={(e) => setNewCardLabelName(e.target.value)} />
              <input type="color" value={newCardLabelColor} onChange={(e) => setNewCardLabelColor(e.target.value)} />
              <button type="button" onClick={handleAddNewCardLabel}>Ajouter</button>
            </div>
          </div>
          <button type="submit" className="auth-btn">Créer</button>
        </form>
      </Modal>

      <Modal
        isOpen={isEditCardModalOpen}
        onClose={() => { setIsEditCardModalOpen(false); setEditCard(null); }}
        title="Modifier la carte"
      >
        <form onSubmit={handleUpdateCard}>
          <div className="form-group">
            <label htmlFor="editCardTitle">Titre</label>
            <input type="text" id="editCardTitle" value={editCardTitle} onChange={(e) => setEditCardTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="editCardDescription">Description</label>
            <textarea id="editCardDescription" value={editCardDescription} onChange={(e) => setEditCardDescription(e.target.value)} rows={4} />
          </div>
          <div className="form-group">
            <label htmlFor="editCardDueDate">Date d'échéance</label>
            <input type="date" id="editCardDueDate" value={editCardDueDate} onChange={(e) => setEditCardDueDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Labels</label>
            <div className="label-list">
              {editCardLabels.map(label => (
                <span key={label.id} className="card-label" style={{ background: label.color }}>
                  {label.name}
                  <button type="button" onClick={() => handleRemoveLabel(label.id)}>×</button>
                </span>
              ))}
            </div>
            <div className="label-add">
              <input type="text" placeholder="Nom du label" value={newLabelName} onChange={(e) => setNewLabelName(e.target.value)} />
              <input type="color" value={newLabelColor} onChange={(e) => setNewLabelColor(e.target.value)} />
              <button type="button" onClick={handleAddLabel}>Ajouter</button>
            </div>
          </div>
          <div className="modal-actions">
            <button type="submit" className="auth-btn">Enregistrer</button>
            <button type="button" className="delete-btn" onClick={handleDeleteCard}>Supprimer</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BoardView;
