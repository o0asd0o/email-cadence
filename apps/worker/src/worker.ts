import { NativeConnection, Worker } from "@temporalio/worker";
import * as activities from "./activities";
import {
  TEMPORAL_ADDRESS,
  TEMPORAL_NAMESPACE,
  TEMPORAL_TASK_QUEUE,
} from "@cadence/shared";

async function main() {
  console.log(`Connecting to Temporal at ${TEMPORAL_ADDRESS}...`);

  const connection = await NativeConnection.connect({
    address: TEMPORAL_ADDRESS,
  });

  const worker = await Worker.create({
    connection,
    namespace: TEMPORAL_NAMESPACE,
    taskQueue: TEMPORAL_TASK_QUEUE,
    workflowsPath: require.resolve("./workflows"),
    activities,
  });

  console.log(
    `Worker started | Namespace: ${TEMPORAL_NAMESPACE} | Task Queue: ${TEMPORAL_TASK_QUEUE}`,
  );

  await worker.run();
}

main().catch((err) => {
  console.error("Worker failed to start:", err);
  process.exit(1);
});
