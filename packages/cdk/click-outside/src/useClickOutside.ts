/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import type { ObjectDirective } from 'vue'

import { isFunction, isObject } from 'lodash-es'

import { NoopFunction, on } from '@idux/cdk/utils'

interface ClickOutsideOptions {
  exclude: (HTMLElement | null)[]
  handler: ClickOutsideHandler
}

type ClickOutsideHandler = (event: Event) => void

export type ClickOutsideBinding = ClickOutsideHandler | ClickOutsideOptions

interface DocumentHandlerOptions {
  exclude: HTMLElement[]
  handler: ClickOutsideHandler
}

const documentHandlerMap = new Map<HTMLElement, DocumentHandlerOptions>()

on(document, 'click', event => {
  documentHandlerMap.forEach(({ exclude, handler }) => {
    const target = event.target as Node
    if (exclude.some(item => item === target || item.contains(target))) {
      return
    }
    handler(event)
  })
})

function createHandler(el: HTMLElement, binding: ClickOutsideBinding): void {
  const exclude: HTMLElement[] = [el]
  let handler: ClickOutsideHandler = NoopFunction
  if (isFunction(binding)) {
    handler = binding
  } else if (isObject(binding)) {
    exclude.push(...(binding.exclude.filter(Boolean) as HTMLElement[]))
    handler = binding.handler
  }

  documentHandlerMap.set(el, { exclude, handler })
}

export const clickOutside: ObjectDirective<HTMLElement, ClickOutsideBinding> = {
  mounted(el, binding) {
    createHandler(el, binding.value)
  },
  updated(el, binding) {
    createHandler(el, binding.value)
  },
  unmounted(el) {
    documentHandlerMap.delete(el)
  },
}
