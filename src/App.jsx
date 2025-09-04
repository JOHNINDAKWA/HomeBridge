import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";
import SiteLayout from "./layouts/SiteLayout.jsx";

// Public & app pages (unchanged imports)
import Home from "./pages/Home/Home.jsx";
import Listings from "./pages/Listings/Listings.jsx";
import ListingDetails from "./pages/ListingDetails/ListingDetails.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import About from "./pages/About/About.jsx";
import Blog from "./pages/Blog/Blog.jsx";
import Support from "./pages/Support/Support.jsx";

import Disclaimer from "./pages/Legal/Disclaimer/Disclaimer.jsx";
import PrivacyPolicy from "./pages/Legal/Privacy/PrivacyPolicy.jsx";
import TermsOfUse from "./pages/Legal/Terms/TermsOfUse.jsx";

import BookingFlow from "./pages/Booking/BookingFlow/BookingFlow.jsx";

// Student
import StudentLayout from "./pages/Dashboard/Student/StudentLayout/StudentLayout.jsx";
import StudentBookings from "./pages/Dashboard/Student/Bookings/StudentBooking.jsx";
import BookingDetail from "./pages/Dashboard/Student/BookingDetail/BookingDetail.jsx";
import StudentDocuments from "./pages/Dashboard/Student/Documents/StudentDocuments.jsx";
import StudentProfile from "./pages/Dashboard/Student/Profile/StudentProfile.jsx";

// Agent
import Agent from "./pages/Agent/Agent.jsx";
import Overview from "./pages/Agent/Overview/Overview.jsx";
import ListingsIndex from "./pages/Agent/Listings/ListingsIndex.jsx";
import ListingForm from "./pages/Agent/Listings/New/ListingForm.jsx";
import Applications from "./pages/Agent/Applications/Applications.jsx";
import AppDetail from "./pages/Agent/Applications/AppDetail/AppDetail.jsx";
import Messages from "./pages/Agent/Messages/Messages.jsx";
import Payouts from "./pages/Agent/Payouts/Payouts.jsx";
import Settings from "./pages/Agent/Settings/Settings.jsx";

// Admin
// (you can add AdminKyc, AdminAgents, AdminStudents, AdminPayouts, AdminAudit, AdminSettings similarly)

import "./index.css";
import AdminLayout from "./pages/Admin/AdminLayout/AdminLayout.jsx";
import AdminBookings from "./pages/Admin/Bookings/AdminBookings.jsx";
import AdminLogin from "./pages/Admin/Auth/AdminLogin.jsx";
import AdminBookingDetail from "./pages/Admin/Bookings/AdminBookingDetail.jsx";
import AdminAgents from "./pages/Admin/AdminAgents/AdminAgents.jsx";
import AdminAgentDetail from "./pages/Admin/AdminAgents/AdminAgentDetail.jsx";
import AdminStudentDetail from "./pages/Admin/AdminStudents/AdminStudentDetail.jsx";
import AdminStudents from "./pages/Admin/AdminStudents/AdminStudents.jsx";
import AdminSettings from "./pages/Admin/AdminSettings/AdminSettings.jsx";
import AdminProfile from "./pages/Admin/Profile/AdminProfile.jsx";
// fixed this
import AdminOverview from "./pages/Admin/Overview/AdminOverView.jsx";

export default function App() {
  return (
    <div className="app-root">
      <ScrollToTop />
      <Routes>
        {/* Public + App routes WITH site header/footer */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/support" element={<Support />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/legal/disclaimer" element={<Disclaimer />} />
          <Route path="/legal/privacy" element={<PrivacyPolicy />} />
          <Route path="/legal/terms" element={<TermsOfUse />} />

          {/* Booking flow (protected) */}
          <Route
            path="/book/:listingId"
            element={
              <RequireAuth>
                <BookingFlow />
              </RequireAuth>
            }
          />

          {/* Dashboards under site chrome */}
          <Route path="/dashboard">
            {/* Student (protected) */}
            <Route
              path="student"
              element={
                <RequireAuth>
                  <StudentLayout />
                </RequireAuth>
              }
            >
              <Route index element={<StudentBookings />} />
              <Route path="bookings" element={<StudentBookings />} />
              <Route path="bookings/:bookingId" element={<BookingDetail />} />
              <Route path="documents" element={<StudentDocuments />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>

            {/* Agent console */}
            <Route path="agent" element={<Agent />}>
              <Route index element={<Overview />} />
              <Route path="overview" element={<Overview />} />
              <Route path="listings">
                <Route index element={<ListingsIndex />} />
                <Route path="new" element={<ListingForm mode="create" />} />
                <Route path=":id/edit" element={<ListingForm mode="edit" />} />
              </Route>
              <Route path="applications" element={<Applications />} />
              <Route path="applications/:appId" element={<AppDetail />} />
              <Route path="messages" element={<Messages />} />
              <Route path="payouts" element={<Payouts />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ADMIN routes — NO site header/footer */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="bookings/:bookingId" element={<AdminBookingDetail />} />
          <Route path="agents" element={<AdminAgents />} />
          <Route path="agents/:agentId" element={<AdminAgentDetail />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="students/:studentId" element={<AdminStudentDetail />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />

          {/* Add more:
              <Route path="kyc" element={<AdminKyc />} />
              <Route path="payouts" element={<AdminPayouts />} />
              <Route path="audit" element={<AdminAudit />} />
          */}
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
