import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import React, { useEffect, useState } from 'react';
import { fetchUnitList } from '@/services/unit';
interface Props {
    unitName: string | undefined;
    isEditing: boolean;
    token: string;
    tenantId: string;
    handleChange: (path: string, value: string | number) => void;
}

interface Unit {
    id: string;
    name: string;
}

const PrimaryUnitField: React.FC<Props> = ({
    unitName,
    isEditing,
    token,
    tenantId,
    handleChange,
}) => {
    const [unitList, setUnitList] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<Unit | undefined>(undefined);

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await fetchUnitList(token, tenantId);
            if (result?.data) {
                setUnitList(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching unit list:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnitChange = (unitId: string) => {
        const selected = unitList.find((unit) => unit.id === unitId);
        if (selected) {
            setSelectedUnit(selected);
            handleChange('data.product_primary_unit', selected.id);
        }
    };

    useEffect(() => {
        if (isEditing) {
            fetchData();
        }
    }, [isEditing]);

    return (
        <>
            {loading ? (
                <Skeleton className="h-4 w-[200px]" />
            ) : isEditing ? (
                <Select
                    disabled={loading}
                    value={selectedUnit?.id}
                    onValueChange={(unitId) => handleUnitChange(unitId)}
                    aria-label="Select unit"
                >
                    <SelectTrigger className="text-xs">
                        <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                        {unitList.map((unit) => (
                            <SelectItem key={unit.id} value={unit.id}>
                                {unit.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ) : (
                <p>{selectedUnit?.name || unitName}</p>
            )}
        </>
    );
};

export default PrimaryUnitField;