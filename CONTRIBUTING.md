# Contributing Guidelines

* **Add semicolons (`;`) after each TypeScript line religiously**. This is because changes in the TypeScript file are minified and compiled (into JavaScript), where lines without semicolons can crash the whole app.

* If you want to raise a pull request, you should fork the TypeScript file. I will minify that file and accept the changes if they are valid.

* Please avoid adding comments or `console.log` statements while raising a PR; if needed, you can have them in your fork.

* Use constant variables and functions as much as possible. Declare global variables globally and local variables locally.

* Declare variables and functions in the following order: constant variables first, then `let` variables, followed by functions, and finally event handlers, all according to their respective scopes.
=======
<h1>Contributing guidelines</h1>
<ul>
    <li><b>Add semicolons (;) after each Typescript line religiously</b>, This is because changes in the Typescript file are minified and compiled (into JS), where lines withput semicolons can crash the whole app</li>
    <li>If you want to raise a pull request, then you should fork the TS file, then I will minify that file and accept the changes (if valid).</li>
    <li>Please don't add comments or console.log statements while raising a PR, if you want you can have them in your fork</li>
    <li>Use constant variables and functions as far as possible. Declare global variables globally and locals locally</li>
    <li>Declare constant variables first, then let variables, then functions, then event handlers (all according to their respective scopes).</li>
</ul>
