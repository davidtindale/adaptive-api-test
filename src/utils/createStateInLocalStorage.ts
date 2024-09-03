import { StoreNode, createMutable } from "solid-js/store"
import { createEffect } from "solid-js"

export default function createStateInLocalStorage<T extends StoreNode>(key: string, defaultState: T) {
  const mutableState = createMutable(getInitialStateFromLocalStorage(key, defaultState))

  // Store back to localStorage if any change
  createEffect(() => {
    const jsonAsString = JSON.stringify(mutableState)
    if (localStorage.getItem(key) === jsonAsString) return
    localStorage.setItem(key, jsonAsString)
  })

  return mutableState
}

export function getInitialStateFromLocalStorage<T extends StoreNode>(key: string, defaultState?: T) {
  let state = defaultState ?? {} as T
  const jsonAsString = localStorage.getItem(key)
  if (jsonAsString)
    try {
      state = { ...defaultState, ...JSON.parse(jsonAsString) }
    } catch {
    }
  return state
}

