import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { AddArticle, ArticlePage, HomePage, AllNews } from './pages';
import About from './pages/About';
import VerifiedPage from './pages/VerifiedPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-navy flex flex-col">
        <Toaster position="top-right" />
        <Header />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<AddArticle />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/all-news" element={<AllNews />} />
            <Route path="/latest" element={<AllNews />} />
            <Route path="/verified" element={<VerifiedPage />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;