import { createEffect, createSignal } from "solid-js"
import { signIn, Token } from "../api/apiSignIn"
import { fetchLiveMachines } from "../api/live/apiLive"
import { LiveMachine } from "../api/live/apiLiveData"

export default function App() {
  const [token, setToken] = createSignal<Token>()
  signIn('https://demo.plantexplorer.app', 'data@adaptivecontrol.com', '').then(result => {
    if (typeof result === 'string')
      console.log(result)  // some sign-in problem
    else
      setToken(result)
  })

  const [liveMachines, setLiveMachines] = createSignal<LiveMachine[]>([])
  createEffect(() => {
    if (token()) {
      fetchLiveMachines(token()!.server, token()!.token).then(result => {
        if (typeof result === 'string')
          console.log(result)  // some fetch problem
        else
          setLiveMachines(result.machines)
      })
    }
  })

  return (
    <div style={{ height: '100%' }}>
      {JSON.stringify(token())}
    </div>
  )
}
