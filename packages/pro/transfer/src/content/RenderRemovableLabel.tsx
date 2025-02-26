/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import type { VKey } from '@idux/cdk/utils'
import type { Slot, VNodeChild } from 'vue'

import { IxIcon } from '@idux/components/icon'

export function renderRemovableLabel(
  key: VKey,
  disabled: boolean,
  defaultSlot: Slot | null,
  triggerRemove: (keys: VKey[]) => void,
  prefixCls: string,
): VNodeChild {
  const onClick = () => {
    triggerRemove([key])
  }
  return (
    <span class={`${prefixCls}-removable-label`}>
      {defaultSlot?.()}
      {!disabled && renderRemoveIcon(prefixCls, onClick)}
    </span>
  )
}

export function renderRemoveIcon(prefixCls: string, onClick: () => void): VNodeChild {
  return <IxIcon class={`${prefixCls}-close-icon`} name="close" onClick={onClick} />
}
