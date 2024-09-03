import './main.css'
import { render } from 'solid-js/web'
import { AppContextProvider } from './app/AppContext'

import App from './app/App'

render(() => {
    return (
        <AppContextProvider>
            <App />
        </AppContextProvider>
    )
}, document.getElementById('root') as HTMLElement)
