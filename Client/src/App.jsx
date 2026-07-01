import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout & Home Components
import Navbar from './Components/layout/Navbar';
import Hero from './Components/home/Hero';
import About from './Components/home/About';
import Skills from './Components/home/Skills';
import TimelineSection from './Components/home/TimelineSection';
import Featured from './Components/home/Featured';
import Testimonials from './Components/home/Testimonials';
import ValueSection from './Components/home/ValueSection';
import Contact from './Components/home/Contact';
import Footer from './Components/layout/Footer';

import './styles/global.css';

// Admin Components
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';

const Home = () => (
  <main className="bg-[#fafafa] dark:bg-black min-h-screen transition-colors duration-500">
    <Navbar />
    <Hero />
    <section id="about"><About /></section>
    <TimelineSection />
    <section id="skills"><Skills /></section>
    <section id="featured"><Featured /></section>
    <Testimonials />
    <section id="values"><ValueSection /></section>
    <section id="contact"><Contact /></section>
    <Footer />
  </main>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={
          <div className="h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-widest text-xs">
            [ Error: 404_Path_Not_Found ]
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;