import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "../common/constants/routes";
import { PublicLayout } from "../common/layouts/PublicLayout";
import { AdminLayout } from "../common/layouts/AdminLayout";
import { useAuth } from "../common/hooks/useAuth";

import { HomePage } from "../modules/home/pages/HomePage";
import { AboutPage } from "../modules/about/pages/AboutPage";
import { ContactPage } from "../modules/contact/pages/ContactPage";
import { ProjectsListPage } from "../modules/projects/pages/ProjectsListPage";
import { ProjectDetailsPage } from "../modules/projects/pages/ProjectDetailsPage";
import { BlogListPage } from "../modules/blog/pages/BlogListPage";
import { BlogDetailsPage } from "../modules/blog/pages/BlogDetailsPage";

// Admin pages are commented out until that module is actively being built --
// uncomment as each page gets created.
// import { AdminLoginPage } from "../modules/admin/auth/pages/AdminLoginPage";
// import { DashboardOverviewPage } from "../modules/admin/dashboard/pages/DashboardOverviewPage";

function RequireAdminAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.adminLogin} replace />;
  }

  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public site */}
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
            <ProjectDetailsPage />
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

      {/* Admin -- uncomment once the admin module is being actively built */}
      {/* <Route path={ROUTES.adminLogin} element={<AdminLoginPage />} /> */}
      {/* <Route
        path="/admin"
        element={
          <RequireAdminAuth>
            <AdminLayout>
              <DashboardOverviewPage />
            </AdminLayout>
          </RequireAdminAuth>
        }
      /> */}
    </Routes>
  );
}