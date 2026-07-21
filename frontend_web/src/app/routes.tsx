// app/routes.tsx

import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { ROUTES } from "../common/constants/routes";
import { PublicLayout } from "../common/layouts/PublicLayout";
import { AdminLayout } from "../common/layouts/AdminLayout";
import { useAuth } from "../common/hooks/useAuth";
import { HomePage } from "../Modules/home/pages/HomePage";
import { AboutPage } from "../Modules/about/pages/AboutPage";
import { ContactPage } from "../Modules/contact/pages/ContactPage";
import { ProjectsListPage } from "../Modules/projects/pages/ProjectsListPage";
import { ProjectsDetailsPage } from "../Modules/projects/pages/ProjectsDetailsPage";
import { BlogListPage } from "../Modules/blog/pages/BlogListPage";
import { BlogDetailsPage } from "../Modules/blog/pages/BlogDetailsPage";
import { AdminLoginPage } from "../Modules/admin/auth/pages/AdminLoginPages";
import { DashboardOverviewPage } from "../Modules/admin/dashboard/pages/DashboardOverviewPage";
import { ManageProjectsPage } from "../Modules/admin/projects/pages/ManageProjectsPage";
import { ManageSkillsPage } from "../Modules/admin/skills/pages/ManageSkillsPage";
import { ManageSocialLinksPage } from "../Modules/admin/scoialLinks/pages/ManageSocialLinkPage";
import ManageContactMessagePage from "../Modules/admin/contact/pages/ManageContactMessagePage";
import { ManageBlogPostsPage } from "../Modules/admin/blog/pages/ManageBlogPostPage";
import { ManageCommentsPage } from "../Modules/admin/comments/pages/ManageCommentPage";
import { ManageAboutPage } from "../Modules/admin/about/pages/ManageAboutPage";
import { ManageCertificatesPage } from "../Modules/admin/certificates/pages/ManageCertificatesPage";
import { ForgotPasswordPage } from "../Modules/admin/auth/pages/ForgetPasswordPage";
import { ResetPasswordPage } from "../Modules/admin/auth/pages/ResetPasswordPage";

function RequireAdminAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isCheckingSession } = useAuth();
  if (isCheckingSession) {
    return <div className="p-8 text-center text-slate-400">Loading…</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.adminLogin} replace />;
  }
  return <>{children}</>;
}

function ProtectedAdminPage({ children }: { children: ReactNode }) {
  return (
    <RequireAdminAuth>
      <AdminLayout>{children}</AdminLayout>
    </RequireAdminAuth>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path={ROUTES.about} element={<PublicLayout><AboutPage /></PublicLayout>} />
      <Route path={ROUTES.projects} element={<PublicLayout><ProjectsListPage /></PublicLayout>} />
      <Route path={ROUTES.projectDetails(":slug")} element={<PublicLayout><ProjectsDetailsPage /></PublicLayout>} />
      <Route path={ROUTES.blog} element={<PublicLayout><BlogListPage /></PublicLayout>} />
      <Route path={ROUTES.blogDetails(":slug")} element={<PublicLayout><BlogDetailsPage /></PublicLayout>} />
      <Route path={ROUTES.contact} element={<PublicLayout><ContactPage /></PublicLayout>} />

      <Route path={ROUTES.adminLogin} element={<AdminLoginPage />} />

      <Route path={ROUTES.adminDashboard} element={<ProtectedAdminPage><DashboardOverviewPage /></ProtectedAdminPage>} />
      <Route path={ROUTES.adminProjects} element={<ProtectedAdminPage><ManageProjectsPage /></ProtectedAdminPage>} />
      <Route path={ROUTES.adminSkills} element={<ProtectedAdminPage><ManageSkillsPage /></ProtectedAdminPage>} />
      <Route path={ROUTES.adminSocialLinks} element={<ProtectedAdminPage><ManageSocialLinksPage /></ProtectedAdminPage>} />
      <Route path="/admin/messages" element={<ProtectedAdminPage><ManageContactMessagePage /></ProtectedAdminPage>} />
      <Route path="/admin/blog-posts" element={<ProtectedAdminPage><ManageBlogPostsPage /></ProtectedAdminPage>} />
      <Route path="/admin/comments" element={<ProtectedAdminPage><ManageCommentsPage /></ProtectedAdminPage>} />
      <Route path="/admin/about" element={<ProtectedAdminPage><ManageAboutPage /></ProtectedAdminPage>} />
      <Route path="/admin/certificates" element={<ProtectedAdminPage><ManageCertificatesPage /></ProtectedAdminPage>} />
      <Route path={ROUTES.adminForgotPassword} element={<ForgotPasswordPage />} />
      <Route path={ROUTES.adminResetPassword} element={<ResetPasswordPage />} />
    </Routes>
  );
}