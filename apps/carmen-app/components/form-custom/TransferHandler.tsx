import { UseFormReturn } from "react-hook-form";

interface TransferHandlerProps {
    readonly form: UseFormReturn<any>;
    readonly fieldName: string;
    readonly setSelected: (keys: (string | number)[]) => void;
}

export default function transferHandler({
    form,
    fieldName,
    setSelected,
}: TransferHandlerProps) {
    return (
        targetKeys: (string | number)[],
        direction: "left" | "right",
        moveKeys: (string | number)[]
    ) => {
        setSelected(targetKeys);

        const currentItems = form.getValues(fieldName) || { add: [], remove: [] };

        const addMap = new Map(currentItems.add.map((item: any) => [item.id, item]));
        const removeMap = new Map(currentItems.remove.map((item: any) => [item.id, item]));

        const processItemMove = (keyStr: string) => {
            const inAddArray = addMap.has(keyStr);
            const inRemoveArray = removeMap.has(keyStr);

            if (direction === "right" && inRemoveArray) {
                removeMap.delete(keyStr);
                return;
            }

            if (direction === "right" && !inAddArray) {
                addMap.set(keyStr, { id: keyStr });
                return;
            }

            if (direction === "left" && inAddArray) {
                addMap.delete(keyStr);
                return;
            }

            if (direction === "left" && !inRemoveArray) {
                removeMap.set(keyStr, { id: keyStr });
            }
        };


        moveKeys.forEach((key) => processItemMove(String(key)));

        const newAddArray = Array.from(addMap.values());
        const newRemoveArray = Array.from(removeMap.values());

        form.setValue(`${fieldName}.add`, newAddArray);
        form.setValue(`${fieldName}.remove`, newRemoveArray);
    };
}
