import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import AddressForm from '../form/AddressForm';
import { Trash } from 'lucide-react';

enum AddressType {
    MAIN = 'MAIN',
    BILLING = 'BILLING',
    SHIPPING = 'SHIPPING',
    BRANCH = 'BRANCH'
}

export interface AddressProps {
    id: string;
    addressType: "MAIN" | "BILLING" | "SHIPPING" | "BRANCH";
    addressLine: string;
    isPrimary: boolean;
}

const data: AddressProps[] = [
    {
        id: 'addr1',
        addressLine: '123 Main St',
        addressType: AddressType.MAIN,
        isPrimary: true
    },
    {
        id: 'addr2',
        addressLine: '69/107',
        addressType: AddressType.SHIPPING,
        isPrimary: false
    }
]

interface Props {
    isEdit: boolean
}

const AddressesSection: React.FC<Props> = ({ isEdit }) => {
    const [address, setAddress] = useState<AddressProps[]>(data);

    const handleSuccess = (updatedUnit: AddressProps) => {
        setAddress((prev) => {
            const exists = prev.some((u) => u.id === updatedUnit.id);
            if (exists) {
                return prev.map((u) => (u.id === updatedUnit.id ? updatedUnit : u));
            }
            return [...prev, updatedUnit];
        });
    };


    return (
        <>
            <div className='flex justify-between'>
                <h1 className='text-base font-bold'>Address</h1>
                {isEdit && (
                    <AddressForm mode="add" onSuccess={handleSuccess} />
                )}
            </div>
            <Table>
                <TableHeader>
                    <TableRow className='text-xs'>
                        <TableHead>Type</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Primary</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {address.map(address => (
                        <TableRow key={address.id} className='text-xs'>
                            <TableCell>{address.addressType}</TableCell>
                            <TableCell>{address.addressLine}</TableCell>
                            <TableCell>{address.isPrimary ? 'Yes' : 'No'}</TableCell>
                            <TableCell>
                                {isEdit && (
                                    <div className="flex">
                                        <AddressForm
                                            mode="edit"
                                            defaultValues={address}
                                            onSuccess={handleSuccess}
                                        />
                                        <Button variant="ghost" size="sm">
                                            <Trash />
                                        </Button>
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </>

    )
}

export default AddressesSection
