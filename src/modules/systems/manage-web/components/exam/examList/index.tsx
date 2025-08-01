'use client';
import { Home_Api } from '@/services/home.service';
import { useEffect, useState } from 'react';
import ExamList from './components/ExamList';
import { IExam } from '@/types/exam';

interface Props {
  id: string;
}

const ExamListPageClient = ({ id }: Props) => {
  const [Supject, setSupject] = useState<IExam[]>([]);

  useEffect(() => {
    if (id) {
      GetExamtBy_IdSubject(id);
    }
  }, [id]);

  const GetExamtBy_IdSubject = async (id: string) => {
    const Lesson_Subject: any = await Home_Api.getExamByIdSubject(id);
    
    setSupject(Lesson_Subject.data.data || []);
  };

  return <ExamList exams={Supject} />;
};

export default ExamListPageClient;
