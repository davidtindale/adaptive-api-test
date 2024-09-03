import { createEffect, createSignal, on } from "solid-js"
import { ConnectState } from "./ConnectState"
import { Token, signIn } from "./apiSignIn"

export default function repeatActionAfterSignIn(
  server: string,
  machine: string,
  retryMs: number,
  refreshMs: number | (() => number),
  action: (server: string, token: string, machine: string) => Promise<unknown>,
  clear: () => void,
  tokenPerServer?: Map<string, Token>
) {
  const [connectState, setConnectState] = createSignal<ConnectState>('connecting')

  let id: NodeJS.Timeout | undefined
  let refreshResolve: (() => void) | undefined
  let skipActionOnce = false

  if (typeof refreshMs === 'function') {
    createEffect<number>((prev => {
      const ret = refreshMs()
      if (id) {
        clearTimeout(id)
        id = undefined
        skipActionOnce = prev !== undefined && ret > prev // skip the action if the delay is greater
        refreshResolve?.()
      }
      return ret
    }))
  }

  let closed = false
    ; (async () => {
      for (; ;) {
        let token: Token
        for (; ;) {
          const tok = tokenPerServer?.get(server)
          if (tok) {
            token = tok
            break
          }
          const email = 'data@adaptivecontrol.com'
          const password = ''
          try {
            const tok = await signIn(server, '', email, password) // need a sign in for this server
            if (closed) return
            if (typeof tok !== 'string') {
              token = tok
              tokenPerServer?.set(server, token)
              break
            }
          } catch (e) { }
          if (closed) return
          setConnectState('failed')
          await new Promise(resolve => setTimeout(resolve, retryMs))
          if (closed) return
          setConnectState('retrying')
        }

        for (; ;) {
          try {
            if (skipActionOnce) 
              skipActionOnce = false
            else
                await action(server, token.token, machine)
            if (closed) return
            setConnectState('ok')

            // This refresh delay is aborted early if refreshMs changes
            await new Promise<void>(resolve => {
              refreshResolve = resolve
              id = setTimeout(() => {
                id = undefined
                resolve()
              }, 
              typeof refreshMs === 'function' ? refreshMs() : refreshMs)
            })
            refreshResolve = undefined

            if (closed) return
            setConnectState('refreshing')
          } catch (e) {
            if (e === 401) // bad token
              clear()
            setConnectState('failed')
            await new Promise(resolve => setTimeout(resolve, retryMs))
            if (closed) return
            if (e === 401) { // bad token
              tokenPerServer?.delete(server)
              break // retry sign in
            }
          }
        }
      }
    })()

  return {
    connectState, close: () => { closed = true; if (id) clearTimeout(id); refreshResolve?.() }
  }
}
