import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../views/HomePage";
import ProfilePage from "../views/profile/ProfilePage";

import ProposalsPage from "../views/proposals/ProposalsPage";

import ClaimsPage from "../views/claims/ClaimsPage";

import CurrenciesPage from "../views/currencies/CurrenciesPage";
import AddCurrency from "../views/currencies/AddCurrency";

import NewBrandPage from "../views/brands/NewBrandPage";
import BrandDetail from "../views/brands/BrandDetail";
import BrandsPage from "../views/brands/BrandsPage";
import BrandUpdate from "../views/brands/BrandUpdate";

import LoginPage from "../views/auth/LoginPage";
import RegistrationPage from "../views/auth/RegistrationPage";
import VerifyUserPage from "../views/auth/VerifyUserPage";
import ProtectedRoute from "./ProtectedRoute";

import CountryPage from "../views/countries/CountryPage";
import CountryDetail from "../views/countries/CountryDetail";
import EditCountry from "../views/countries/EditCountryPage";
import AddCountryPage from "../views/countries/AddCountryPage";
import SubscriberTable from "../views/subscribers/SubscriberTable";

import PoliciesPage from "../views/policies/PoliciesPageSalesAgent";
import PoliciesPageSalesAgent from "../views/policies/PoliciesPageSalesAgent";
import PoliciesPageSubsriber from "../views/policies/PoliciesPageSubsriber";
import AddProposalPage from "../views/proposals/AddProposalPage";
import PolicyCreationStepper from "../reducers/PolicyCreationStepper";
import PublicRoute from "./PublicRoute";
import EditProfilePage from "../views/profile/EditProfilePage";
import PolicyDetail from "../views/policies/PolicyDetail";

export default function Navigation() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify/:id" element={<VerifyUserPage />} />
      </Route>
      {/* only managers can REGISTER other users */}
      <Route element={<ProtectedRoute allowedRoles={["MANAGER"]} />}>
        <Route path="/register" element={<RegistrationPage />} />
      </Route>

      {/* all auth users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/claims" element={<ClaimsPage />} />

        <Route path="/home" element={<HomePage />} />

        <Route path="/profile/:userRoleType" element={<EditProfilePage />} />

        {/* only ADMINISTRATOR may manage currencies, countries and brands */}
        <Route element={<ProtectedRoute allowedRoles={["ADMINISTRATOR"]} />}>
          <Route path="/currencies" element={<CurrenciesPage />} />
          <Route path="/currencies/new" element={<AddCurrency />} />
          {/* country */}
          <Route path="/countries" element={<CountryPage />} />
          <Route path="/countries/:id" element={<CountryDetail />} />
          <Route path="/countries/new" element={<AddCountryPage />} />
          <Route path="/countries/edit/:id" element={<EditCountry />} />
          {/* brand */}
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/brands/:id" element={<BrandDetail />} />
          <Route path="/brands/new" element={<NewBrandPage />} />
          <Route path="/brands/edit/:id" element={<BrandUpdate />} />
        </Route>

        {/* only sales agent can see policies */}
        <Route element={<ProtectedRoute allowedRoles={["SALES_AGENT"]} />}>
          <Route path="/subscribers" element={<SubscriberTable />} />

          <Route path="/policy-creation" element={<PolicyCreationStepper />} />
          <Route path="/policies" element={<PoliciesPageSalesAgent />} />
          <Route path="/policies" element={<PoliciesPage />} />
          <Route path="/policies/:id" element={<PolicyDetail />} />

          <Route path="/proposals" element={<ProposalsPage />} />
          <Route path="/proposals/new" element={<AddProposalPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["SUBSCRIBER"]} />}>
          <Route path="/policy" element={<PoliciesPageSubsriber />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
