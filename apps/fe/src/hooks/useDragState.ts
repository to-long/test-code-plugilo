import { useState, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

/**
 * Hook for managing drag-and-drop state for cards
 */
export function useDragState() {
  const [isDraggingToStacks, setIsDraggingToStacks] = useState(false);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [hoveredStackId, setHoveredStackId] = useState<string | null>(null);

  const startDragging = useCallback((cardId: string) => {
    setIsDraggingToStacks(true);
    setDraggingCardId(cardId);
  }, []);

  const stopDragging = useCallback(() => {
    setIsDraggingToStacks(false);
    setDraggingCardId(null);
    setHoveredStackId(null);
  }, []);

  const updateHoveredStack = useCallback((stackId: string | null) => {
    setHoveredStackId(stackId);
  }, []);

  return {
    isDraggingToStacks,
    draggingCardId,
    hoveredStackId,
    startDragging,
    stopDragging,
    updateHoveredStack,
  };
}

/**
 * Helper to find stack ID at a given position from DOM
 */
export function getStackIdAtPosition(position: Position): string | null {
  const elementAtPoint = document.elementFromPoint(position.x, position.y);
  if (!elementAtPoint) return null;

  const stackElement = elementAtPoint.closest('[data-stack-id]');
  if (!stackElement) return null;

  return stackElement.getAttribute('data-stack-id');
}

