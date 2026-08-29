const fs = require('fs');
let code = fs.readFileSync('src/components/VideoUploader.tsx', 'utf8');

code = code.replace(
  /const isProcessing = status === 'uploading' \|\| status === 'analyzing' \|\| status === 'error';/,
  "const isProcessing = status === 'uploading' || status === 'analyzing';\n  const isError = status === 'error';"
);

code = code.replace(
  /isProcessing && "opacity-50 pointer-events-none"/,
  "isProcessing && \"opacity-50 pointer-events-none\""
);

code = code.replace(
  /<input\s*type="file"\s*accept="video\/\*"\s*onChange=\{handleFileSelect\}\s*className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"\s*disabled=\{isProcessing\}\s*\/>/,
  `{!isProcessing && !isError && (
            <input
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              disabled={isProcessing}
            />
          )}`
);

// We need to also conditionally render the inner content, because currently it's doing:
// {isProcessing ? (
// But error state is rendered inside the `isProcessing ?` block because I patched it earlier to say `{status === 'error' ? ... : status === 'uploading' ? ...}`

code = code.replace(
  /\{isProcessing \? \(/,
  `{(isProcessing || isError) ? (`
);

// We also need to fix the button click so we give it pointer-events-auto just in case, and z-index.
code = code.replace(
  /<button onClick=\{\(\) => onCancel\?\.\(\)\} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors">/,
  `<button onClick={(e) => { e.stopPropagation(); onCancel?.(); }} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors relative z-10 pointer-events-auto cursor-pointer">`
);

fs.writeFileSync('src/components/VideoUploader.tsx', code);
