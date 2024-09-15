import Client, {
  CommitmentLevel,
  SubscribeRequest,
} from "@triton-one/yellowstone-grpc";

import bs58 from "bs58";
import { jupMesure } from "./jupiter";

require("dotenv").config();

async function subrscribe() {
  const client = new Client(
    process.env.TRITON_ENDPOINT || "",
    process.env.TRITON_TOKEN || "",
    undefined
  );

  const AMM = process.env.AMM || "";
  const MINT = process.env.MINT || "";

  // Fetch and display the version information
  const version = await client.getVersion();
  console.log(version);

  // Create a subscription stream.
  const stream = await client.subscribe();

  console.log("Starting blockhash subscription...");

  // Collecting all incoming events
  stream.on("data", async (data) => {
    if (data.slot) {
      if (data.slot.status === 0) {
        // console.log("Slot: ", data.slot.slot);
      }
    }

    if (data.transaction) {
      const txnSignature = bs58.encode(
        Buffer.from(data.transaction.transaction.signature)
      );
      const logMessage = `\n\nTransaction Signature on AMM: ${txnSignature} \n  on slot: ${data.transaction.slot}`;
      console.log(logMessage);

      jupMesure("So11111111111111111111111111111111111111112", MINT);
    }
  });

  const request: SubscribeRequest = {
    slots: { incoming_slots: {} },
    accounts: {},
    transactions: {
      accountsSubscription: {
        accountInclude: [AMM],
        accountExclude: [],
        accountRequired: [],
        vote: false,
        failed: false,
      },
    },
    blocks: {},
    blocksMeta: {},
    accountsDataSlice: [],
    commitment: CommitmentLevel.PROCESSED,
    entry: {},
    transactionsStatus: {},
  };

  // Sending the subscription request
  await new Promise<void>((resolve, reject) => {
    stream.write(request, (err: null | undefined) => {
      if (err === null || err === undefined) {
        resolve();
      } else {
        reject(err);
      }
    });
  }).catch((reason) => {
    console.error(reason);
    throw reason;
  });
}

subrscribe();
