export interface ILesson {
  id: string;
  name: string;
}

export interface ISubject_Home {
  subject_id: string;
  subject_name: string;
  description: string;
  image: string;
  textbook:string;
  workbook:string;
  exercise_book:string;
  lessons: ILesson[] | null; // có thể là null nếu không có bài học
}



// LIST BÀI HỌC THEO CHƯƠNG 
export interface ILesson {
  id: string;
  name: string;
  description: string;
  image: string | null;
}

export interface IChapter_Home {
  chapter_id: string;
  chapter_name: string;
  chapter_description: string;
  lessons: ILesson[]; // được parse từ JSON trong SQL
}



// BÀI HỌC 
export interface ILessonDetail {
  lesson_id: string;
  lesson_name: string;
  description: string | null;
  image: string | null;
  chapter_id: string;
  chapter_name: string;
  chapter_description: string | null;
  created_at: string; 
  updated_at: string; 
  created_by: string;
  created_by_name:string;
}
