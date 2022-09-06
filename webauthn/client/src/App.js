import { Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Reauth } from './components/Reauth';

function App() {
  return (
     <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reauth" element={<Reauth />} />
        <Route path="/home" element={<Home />} />
      </Routes>
  );
}

export default App;
