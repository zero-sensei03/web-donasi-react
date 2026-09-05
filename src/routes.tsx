import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LayoutPublic } from './components/layout/landing';
import { LoadingScreen } from './components/common/LoadingScreen';
import { useGetSiteSettingPublic } from './services/siteSetting';
import { useSiteStore } from './stores/data-site';
import { useGetCampaignPublic } from './services/campaign';

const Home = lazy(() => import('./pages/landing/Home'));
const About = lazy(() => import('./pages/landing/About'));
const Gallery = lazy(() => import('./pages/landing/Gallery'));
const Donation = lazy(() => import('./pages/landing/Donasi'));
const Proposal = lazy(() => import('./pages/landing/Proposal'));

export function AppRoutes() {

  const { data: dataSite, isLoading: isLoadingSite } = useGetSiteSettingPublic();
  const { data: dataCampaign, isLoading: isLoadingCampaign } = useGetCampaignPublic();

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

  return (isLoadingSite || isLoadingCampaign) ? <LoadingScreen /> : (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<LayoutPublic />}>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/proposal" element={<Proposal />} />
          <Route path="/donation-support" element={<Donation />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
