import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import ViewGroup from './components/ViewGroup';
import Main from './components/Main';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/view-group/:groupName" element={<ViewGroup />} />
      </Routes>
    </Router>
  );
}

export default App;
