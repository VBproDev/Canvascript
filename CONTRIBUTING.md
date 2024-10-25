<h1>Contributing guidelines</h1>
<ul>
    <li><b>Add semicolons (;) after each Typescript line religiously</b>, This is because changes in the Typescript file are minified and compiled (into JS), where lines withput semicolons can crash the whole app</li>
    <li>If you want to raise a pull request, then you should fork the TS file, then I will minify that file and accept the changes (if valid).</li>
    <li>Please don't add comments or console.log statements while raising a PR, if you want you can have them in your fork</li>
    <li>Use constant variables and functions as far as possible. Declare global variables globally and locals locally</li>
    <li>Declare constant variables first, then let variables, then functions, then event handlers (all according to their respective scopes).</li>
</ul>
