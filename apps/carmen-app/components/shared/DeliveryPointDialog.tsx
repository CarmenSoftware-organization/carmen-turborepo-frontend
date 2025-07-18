"use client";

import { formType } from "@/dtos/form.dto";
import { useTranslations } from "next-intl";
import {
    DeliveryPointCreateDto,
    DeliveryPointUpdateDto,
    DeliveryPointGetDto,
    deliveryPointCreateSchema,
    deliveryPointUpdateSchema
} from "@/dtos/delivery-point.dto";
import GenericFormDialog, { FieldConfig } from "./GenericFormDialog";
import { FORM_FIELD_TYPE } from "@/constants/enum";

interface DeliveryPointDialogProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly mode: formType;
    readonly deliveryPoint?: DeliveryPointGetDto;
    readonly onSubmit: (data: DeliveryPointCreateDto | DeliveryPointUpdateDto) => void;
    readonly isLoading?: boolean;
};

export default function DeliveryPointDialog({
    open,
    onOpenChange,
    mode,
    deliveryPoint,
    onSubmit,
    isLoading = false
}: DeliveryPointDialogProps) {
    const tCommon = useTranslations('Common');
    const tDeliveryPoint = useTranslations('DeliveryPoint');

    const defaultValues = {
        name: '',
        is_active: true,
    };

    const schema = mode === formType.EDIT ? deliveryPointUpdateSchema : deliveryPointCreateSchema;

    const fields: FieldConfig<DeliveryPointCreateDto | DeliveryPointUpdateDto>[] = [
        {
            name: 'name',
            label: tCommon("name"),
            type: FORM_FIELD_TYPE.TEXT,
        },
        {
            name: 'is_active',
            label: tCommon("status"),
            type: FORM_FIELD_TYPE.CHECKBOX,
        }
    ];

    return (
        <GenericFormDialog
            open={open}
            onOpenChange={onOpenChange}
            mode={mode}
            data={deliveryPoint}
            onSubmit={onSubmit}
            isLoading={isLoading}
            schema={schema}
            defaultValues={defaultValues}
            fields={fields}
            title={{
                add: tDeliveryPoint("add_delivery_point"),
                edit: tDeliveryPoint("edit_delivery_point")
            }}
            description={{
                add: tDeliveryPoint("add_delivery_point_description"),
                edit: tDeliveryPoint("edit_delivery_point_description")
            }}
            buttons={{
                cancel: tCommon('cancel'),
                add: tCommon('save'),
                save: tCommon('edit')
            }}
        />
    );
}