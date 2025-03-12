import React from 'react'
import { formatLargeNumber } from '../utils'

interface Props {
    title: string
    value: string | number
    subtext: string
    unit: string
}

const MetricCard: React.FC<Props> = ({
    title,
    value,
    subtext,
    unit
}) => {
    return (
        <div className="p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="mt-2 text-3xl font-semibold">
                {typeof value === 'number' ? formatLargeNumber(value) : value}{' '}
                <span className="text-lg font-normal text-gray-500">{unit}</span>
            </p>
            <p className="text-sm text-gray-600">{subtext}</p>
        </div>
    )
}

export default MetricCard