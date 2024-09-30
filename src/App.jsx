import WeatherApp from './Components/WeatherApp'
import ErrorBoundary from './Components/ErrorBoundary'

const App = () => {
    return (
        <ErrorBoundary>
            <WeatherApp />
        </ErrorBoundary>

    )

}

export default App;
