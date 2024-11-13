import { invoke } from "@tauri-apps/api/core";
import { create } from "zustand";


interface NodeId {
    tb: string;
    id: {
        String: string;
    };
}

interface RootId {
    tb: string;
    id: {
        String: string;
    };
}

export interface Node {
    id: NodeId;
    name: string;
    node_type: string;
    path: string;
    root_id: RootId;
    segments: [];
}

interface NewNode {
    name: string;
    path: string;
    root_id: string;
    node_type:string;
}

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

interface NodeStore {
    nodes: Node[];
    loading: boolean;
    error: string | null;
    setNodes: (nodes: Node[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    createNode: (node: NewNode) => Promise<void>;
    loadNodes: (root_id: string) => Promise<void>;
}

export const useNodeStore = create<NodeStore>((set, get) => ({
    nodes: [],
    loading: false,
    error: null,
    setNodes: (nodes) => set({ nodes }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    createNode: async (newNode) => {
        try {
            set({ loading: true, error: null });
            const response = await invoke<ApiResponse<Node>>('create_node', {
              request: newNode
            });
      
            if (response.error) {
              const match = response.error.match(/InvalidData\("(.+)"\)/);
              throw new Error(match ? match[1] : response.error);
            }
            
            // Refresh nodes after creation
            // await get().loadNodes();
          } catch (err) {
            throw err;
          } finally {
            set({ loading: false });
          }
     
    },
    loadNodes: async (root_id: string) => {
        try {
            set({ loading: true, error: null });
            const response = await invoke<ApiResponse<Node[]>>('get_nodes', {
                rootId: root_id
            });
            if (response.error) {
                set({error: response.error})
                return;
            }
            if (response.data) {
                // console.log('Nodes:', response.data);
                set({ nodes: Array.isArray(response.data) ? response.data : [response.data] });
            }
        } catch (err) {
            console.error('Error loading nodes:', err);
            set({ error: err instanceof Error ? err.message : 'Failed to load nodes' });
        } finally {
            set({ loading: false });
        }
    }
}));