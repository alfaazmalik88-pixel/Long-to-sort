--- src/lib/renderVideo.ts
+++ src/lib/renderVideo.ts
@@ -34,44 +34,47 @@
       const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
       formData.append('jobId', jobId);
 
-      // 1. Start the render job
-      const response = await fetch('/api/render/start', {
-        method: 'POST',
-        body: formData
-      });
-
-      if (!response.ok) {
-        const errData = await response.json().catch(() => ({}));
-        throw new Error(errData.error || `Failed to start render: ${response.status}`);
-      }
-
-      // 2. Poll for status
-      const pollInterval = setInterval(async () => {
-        try {
-          const statusRes = await fetch(`/api/render/status/${jobId}`);
-          if (!statusRes.ok) throw new Error("Failed to fetch job status");
-          const job = await statusRes.json();
-
-          if (job.status === 'completed') {
-            clearInterval(pollInterval);
-            onProgress(100);
-            resolve(job.url);
-          } else if (job.status === 'failed') {
-            clearInterval(pollInterval);
-            reject(new Error(job.error || "Render job failed"));
+      // 1. Start the render job using XHR for upload progress
+      await new Promise<void>((resolveStart, rejectStart) => {
+        const xhr = new XMLHttpRequest();
+        xhr.open('POST', '/api/render/start', true);
+        
+        // Track upload progress (0 to 50%)
+        xhr.upload.onprogress = (e) => {
+          if (e.lengthComputable) {
+            const percentComplete = Math.floor((e.loaded / e.total) * 40); // 0 to 40% for upload
+            onProgress(percentComplete);
+          }
+        };
+
+        xhr.onload = () => {
+          if (xhr.status >= 200 && xhr.status < 300) {
+            resolveStart();
           } else {
-            // Update progress (map 0-100 to 0-99 to show processing)
-            onProgress(job.progress || 0);
+            try {
+              const errData = JSON.parse(xhr.responseText);
+              rejectStart(new Error(errData.error || `Failed to start render: ${xhr.status}`));
+            } catch (e) {
+              rejectStart(new Error(`Server Error ${xhr.status}`));
+            }
           }
-        } catch (pollErr) {
-          console.error("Polling error:", pollErr);
-          // Don't reject immediately on poll error, it might be a temporary network glitch
-        }
-      }, 1500);
+        };
+
+        xhr.onerror = () => {
+          rejectStart(new Error("Network error during upload. Please check your connection."));
+        };
+
+        xhr.send(formData);
+      });
+
+      // 2. Poll for status (40 to 99%)
+      const pollInterval = setInterval(async () => {
+        try {
+          const statusRes = await fetch(`/api/render/status/${jobId}`);
+          if (!statusRes.ok) throw new Error("Failed to fetch job status");
+          const job = await statusRes.json();
+
+          if (job.status === 'completed') {
+            clearInterval(pollInterval);
+            onProgress(100);
+            resolve(job.url);
+          } else if (job.status === 'failed') {
+            clearInterval(pollInterval);
+            reject(new Error(job.error || "Render job failed"));
+          } else {
+            // job.progress is 0 to 100. We map it to 40 to 99
+            const renderProgress = job.progress || 0;
+            const mappedProgress = 40 + Math.floor(renderProgress * 0.59);
+            onProgress(mappedProgress);
+          }
+        } catch (pollErr) {
+          console.error("Polling error:", pollErr);
+        }
+      }, 1000);
 
     } catch (error) {
       console.error("renderVideoClip error:", error);
