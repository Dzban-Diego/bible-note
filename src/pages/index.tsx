import {useEffect, useState} from 'react';
import {book_type, books} from '../utils/books';
import {useGetChapter} from '../utils/useGetChapter';
import {NextPage} from 'next';
import Config from '../Components/Config';
import {useAtom} from 'jotai';
import {multiVerseAtom, redirectAtom, templateAtom} from '../utils/initAtoms';

const Index: NextPage = () => {
  const [book, setBook] = useState<book_type>();
  const [chapter_index, setChapterIndex] = useState<number>();
  const [firstVerse, setFirtVerse] = useState<number | false>(false);
  const {chapter, updateChapter, clearChapter} = useGetChapter();

  // config
  const [redirect, setRedirect] = useAtom(redirectAtom);
  const [multiVerse, setMultiVerse] = useAtom(multiVerseAtom);
  const [template, setTemplate] = useAtom(templateAtom);

  const [command, setCommand] = useState<string>();

  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    setWidth(window.outerWidth);

    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  const clear = () => {
    setBook(undefined);
    setChapterIndex(undefined);
    clearChapter();
    setFirtVerse(false);
  };

  const handleWindowSizeChange = () => {
    setWidth(window.outerWidth);
  };

  const handleBookPress = (book: book_type) => {
    setBook(book);
  };

  const handleChapterPress = (chapter: number) => {
    setChapterIndex(chapter);
    if (updateChapter && book) {
      updateChapter(book.book_id, chapter);
    }
  };

  const handleVersePress = async (verse_index: number) => {
    if (!chapter) return;

    let content = '';
    let verseText = '';
    let url = '';

    if (multiVerse) {
      if (firstVerse === verse_index) {
        return setFirtVerse(false);
      }
      if (firstVerse) {
        const firstVerseObj = chapter[firstVerse - 1];
        if (!firstVerseObj) return;
        url = firstVerseObj.url;
        verseText = `${firstVerse}-${verse_index}`;

        for (let i = firstVerse; i <= verse_index; i++) {
          const verse = chapter[i - 1];
          if (!verse) return;
          content += ` ${verse.content}`;
        }

        setFirtVerse(false);
      } else {
        return setFirtVerse(verse_index);
      }
    } else {
      const verse = chapter[verse_index - 1];
      if (!verse) return;

      url = verse.url;
      content = verse.content;
      verseText = verse_index.toString();
    }

    const textToCopy = () => {
      switch (template) {
        case 'text':
          return `(${book?.book_name} ${chapter_index}:${verseText}) ${content}`;
        case 'markdown':
          return `> [${book?.book_name} ${chapter_index}:${verseText}](${url}) ${content}`;
        case 'link':
          return `${url}`;
        case 'markdown-link':
          return `[${book?.book_name} ${chapter_index}:${verseText}](${url})`;
      }
    };

    // redirect
    if (redirect) {
      window.open(url, '', 'left=600,top=250,width=700,height=700');
    }

    // copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy());
    } else {
      const el = document.createElement('textarea');
      el.value = textToCopy();
      // el.value = `(${book?.book_name} ${chapter_index}:${verse_index}) ${verse.content}`;
      el.setAttribute('readonly', '');
      document.body.appendChild(el);
      el.select();
      el.setSelectionRange(0, 99999);
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  };

  const execCommand = () => {
    setCommand('');
    if (!command) return;

    switch (command) {
      case 'bb':
        return clear();
      case 'b': {
        if (chapter) {
          setChapterIndex(undefined);
          clearChapter();
          return;
        } else {
          return clear();
        }
      }
      // templates
      case 'tt': {
        return setTemplate('text');
      }
      case 'tm': {
        return setTemplate('markdown');
      }
      case 'tl': {
        return setTemplate('link');
      }
      case 'tml': {
        return setTemplate('markdown-link');
      }
      // redirect
      case 'r': {
        return setRedirect(!redirect);
      }
      // multiVerse
      case 'm': {
        return setMultiVerse(!multiVerse);
      }
    }

    if (book) {
      if (chapter_index) {
        handleVersePress(parseInt(command));
      } else {
        handleChapterPress(parseInt(command));
      }
    } else {
      const book = books.find((book) => {
        console.log(book.book_name.toUpperCase());
        console.log(command.toUpperCase());
        return (
          book.book_name.toUpperCase() === command.toUpperCase() ||
          book.short_book_name.toUpperCase().replace('.', '') ===
            command.toUpperCase()
        );
      });
      if (book) {
        handleBookPress(book);
      }
    }
  };

  type list_type = 'chapters' | 'verses';
  const renderList = (
    count: number,
    type: list_type,
    callback: (index: number) => void,
  ) => {
    const arr = [];
    for (let i = 1; i <= count; i++) {
      arr.push(
        <button
          className={`text-white border-0 p-3 ${
            type === 'verses'
              ? `${i === firstVerse ? 'bg-[#746a84]' : 'bg-[#757575]'}`
              : 'bg-[#746a84]'
          }`}
          key={`${type}-${i}`}
          onClick={() => callback(i)}>
          {i}
        </button>,
      );
    }

    return arr;
  };

  return (
    <div className="text-center bg-black text-3xl">
      <header className={'flex justify-between w-full p-3'}>
        <button className="bg-blue text-white" onClick={() => clear()}>
          {book ? `${book.book_name} ${chapter_index ?? ''}` : 'Biblia'}
        </button>
        <Config isMobile={isMobile} />
        <div className={'flex justify-center'}>
          {!isMobile && (
            <input
              autoFocus
              type="text"
              className={'text-black'}
              id="one"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(event) => {
                if (event.keyCode === 13) execCommand();
              }}
            />
          )}
        </div>
      </header>
      <div className={'w-screen grid grid-cols-5 content-center gap-2 mb-8'}>
        {/* Lista ksiąg */}
        {!book && (
          <>
            {books
              .filter((book, index) => {
                return index < 39;
              })
              .map((book) => {
                return (
                  <button
                    className={`text-white flex content-between align-middle p-3 ${
                      isMobile ? 'text-sm' : ''
                    }`}
                    key={book.book_id}
                    onClick={() => handleBookPress(book)}
                    style={{backgroundColor: `${book.color}`}}>
                    {isMobile ? book.short_book_name : book.book_name}
                  </button>
                );
              })}
          </>
        )}
        {/* Lista rozdziałów */}
        {book && !chapter && (
          <>{renderList(book.chapter_count, 'chapters', handleChapterPress)}</>
        )}
        {/*Lista wersetów */}
        {chapter && (
          <>{renderList(chapter.length, 'verses', handleVersePress)}</>
        )}
      </div>
      <div className={'w-screen grid grid-cols-5 content-center gap-2 mb-8'}>
        {/* Nowy testament */}
        {!book && (
          <>
            {books
              .filter((book, index) => {
                return index > 38;
              })
              .map((book) => {
                return (
                  <button
                    className={`text-white flex content-between align-middle p-3 ${
                      isMobile ? 'text-sm' : ''
                    }`}
                    key={book.book_id}
                    onClick={() => handleBookPress(book)}
                    style={{backgroundColor: `${book.color}`}}>
                    {isMobile ? book.short_book_name : book.book_name}
                  </button>
                );
              })}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
