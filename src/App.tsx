import { Routes, Route } from "react-router-dom";

import { RequireAuth } from "@/context/auth-context";
import { NotFoundPage } from "@/pages/NotFound";

import AppLayout from "@/layouts/AppLayout";
import SiteLayout from "@/layouts/SiteLayout";

import HomePage from "@/pages/marketing/home";
import GalleryPage from "@/pages/marketing/gallery";
import PricingPage from "@/pages/marketing/pricing";

import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";

import DashboardPage from "@/pages/dashboard/dashboard";
import CalendarPage from "@/pages/dashboard/calendar";

import LeadsPage from "@/pages/leads/leads";
import LeadDetailPage from "@/pages/leads/lead-detail";

import ProjectsPage from "@/pages/projects/projects";
import ProjectDetailPage from "@/pages/projects/project-detail";

import ClientsPage from "@/pages/clients/clients";
import ClientDetailPage from "@/pages/clients/client-detail";

import CrewPage from "@/pages/crew/crew";
import MemberDetailPage from "@/pages/crew/member-detail";

import DesignAssetsPage from "@/pages/design/assets";
import PlannerPage from "@/pages/design/planner";
import StudioPage from "@/pages/design/studio";
import PresentationPage from "@/pages/design/presentation";

import AccountsPage from "@/pages/operations/accounts";
import ProcurementPage from "@/pages/operations/procurement";
import FilesPage from "@/pages/operations/files";
import MessagesPage from "@/pages/operations/messages";
import TasksPage from "@/pages/operations/tasks";
import NotificationsPage from "@/pages/operations/notifications";

import StudioPlanPage from "@/pages/settings/studio-plan";
import ProfilePage from "@/pages/settings/profile";
import HelpPage from "@/pages/settings/help";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/calendar" element={<CalendarPage />} />

          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/leads/:leadId" element={<LeadDetailPage />} />

          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />

          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/:clientId" element={<ClientDetailPage />} />

          <Route path="/crew" element={<CrewPage />} />
          <Route path="/crew/:memberId" element={<MemberDetailPage />} />

          <Route path="/assets" element={<DesignAssetsPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/presentation" element={<PresentationPage />} />

          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/procurement" element={<ProcurementPage />} />
          <Route path="/files" element={<FilesPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          <Route path="/studio-plan" element={<StudioPlanPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/help" element={<HelpPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
