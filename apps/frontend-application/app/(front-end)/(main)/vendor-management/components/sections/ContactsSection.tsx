import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash } from 'lucide-react';
import ContactForm from '../form/ContactForm';

interface Props {
    isEdit: boolean
}

export interface ContactProps {
    id: string;
    name: string;
    position: string;
    phone: string;
    email: string;
    department: string;
    isPrimary: boolean;
}
const data: ContactProps[] = [
    {
        id: 'cont1',
        name: 'John Doe',
        email: 'john.doe@acme.com',
        phone: '+1-555-0123',
        position: 'Manager',
        department: 'Procurement',
        isPrimary: true
    }
]
const ContactsSection: React.FC<Props> = ({ isEdit }) => {
    const [contacts, setContacts] = useState<ContactProps[]>(data);
    const handleSuccess = (updatedUnit: ContactProps) => {
        setContacts((prev) => {
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
                <h1 className='text-base font-bold'>Contact</h1>
                {isEdit && (
                    <ContactForm mode="add" onSuccess={handleSuccess} />
                )}
            </div>
            <Table>
                <TableHeader>
                    <TableRow className='text-xs'>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Primary</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contacts.map((contact: ContactProps) => (
                        <TableRow key={contact.id} className='text-xs'>
                            <TableCell>{contact.name}</TableCell>
                            <TableCell>{contact.position}</TableCell>
                            <TableCell>{contact.phone}</TableCell>
                            <TableCell>{contact.email}</TableCell>
                            <TableCell>{contact.department}</TableCell>
                            <TableCell>{contact.isPrimary ? 'Yes' : 'No'}</TableCell>
                            <TableCell>
                                {isEdit && (
                                    <div className="flex">
                                        <ContactForm mode="edit"
                                            defaultValues={contact}
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

export default ContactsSection