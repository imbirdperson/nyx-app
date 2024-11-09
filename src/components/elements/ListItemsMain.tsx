import {ReactNode, useState, useRef, useEffect} from "react";

type ListItemProps = {
    id: string;
    icon: ReactNode;
    label: string;
    onClick?: () => void;
    tooltipText?: string;
}

type ListItemsMainProps = {
    items: ListItemProps[];
    onItemSelect?: (id: string) => void;
}

const ListItemsMain: React.FC<ListItemsMainProps> = ({items, onItemSelect}) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleItemClick = (id: string) => {
        setSelectedId(id);
        onItemSelect?.(id);
    };

    return (
        <div className="list-items-main-wrapper">
            {items.map((item) => (
            <button
                key={item.id}
                className={`list-item-button ${selectedId === item.id ? 'selected' : ''}`}
                onClick={() => handleItemClick(item.id)}
            >
                <span className="item-icon">{item.icon}</span>
                <span className="item-label">{item.label}</span>
            </button>
        ))}
        </div>
    );
};

export default ListItemsMain;

