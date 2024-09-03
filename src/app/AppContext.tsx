import { ParentComponent, Suspense, createContext, useContext } from 'solid-js'
import createTranslator, { initialLocale, Locale } from './createTranslator'
import createStateInLocalStorage from '../utils/createStateInLocalStorage'

type C = {
  locale(): Locale
  setLocale(value: Locale): void
  t: ReturnType<typeof createTranslator>
}
const AppContext = createContext<C>({} as C)

export const useAppState = () => useContext(AppContext)

export const AppContextProvider: ParentComponent = (props) => {
  const settings = createStateInLocalStorage('settings', {
    locale: initialLocale(),
  })
  const t = createTranslator(() => settings.locale)
 

  return (
    <Suspense>
      <AppContext.Provider
        value={{
          locale() {
            return settings.locale
          },
          setLocale(value) {
            settings.locale = value
          },
          t,
        }}
      >
        {props.children}
      </AppContext.Provider>
    </Suspense>
  )
}