import React from 'react'

interface Transaction {
    qtyRequired: number;
    qtyApproved: number;
    qtyIssued?: number;
    total: number;
}

interface Props {
    transactions: Transaction[];
}

const TransactionSummary: React.FC<Props> = ({ transactions }) => {
    const totalQuantity = transactions.reduce((sum, item: Transaction) => sum + item.qtyRequired, 0);
    const totalApproved = transactions.reduce((sum, item) => sum + item.qtyApproved, 0);
    const totalIssued = transactions.reduce((sum, item) => sum + (item.qtyIssued || 0), 0);
    const totalAmount = transactions.reduce((sum, item) => sum + item.total, 0);
    return (
        <div className="border-t">
            <div className="p-6">
                <h3 className="text-xs font-semibold mb-4">Transaction Summary</h3>
                <div className="grid grid-cols-5 gap-8">
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Total Items</div>
                        <div className="text-lg font-medium">{transactions.length}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Total Quantity</div>
                        <div className="text-lg font-medium">
                            {totalQuantity}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Total Approved</div>
                        <div className="text-lg font-medium">
                            {totalApproved}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Total Issued</div>
                        <div className="text-lg font-medium">
                            {totalIssued}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Total Amount</div>
                        <div className="text-lg font-mono">
                            {new Intl.NumberFormat('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }).format(totalAmount)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionSummary;