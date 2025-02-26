/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import { computed, defineComponent, inject } from 'vue'

import { callEmit } from '@idux/cdk/utils'
import { ɵTrigger } from '@idux/components/_private/trigger'
import { FORM_TOKEN } from '@idux/components/form'

import { useTriggerProps } from '../composables/useTriggerProps'
import { dateRangePickerToken } from '../token'

export default defineComponent({
  setup() {
    const context = inject(dateRangePickerToken)!
    const {
      props,
      slots,
      locale,
      rangeControlContext: { fromControl, toControl },
      mergedPrefixCls,
      formatRef,
      inputRef,
      inputEnableStatus,
      renderSeparator,
    } = context
    const formContext = inject(FORM_TOKEN, null)

    const placeholders = computed(() => [
      props.placeholder?.[0] ?? locale.dateRangePicker[`${props.type}Placeholder`][0],
      props.placeholder?.[1] ?? locale.dateRangePicker[`${props.type}Placeholder`][1],
    ])
    const inputSize = computed(() => Math.max(10, formatRef.value.length) + 2)
    const triggerProps = useTriggerProps(context, formContext)

    const handleFromInput = (evt: Event) => {
      fromControl.handleInput(evt)
      callEmit(props.onInput, true, evt)
    }
    const handleToInput = (evt: Event) => {
      toControl.handleInput(evt)
      callEmit(props.onInput, false, evt)
    }

    const renderSide = (isFrom: boolean) => {
      const prefixCls = mergedPrefixCls.value
      const { inputValue } = isFrom ? fromControl : toControl
      const placeholder = placeholders.value[isFrom ? 0 : 1]
      const handleInput = isFrom ? handleFromInput : handleToInput

      const { disabled, readonly } = triggerProps.value

      return (
        <input
          ref={isFrom && inputEnableStatus.value.allowInput === true ? inputRef : undefined}
          class={`${prefixCls}-input-inner`}
          autocomplete="off"
          disabled={disabled}
          placeholder={placeholder}
          readonly={readonly}
          size={inputSize.value}
          value={inputValue.value}
          onInput={handleInput}
        />
      )
    }

    const renderContent = (prefixCls: string) => (
      <div class={`${prefixCls}-input`}>
        {renderSide(true)}
        <span class={`${prefixCls}-input-separator`}>{renderSeparator()}</span>
        {renderSide(false)}
      </div>
    )

    return () => {
      const prefixCls = mergedPrefixCls.value
      const triggerSlots = {
        default: () => renderContent(prefixCls),
        suffix: slots.suffix,
        clearIcon: slots.clearIcon,
      }

      return <ɵTrigger className={prefixCls} v-slots={triggerSlots} {...triggerProps.value} />
    }
  },
})
