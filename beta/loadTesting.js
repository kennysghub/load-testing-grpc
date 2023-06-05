// load_testing_script.js
const { Worker } = require('worker_threads');

// Number of concurrent requests to make
// const numWorkers = 2500;

// Path to your worker script
const workerScriptPath = './worker.js';

// Creates a new worker thread from the `Worker` class from `worker_threads` module. EACH worker_thread executes the `worker.js` file. 
function createWorker() {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerScriptPath);
    worker.on('message', (message) => {
      console.log('Worker message:', message);
    });
    worker.on('error', (error) => {
      reject(error);
    });
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
    resolve(worker);
  });
}

// Main execution function
async function runLoadTesting(numWorkers) {
  const startTime = new Date()
  console.log("START:", startTime)
  console.log(`Starting load testing with ${numWorkers} concurrent requests.`);

  const workers = [];

  // Create the desired number of worker threads
  for (let i = 0; i < numWorkers; i++) {
    const worker = await createWorker();
    workers.push(worker);
  }
  console.log(`Created ${numWorkers} worker threads. Sending gRPC requests...`);


  // Wait for all workers to finish
  await Promise.all(workers.map((worker) => {
    return new Promise((resolve) => {
      worker.on('exit', () => {
        resolve();
      });
    });
  }));
  const endTime = new Date();
  console.log(endTime);
  const duration = (endTime - startTime) / 1000;
  // Moves it over 2 decimal places pretty kool
  console.log(`Elapsed time: ${duration.toFixed(2)} seconds`);

  console.log('Load testing complete');
}

// Run the load testing script
runLoadTesting(20);
