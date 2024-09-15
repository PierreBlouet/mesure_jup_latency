type SwapMode = "ExactIn" | "ExactOut";

export async function getQuote(
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number,
  onlyDirectRouteParam?: boolean,
  swapModeParam?: SwapMode,
  excludeDex?: string[],
  metisEndpointParam?: string
) {
  const onlyDirectRoute = onlyDirectRouteParam || false;
  const swapMode = swapModeParam || "ExactIn";
  const metisEndpoint = metisEndpointParam || process.env.METIS_ENDPOINT;
  const excludeDexes = excludeDex ? excludeDex.join(",") : "";

  const response = await fetch(
    `${metisEndpoint}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}&swapMode=${swapMode}&onlyDirectRoutes=${onlyDirectRoute}` +
      (excludeDexes ? `&excludeDexes=${excludeDexes}` : "")
  );
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Error fetching quote: ${response.statusText} (Status: ${response.status})
      URL: ${response.url}
      Response Body: ${errorBody}`);
  }
  const data = await response.json();

  return data;
}

export async function jupMesure(TokenIn: string, TokenOut: string) {
  const timeLimit = 400; // Adjusted time limit
  const startTime = performance.now();

  let currentAmount = 1000000000;
  let priceStable = true;
  let initialProfit = 0;

  let quote = await getQuote(TokenIn, TokenOut, currentAmount, 0, false);
  initialProfit = (Number(quote.outAmount) - Number(quote.inAmount)) / 1e9;

  while (priceStable) {
    const currentTime = performance.now();
    if (currentTime - startTime > timeLimit) {
      console.log("Time limit exceeded.");
      return null;
    }

    const newQuote = await getQuote(TokenIn, TokenOut, currentAmount, 0, false);
    const newProfit =
      (Number(newQuote.outAmount) - Number(newQuote.inAmount)) / 1e9;

    if (newProfit != initialProfit) {
      console.log(
        "self hosted jupiter price updated in : ",
        performance.now() - startTime
      );
      // await pause(300);
      // process.exit();
      break;
    }
  }
}
