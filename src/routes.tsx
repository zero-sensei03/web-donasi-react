import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LayoutPublic } from './components/layout/landing';
import { LoadingScreen } from './components/common/LoadingScreen';

const Home = lazy(() => import('./pages/landing/Home'));
const About = lazy(() => import('./pages/landing/About'));
const Gallery = lazy(() => import('./pages/landing/Gallery'));
const Donation = lazy(() => import('./pages/landing/Donasi'));
const Proposal = lazy(() => import('./pages/landing/Proposal'));

export function AppRoutes() {
  return (
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
