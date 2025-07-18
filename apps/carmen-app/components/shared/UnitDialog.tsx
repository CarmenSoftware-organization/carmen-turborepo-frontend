"use client";

import { unitSchema, UnitDto, CreateUnitDto } from "@/dtos/unit.dto";
import { formType } from "@/dtos/form.dto";
import { useTranslations } from "next-intl";
import GenericFormDialog, { FieldConfig } from "./GenericFormDialog";
import { FORM_FIELD_TYPE } from "@/constants/enum";

interface UnitDialogProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly mode: formType;
    readonly unit?: UnitDto;
    readonly onSubmit: (data: CreateUnitDto) => void;
    readonly isLoading?: boolean;
}

export default function UnitDialog({
    open,
    onOpenChange,
    mode,
    unit,
    onSubmit,
    isLoading = false
}: UnitDialogProps) {
    const tCommon = useTranslations('Common');
    const tUnit = useTranslations('Unit');

    const defaultValues = {
        name: '',
        description: '',
        is_active: true,
    };

    const fields: FieldConfig<CreateUnitDto>[] = [
        {
            name: 'name',
            label: tCommon('name'),
            type: FORM_FIELD_TYPE.TEXT,
        },
        {
            name: 'description',
            label: tCommon('description'),
            type: FORM_FIELD_TYPE.TEXTAREA,
        },
        {
            name: 'is_active',
            label: tCommon('status'),
            type: FORM_FIELD_TYPE.CHECKBOX,
        }
    ];

    return (
        <GenericFormDialog
            open={open}
            onOpenChange={onOpenChange}
            mode={mode}
            data={unit}
            onSubmit={onSubmit}
            isLoading={isLoading}
            schema={unitSchema}
            defaultValues={defaultValues}
            fields={fields}
            title={{
                add: tCommon('add'),
                edit: tCommon('edit')
            }}
            description={{
                add: tUnit('add_description'),
                edit: tUnit('edit_description')
            }}
        />
    );
}