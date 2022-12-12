import {useState} from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {books} from './bible.js'

export type verse_type = {
  abbreviatedCitation
    :
    string;
  bookNumber
    :
    number
  chapterNumber
    :
    number
  content
    :
    string;
  standardCitation
    :
    string;
  url
    :
    string;
  verseNumber
    :
    number
  vsID
    :
    string;
};

export type chapter_type = verse_type[] | false;

export const useGetChapter = (): {
  chapter: chapter_type;
  updateChapter: (book_index: number, chapter_index: number) => void;
  clearChapter: () => void;
} => {
  const [chapter, setChapter] = useState<chapter_type>();

  const updateChapter = (book_index: number, chapter_index: number) => {
    fetchChapter(book_index, chapter_index).then((data) => setChapter(data));
  };

  const fetchChapter = async (book_index: number, chapter_index: number) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
    return books[book_index].chapters[chapter_index]

    // console.log(verses);
    // return verses;
  };

  const clearChapter = () => {
    setChapter(false);
  };

  return {
    chapter: chapter ?? false,
    updateChapter,
    clearChapter,
  };
};
