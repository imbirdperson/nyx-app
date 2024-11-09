import React, { useEffect } from 'react';
import { useRootStore } from '../../store/RootStore';
import ListItemsMain from '../elements/ListItemsMain';
import { Package } from '@geist-ui/icons';
import { invoke } from '@tauri-apps/api/core';
import { Root } from '../../store/RootStore';

const RootList: React.FC = () => {
  const { roots, loadRoots, setSelectedRootId } = useRootStore();

  useEffect(() => {
    loadRoots();
  }, []);

  const handleRootSelect = async (id: string) => {
    try {
      const segments = await invoke('get_segments', { rootId: id });
      console.log(id);
      setSelectedRootId(id);
    } catch (error) {
      console.error('Failed to load segments:', error);
    }
  };

  const rootItems = roots.map(root => ({
    id: root.id.id.String,
    icon: <Package size={20} color='#fff'/>,
    label: root.name,
  }));

  return (
    <ListItemsMain 
      items={rootItems}
      onItemSelect={handleRootSelect}
    />
  );
};

export default RootList;