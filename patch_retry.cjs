const fs = require('fs');
let content = fs.readFileSync('src/components/VideoUploader.tsx', 'utf8');

// Replace uploadNextChunk definition
const uploadFuncRegex = /const uploadNextChunk = \(\) => \{([\s\S]*?)uploadNextChunk\(\);\n    \} else if/m;

const match = content.match(uploadFuncRegex);
if (!match) {
  console.log("Could not find uploadNextChunk");
  process.exit(1);
}

const replacement = `const uploadNextChunk = (retryCount = 0) => {
        if (isCancelled) return;

        const start = currentChunk * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, pendingFile.size);
        const chunk = pendingFile.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('uploadId', uploadId);
        formData.append('fileName', fileName);
        formData.append('chunkIndex', currentChunk.toString());
        formData.append('totalChunks', totalChunks.toString());

        currentXhr = new XMLHttpRequest();
        currentXhr.open('POST', '/api/upload-chunk', true);

        currentXhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const chunkProgress = e.loaded / e.total;
            const overallProgress = ((currentChunk + chunkProgress) / totalChunks) * 100;
            setUploadProgress(Math.min(overallProgress, 99.9)); // keep max at 99.9 until fully done
          }
        };

        currentXhr.onload = () => {
          if (isCancelled) return;
          if (currentXhr.status === 200) {
            currentChunk++;
            setUploadProgress((currentChunk / totalChunks) * 100);

            if (currentChunk < totalChunks) {
              uploadNextChunk(0); // Reset retry count for the next chunk
            } else {
              try {
                const res = JSON.parse(currentXhr.responseText);
                const serverPath = res.videoPath;
                setUploadProgress(100);
                setTimeout(() => {
                  if (!isCancelled) {
                    onAnalyze(pendingFile, serverPath);
                    setIsUploading(false);
                    setUploadProgress(0);
                    setPendingFile(null);
                  }
                }, 500);
              } catch (e) {
                console.error("Parse error", e);
                alert("Upload failed to parse response.");
                setIsUploading(false);
              }
            }
          } else {
            if (retryCount < 5) {
              console.warn(\`Chunk \${currentChunk} failed with \${currentXhr.status}. Retrying (\${retryCount + 1}/5)...\`);
              setTimeout(() => uploadNextChunk(retryCount + 1), 2000);
            } else {
              alert("Server error uploading video chunk after retries");
              setIsUploading(false);
            }
          }
        };

        currentXhr.onerror = () => {
          if (isCancelled) return;
          if (retryCount < 5) {
            console.warn(\`Network error on chunk \${currentChunk}. Retrying (\${retryCount + 1}/5)...\`);
            setTimeout(() => uploadNextChunk(retryCount + 1), 2000);
          } else {
            alert("Network error uploading video after retries");
            setIsUploading(false);
          }
        };

        currentXhr.send(formData);
      };

      uploadNextChunk(0);
    } else if`;

content = content.replace(uploadFuncRegex, replacement);

// Also replace `{uploadProgress}%` with `{uploadProgress.toFixed(1)}%`
content = content.replace('{uploadProgress}%', '{uploadProgress.toFixed(1)}%');

fs.writeFileSync('src/components/VideoUploader.tsx', content);
console.log("Successfully patched");
