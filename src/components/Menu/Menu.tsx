import type { MenuProps } from "./types";
import MenuItem from "./MenuItem";

export default function Menu({ items, selectedItem, isAdding, onSelect, onCreate, onEdit, onDelete }: MenuProps) {
    return (
        <div className="flex flex-col gap-2">
            {items?.map((el) => {
                return (
                    <MenuItem
                        key={el.value}
                        item={el}
                        selected={selectedItem === el.value}
                        onClick={() => onSelect(el)}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                );
            })}
            {isAdding && <MenuItem isAdding={true} onCreate={onCreate} />}
        </div>
    );
}
