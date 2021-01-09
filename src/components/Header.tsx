import React from 'react';

import Link from 'next/link';

export interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <div className="root">
      <div className="quicklinks">
        <Link href="/">
          <a className="icon-link" aria-label="Home">
            <HomeIcon />
          </a>
        </Link>
        <Link href="/archive">
          <a className="icon-link" aria-label="Search">
            <SearchIcon width={24} height={24} />
          </a>
        </Link>
      </div>
      <h1>{title}</h1>

      <style jsx>{`
        .root {
          display: flex;
          flex-wrap: wrap;
          flex-direction: row-reverse;
        }
        h1 {
          flex-shrink: 0;
          flex-grow: 1;
          justify-self: stretch;
          max-width: 100%;
        }
        .quicklinks {
          display: inline-flex;
          align-items: flex-start;
          margin-left: 12px;
        }
        .icon-link {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 12px;
        }
        @media (min-width: 800px) {
          .quicklinks {
            position: absolute;
            left: 100%;
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      {...props}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
};

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="black"
      width="18px"
      height="18px"
      {...props}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
};

export default Header;
