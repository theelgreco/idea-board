import type { MenuProps } from "./types";
import MenuItem from "./MenuItem";

export default function Menu({ items, selectedItem, isAdding, onSelect, onCreate, onEdit, onDelete }: MenuProps) {
    return (
        <div className="flex flex-col gap-2">
            {items?.map((item) => {
                return (
                    <MenuItem
                        key={item.value}
                        item={item}
                        selected={selectedItem === item.value}
                        onClick={() => onSelect(item)}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                );
            })}
            {isAdding && <MenuItem isAdding={true} onCreate={onCreate} />}
        </div>
    );
}
