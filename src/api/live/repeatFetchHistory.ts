import { createSignal } from "solid-js"
import { AdaptiveHistory } from "../data/AdaptiveHistory"
import { Token } from "../apiSignIn"
import { fetchOrUpdateHistory } from "./apiLive"
import repeatActionAfterSignIn from "../repeatActionAfterSignIn"

export default function repeatFetchHistory(
  server: string,
  machine: string,
  retryMs: number,
  refreshMs: number | (() => number),
  tokenPerServer?: Map<string, Token>
) {
  const [history, setHistory] = createSignal<AdaptiveHistory | null>(null)

  return {
    ...repeatActionAfterSignIn(server, machine, retryMs, refreshMs,
      (server, token, machine) => fetchOrUpdateHistory(server, token, machine, history()).then(setHistory),
      () => setHistory(null),
      tokenPerServer),
    history
  }
}
