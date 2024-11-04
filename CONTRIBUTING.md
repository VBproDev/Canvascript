# Contributing Guidelines

* **Add semicolons (`;`) after each TypeScript line religiously**. This is because changes in the TypeScript file are minified and compiled (into JavaScript), where lines without semicolons can crash the whole app.

* If you want to raise a pull request, you should fork the TypeScript file. I will minify that file and accept the changes if they are valid.

* Please avoid adding comments or `console.log` statements while raising a PR; if needed, you can have them in your fork.

* Use constant variables and functions as much as possible. Declare global variables globally and local variables locally.

* Declare variables and functions in the following order: constant variables first, then `let` variables, followed by functions, and finally event handlers, all according to their respective scopes.
