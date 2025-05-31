import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from "./routes/AppRouter";

if (import.meta.env.VITE_MAINTENANCE === 'true') {
  document.body.innerHTML = `
    <div style="display:flex;justify-content:center;align-items:center;height:100vh;font-size:1.5rem;">
      ⚠️ 현재 점검 중입니다. 잠시 후 다시 접속해주세요.
    </div>
  `;
  throw new Error('점검 모드 - 앱 중단');
}


function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
