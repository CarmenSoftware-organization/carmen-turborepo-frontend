"use client";

import React from 'react'
import StockCard from './StockCard';
import StockLevel from './StockLevel';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import StockTable from './StockTable';

const StockReplenishmentDashboard = () => {
    return (
        <div className="p-6 space-y-4">
            <StockCard />
            <StockLevel />
            <Alert className="bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertDescription>
                    8 items are below minimum stock levels and require immediate attention
                </AlertDescription>
            </Alert>
            <StockTable />
        </div>
    )
}

export default StockReplenishmentDashboard