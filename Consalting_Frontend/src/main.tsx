import React from "react";
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter} from "react-router-dom";
import { store } from "./store";
import { Provider } from "react-redux";

// Делаем store доступным в window
if (process.env.NODE_ENV === "development") {
    (window as any).store = store;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
    <Provider store={store}>
        <BrowserRouter basename="/Consalting_Frontend">
                <App />
        </BrowserRouter>
    </Provider>
    </React.StrictMode>
)