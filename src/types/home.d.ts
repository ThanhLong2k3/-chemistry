export interface ILesson {
  id: string;
  name: string;
}

export interface ISubject_Home {
  subject_id: string;
  subject_name: string;
  description: string;
  image: string;
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
