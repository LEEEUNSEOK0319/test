import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Search, FileText, MessageSquare, Shield, Zap, Check } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Smart Search에 오신 것을 환영합니다!',
      description: 'AI 기반 파일 검색으로 업무 효율성을 높여보세요',
      icon: <Search />,
      features: ['지능형 문서 검색', '자연어 쿼리 지원', '실시간 채팅 인터페이스'],
    },
    {
      title: '강력한 AI 검색 엔진',
      description: '문서의 내용을 이해하고 정확한 결과를 제공합니다',
      icon: <Zap />,
      features: ['의미 기반 검색', '다양한 파일 형식 지원', '빠른 검색 결과'],
    },
    {
      title: '스마트 채팅 인터페이스',
      description: 'AI 어시스턴트와 대화하듯 파일을 찾아보세요',
      icon: <MessageSquare />,
      features: ['자연어 대화', '상황별 추천', '학습하는 AI'],
    },
    {
      title: '보안과 개인정보 보호',
      description: '기업급 보안으로 데이터를 안전하게 보호합니다',
      icon: <Shield />,
      features: ['접근 권한 관리', '암호화', '감사 로그'],
    },
  ];

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(s => s + 1);
    else onComplete();
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-white to-slate-50">
      <Card className="w-full max-w-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText />
          <h2 className="text-xl font-semibold">빠른 소개</h2>
        </div>

        <div className="flex items-start gap-6">
          <div className="shrink-0 mt-1">{steps[currentStep].icon}</div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{steps[currentStep].title}</h3>
            <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
            <ul className="mt-3 grid grid-cols-1 gap-2">
              {steps[currentStep].features.map((f, idx) => (
                <li key={idx} className="inline-flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-600" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <div className="text-sm text-muted-foreground">
            {currentStep + 1} / {steps.length}
          </div>
          <div className="space-x-2">
            <Button variant="ghost" onClick={onComplete}>
              건너뛰기
            </Button>
            <Button onClick={next}>{currentStep === steps.length - 1 ? '시작하기' : '다음'}</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
