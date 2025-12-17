import { useState, useCallback } from 'react';
import type { Card } from '@/features/cards/types';
import type { Stack } from '@/features/stacks/types';
import type { ModalType } from '../types';

/**
 * Hook for managing modal state and editing card/stack state
 */
export function useModalState() {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [viewingCard, setViewingCard] = useState<Card | null>(null);
  const [sharingCard, setSharingCard] = useState<Card | null>(null);
  const [editingStack, setEditingStack] = useState<Stack | null>(null);
  const [deletingStack, setDeletingStack] = useState<Stack | null>(null);
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

  const openEditStack = useCallback((stack: Stack) => {
    setEditingStack(stack);
    setModalType('edit-stack');
  }, []);

  const openDeleteStack = useCallback((stack: Stack) => {
    setDeletingStack(stack);
    setModalType('delete-stack');
  }, []);

  const openViewDetail = useCallback((card: Card) => {
    setViewingCard(card);
    setModalType('view-detail');
  }, []);

  const openShare = useCallback((card: Card) => {
    setSharingCard(card);
    setModalType('share');
  }, []);

  const closeModal = useCallback(() => {
    setModalType(null);
    setEditingCard(null);
    setViewingCard(null);
    setSharingCard(null);
    setEditingStack(null);
    setDeletingStack(null);
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
    viewingCard,
    sharingCard,
    editingStack,
    deletingStack,
    showCreateMenu,
    openCreateCard,
    openCreateStack,
    openEditCard,
    openEditStack,
    openDeleteStack,
    openViewDetail,
    openShare,
    closeModal,
    openCreateMenu,
    closeCreateMenu,
  };
}

