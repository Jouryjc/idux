/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import type { FormatContext } from './useFormat'
import type { InputEnableStatus } from './useInputEnableStatus'
import type { DateConfig } from '@idux/components/config'

import { type ComputedRef, watch } from 'vue'

import { useState } from '@idux/cdk/utils'

import { applyDateTime, convertToDate } from '../utils'

export interface PickerControlContext {
  inputValue: ComputedRef<string>
  dateInputValue: ComputedRef<string>
  timeInputVaue: ComputedRef<string>
  panelValue: ComputedRef<Date | undefined>
  dateInputFocused: ComputedRef<boolean>
  timeInputFocused: ComputedRef<boolean>

  visiblePanel: ComputedRef<'datePanel' | 'timePanel'>
  setVisiblePanel: (value: 'datePanel' | 'timePanel') => void

  init: (force?: boolean) => void
  handleInput: (evt: Event) => void
  handleDateInput: (evt: Event) => void
  handleTimeInput: (evt: Event) => void
  handleDateInputClear: () => void
  handleTimeInputClear: () => void
  handleDatePanelChange: (value: Date) => void
  handleTimePanelChange: (value: Date) => void
  handleDateInputFocus: () => void
  handleTimeInputFocus: () => void
  handleDateInputBlur: () => void
  handleTimeInputBlur: () => void
}

export function useControl(
  dateConfig: DateConfig,
  formatContext: FormatContext,
  inputEnableStatus: ComputedRef<InputEnableStatus>,
  valueRef: ComputedRef<string | number | Date | undefined>,
  handleChange: (value: Date | undefined) => void,
): PickerControlContext {
  const { formatRef, dateFormatRef, timeFormatRef } = formatContext

  const [inputValue, setInputValue] = useState<string>('')
  const [dateInputValue, setDateInputValue] = useState<string>('')
  const [timeInputVaue, setTimeInputValue] = useState<string>('')
  const [panelValue, setPanelValue] = useState<Date | undefined>(undefined)
  const [visiblePanel, setVisiblePanel] = useState<'datePanel' | 'timePanel'>('datePanel')
  const [dateInputFocused, setDateInputFocused] = useState(false)
  const [timeInputFocused, setTimeInputFocused] = useState(false)

  function initInputValue(currValue: Date | undefined, force = false) {
    if (!currValue) {
      setInputValue('')
      return
    }

    const { parse, format } = dateConfig

    if (force || parse(inputValue.value, formatRef.value).valueOf() !== currValue.valueOf()) {
      setInputValue(format(currValue, formatRef.value))
    }
  }
  function initDateInputValue(currValue: Date | undefined, force = false) {
    if (!currValue) {
      setDateInputValue('')
      return
    }

    const { isSame, parse, format } = dateConfig
    const parsedValue = parse(dateInputValue.value, dateFormatRef.value)

    if (
      force ||
      !isSame(parsedValue, currValue, 'year') ||
      !isSame(parsedValue, currValue, 'month') ||
      !isSame(parsedValue, currValue, 'date')
    ) {
      setDateInputValue(format(currValue, dateFormatRef.value))
    }
  }
  function initTimeInputValue(currValue: Date | undefined, force = false) {
    if (!currValue) {
      setTimeInputValue('')
      return
    }

    const { parse, format, isSame } = dateConfig
    const parsedValue = parse(timeInputVaue.value, timeFormatRef.value)

    if (
      force ||
      !isSame(parsedValue, currValue, 'hour') ||
      !isSame(parsedValue, currValue, 'minute') ||
      !isSame(parsedValue, currValue, 'second')
    ) {
      setTimeInputValue(format(currValue, timeFormatRef.value))
    }
  }

  function init(force = false) {
    const currDateValue = convertToDate(dateConfig, valueRef.value, formatRef.value)

    initInputValue(currDateValue, force)
    inputEnableStatus.value.enableOverlayDateInput && initDateInputValue(currDateValue, force)
    inputEnableStatus.value.enableOverlayTimeInput && initTimeInputValue(currDateValue, force)

    setPanelValue(currDateValue)
  }

  watch(valueRef, () => init(), { immediate: true })
  watch(inputEnableStatus, () => init())

  function parseInput(value: string, format: string) {
    return value ? dateConfig.parse(value, format) : undefined
  }
  function checkInputValid(date: Date | undefined) {
    return !date || dateConfig.isValid(date)
  }

  function handleInput(evt: Event) {
    const value = (evt.target as HTMLInputElement).value

    setInputValue(value)
    const currDate = parseInput(value, formatRef.value)
    if (checkInputValid(currDate)) {
      handleChange(currDate)
    }
  }
  function handleDateInput(evt: Event) {
    const value = (evt.target as HTMLInputElement).value

    setDateInputValue(value)
    let currDate = parseInput(value, dateFormatRef.value)
    if (!checkInputValid(currDate)) {
      return
    }

    const accessorValue = convertToDate(dateConfig, valueRef.value, formatRef.value)
    if (currDate && accessorValue) {
      currDate = applyDateTime(dateConfig, accessorValue, currDate, ['hour', 'minute', 'second'])
    }

    handleChange(currDate)
    setVisiblePanel('datePanel')
  }
  function handleTimeInput(evt: Event) {
    const value = (evt.target as HTMLInputElement).value

    setTimeInputValue(value)
    let currDate = parseInput(value, timeFormatRef.value)
    if (!checkInputValid(currDate)) {
      return
    }

    const accessorValue = convertToDate(dateConfig, valueRef.value, formatRef.value)
    if (currDate && accessorValue) {
      currDate = applyDateTime(dateConfig, accessorValue, currDate, ['year', 'month', 'date'])
    }

    handleChange(currDate)
    setVisiblePanel('timePanel')
  }

  function handleDateInputClear() {
    setDateInputValue('')
  }
  function handleTimeInputClear() {
    setTimeInputValue('')
  }

  function handleDatePanelChange(value: Date) {
    handleChange(
      panelValue.value ? applyDateTime(dateConfig, panelValue.value, value, ['hour', 'minute', 'second']) : value,
    )
  }
  function handleTimePanelChange(value: Date) {
    handleChange(
      panelValue.value ? applyDateTime(dateConfig, panelValue.value, value, ['year', 'month', 'date']) : value,
    )
  }

  function handleDateInputFocus() {
    setVisiblePanel('datePanel')
    setDateInputFocused(true)
  }
  function handleTimeInputFocus() {
    setVisiblePanel('timePanel')
    setTimeInputFocused(true)
  }
  function handleDateInputBlur() {
    setDateInputFocused(false)
  }
  function handleTimeInputBlur() {
    setTimeInputFocused(false)
  }

  return {
    inputValue,
    dateInputValue,
    timeInputVaue,
    dateInputFocused,
    timeInputFocused,
    panelValue,

    visiblePanel,
    setVisiblePanel,

    init,
    handleInput,
    handleDateInput,
    handleTimeInput,
    handleDateInputClear,
    handleTimeInputClear,
    handleDatePanelChange,
    handleTimePanelChange,
    handleDateInputFocus,
    handleTimeInputFocus,
    handleDateInputBlur,
    handleTimeInputBlur,
  }
}
