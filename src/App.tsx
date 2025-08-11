import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-emerald-50 to-sky-50">
      <div className="p-8 rounded-2xl shadow-lg bg-white w-full max-w-md text-center space-y-4">
        <div className="text-2xl font-semibold">Smart Search</div>
        <p className="text-sm text-gray-500">
          초기화 완료! 이제 이 위에 화면들을 다시 붙여갈게요.
        </p>
        <div className="text-xs text-gray-400">
          Tailwind 로딩 / Vite HMR 정상 동작 확인용 임시 화면
        </div>
      </div>
    </div>
  );
}
