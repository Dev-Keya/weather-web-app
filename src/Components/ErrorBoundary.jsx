import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("ErrorBoundary caught an error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return  <div>
            
        <h4 className='error-label'>Oops! Something went wrong.</h4>
        <div className="error-img"></div>
        </div>
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
