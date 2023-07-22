import Logger from 'bunyan';
import { shutdown } from '../../tracing/dist/src/setup';
import {
  getActiveSpan,
  withObservabilityFunction,
} from '../../tracing/dist/src/spans';
import { meter } from '../../tracing/dist/src/metrics';
import {
  GetBucketAclCommand,
  ListBucketsCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const logger = new Logger({
  name: 'test',
});

const run = async () => {
  await mainWork();
  await shutdown();
  await new Promise((resolve) => setTimeout(resolve, 5000));
};

const mainWork = withObservabilityFunction({
  spanName: 'main',
  run: async () => {
    logger.info('doing stuff');
    for (let i = 0; i < 3; i += 1) {
      doWork(i);
    }
    await listBuckets();
    try {
      await expectBrokeBucket();
    } catch (err) {
      logger.error(err);
    }

    logger.info('done doing stuff');
  },
});

const doWork = withObservabilityFunction({
  spanName: 'doWork',
  run: async (i: number) => {
    const counter = meter.createCounter('counter', {
      description: 'Example counter',
    });
    counter.add(1);
    for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {}
  },
});

const listBuckets = withObservabilityFunction({
  spanName: 'listBuckets',
  run: async () => {
    const client = new S3Client({});
    const command = new ListBucketsCommand({});
    const { Owner, Buckets } = await client.send(command);
    getActiveSpan()?.setAttributes({
      bucketOwner: Owner?.ID,
      bucketCount: Buckets?.length,
    });
  },
});

const expectBrokeBucket = withObservabilityFunction({
  spanName: 'expectBrokeBucket',
  run: async () => {
    const client = new S3Client({});
    const command = new GetBucketAclCommand({
      Bucket: 'this-bucket-wont-exist',
    });
    const { Grants, Owner } = await client.send(command);
    getActiveSpan()?.setAttributes({
      owner: Owner?.ID,
      grantCount: Grants?.length,
    });
  },
});

run().then(() => {});
