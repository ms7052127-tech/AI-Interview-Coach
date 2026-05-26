import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// ── Complete MCQ Bank ──
const mcqBank = {
  'Web Development': {
    Easy: [
      { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], ans: 0, explanation: "HTML stands for HyperText Markup Language — the standard language for creating web pages." },
      { q: "Which tag is used to create a hyperlink in HTML?", options: ["<link>", "<a>", "<href>", "<url>"], ans: 1, explanation: "The <a> (anchor) tag with the href attribute is used to create hyperlinks in HTML." },
      { q: "Which CSS property changes the text color?", options: ["text-color", "font-color", "color", "background-color"], ans: 2, explanation: "The 'color' property in CSS is used to set the color of text." },
      { q: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], ans: 1, explanation: "CSS stands for Cascading Style Sheets — used to style HTML elements." },
      { q: "Which HTML tag is used for the largest heading?", options: ["<h6>", "<heading>", "<h1>", "<head>"], ans: 2, explanation: "<h1> defines the largest/most important heading. <h6> defines the smallest." },
      { q: "How do you make text bold in HTML?", options: ["<bold>", "<b>", "<strong> or <b>", "<thick>"], ans: 2, explanation: "Both <strong> and <b> make text bold. <strong> also carries semantic importance." },
      { q: "Which property is used to change the background color in CSS?", options: ["bgcolor", "background-color", "color", "bg-color"], ans: 1, explanation: "background-color is the correct CSS property to set the background color of an element." },
      { q: "What is the correct HTML for adding a background color?", options: ["<body bg='yellow'>", "<body style='background-color:yellow;'>", "<background>yellow</background>", "<body color='yellow'>"], ans: 1, explanation: "Inline CSS with style attribute is the correct way to add background color directly in HTML." },
      { q: "Which HTML element defines the title of a document?", options: ["<meta>", "<head>", "<title>", "<header>"], ans: 2, explanation: "The <title> element defines the title of the document shown in the browser tab." },
      { q: "What does the 'div' tag do in HTML?", options: ["Creates a link", "Defines a division or section", "Creates a table", "Inserts an image"], ans: 1, explanation: "The <div> tag defines a division or section in an HTML document — used as a container." },
    ],
    Medium: [
      { q: "What is the CSS Box Model?", options: ["A layout model with content, padding, border, margin", "A 3D model for CSS shapes", "A JavaScript framework", "A way to create boxes in HTML"], ans: 0, explanation: "The CSS Box Model describes element layout: content area, padding, border, and margin — from inside to outside." },
      { q: "Which CSS property controls the flex direction?", options: ["flex-flow", "flex-direction", "flex-wrap", "flex-axis"], ans: 1, explanation: "flex-direction sets the main axis direction: row (default), row-reverse, column, or column-reverse." },
      { q: "What is the difference between display:none and visibility:hidden?", options: ["No difference", "display:none removes from layout; visibility:hidden keeps space", "visibility:hidden removes from layout; display:none keeps space", "Both keep space in layout"], ans: 1, explanation: "display:none removes the element from the document flow entirely. visibility:hidden hides it but keeps its space." },
      { q: "What does the 'z-index' property control?", options: ["Zoom level", "Stacking order of elements", "Horizontal position", "Element size"], ans: 1, explanation: "z-index controls the stacking order of positioned elements. Higher values appear on top of lower values." },
      { q: "Which HTTP method is used to send data to a server?", options: ["GET", "DELETE", "POST", "FETCH"], ans: 2, explanation: "POST is used to send data to the server to create/update a resource. GET retrieves data." },
      { q: "What is responsive web design?", options: ["Design that responds to user clicks", "Design that adapts to different screen sizes", "Design using animated responses", "Fast loading design"], ans: 1, explanation: "Responsive web design uses flexible layouts, images, and CSS media queries to adapt to different screen sizes." },
      { q: "What is CORS?", options: ["A CSS framework", "Cross-Origin Resource Sharing", "A type of web attack", "A JavaScript library"], ans: 1, explanation: "CORS (Cross-Origin Resource Sharing) is a browser security feature that controls cross-origin HTTP requests." },
      { q: "Which pseudo-class selects an element when the mouse is over it?", options: [":focus", ":active", ":hover", ":visited"], ans: 2, explanation: ":hover applies styles when the user moves their mouse pointer over an element." },
      { q: "What is the purpose of the meta viewport tag?", options: ["Set page author", "Control page rendering on mobile devices", "Add page description", "Set character encoding"], ans: 1, explanation: "The meta viewport tag controls how the page is displayed on mobile devices, essential for responsive design." },
      { q: "What is localStorage?", options: ["Server-side storage", "Browser-based key-value storage that persists", "Temporary session storage", "Cookie-based storage"], ans: 1, explanation: "localStorage is a web storage API that stores key-value pairs persistently in the browser with no expiry." },
    ],
    Hard: [
      { q: "What are Core Web Vitals?", options: ["HTML5 new features", "Google's metrics for page experience (LCP, FID, CLS)", "CSS animation properties", "JavaScript performance APIs"], ans: 1, explanation: "Core Web Vitals are Google's metrics: LCP (loading), FID/INP (interactivity), CLS (visual stability)." },
      { q: "What is the Critical Rendering Path?", options: ["CSS animation sequence", "Browser steps to convert HTML/CSS/JS to pixels on screen", "Server request sequence", "JavaScript execution order"], ans: 1, explanation: "Critical Rendering Path is the sequence: parse HTML → build DOM → build CSSOM → Render Tree → Layout → Paint → Composite." },
      { q: "What is a Service Worker?", options: ["A background JavaScript thread that can intercept network requests", "A CSS worker thread", "A Node.js worker", "A web server component"], ans: 0, explanation: "Service Workers are JavaScript files that run in the background, enabling offline functionality and caching strategies." },
      { q: "What is Content Security Policy (CSP)?", options: ["A CSS framework", "An HTTP header that prevents XSS attacks by controlling resource sources", "A JavaScript library", "A caching mechanism"], ans: 1, explanation: "CSP is an HTTP security header that tells browsers which content sources are trusted, preventing XSS attacks." },
      { q: "What is the difference between SSR and CSR?", options: ["No difference", "SSR generates HTML on server; CSR generates HTML in browser using JS", "CSR is faster always", "SSR only works with React"], ans: 1, explanation: "SSR (Server-Side Rendering) sends complete HTML from server. CSR (Client-Side Rendering) uses JavaScript in the browser to build the UI." },
    ],
  },

  'JavaScript': {
    Easy: [
      { q: "Which keyword is used to declare a variable in modern JavaScript?", options: ["var", "let and const", "variable", "int"], ans: 1, explanation: "Modern JavaScript uses 'let' for reassignable variables and 'const' for constants. 'var' is older and has function scope." },
      { q: "What does '===' mean in JavaScript?", options: ["Assignment", "Loose equality", "Strict equality (value and type)", "Not equal"], ans: 2, explanation: "=== is the strict equality operator that checks both value AND type. '5' === 5 returns false." },
      { q: "What is the output of: typeof null?", options: ["null", "undefined", "object", "string"], ans: 2, explanation: "typeof null returns 'object' — this is a historical bug in JavaScript that cannot be fixed for backward compatibility." },
      { q: "Which method adds an element to the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], ans: 0, explanation: "push() adds one or more elements to the end of an array and returns the new length." },
      { q: "What is a closure in JavaScript?", options: ["A way to close browser tabs", "A function that has access to its outer scope even after the outer function returns", "A type of loop", "An error handling mechanism"], ans: 1, explanation: "A closure is a function that retains access to variables from its outer (enclosing) scope after the outer function has executed." },
      { q: "What does JSON.parse() do?", options: ["Converts JS object to JSON string", "Parses a JSON string into a JavaScript object", "Creates a new JSON file", "Validates JSON format"], ans: 1, explanation: "JSON.parse() takes a JSON string and converts it into a JavaScript object/array." },
      { q: "What is the result of: 2 + '2' in JavaScript?", options: ["4", "22", "NaN", "Error"], ans: 1, explanation: "JavaScript converts the number 2 to a string and concatenates, resulting in '22'. This is type coercion." },
      { q: "Which method removes the last element from an array?", options: ["shift()", "push()", "pop()", "splice()"], ans: 2, explanation: "pop() removes and returns the last element of an array, modifying the original array." },
      { q: "What is 'undefined' in JavaScript?", options: ["A variable with null value", "A variable declared but not assigned a value", "An error type", "A reserved keyword for missing functions"], ans: 1, explanation: "undefined means a variable has been declared but has not been assigned a value yet." },
      { q: "What does the 'this' keyword refer to?", options: ["The previous function", "The current HTML element always", "The object that is executing the current function", "The global window object always"], ans: 2, explanation: "'this' refers to the object that is currently executing the function. Its value depends on how the function is called." },
    ],
    Medium: [
      { q: "What is event bubbling?", options: ["Events that occur in bubbles", "An event propagating from child to parent elements", "A way to create events", "Events that cancel themselves"], ans: 1, explanation: "Event bubbling is when an event on a child element propagates upward through all ancestor elements." },
      { q: "What is the difference between call() and apply()?", options: ["No difference", "call() passes args individually; apply() passes args as an array", "apply() is faster", "call() only works with arrow functions"], ans: 1, explanation: "Both set 'this' context, but call() takes individual arguments while apply() takes an array of arguments." },
      { q: "What is a Promise in JavaScript?", options: ["A guarantee function will work", "An object representing eventual completion or failure of async operation", "A type of callback", "A synchronous operation"], ans: 1, explanation: "A Promise represents a value that may be available now, later, or never. States: pending, fulfilled, or rejected." },
      { q: "What is the purpose of async/await?", options: ["Make code run faster", "Syntactic sugar for Promises making async code look synchronous", "Replace callbacks entirely", "Handle errors only"], ans: 1, explanation: "async/await is built on Promises and makes asynchronous code easier to read and write, appearing like synchronous code." },
      { q: "What does Array.prototype.reduce() do?", options: ["Reduces array length", "Executes a reducer function on each element, resulting in a single value", "Removes duplicate elements", "Sorts the array"], ans: 1, explanation: "reduce() executes a callback function on each array element, accumulating into a single output value." },
      { q: "What is prototypal inheritance?", options: ["Copying properties from parent to child", "Objects inheriting properties through the prototype chain", "A class-based inheritance system", "A way to create private properties"], ans: 1, explanation: "Prototypal inheritance allows objects to inherit properties and methods directly from other objects via the prototype chain." },
      { q: "What is the Temporal Dead Zone (TDZ)?", options: ["A time zone setting", "Period between entering scope and let/const declaration where they can't be accessed", "A JavaScript error", "A browser compatibility issue"], ans: 1, explanation: "TDZ is the period between when a let/const variable enters scope and when it's initialized — accessing it throws ReferenceError." },
      { q: "What does the spread operator (...) do?", options: ["Creates a rest parameter", "Expands an iterable into individual elements", "Declares multiple variables", "Creates a copy of a function"], ans: 1, explanation: "The spread operator expands arrays/objects into individual elements. [...arr1, ...arr2] merges arrays." },
      { q: "What is hoisting in JavaScript?", options: ["Moving HTML elements up", "JavaScript's behavior of moving declarations to top of scope", "A CSS property", "An event handling method"], ans: 1, explanation: "Hoisting moves variable and function declarations to the top of their scope during the compilation phase." },
      { q: "What is the difference between map() and forEach()?", options: ["No difference", "map() returns a new array; forEach() returns undefined", "forEach() is faster", "map() modifies the original array"], ans: 1, explanation: "map() transforms each element and returns a new array. forEach() just executes a function for each element with no return value." },
    ],
    Hard: [
      { q: "What is the JavaScript event loop?", options: ["A for loop in events", "A mechanism enabling async operations in single-threaded JS via call stack, Web APIs, and task queue", "A DOM event system", "A way to loop through events"], ans: 1, explanation: "The event loop allows JS to perform non-blocking operations by offloading tasks to Web APIs and processing callbacks via the task queue." },
      { q: "What is the difference between microtasks and macrotasks?", options: ["No difference", "Microtasks (Promises) run before macrotasks (setTimeout) after each task", "Macrotasks always run first", "They run simultaneously"], ans: 1, explanation: "Microtasks (Promise callbacks) are processed after each task before the next macrotask (setTimeout, setInterval)." },
      { q: "What is memoization?", options: ["Computer memory management", "Caching function results to avoid redundant calculations", "A type of recursion", "A design pattern for classes"], ans: 1, explanation: "Memoization stores the results of expensive function calls and returns cached results when the same inputs occur again." },
      { q: "What is a WeakMap in JavaScript?", options: ["A smaller version of Map", "A Map where keys are weakly referenced and can be garbage collected", "A read-only Map", "A Map with weak typing"], ans: 1, explanation: "WeakMap holds weak references to keys (must be objects), allowing garbage collection when no other references exist." },
      { q: "What does Object.freeze() do?", options: ["Stops the program temporarily", "Prevents modifications to an object (properties can't be added, removed, or changed)", "Creates an immutable copy", "Converts object to string"], ans: 1, explanation: "Object.freeze() makes an object immutable — prevents adding, removing, or modifying properties. It's shallow though." },
    ],
  },

  'React': {
    Easy: [
      { q: "What is JSX?", options: ["A JavaScript framework", "A syntax extension that allows HTML-like code in JavaScript", "A CSS preprocessor", "A database query language"], ans: 1, explanation: "JSX is a syntax extension for JavaScript used in React that looks like HTML and gets compiled to React.createElement() calls." },
      { q: "What is a React component?", options: ["A CSS class", "A reusable piece of UI that returns JSX", "A JavaScript variable", "An HTML element"], ans: 1, explanation: "A React component is an independent, reusable piece of UI. It can be a function or class that returns JSX." },
      { q: "What hook is used to add state to a functional component?", options: ["useEffect", "useContext", "useState", "useRef"], ans: 2, explanation: "useState returns a state variable and a setter function: const [count, setCount] = useState(0)." },
      { q: "What does useEffect do?", options: ["Updates component state", "Performs side effects after render (data fetching, subscriptions)", "Creates new components", "Handles user input"], ans: 1, explanation: "useEffect runs side effects after render. The dependency array controls when it runs." },
      { q: "What are props in React?", options: ["Internal component state", "CSS properties", "Read-only data passed from parent to child components", "JavaScript functions"], ans: 2, explanation: "Props are read-only data passed from parent to child components, similar to function arguments." },
      { q: "What is the virtual DOM?", options: ["A browser feature", "A lightweight JS representation of the real DOM used by React for efficient updates", "A testing tool", "An alternative to HTML"], ans: 1, explanation: "React's virtual DOM is a lightweight copy of the real DOM. React diffs old and new virtual DOM to minimize real DOM updates." },
      { q: "Why is the 'key' prop important in lists?", options: ["For styling purposes", "It's optional for small lists", "Helps React identify changed, added, or removed items for efficient updates", "It sets the HTML id attribute"], ans: 2, explanation: "Keys help React identify which items changed in a list. Use stable, unique IDs — not array indices." },
      { q: "What does React.memo do?", options: ["Adds memory to components", "Memoizes a component to skip re-render if props haven't changed", "Creates a memo item", "Handles component memory leaks"], ans: 1, explanation: "React.memo is a HOC that prevents a component from re-rendering if its props haven't changed (shallow comparison)." },
      { q: "What is the difference between state and props?", options: ["No difference", "State is internal/mutable; props are external/read-only", "Props are internal; state is external", "Both are the same type"], ans: 1, explanation: "State is managed internally by the component and can change. Props are passed from parent and are read-only." },
      { q: "What is a React Fragment?", options: ["A piece of broken code", "Lets you group elements without adding extra DOM nodes", "A type of state", "A lifecycle method"], ans: 1, explanation: "React.Fragment (<> </>) wraps multiple elements without adding an extra DOM node like a div." },
    ],
    Medium: [
      { q: "What is the Context API used for?", options: ["Making API calls", "Sharing state across components without prop drilling", "Creating custom hooks", "Managing component lifecycle"], ans: 1, explanation: "Context API provides a way to share values between components without explicitly passing props through every level." },
      { q: "What is the purpose of useCallback?", options: ["Cache an expensive calculation", "Memoize a function to maintain stable reference between renders", "Replace useEffect", "Create async functions"], ans: 1, explanation: "useCallback returns a memoized callback function that only changes if dependencies change — prevents unnecessary child re-renders." },
      { q: "What is prop drilling?", options: ["Adding holes to HTML", "Passing props through many intermediate components that don't need them", "A React performance issue", "A way to update props"], ans: 1, explanation: "Prop drilling is passing data through multiple components that don't use it just to reach a deeply nested component." },
      { q: "What is the difference between useEffect and useLayoutEffect?", options: ["No difference", "useLayoutEffect fires synchronously before browser paint; useEffect fires after", "useLayoutEffect is deprecated", "useEffect fires before paint"], ans: 1, explanation: "useLayoutEffect runs synchronously after DOM mutations but before the browser paints. useEffect runs after painting." },
      { q: "What is the useReducer hook used for?", options: ["Reducing component size", "Managing complex state logic with a reducer function and dispatch", "Replacing Redux", "Optimizing renders"], ans: 1, explanation: "useReducer is an alternative to useState for complex state logic. Takes reducer(state, action) => newState and dispatch." },
      { q: "What is code splitting in React?", options: ["Separating CSS from JS", "Breaking the bundle into smaller chunks loaded on demand using React.lazy", "Splitting components into files", "A performance testing technique"], ans: 1, explanation: "Code splitting with React.lazy() and Suspense loads component code only when needed, reducing initial bundle size." },
      { q: "What causes infinite re-render loops in useEffect?", options: ["Too many components", "Missing dependency array or objects/functions as deps without memoization", "Using state inside effects", "Server-side rendering"], ans: 1, explanation: "Infinite loops happen when effect updates a dependency that triggers the effect again. Objects recreated each render also cause this." },
      { q: "What is the purpose of useMemo?", options: ["Add memos to components", "Cache the result of an expensive computation between renders", "Memoize functions", "Handle async operations"], ans: 1, explanation: "useMemo returns a memoized value. The computation only re-runs when specified dependencies change." },
      { q: "What are controlled components?", options: ["Components controlled by CSS", "Form elements whose value is controlled by React state", "Components with lifecycle methods", "Components that control their children"], ans: 1, explanation: "Controlled components have their form element values controlled by React state via value prop and onChange handler." },
      { q: "What is reconciliation in React?", options: ["Error handling process", "React's process of comparing old and new virtual DOM to determine minimal DOM updates", "Component re-mounting", "State synchronization"], ans: 1, explanation: "Reconciliation is how React updates the DOM efficiently by diffing the previous and new virtual DOM trees." },
    ],
    Hard: [
      { q: "What is React Fiber?", options: ["A CSS framework", "React's reimplemented core reconciliation algorithm enabling interruptible rendering", "A state management library", "A testing framework"], ans: 1, explanation: "React Fiber is a complete rewrite of React's reconciliation engine enabling incremental rendering, prioritization, and concurrent features." },
      { q: "What are React Server Components?", options: ["Components running on Node.js server", "Components that execute on the server with no client-side JS sent, enabling direct data access", "Server-side rendered components", "API route handlers"], ans: 1, explanation: "RSC run exclusively on the server, have no client-side JS bundle, and can directly access databases and backend resources." },
      { q: "What is the Concurrent Mode in React?", options: ["Running React on multiple threads", "React's ability to interrupt, pause, and resume rendering for better responsiveness", "Handling concurrent user actions", "A deprecated React feature"], ans: 1, explanation: "Concurrent Mode allows React to work on multiple renders simultaneously, prioritizing urgent updates and deferring non-urgent ones." },
      { q: "What is the difference between useEffect cleanup and componentWillUnmount?", options: ["No difference", "useEffect cleanup runs before next effect execution AND on unmount; componentWillUnmount only on unmount", "componentWillUnmount runs before next render", "They're completely different concepts"], ans: 1, explanation: "useEffect's cleanup function runs both before the next effect (when deps change) and when unmounting, not just on unmount." },
      { q: "What is the render props pattern?", options: ["Passing JSX as a return value", "A pattern where a component's prop is a function that returns JSX, sharing code between components", "Rendering conditional props", "A CSS-in-JS pattern"], ans: 1, explanation: "Render props share code between components using a prop whose value is a function. The function returns what to render." },
    ],
  },

  'Node.js': {
    Easy: [
      { q: "What is Node.js?", options: ["A browser extension", "A JavaScript runtime built on Chrome's V8 engine for server-side development", "A CSS framework", "A database"], ans: 1, explanation: "Node.js is a JavaScript runtime environment that allows JS to run on the server, outside of a browser." },
      { q: "What is npm?", options: ["Node Process Manager", "Node Package Manager — manages packages/dependencies", "Node Programming Module", "Network Protocol Manager"], ans: 1, explanation: "npm (Node Package Manager) is the default package manager for Node.js used to install and manage dependencies." },
      { q: "What is Express.js?", options: ["A database ORM", "A minimal, fast web framework for Node.js", "A frontend framework", "A testing library"], ans: 1, explanation: "Express.js is a minimal and flexible Node.js web application framework providing routing and middleware capabilities." },
      { q: "What is middleware in Express?", options: ["A database layer", "Functions that execute between request and response in the request cycle", "A type of route", "An error handler only"], ans: 1, explanation: "Middleware functions have access to req, res, and next. They can modify req/res, end the cycle, or call next()." },
      { q: "What is the purpose of package.json?", options: ["Store application data", "Project manifest containing metadata, dependencies, and scripts", "Configure the server", "Store environment variables"], ans: 1, explanation: "package.json is the project manifest containing name, version, dependencies, devDependencies, and npm scripts." },
      { q: "What is the difference between dependencies and devDependencies?", options: ["No difference", "dependencies needed in production; devDependencies only for development/testing", "devDependencies are more important", "dependencies are optional"], ans: 1, explanation: "dependencies are required in production (express, mongoose). devDependencies are only for development (nodemon, jest)." },
      { q: "What does require() do in Node.js?", options: ["Makes HTTP requests", "Imports modules/files synchronously", "Creates server routes", "Handles errors"], ans: 1, explanation: "require() is Node's CommonJS module system function that imports external modules, files, or built-in Node modules." },
      { q: "What is the .env file used for?", options: ["Storing HTML templates", "Storing environment variables like API keys, database URLs", "Environment configuration for CSS", "Event listeners configuration"], ans: 1, explanation: ".env files store sensitive environment variables (API keys, passwords, URLs) that shouldn't be committed to version control." },
      { q: "What is REST API?", options: ["A JavaScript library", "An architectural style for APIs using HTTP methods and resource-based URLs", "A database type", "A server type"], ans: 1, explanation: "REST (Representational State Transfer) uses HTTP methods (GET, POST, PUT, DELETE) on resource-based URLs to create APIs." },
      { q: "Which module is used to work with the file system in Node.js?", options: ["http", "path", "fs", "os"], ans: 2, explanation: "The 'fs' (File System) module provides APIs to interact with the file system — read, write, delete files." },
    ],
    Medium: [
      { q: "What is the Node.js event loop?", options: ["A for-each loop", "A mechanism handling async operations in single-threaded Node via libuv", "A DOM event system", "A scheduling algorithm"], ans: 1, explanation: "Node's event loop (powered by libuv) allows handling thousands of concurrent connections by delegating I/O to the OS." },
      { q: "What is JWT used for?", options: ["JavaScript Unit Testing", "JSON Web Token — compact token for authentication/authorization", "JavaScript Threading", "JSON Validation Tool"], ans: 1, explanation: "JWT is a compact, signed token with header, payload, and signature used for stateless authentication." },
      { q: "What is the difference between authentication and authorization?", options: ["They're the same", "Authentication verifies identity; authorization determines permissions", "Authorization happens first", "Authentication checks permissions"], ans: 1, explanation: "Authentication ('who are you?') verifies identity. Authorization ('what can you do?') controls access to resources." },
      { q: "What is bcrypt used for?", options: ["Encrypting network traffic", "Hashing passwords securely with salt", "Generating tokens", "Compressing files"], ans: 1, explanation: "bcrypt is a password hashing function that adds salt and multiple rounds of hashing to securely store passwords." },
      { q: "What is MongoDB?", options: ["A SQL relational database", "A NoSQL document database storing JSON-like documents", "A caching system", "A message queue"], ans: 1, explanation: "MongoDB is a NoSQL database storing data in flexible BSON documents (similar to JSON), ideal for JavaScript apps." },
      { q: "What is Mongoose?", options: ["A testing framework", "An ODM (Object Document Mapper) for MongoDB in Node.js", "A HTTP client", "A caching library"], ans: 1, explanation: "Mongoose is an ODM that provides schema-based modeling for MongoDB, adding validation and query building." },
      { q: "What is CORS and why is it needed?", options: ["A CSS feature", "Cross-Origin Resource Sharing — security feature controlling cross-domain API requests from browsers", "A type of server", "An authentication method"], ans: 1, explanation: "CORS is a browser security mechanism. APIs must send proper headers to allow requests from different domains." },
      { q: "What does async/await do in Node.js?", options: ["Creates multiple threads", "Makes asynchronous code readable by writing it synchronously with Promises", "Speeds up code execution", "Handles HTTP requests"], ans: 1, explanation: "async/await is syntactic sugar over Promises, making async Node.js code easier to read and maintain." },
      { q: "What is rate limiting?", options: ["Limiting server speed", "Restricting number of requests a client can make in a time period", "Limiting database queries", "Controlling file upload size"], ans: 1, explanation: "Rate limiting prevents API abuse by restricting how many requests a client IP can make in a given time window." },
      { q: "What is the purpose of the .gitignore file?", options: ["Ignore git commands", "Specify files/folders not to track in version control (node_modules, .env)", "Speed up git", "Configure git settings"], ans: 1, explanation: ".gitignore tells Git which files to ignore — typically node_modules, .env, build outputs, and OS files." },
    ],
    Hard: [
      { q: "What is the difference between process.nextTick() and setImmediate()?", options: ["No difference", "nextTick() runs before I/O events; setImmediate() runs after I/O events in check phase", "setImmediate() runs first always", "Both run in the same phase"], ans: 1, explanation: "nextTick() callbacks run before the event loop continues. setImmediate() runs in the check phase after I/O events." },
      { q: "What are Worker Threads in Node.js?", options: ["A way to create web workers", "Threads for running CPU-intensive JS operations without blocking the event loop", "A clustering technique", "A type of child process"], ans: 1, explanation: "Worker Threads (Node 10.5+) run JavaScript in separate threads, ideal for CPU-intensive tasks that would block the event loop." },
      { q: "What is connection pooling?", options: ["Creating new DB connection per request", "Maintaining a pool of reusable database connections to improve performance", "A type of database", "Load balancing technique"], ans: 1, explanation: "Connection pooling reuses pre-established DB connections instead of creating a new one per request, dramatically improving performance." },
      { q: "What is the Cluster module in Node.js?", options: ["A database clustering tool", "Creates multiple Node processes sharing the same port to utilize all CPU cores", "A module for grouping routes", "A caching mechanism"], ans: 1, explanation: "The Cluster module forks multiple Node processes (workers) that share the server port, utilizing multiple CPU cores." },
      { q: "What is event-driven architecture?", options: ["Using DOM events", "A pattern where components communicate via events rather than direct calls, enabling loose coupling", "A CSS animation system", "A database design pattern"], ans: 1, explanation: "Event-driven architecture uses events to trigger and communicate between services — central to Node.js design with EventEmitter." },
    ],
  },

  'HR Questions': {
    Easy: [
      { q: "What is the STAR method in interviews?", options: ["Skills, Training, Achievements, Results", "Situation, Task, Action, Result — a structured way to answer behavioral questions", "Strategy, Thinking, Analysis, Reporting", "Start, Think, Act, Review"], ans: 1, explanation: "STAR (Situation, Task, Action, Result) is a technique to structure answers to behavioral interview questions clearly." },
      { q: "How should you research a company before an interview?", options: ["Only check their website", "Read their website, news, engineering blog, LinkedIn, Glassdoor, and understand their product", "Ask friends about them", "No research needed"], ans: 1, explanation: "Thorough research includes: company website, recent news, tech stack, culture, Glassdoor reviews, and their product." },
      { q: "What should you do if you don't know the answer to an interview question?", options: ["Make something up", "Stay silent", "Admit you don't know, share your thought process, and ask clarifying questions", "Change the subject"], ans: 2, explanation: "Be honest about knowledge gaps. Show how you'd approach finding the answer. Interviewers value integrity and problem-solving." },
      { q: "What is the best structure for answering 'Tell me about yourself'?", options: ["List all your jobs chronologically", "Present → Past → Future: current role, relevant experience, why this opportunity", "Talk about personal life", "Read from resume"], ans: 1, explanation: "Present-Past-Future: start with what you do now, relevant background, and why this specific role excites you." },
      { q: "When should you send a thank-you note after an interview?", options: ["Never necessary", "Within 24 hours via email", "After one week", "Only if you really liked the company"], ans: 1, explanation: "Send a brief thank-you email within 24 hours. It reinforces your interest and keeps you top of mind." },
      { q: "What does 'culture fit' mean in hiring?", options: ["Dressing like the team", "Whether your values and work style align with the company's culture and team dynamics", "Matching the company's demographics", "Being friends with the interviewer"], ans: 1, explanation: "Culture fit means your values, communication style, and work approach align with how the company operates and what they value." },
      { q: "How should you handle nervousness in an interview?", options: ["Pretend you're not nervous", "Prepare thoroughly, practice out loud, and remember it's a two-way conversation", "Cancel the interview", "Ask to reschedule"], ans: 1, explanation: "Preparation is the best antidote to nerves. Practice answers aloud, research the company, and reframe it as a conversation." },
      { q: "What questions should you ask the interviewer at the end?", options: ["Salary questions only", "Thoughtful questions about the role, team, culture, tech stack, and growth opportunities", "No questions needed", "How soon can I start?"], ans: 1, explanation: "Ask about: team dynamics, technical challenges, success metrics for the role, company direction, and engineering culture." },
      { q: "How do you handle a question about your greatest weakness?", options: ["Say you have no weaknesses", "Share a real weakness with steps you're taking to improve it", "Make up a fake weakness", "Refuse to answer"], ans: 1, explanation: "Choose a genuine weakness that isn't critical for the role, and show self-awareness with concrete improvement steps." },
      { q: "What does 'growth mindset' mean?", options: ["Wanting a salary raise", "Believing abilities can be developed through dedication and hard work", "Growing a company quickly", "Expanding your network"], ans: 1, explanation: "Growth mindset (Dweck) is the belief that intelligence and skills can be developed — you embrace challenges and learn from failure." },
    ],
    Medium: [
      { q: "How do you prioritize tasks when everything seems urgent?", options: ["Do tasks in order received", "Clarify deadlines and impact, communicate with stakeholders, and tackle highest-impact items first", "Do easiest tasks first", "Ask manager to decide everything"], ans: 1, explanation: "Assess urgency vs importance, communicate proactively with stakeholders about trade-offs, and confirm priorities explicitly." },
      { q: "How should you discuss a conflict with a previous manager?", options: ["Complain extensively", "Briefly explain the disagreement professionally, focus on resolution and learning", "Claim there was never conflict", "Blame the manager entirely"], ans: 1, explanation: "Be factual and brief. Focus on how you communicated constructively and what you learned — never badmouth former employers." },
      { q: "What is the best way to show leadership without formal authority?", options: ["Ignore it — only managers lead", "Take initiative, propose solutions, build consensus, and influence through expertise and trust", "Force others to follow you", "Wait for a promotion first"], ans: 1, explanation: "Leadership without authority means: identifying gaps, proposing solutions, rallying colleagues, and delivering results through collaboration." },
      { q: "How do you describe a time you failed professionally?", options: ["Claim you never fail", "Own the failure honestly, explain what you learned, and show how you applied those lessons", "Blame others for the failure", "Minimize its importance"], ans: 1, explanation: "Use STAR: describe the failure honestly, take ownership, explain specific learnings, and show concrete changes you made after." },
      { q: "What does it mean to be 'data-driven'?", options: ["Using Excel spreadsheets", "Making decisions based on evidence, metrics, and analysis rather than gut feeling alone", "Collecting lots of data", "Using databases"], ans: 1, explanation: "Being data-driven means using quantitative evidence to validate assumptions, measure success, and inform decisions." },
      { q: "How should you handle receiving critical feedback?", options: ["Dismiss it", "Listen actively, ask clarifying questions, thank them, and reflect before responding", "Argue immediately", "Ignore the person giving it"], ans: 1, explanation: "Good feedback receivers listen without interrupting, ask questions to understand, reflect before reacting, and take action." },
      { q: "What is 'managing up'?", options: ["Getting promoted", "Proactively communicating with your manager to align expectations and support their goals", "Giving orders to managers", "A hierarchical management style"], ans: 1, explanation: "Managing up means understanding your manager's priorities, communicating proactively, and making their job easier through alignment." },
      { q: "How do you demonstrate initiative in a job?", options: ["Only do assigned tasks", "Identify problems without being asked, propose solutions, and take ownership beyond your job description", "Work longer hours always", "Copy successful colleagues"], ans: 1, explanation: "Initiative means spotting issues before being asked, proposing improvements, volunteering for stretch assignments, and owning outcomes." },
      { q: "What makes a strong answer to 'Where do you see yourself in 5 years?'", options: ["Say you want the interviewer's job", "Show ambition aligned with the company's growth path and relevant to the role", "Say you have no plans", "Promise to stay forever"], ans: 1, explanation: "Show career direction (technical depth, leadership aspirations) aligned with what the company can realistically offer you." },
      { q: "How do you handle working with a difficult coworker?", options: ["Ignore them completely", "Have a direct, respectful conversation to understand their perspective and find common ground", "Complain to everyone", "Ask for them to be fired"], ans: 1, explanation: "Address it directly with empathy first. If that fails, involve your manager. Focus on work impact, not personality." },
    ],
    Hard: [
      { q: "How do you influence a decision when you disagree with leadership?", options: ["Accept all decisions silently", "Build a data-driven case, propose alternatives, find allies, and present through proper channels", "Go around leadership", "Threaten to leave"], ans: 1, explanation: "Use data, propose solutions not just problems, find champions who agree, and accept the final decision with professionalism." },
      { q: "What is 'psychological safety' in a team?", options: ["Physical safety at work", "Team environment where members feel safe to speak up, take risks, and admit mistakes without fear", "Mental health benefits", "Work-life balance policy"], ans: 1, explanation: "Psychological safety (Edmondson) is when team members believe they won't be punished for speaking up, sharing ideas, or making mistakes." },
      { q: "How do you approach a situation where requirements change significantly mid-project?", options: ["Refuse to accept changes", "Assess impact, communicate clearly with stakeholders, re-prioritize, and adapt the plan", "Start over completely", "Blame product management"], ans: 1, explanation: "Acknowledge the change, assess scope/timeline impact, communicate trade-offs to stakeholders, get alignment, then adapt and execute." },
      { q: "What is 'technical debt' and how do you communicate it to non-technical stakeholders?", options: ["Money owed for software licenses", "Code shortcuts that need future refactoring — translate to business impact: slower features, more bugs", "Unpaid developer invoices", "Server hosting costs"], ans: 1, explanation: "Technical debt is code that works but needs improvement. Frame it in business terms: slower delivery, higher bug rate, talent retention risk." },
      { q: "How do you know when to ask for help vs figure it out yourself?", options: ["Always figure it out yourself", "Set a time-box (30-60 min), try systematically, then ask specific targeted questions", "Always ask immediately", "Never ask for help"], ans: 1, explanation: "Time-box your independent effort, document what you tried, then ask specific questions. Respects others' time while showing initiative." },
    ],
  },
};

