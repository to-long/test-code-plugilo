import { useState, useCallback } from 'react';
import type { Card, ModalType } from '../types';

/**
 * Hook for managing modal state and editing card state
 */
export function useModalState() {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const openCreateCard = useCallback(() => {
    setModalType('create-card');
  }, []);

  const openCreateStack = useCallback(() => {
    setModalType('create-stack');
  }, []);

  const openEditCard = useCallback((card: Card) => {
    setEditingCard(card);
    setModalType('edit-card');
  }, []);

  const closeModal = useCallback(() => {
    setModalType(null);
    setEditingCard(null);
  }, []);

  const openCreateMenu = useCallback(() => {
    setShowCreateMenu(true);
  }, []);

  const closeCreateMenu = useCallback(() => {
    setShowCreateMenu(false);
  }, []);

  return {
    modalType,
    editingCard,
    showCreateMenu,
    openCreateCard,
    openCreateStack,
    openEditCard,
    closeModal,
    openCreateMenu,
    closeCreateMenu,
  };
}

