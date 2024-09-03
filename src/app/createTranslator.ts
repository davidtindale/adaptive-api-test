import { createEffect, createSignal } from 'solid-js'
import { dict as en_dict } from '../../lang/en/en'  // en dictionary is loaded by default
import * as i18n from '@solid-primitives/i18n'

type RawDictionary = typeof en_dict

export type Locale =
    | 'en'
    | 'zh-tw'


/*
for validating of other dictionaries have same keys as en dictionary
some might be missing, but the shape should be the same
*/
type DeepPartial<T> = T extends Record<string, unknown>
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T

const raw_dict_map: Record<Locale, () => Promise<{ dict: DeepPartial<RawDictionary> }>> = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
    en: () => null as any, // en is loaded by default
    'zh-tw': () => import('../../lang/zh-tw/zh-tw'),
}

type Dictionary = i18n.Flatten<RawDictionary>

const en_flat_dict: Dictionary = i18n.flatten(en_dict)

// Async because raw_dict_map uses dynamic import
async function fetchDictionary(locale: Locale): Promise<Dictionary> {
    if (locale === 'en') return en_flat_dict

    const { dict } = await raw_dict_map[locale]()
    const flat_dict = i18n.flatten(dict) as RawDictionary
    return { ...en_flat_dict, ...flat_dict }
}

// Some browsers does not map correctly to some locale code
// due to offering multiple locale code for similar language (e.g. tl and fil)
// This object maps it to correct `langs` key
const LANG_ALIASES: Partial<Record<string, Locale>> = {
    // fil: 'tl',
}

const toLocale = (string: string): Locale | undefined =>
    string in raw_dict_map
        ? (string as Locale)
        : string in LANG_ALIASES
            ? (LANG_ALIASES[string] as Locale)
            : undefined

export function initialLocale(
    // location: router.Location
): Locale {
    let locale: Locale | undefined

    // TODO: might be set in the url query
    // locale = toLocale(location.query.locale)
    // if (locale) return locale

    locale = toLocale(navigator.language.slice(0, 2))
    if (locale) return locale

    locale = toLocale(navigator.language.toLocaleLowerCase())
    if (locale) return locale

    return 'en'
}

export default function createTranslator(locale: () => Locale) {
    createEffect(() => document.documentElement.lang = locale())

    const [dict, setDict] = createSignal<Dictionary>(en_flat_dict)
    createEffect(() => {
        const loc = locale()
        if (loc === 'en')
            setDict(en_flat_dict)
        else
            fetchDictionary(loc).then(setDict)
    })
    return i18n.translator(dict, i18n.resolveTemplate)
}