const DOMAINS = ['Web Development', 'JavaScript', 'React', 'Node.js', 'HR Questions'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const DOMAIN_ICONS = { 'Web Development': '🌐', 'JavaScript': '⚡', 'React': '⚛️', 'Node.js': '🟢', 'HR Questions': '🤝' };

export default function MCQ() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [screen, setScreen] = useState('setup'); // setup | quiz | result
  const [domain, setDomain] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const timerRef = useRef(null);

  // Timer
  useEffect(() => {
    if (!timerRunning) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerRunning, currentIdx]);

  const handleTimeUp = () => {
    if (answered) return;
    setAnswered(true);
    setTimerRunning(false);
    const q = questions[currentIdx];
    setResults(prev => [...prev, { question: q.q, selected: -1, correct: q.ans, isCorrect: false, explanation: q.explanation, options: q.options, timedOut: true }]);
  };

  const startQuiz = () => {
    if (!domain || !difficulty) { toast.error('Please select domain and difficulty'); return; }
    const pool = mcqBank[domain]?.[difficulty] || [];
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
    
    // Shuffle options for each question so correct answer isn't always B
    const questionsWithShuffledOptions = shuffled.map(q => {
      const optionsWithIndex = q.options.map((opt, i) => ({ opt, isCorrect: i === q.ans }));
      const shuffledOptions = optionsWithIndex.sort(() => Math.random() - 0.5);
      const newCorrectIndex = shuffledOptions.findIndex(o => o.isCorrect);
      return {
        ...q,
        options: shuffledOptions.map(o => o.opt),
        ans: newCorrectIndex
      };
    });
    
    setQuestions(questionsWithShuffledOptions);
    setCurrentIdx(0);
    setResults([]);
    setSelected(null);
    setAnswered(false);
    setTimeLeft(30);
    setTimerRunning(true);
    setScreen('quiz');
  };

  const handleSelect = (optIdx) => {
    if (answered) return;
    setSelected(optIdx);
    setAnswered(true);
    setTimerRunning(false);
    clearInterval(timerRef.current);
    const q = questions[currentIdx];
    const isCorrect = optIdx === q.ans;
    setResults(prev => [...prev, { question: q.q, selected: optIdx, correct: q.ans, isCorrect, explanation: q.explanation, options: q.options, timedOut: false }]);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setScreen('result');
      setTimerRunning(false);
      return;
    }
    setCurrentIdx(i => i + 1);
    setSelected(null);
    setAnswered(false);
    setTimeLeft(30);
    setTimerRunning(true);
  };

  const score = results.filter(r => r.isCorrect).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const getScoreColor = (p) => p >= 80 ? '#22c55e' : p >= 60 ? '#f59e0b' : '#ef4444';
  const getDiffClass = (d) => d === 'Easy' ? 'selected-easy' : d === 'Medium' ? 'selected-medium' : 'selected-hard';

  // ── SETUP SCREEN ──
  if (screen === 'setup') return (
    <div style={{ padding: '40px 0 80px', animation: 'pageIn 0.3s ease' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>📝</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', margin: 0 }}>
              MCQ Quiz
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Test your knowledge with multiple choice questions — 30 seconds per question!
          </p>
        </div>

        {/* Domain */}
        <div className="setup-section">
          <p className="setup-section-title">Select Domain</p>
          <div className="domain-grid">
            {DOMAINS.map(d => (
              <div key={d} className={`domain-card${domain === d ? ' selected' : ''}`} onClick={() => setDomain(d)}>
                <span className="domain-icon">{DOMAIN_ICONS[d]}</span>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="setup-section">
          <p className="setup-section-title">Difficulty</p>
          <div className="difficulty-grid">
            {DIFFICULTIES.map(d => (
              <button key={d} className={`difficulty-chip${difficulty === d ? ' ' + getDiffClass(d) : ''}`} onClick={() => setDifficulty(d)}>
                {d === 'Easy' ? '🟢' : d === 'Medium' ? '🟡' : '🔴'} {d}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="setup-section">
          <p className="setup-section-title">Number of Questions</p>
          <div className="difficulty-grid">
            {[5, 10, 15].map(c => (
              <button key={c} className={`difficulty-chip${count === c ? ' selected-easy' : ''}`} onClick={() => setCount(c)}>
                {c} Questions
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={startQuiz}
            disabled={!domain || !difficulty}
            style={{ minWidth: 220, fontSize: '1.05rem' }}
          >
            🚀 Start Quiz
          </button>
        </div>
      </div>
    </div>
  );

  // ── QUIZ SCREEN ──
  if (screen === 'quiz') {
    const q = questions[currentIdx];
    const progress = ((currentIdx + (answered ? 1 : 0)) / questions.length) * 100;
    const timerColor = timeLeft <= 10 ? '#ef4444' : timeLeft <= 20 ? '#f59e0b' : '#00d4aa';

    return (
      <div style={{ padding: '32px 0 80px', animation: 'pageIn 0.3s ease' }}>
        <div className="container" style={{ maxWidth: 720 }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="badge badge-accent">{domain}</span>
              <span className={`badge badge-${difficulty === 'Easy' ? 'success' : difficulty === 'Medium' ? 'warning' : 'danger'}`}>{difficulty}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Q {currentIdx + 1}/{questions.length}</span>
            </div>
            {/* Timer */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 16px', borderRadius: 100,
              background: `${timerColor}15`,
              border: `1px solid ${timerColor}40`,
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '1rem', color: timerColor,
              animation: timeLeft <= 10 ? 'pulse 1s ease infinite' : 'none'
            }}>
              ⏱ {timeLeft}s
            </div>
          </div>

          {/* Progress */}
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* Score so far */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 700 }}>
              ✅ {results.filter(r => r.isCorrect).length} Correct
            </span>
            <span style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 700 }}>
              ❌ {results.filter(r => !r.isCorrect).length} Wrong
            </span>
          </div>

          {/* Question */}
          <div className="question-card" style={{ marginBottom: 20 }}>
            <div className="question-num">Question {currentIdx + 1}</div>
            <p className="question-text">{q.q}</p>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {q.options.map((opt, i) => {
              let bg = 'var(--bg-card)';
              let border = 'var(--border)';
              let color = 'var(--text-primary)';
              let icon = null;

              if (answered) {
                if (i === q.ans) { bg = 'rgba(34,197,94,0.12)'; border = '#22c55e'; color = '#22c55e'; icon = '✅'; }
                else if (i === selected && !q.ans === i) { bg = 'rgba(239,68,68,0.1)'; border = '#ef4444'; color = '#ef4444'; icon = '❌'; }
                else if (i === selected && selected !== q.ans) { bg = 'rgba(239,68,68,0.1)'; border = '#ef4444'; color = '#ef4444'; icon = '❌'; }
              } else if (selected === i) {
                bg = 'var(--accent-dim)'; border = 'var(--accent)'; color = 'var(--accent)';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                  style={{
                    width: '100%', padding: '16px 20px',
                    background: bg, border: `1px solid ${border}`,
                    borderRadius: 'var(--radius-md)', color,
                    cursor: answered ? 'default' : 'pointer',
                    textAlign: 'left', fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem', fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: 12,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: answered && i === q.ans ? '#22c55e' : answered && i === selected && i !== q.ans ? '#ef4444' : 'var(--bg-elevated)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                    color: answered && (i === q.ans || i === selected) ? '#fff' : 'var(--text-muted)'
                  }}>
                    {['A', 'B', 'C', 'D'][i]}
                  </span>
                  <span style={{ flex: 1 }}>{opt}</span>
                  {icon && <span>{icon}</span>}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div style={{
              background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 20,
              animation: 'pageIn 0.3s ease'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                💡 Explanation
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                {results[results.length - 1]?.timedOut && <span style={{ color: 'var(--danger)', fontWeight: 700 }}>⏱ Time expired! </span>}
                {q.explanation}
              </p>
            </div>
          )}

          {answered && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary btn-lg" onClick={handleNext}>
                {currentIdx + 1 >= questions.length ? '🏆 See Results' : 'Next Question →'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── RESULT SCREEN ──
  return (
    <div style={{ padding: '40px 0 80px', animation: 'pageIn 0.4s ease' }}>
      <div className="container" style={{ maxWidth: 720 }}>

        {/* Score hero */}
        <div style={{
          textAlign: 'center', padding: '40px 24px 32px',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', marginBottom: 24,
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
            width: 300, height: 200,
            background: `radial-gradient(ellipse, ${getScoreColor(pct)}15 0%, transparent 70%)`,
            pointerEvents: 'none'
          }} />
          <div style={{ fontSize: 48, marginBottom: 12 }}>
            {pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : pct >= 40 ? '📈' : '💪'}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 4.5rem)',
            fontWeight: 800, color: getScoreColor(pct), lineHeight: 1, marginBottom: 8
          }}>
            {pct}%
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 16 }}>
            {score} out of {questions.length} correct
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span className="badge badge-accent">{domain}</span>
            <span className={`badge badge-${difficulty === 'Easy' ? 'success' : difficulty === 'Medium' ? 'warning' : 'danger'}`}>{difficulty}</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { icon: '✅', label: 'Correct', value: score, color: '#22c55e' },
            { icon: '❌', label: 'Wrong', value: questions.length - score - results.filter(r => r.timedOut).length, color: '#ef4444' },
            { icon: '⏱', label: 'Timed Out', value: results.filter(r => r.timedOut).length, color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Question review */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 24 }}>
          <button
            onClick={() => setShowDetails(v => !v)}
            style={{
              width: '100%', padding: '16px 20px',
              background: 'transparent', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem'
            }}
          >
            <span>📋 Review Answers</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{showDetails ? '▲ Hide' : '▼ Show'}</span>
          </button>

          {showDetails && (
            <div style={{ borderTop: '1px solid var(--border)' }}>
              {results.map((r, i) => (
                <div key={i} style={{
                  padding: '16px 20px',
                  borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none',
                  background: r.isCorrect ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)'
                }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                    <span style={{ flexShrink: 0, fontSize: '1rem' }}>{r.isCorrect ? '✅' : '❌'}</span>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{r.question}</p>
                  </div>
                  {!r.isCorrect && (
                    <div style={{ marginLeft: 28, fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                      {r.timedOut ? <span style={{ color: '#f59e0b' }}>⏱ Time expired</span> : <><span style={{ color: '#ef4444' }}>Your answer: </span>{r.options[r.selected]}</>}
                      {' · '}
                      <span style={{ color: '#22c55e' }}>Correct: {r.options[r.correct]}</span>
                    </div>
                  )}
                  <div style={{ marginLeft: 28, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    💡 {r.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={() => { setScreen('setup'); setResults([]); setCurrentIdx(0); }}>
            🔄 Try Again
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/dashboard')}>
            🏠 Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
