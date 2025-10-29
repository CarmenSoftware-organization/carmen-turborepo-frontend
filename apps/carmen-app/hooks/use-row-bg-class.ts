import { formType } from '@/dtos/form.dto';
import { useCallback } from 'react';

type BaseRow = {
    id?: string;
    isNew: boolean;
};

type RowBgClassOptions = {
    updatedIds?: Set<string>;
    currentMode?: formType;
};
export const useRowBgClass = (options: RowBgClassOptions = {}) => {
    const { updatedIds, currentMode } = options;

    return useCallback(
        (row: BaseRow): string => {
            if (row.isNew) {
                return 'bg-active/30';
            }
            if (
                !row.isNew &&
                row.id &&
                updatedIds &&
                currentMode === formType.EDIT &&
                updatedIds.has(row.id)
            ) {
                return 'bg-amber-100 dark:bg-amber-800';
            }
            return '';
        },
        [updatedIds, currentMode]
    );
};