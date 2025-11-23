import { Queue } from 'bullmq';

const queue = new Queue('statements', {
  connection: {
    host: '127.0.0.1',
    port: 6379,
  },
});

async function main() {
  const job = await queue.add('process-statements', {
    userId: 1,
    fileUrl:
      'https://wallet-statements.s3.us-east-1.amazonaws.com/statements/1/81f32c97-16d8-434f-8569-8a6d363a4c77.pdf',
  });
  console.log('Job queued:', job.id);
  process.exit(0);
}

main();
