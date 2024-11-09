import React, { useEffect } from 'react';
import { useRootStore } from '../../store/RootStore';
import ListItemsMain from '../elements/ListItemsMain';
import { Package } from '@geist-ui/icons';

const RootList: React.FC = () => {
  const { roots, loadRoots } = useRootStore();

  useEffect(() => {
    loadRoots();
  }, []);

  const rootItems = roots.map(root => ({
    id: root.id.id.String,
    icon: <Package size={20} color='#fff'/>,
    label: root.name,
  }));

  return (
    <ListItemsMain 
      items={rootItems}
      onItemSelect={(id) => console.log('Selected root:', id)}
    />
  );
};

export default RootList;