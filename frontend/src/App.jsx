
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; import Footer from './components/Footer';
import Home from './pages/Home'; import Properties from './pages/Properties'; import PropertyDetails from './pages/PropertyDetails'; import About from './pages/About'; import Contact from './pages/Contact'; import Auth from './pages/Auth'; import Dashboard from './pages/Dashboard';
export default function App(){return <div className="min-h-screen overflow-hidden bg-estate-950 text-white"><Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/properties" element={<Properties/>}/><Route path="/properties/:slug" element={<PropertyDetails/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="/auth" element={<Auth/>}/><Route path="/dashboard" element={<Dashboard/>}/></Routes><Footer/></div>}
