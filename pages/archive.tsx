import React from 'react';
import clsx from 'clsx';

import Link from '@/components/Link';
import { getAllPosts } from '@/lib/api';
import { useDebounce } from 'react-use';

type PostInfo = {
  path: string;
  title: string;
};

interface ArchiveProps {
  posts: PostInfo[];
}

const useDebounced = <T extends unknown>(value: T, timeout: number) => {
  const [debounced, setDebounced] = React.useState(value);
  useDebounce(() => setDebounced(value), timeout, [value]);
  return debounced;
};

const Archive = ({ posts }: ArchiveProps) => {
  const [input, setInput] = React.useState('');

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInput(event.target.value);
    },
    []
  );
  const handleClearClick = React.useCallback(() => {
    setInput('');
  }, []);

  const query = useDebounced(input, 200);
  const searchResult = React.useMemo(() => {
    const stems = query.toLowerCase().split(/\s+/);
    return posts.filter((post) => {
      const title = post.title.toLowerCase();
      return stems.every((stem) => title.includes(stem));
    });
  }, [posts, query]);

  return (
    <>
      <h1>Archive</h1>
      <div className="input-wrapper">
        <input value={input} placeholder="Search…" onChange={handleChange} />
        <div
          className={clsx('clear', input === '' && 'hidden')}
          onClick={handleClearClick}
        >
          <svg className="clear-svg" viewBox="0 0 357 357">
            <polygon
              points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3
 214.2,178.5"
            />
          </svg>
        </div>
      </div>
      <div className="notes-counter">{`${searchResult.length} notes`}</div>
      <PostList posts={searchResult} />
      {/* always show scroll on this page, so the layout is stable
          when notes list gets too short */}
      <style global jsx>{`
        body {
          overflow: scroll;
        }
      `}</style>
      <style jsx>{`
        .input-wrapper {
          display: flex;
          align-items: center;
          border: thin solid #888888;
          border-radius: 1px;
          margin-bottom: 5px;
        }
        input {
          flex-grow: 1;
          appearance: none;
          display: inline-block;
          min-height: 36px;
          padding: 8px 0 8px 12px;
          background: #fff;
          border: none;
          font-size: 15px;
          outline: none;
        }
        .clear {
          cursor: pointer;
          font-weight: bold;
          padding: 8px;
          min-height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s ease-in-out;
        }
        .clear.hidden {
          opacity: 0;
        }
        .clear-svg {
          height: 12px;
          fill: #888888;
        }
        .notes-counter {
          font-size: 0.8em;
          line-height: 1;
          color: #282828;
          text-align: right;
        }
      `}</style>
    </>
  );
};

export default Archive;

// Split list of posts into a separate component, so it does not
// hinder typing performance.
const PostList = React.memo(({ posts }: ArchiveProps) => {
  return (
    <ul className="wide">
      {posts.map((p) => (
        <li key={p.path}>
          <Link href={p.path}>{p.title}</Link>
        </li>
      ))}
    </ul>
  );
});

export const getStaticProps = async () => {
  const allPosts = await getAllPosts();
  const posts = allPosts
    .map((p) => ({ title: p.data.title, path: p.path }))
    .sort((a, b) => {
      // new notes on top, but bibliography on bottom (notes with
      // non-numeric path)

      // .slice(1) to skip leading slash.
      const aNumeric = !a.path.slice(1).match(/\D/);
      const bNumeric = !b.path.slice(1).match(/\D/);
      if (aNumeric < bNumeric) {
        return 1;
      } else if (aNumeric > bNumeric) {
        return -1;
      }

      return a.path < b.path ? 1 : -1;
    });

  const props: ArchiveProps = {
    posts,
  };
  return { props };
};
