import React from "react";

const ErrorDisplay = ({ type, message, retry = null }) => {
    const errorTypes = {
        network: 'Network error. Please check your connection',
        api: 'Error communication with the Pokemon API',
        notFound: 'Pokemon not found',
        unknown: 'An unexpected error occurred.'
    };

    return (
        <div className="error-container">
            <h3>Error: {errorTypes[type] || type}</h3>
            <p>{message}</p>
            {retry && (
                <button onClick={retry} className="retry-button">
                    Try Again
                </button>
            )}
        </div>
    )
}

export default ErrorDisplay;