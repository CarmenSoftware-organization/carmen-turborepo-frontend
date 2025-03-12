import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CertificateForm from '../form/CertificateForm';
interface Props {
    isEdit: boolean
}

export interface CertificationProps {
    id: string
    name: string
    issuer: string
    validUntil: string
    status: 'active' | 'expired' | 'pending'
}

const data: CertificationProps[] = [
    {
        id: 'cert1',
        name: 'ISO 9001',
        status: 'active',
        issuer: 'ISO',
        validUntil: '2025-12-31'
    }
]

const CertificationsSection: React.FC<Props> = ({ isEdit }) => {
    const [certifications, setCertifications] = useState<CertificationProps[]>(data);

    const handleSuccess = (updatedUnit: CertificationProps) => {
        setCertifications((prev) => {
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
                <h1 className='text-base font-bold'>Certification</h1>
                {isEdit && (
                    <CertificateForm mode="add" onSuccess={handleSuccess} />
                )}
            </div>
            <Table>
                <TableHeader>
                    <TableRow className='text-xs'>
                        <TableHead>Name</TableHead>
                        <TableHead>Issuer</TableHead>
                        <TableHead>Valid Until</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {certifications.map((cert) => (
                        <TableRow key={cert.id} className='text-xs'>
                            <TableCell className="font-medium">{cert.name}</TableCell>
                            <TableCell>{cert.issuer}</TableCell>
                            <TableCell>{new Date(cert.validUntil).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Badge
                                >
                                    {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {isEdit && (
                                    <div className="flex">
                                        <CertificateForm mode="edit"
                                            defaultValues={cert}
                                            onSuccess={handleSuccess} />

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

export default CertificationsSection