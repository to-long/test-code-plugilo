import { useCallback } from 'react';
import { useStackStore } from '../store';

interface StackFormData {
  name: string;
  cover: string;
}

interface UseStackHandlersOptions {
  onSuccess?: () => void;
}

/**
 * Hook for managing stack operations with error handling
 */
export function useStackHandlers(options: UseStackHandlersOptions = {}) {
  const { onSuccess } = options;

  const stacks = useStackStore((state) => state.stacks);
  const activeStackId = useStackStore((state) => state.activeStackId);
  const createStack = useStackStore((state) => state.createStack);
  const setActiveStack = useStackStore((state) => state.setActiveStack);

  const handleCreateStack = useCallback(
    async (data: StackFormData) => {
      try {
        await createStack(data.name, data.cover);
        onSuccess?.();
      } catch (err) {
        console.error('Failed to create stack:', err);
      }
    },
    [createStack, onSuccess],
  );

  const handleStackSelect = useCallback(
    (stackId: string) => {
      setActiveStack(activeStackId === stackId ? null : stackId);
    },
    [activeStackId, setActiveStack],
  );

  const handleCollapse = useCallback(() => {
    setActiveStack(null);
  }, [setActiveStack]);

  return {
    stacks,
    activeStackId,
    handleCreateStack,
    handleStackSelect,
    handleCollapse,
  };
}

export type { StackFormData };

