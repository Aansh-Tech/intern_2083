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

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={ROUTES.home}
        element={
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        }
      />
      <Route
        path={ROUTES.about}
        element={
          <PublicLayout>
            <AboutPage />
          </PublicLayout>
        }
      />
      <Route
        path={ROUTES.projects}
        element={
          <PublicLayout>
            <ProjectsListPage />
          </PublicLayout>
        }
      />
      <Route
        path={ROUTES.projectDetails(":slug")}
        element={
          <PublicLayout>
            <ProjectsDetailsPage />
          </PublicLayout>
        }
      />
      <Route
        path={ROUTES.blog}
        element={
          <PublicLayout>
            <BlogListPage />
          </PublicLayout>
        }
      />
      <Route
        path={ROUTES.blogDetails(":slug")}
        element={
          <PublicLayout>
            <BlogDetailsPage />
          </PublicLayout>
        }
      />
      <Route
        path={ROUTES.contact}
        element={
          <PublicLayout>
            <ContactPage />
          </PublicLayout>
        }
      />

      <Route path={ROUTES.adminLogin} element={<AdminLoginPage />} />
      <Route
        path={ROUTES.adminDashboard}
        element={
          // <RequireAdminAuth>
            <AdminLayout>
              <DashboardOverviewPage />
            </AdminLayout>
          /* </RequireAdminAuth> */
        }
      />
    </Routes>
  );
}