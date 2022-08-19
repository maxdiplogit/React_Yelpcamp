import React from 'react';
import ReactDOM from 'react-dom/client';

// React Helpers
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

// store
import store from './store/index';

// Components
import App from './App';

import './index.css';


let persistor = persistStore(store);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<Provider store={ store }>
			<PersistGate loading={ null } persistor={ persistor }>
				<App />
			</PersistGate>
		</Provider>
	</BrowserRouter>
);