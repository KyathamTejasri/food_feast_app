import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Cart from './pages/Cart.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderDetails from './pages/OrderDetails.jsx';
import OrderHistory from './pages/OrderHistory.jsx';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              <Route path="/orders/history" element={<OrderHistory />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
