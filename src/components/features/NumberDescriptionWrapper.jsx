export default function NumberDescriptionWrapper(values, columns, onProgress) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("../workers/numberDescription.worker.js", import.meta.url),
      { type: "module" }
    );

    worker.onmessage = (e) => {
      const { type, progress, data } = e.data;

      if (type === "progress" && onProgress) {
        onProgress(progress);
      } else if (type === "result") {
        resolve(data);
        worker.terminate();
      }
    };

    worker.onerror = (err) => {
      console.error("Worker error:", err);
      reject(err);
      worker.terminate();
    };

    worker.postMessage({ values, columns });
  });
}