import { useRef } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);

  const handleInput = (e: any) => {
    if (e.key === 'Enter') {
      router.push({
        pathname: '/api/image.png',
        query: { url: input.current?.value },
      });
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Generate Image Screenshot</title>
        <meta name="description" content="Generate Image Screenshot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Generate Image Screenshot</h1>

        <p className={styles.description}>
          <input
            ref={input}
            className={styles.formControl}
            type="text"
            placeholder="URL"
            required={true}
            onKeyDown={handleInput}
          />
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/rendiriz/next-gen-image"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </footer>
    </div>
  );
};

export default Home;
