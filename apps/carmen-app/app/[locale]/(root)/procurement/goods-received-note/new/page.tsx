"use client";

import { Stepper } from "@/components/ui-custom/Stepper";
import { useState, useCallback, useEffect } from "react";
import SelectVendor from "../components/stepper/SelectVendor";
import SelectPo from "../components/stepper/SelectPo";
import SelectItemAndLocation from "../components/stepper/SelectItemAndLocation";
import { InitGrnDto, mockItem, mockPo, mockVendor, NewItemDto, NewPoDto, NewVendorDto } from "../type.dto";

export default function GoodsReceivedNoteNewPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [grnData, setGrnData] = useState<InitGrnDto>({});
    const [selectedVendors, setSelectedVendors] = useState<NewVendorDto[]>([]);
    const [selectedVendor, setSelectedVendor] = useState<NewVendorDto | undefined>(undefined);
    const [selectedPo, setSelectedPo] = useState<NewPoDto[]>([]);
    const [selectedItems, setSelectedItems] = useState<NewItemDto[]>([]);
    const [items, setItems] = useState<NewItemDto[]>(mockItem);

    useEffect(() => {
        // Initialize items from mockItem when component mounts
        setItems(mockItem);
    }, []);

    const handleVendorSelect = (vendor: NewVendorDto) => {
        setSelectedVendor(vendor);
        setSelectedVendors([vendor]);
        setGrnData(prev => ({ ...prev, vendors: [vendor] }));
    }

    const handlePoSelect = (po: NewPoDto[]) => {
        setSelectedPo(po);
        setGrnData(prev => ({ ...prev, po }));
    }

    const handleItemSelect = (items: NewItemDto[]) => {
        setSelectedItems(items);
        setGrnData(prev => ({ ...prev, items }));
    }

    const handleQtyChange = useCallback((itemId: string, value: string) => {
        const numValue = Number(value) || 0;

        // Update items
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, received_qty: numValue } : item
            )
        );

        // Update selected items if the changed item is selected
        const isItemSelected = selectedItems.some(i => i.id === itemId);
        if (isItemSelected) {
            const updatedSelectedItems = selectedItems.map(item =>
                item.id === itemId ? { ...item, received_qty: numValue } : item
            );
            handleItemSelect(updatedSelectedItems);
        }
    }, [selectedItems]);

    const isStepValid = () => {
        switch (currentStep) {
            case 0:
                return selectedVendors.length > 0;
            case 1:
                return selectedPo.length > 0;
            case 2:
                return selectedItems.length > 0;
            default:
                return false;
        }
    };

    const handleStepChange = (step: number) => {
        if (step < currentStep || isStepValid()) {
            setCurrentStep(step);
        }
    };

    const handleNextStep = () => {
        if (currentStep < grnSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const renderStepComponent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <SelectVendor
                        key={`vendor-step-${JSON.stringify(selectedVendors)}`}
                        vendors={mockVendor}
                        selectedVendor={selectedVendor}
                        onVendorSelect={handleVendorSelect}
                        onNext={handleNextStep}
                    />
                );
            case 1:
                return (
                    <SelectPo
                        key={`po-step-${JSON.stringify(selectedPo)}`}
                        po={mockPo}
                        selectedPo={selectedPo}
                        onPoSelect={handlePoSelect}
                        selectedVendor={selectedVendor?.name ?? ""}
                    />
                );
            case 2:
                return (
                    <SelectItemAndLocation
                        key={`item-step-${JSON.stringify(selectedItems)}`}
                        items={items}
                        selectedItems={selectedItems}
                        onItemSelect={handleItemSelect}
                        onQtyChange={handleQtyChange}
                        vendorName={selectedVendor?.name ?? ""}
                        poNo={selectedPo.map(po => po.no).join(", ")}
                    />
                );
            default:
                return null;
        }
    };

    const grnSteps = [
        {
            title: "Vendor",
            stepNumber: 1,
        },
        {
            title: "Purchase Order",
            stepNumber: 2,
        },
        {
            title: "Items and Locations",
            stepNumber: 3,
        }
    ]

    return (
        <div className="container mx-auto p-4">
            <Stepper
                steps={grnSteps}
                currentStep={currentStep}
                onStepChange={handleStepChange}
                isStepValid={isStepValid()}
            />
            <div className="w-full max-w-3xl mx-auto mt-8">
                {renderStepComponent()}
            </div>
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Current GRN Data:</h3>
                <pre className="bg-gray-100 p-4 rounded-lg">
                    {JSON.stringify(grnData, null, 2)}
                </pre>
            </div>
        </div>
    )
}
