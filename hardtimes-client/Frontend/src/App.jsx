import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Account from './Pages/Account';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Categories from './Pages/Categories';
import ProtectedRoute from './Utils/ProtectedRoute';
import CategoryPage from './Pages/CategoryPage';
import AddPrompt from './Pages/AddPrompt';
import About from './Pages/About'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/category/:categoryName" element={<CategoryPage />} />
      <Route
        path="/add-prompt"
        element={
          <ProtectedRoute>
            <AddPrompt />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
