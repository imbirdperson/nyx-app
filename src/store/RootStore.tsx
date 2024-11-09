import { invoke } from "@tauri-apps/api/core";
import { create } from "zustand";

interface RootId {
  tb: string;
  id: {
    String: string;
  };
}

interface Root {
  id: RootId;
  name: string;
  path: string;
  created_at: string;
}

interface NewRoot {
  name: string;
  path: string;
}

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

interface RootStore {
  roots: Root[];
  loading: boolean;
  error: string | null;
  newRoot: NewRoot;
  setRoots: (roots: Root[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setNewRoot: (root: NewRoot) => void;
  loadRoots: () => Promise<void>;
  createRoot: (root: NewRoot) => Promise<void>;
}

export const useRootStore = create<RootStore>((set, get) => ({
  roots: [],
  loading: false,
  error: null,
  newRoot: {
    name: '',
    path: ''
  },
  
  setRoots: (roots) => set({ roots }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setNewRoot: (root) => set({ newRoot: root }),
  
  loadRoots: async () => {
    try {
      set({ loading: true, error: null });
      const response = await invoke<ApiResponse<Root[]>>('get_all_roots');
      
      if (response.error) {
        set({ error: response.error });
        return;
      }

      if (response.data) {
        set({ roots: response.data });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load roots' });
    } finally {
      set({ loading: false });
    }
  },

  createRoot: async (newRoot) => {
    try {
      set({ loading: true, error: null });
      const response = await invoke<ApiResponse<Root>>('create_root', {
        request: newRoot
      });

      if (response.error) {
        set({ error: response.error });
        return;
      }

      // Reload the roots after creation
      await get().loadRoots();
      
      // Reset the form
      set({ 
        newRoot: {
          name: '',
          path: ''
        }
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create root' });
    } finally {
      set({ loading: false });
    }
  }
}));