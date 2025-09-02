import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";

import Home from "./pages/Home/Home.jsx";
import Listings from "./pages/Listings/Listings.jsx";
import ListingDetails from "./pages/ListingDetails/ListingDetails.jsx";
import Documents from "./pages/Documents/Documents.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import About from "./pages/About/About.jsx";

import StudentDashboard from "./pages/Dashboard/StudentDashboard/StudentDashboard.jsx";

// Agent console + children
import Agent from "./pages/Agent/Agent.jsx";
import Overview from "./pages/Agent/Overview/Overview.jsx";
import ListingsIndex from "./pages/Agent/Listings/ListingsIndex.jsx";
import ListingForm from "./pages/Agent/Listings/New/ListingForm.jsx";
import Applications from "./pages/Agent/Applications/Applications.jsx";
import Messages from "./pages/Agent/Messages/Messages.jsx";
import Payouts from "./pages/Agent/Payouts/Payouts.jsx";
import Settings from "./pages/Agent/Settings/Settings.jsx";

import "./index.css";
import AppDetail from "./pages/Agent/Applications/AppDetail/AppDetail.jsx";

export default function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetails />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboards */}
          <Route path="/dashboard">
            <Route path="student" element={<StudentDashboard />} />
            <Route path="agent" element={<Agent />}>
              {/* Agent nested routes render inside <Outlet /> in Agent.jsx */}
              <Route index element={<Overview />} />
              <Route path="overview" element={<Overview />} />
              <Route path="listings">
                <Route index element={<ListingsIndex />} />
                <Route path="new" element={<ListingForm mode="create" />} />
                <Route path=":id/edit" element={<ListingForm mode="edit" />} />
              </Route>
              <Route path="applications" element={<Applications />} />
              <Route
                path="/dashboard/agent/applications/:appId"
                element={<AppDetail />}
              />

              <Route path="messages" element={<Messages />} />
              <Route path="payouts" element={<Payouts />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
