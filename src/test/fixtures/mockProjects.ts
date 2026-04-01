import { GenerationResult } from '../../types';

export const mockHtmlProject: GenerationResult = {
  explanation: 'A beautiful vanilla HTML, CSS, and JavaScript portfolio showcasing responsive design and smooth scrolling navigation.',
  files: [
    {
      path: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>John Doe - Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <h1>John Doe</h1>
            <ul class="nav-links">
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <section id="hero" class="hero">
        <div class="container">
            <h2>Full Stack Developer</h2>
            <p>Building beautiful web experiences</p>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2>About Me</h2>
            <p>I'm a passionate developer with 5+ years of experience in web development.</p>
        </div>
    </section>

    <script src="script.js"></script>
</body>
</html>`,
    },
    {
      path: 'style.css',
      content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.navbar {
    background: #333;
    color: white;
    padding: 1rem 0;
    position: sticky;
    top: 0;
}

.navbar h1 {
    display: inline-block;
    font-size: 1.5rem;
}

.nav-links {
    list-style: none;
    float: right;
}

.nav-links li {
    display: inline-block;
    margin-left: 2rem;
}

.nav-links a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: #667eea;
}

.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 100px 0;
    text-align: center;
}

.hero h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.hero p {
    font-size: 1.2rem;
}

.about {
    padding: 50px 0;
    text-align: center;
}

.about h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
}`,
    },
    {
      path: 'script.js',
      content: `console.log('Portfolio loaded!');

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});`,
    },
  ],
};

export const mockReactProject: GenerationResult = {
  explanation: 'A modern React portfolio built with Tailwind CSS, featuring interactive components, smooth gradients, and responsive grid layouts. Includes a click counter to demonstrate state management.',
  files: [
    {
      path: 'package.json',
      content: `{
  "name": "portfolio-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  }
}`,
    },
    {
      path: 'public/index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - React</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
</body>
</html>`,
    },
    {
      path: 'src/index.tsx',
      content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
    },
    {
      path: 'src/App.tsx',
      content: `import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600">
      <nav className="bg-black bg-opacity-50 text-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <ul className="flex gap-6">
            <li><a href="#" className="hover:text-purple-400">About</a></li>
            <li><a href="#" className="hover:text-purple-400">Projects</a></li>
            <li><a href="#" className="hover:text-purple-400">Contact</a></li>
          </ul>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-4 py-20 text-white text-center">
        <h2 className="text-5xl font-bold mb-4">Full Stack Developer</h2>
        <p className="text-xl mb-8">Building amazing web experiences</p>
        <button 
          onClick={() => setCount(count + 1)}
          className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-purple-100 transition"
        >
          Click me! ({count})
        </button>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h3 className="text-3xl font-bold text-white mb-8">Featured Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-lg">
              <h4 className="text-xl font-bold mb-2">Project {i}</h4>
              <p className="text-gray-600 mb-4">An amazing project built with React and Tailwind CSS</p>
              <a href="#" className="text-purple-600 hover:text-purple-800 font-semibold">View →</a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}`,
    },
    {
      path: 'src/index.css',
      content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`,
    },
  ],
};

export const mockNextProject: GenerationResult = {
  explanation: 'A Next.js 14 portfolio with TypeScript support, featuring file-based routing and server-side capabilities. Styled with Tailwind CSS for excellent performance and scalability.',
  files: [
    {
      path: 'package.json',
      content: `{
  "name": "portfolio-next",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`,
    },
    {
      path: 'pages/index.tsx',
      content: `export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">NextJS Portfolio</h1>
        <ul className="flex gap-4">
          <li><a href="#" className="hover:text-blue-400">Home</a></li>
          <li><a href="#" className="hover:text-blue-400">About</a></li>
        </ul>
      </nav>
      
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold mb-4">Welcome to my portfolio</h2>
        <p className="text-xl text-gray-300">Built with Next.js 14</p>
      </section>
    </div>
  );
}`,
    },
    {
      path: 'pages/_app.tsx',
      content: `import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}`,
    },
    {
      path: 'styles/globals.css',
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
    },
  ],
};
