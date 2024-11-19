// app/page.tsx
'use client';

import { setupIonicReact } from '@ionic/react';
import dynamic from 'next/dynamic';

// Ionic 설정 초기화
setupIonicReact({
 mode: 'md'
});

// SSR 비활성화로 동적 임포트
const HealthSurvey = dynamic(() => import('@/components/HealthSurvey'), {
 ssr: false
});

export default function Home() {
 return <HealthSurvey />;
}