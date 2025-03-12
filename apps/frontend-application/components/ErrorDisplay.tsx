import React from 'react'

interface Props {
    errMessage: string
}
const ErrorDisplay: React.FunctionComponent<Props> = ({ errMessage }) => {
    return (
        <div className="all-center h-96 text-red-500">
            {errMessage}
        </div>
    )
}

export default ErrorDisplay