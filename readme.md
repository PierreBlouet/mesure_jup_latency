AMM Transaction Latency Measurement Project
Overview
This project aims to measure the latency between the execution of a transaction on an Automated Market Maker (AMM) and the update of the quoted price in a self-hosted instance of the Jupiter Aggregator. It is designed to help you evaluate how quickly price updates are reflected after a transaction occurs on an AMM platform.

Getting Started

1. Configuration:
   To get started, you'll need to configure your environment.

Replace the provided .env.example file with your actual environment values. Rename it to .env and fill in the necessary configuration variables. 2. Running the Application:
Once your .env file is set, run the following command to start the application:

bash
Copier le code
npm run start
Notes
Sometimes, you may not see a price impact, as some transactions trigger on tokens that are not associated with AMMs. In such cases, no price variation will occur despite the transaction being triggered.
