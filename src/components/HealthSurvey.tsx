"use client"
import { zodResolver } from '@hookform/resolvers/zod';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonInput, IonItem, IonLabel, IonPage, IonRadio, IonRadioGroup, IonSelect, IonSelectOption } from '@ionic/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ionic-form/form";

const formSchema = z.object({
  q1: z.string().min(1, '답변을 선택해주세요'),
  q2: z.string().min(1, '답변을 선택해주세요'),
  q3: z.string().min(1, '답변을 선택해주세요'),
  q4: z.string().min(1, '답변을 선택해주세요'),
  q5: z.string().min(1, '답변을 선택해주세요'),
  q6: z.string().min(1, '답변을 선택해주세요'),
  q7: z.string().min(1, '답변을 선택해주세요'),
  q8: z.string().min(1, '답변을 선택해주세요'),
  q9: z.string().min(1, '답변을 선택해주세요'),
  q10: z.string().min(1, '답변을 입력해주세요'),
});

type FormValues = z.infer<typeof formSchema>;

const HealthSurvey = () => {
  const [currentPage, setCurrentPage] = React.useState(0);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q1: '', q2: '', q3: '', q4: '', q5: '', 
      q6: '', q7: '', q8: '', q9: '', q10: ''
    }
  });

  const questions = [
    [
      { id: 'q1', type: 'radio', text: '최근 2주간 피로감을 느끼신 적이 있습니까?' },
      { id: 'q2', type: 'radio', text: '최근 2주간 수면에 어려움이 있었습니까?' },
      { id: 'q3', type: 'radio', text: '현재 복용 중인 약이 있습니까?' }
    ],
    [
      { id: 'q4', type: 'radio', text: '일주일에 운동을 하시나요?' },
      { id: 'q5', type: 'radio', text: '하루 평균 몇 시간 주무시나요?' },
      { id: 'q6', type: 'radio', text: '스트레스를 많이 받고 계신가요?' }
    ],
    [
      { id: 'q7', type: 'select', text: '식사는 규칙적으로 하시나요?',
        options: ['매우 규칙적', '대체로 규칙적', '불규칙적'] },
      { id: 'q8', type: 'select', text: '음주는 얼마나 자주 하시나요?',
        options: ['전혀 안함', '월 1-2회', '주 1-2회', '주 3회 이상'] },
      { id: 'q9', type: 'select', text: '흡연을 하시나요?',
        options: ['비흡연', '금연중', '흡연중'] },
      { id: 'q10', type: 'text', text: '현재 건강에 대한 걱정이 있다면 적어주세요' }
    ]
  ];

  const validateCurrentPage = async () => {
    const currentQuestions = questions[currentPage];
    return await form.trigger(currentQuestions.map(q => q.id as keyof FormValues));
  };

  const handleNext = async () => {
    if (await validateCurrentPage() && currentPage < questions.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log('제출된 답변:', data);
    alert('설문이 제출되었습니다.');
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="ion-text-center">
              건강 설문조사
              <div className="ion-padding-top">
                <small>페이지 {currentPage + 1} / {questions.length}</small>
              </div>
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {questions[currentPage].map((question) => (
                  <FormField
                    key={question.id}
                    control={form.control}
                    name={question.id as keyof FormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{question.text}</FormLabel>
                        {question.type === 'radio' && (
                          <FormControl>
                            <IonRadioGroup
                              value={field.value}
                              onIonChange={e => field.onChange(e.detail.value)}
                            >
                              {['전혀 아니다', '아니다', '보통이다', '그렇다', '매우 그렇다'].map((option, idx) => (
                                <IonItem key={idx}>
                                  <IonLabel>{option}</IonLabel>
                                  <IonRadio slot="start" value={String(idx + 1)} />
                                </IonItem>
                              ))}
                            </IonRadioGroup>
                          </FormControl>
                        )}
                        {question.type === 'select' && (
                          <FormControl>
                            <IonSelect
                              value={field.value}
                              onIonChange={e => field.onChange(e.detail.value)}
                            >
                              {question.options?.map((option, idx) => (
                                <IonSelectOption key={idx} value={String(idx)}>
                                  {option}
                                </IonSelectOption>
                              ))}
                            </IonSelect>
                          </FormControl>
                        )}
                        {question.type === 'text' && (
                          <FormControl>
                            <IonInput
                              value={field.value}
                              onIonChange={e => field.onChange(e.detail.value)}
                              placeholder="답변을 입력해주세요"
                            />
                          </FormControl>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <div className="ion-text-center ion-padding-top">
                  <IonButton
                    fill="outline"
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                  >
                    이전
                  </IonButton>
                  
                  {currentPage === questions.length - 1 ? (
                    <IonButton type="submit">
                      제출하기
                    </IonButton>
                  ) : (
                    <IonButton onClick={handleNext}>
                      다음
                    </IonButton>
                  )}
                </div>
              </form>
            </FormProvider>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default HealthSurvey;