import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useGetSiteSettingPublic } from './services/siteSetting';
import { useSiteStore } from './stores/data-site';
import { useGetCampaignPublic } from './services/campaign';
import { LoadingScreen } from './components/common/LoadingScreen';
import { LayoutPublic } from './components/layout/landing';
import { AdminLayout } from '@/components/layout/admin';

import AdminGuard from '@/components/admin/AdminGuard';

const Home = lazy(() => import('./pages/landing/Home'));
const About = lazy(() => import('./pages/landing/About'));
const Gallery = lazy(() => import('./pages/landing/Gallery'));
const Donation = lazy(() => import('./pages/landing/Donasi'));
const Proposal = lazy(() => import('./pages/landing/Proposal'));

const Auth = lazy(() => import('./pages/auth/SIgnIn'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Users = lazy(() => import('./pages/admin/users/Users'));
const AuditLogPage = lazy(() => import('./pages/admin/audit-log/AuditLogPage'));
const SiteSettingPage = lazy(
  () => import('./pages/admin/site-setting/SiteSettingPage')
);
const NotificationPage = lazy(
  () => import('./pages/admin/notification/NotificationPage')
);
const CampaignPage = lazy(() => import('./pages/admin/campaign/CampaignPage'));
const CampaignPageDetail = lazy(
  () => import('./pages/admin/campaign/CampaignDetailPage')
);
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export function AppRoutes() {
  const { data: dataSite, isLoading: isLoadingSite } =
    useGetSiteSettingPublic();
  const { data: dataCampaign, isLoading: isLoadingCampaign } =
    useGetCampaignPublic();

  const setSiteData = useSiteStore((state) => state.setSiteData);
  useEffect(() => {
    if (dataSite && dataSite.data) {
      setSiteData(dataSite.data);
    }
  }, [dataSite, setSiteData]);

  const setCampaignData = useSiteStore((state) => state.setCampaignData);
  useEffect(() => {
    if (dataCampaign && dataCampaign.data) {
      setCampaignData(dataCampaign.data);
    }
  }, [dataCampaign, setCampaignData]);

  return isLoadingSite || isLoadingCampaign ? (
    <LoadingScreen />
  ) : (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<LayoutPublic />}>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/proposal" element={<Proposal />} />
          <Route path="/donation-support" element={<Donation />} />
        </Route>
        <Route path="/auth/sign-in" element={<Auth />} />
        <Route element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/audit-logs" element={<AuditLogPage />} />
            <Route path="/admin/site-settings" element={<SiteSettingPage />} />
            <Route path="/admin/notifications" element={<NotificationPage />} />
            <Route path="/admin/campaigns" element={<CampaignPage />} />
            <Route
              path="/admin/campaign/:id"
              element={<CampaignPageDetail />}
            />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
