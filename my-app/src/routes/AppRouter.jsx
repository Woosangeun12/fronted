import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../page/LandingPage/LandingPage.jsx';
import SurveyPage from '../page/SurveyPage/SurveyPage.jsx';
import RecommendPage from '../page/RecommendPage/RecommendPage';
import ReviewPage from '../page/ReviewPage/ReviewPage';
import AdminReviewPage from '../page/AdminReviewPage/AdminReviewPage';
import QuotePage from '../page/QuotePage/QuotePage';
import ReviewWritePage from '../page/ReviewWritePage/ReviewWritePage';
import StartPage from '../page/StartPage/StartPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<StartPage/>}/>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/survey" element={<SurveyPage />} />
      <Route path="/recommend" element={<RecommendPage/>}/>
      <Route path="/review" element={<ReviewPage/>}/>
      <Route path="/admin" element={<AdminReviewPage/>}/>
      <Route path="/quote" element={<QuotePage/>}/>
      <Route path="/reviewwrite" element={<ReviewWritePage/>}/>
    </Routes>
  );
};

export default AppRouter;
