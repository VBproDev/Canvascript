# Contributing Guidelines

<h1>Typescript</h1>

* **Add semicolons (`;`) after each TypeScript line religiously**. This is because changes in the TypeScript file are minified and compiled (into JavaScript), where lines without semicolons can crash the whole app.

* If you want to raise a pull request, you should fork the TypeScript file. I will minify that file and accept the changes if they are valid.

* Please avoid adding comments or `console.log` statements while raising a PR; if needed, you can have them in your fork.

* Use constant variables and functions as much as possible. Declare global variables globally and local variables locally.

* Declare variables and functions in the following order: constant variables first, then `let` variables, followed by functions, and finally event handlers, all according to their respective scopes.

<h1>CSS</h1>

* Use responisive sizing units such as `rem` and `%` **only**.
* Refer to the 1st point in HTML

<h1>HTML</h1>

* For uniformity's sake, use **Bootstrap** classes as far as possible. That means, don't modify your design to suit Bootstrap, but if some aspect of the design could be replicated by it, then don't use custom CSS for that aspect.
