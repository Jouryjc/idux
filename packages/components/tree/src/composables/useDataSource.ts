/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import type { TreeNode, TreeNodeDisabled, TreeProps } from '../types'
import type { ExpandableContext } from './useExpandable'
import type { GetNodeKey } from './useGetNodeKey'
import type { VKey } from '@idux/cdk/utils'
import type { ComputedRef } from 'vue'

import { computed } from 'vue'

import { isNil } from 'lodash-es'

export interface MergedNode {
  children?: MergedNode[]
  label: string
  isFirst: boolean
  isLeaf: boolean
  isLast: boolean
  key: VKey
  expanded: boolean
  level: number
  parentKey?: VKey
  rawNode: TreeNode
  checkDisabled?: boolean
  dragDisabled?: boolean
  dropDisabled?: boolean
  selectDisabled?: boolean
}

export function useMergeNodes(
  props: TreeProps,
  mergedChildrenKey: ComputedRef<string>,
  mergedGetKey: ComputedRef<GetNodeKey>,
  mergedLabelKey: ComputedRef<string>,
): {
  mergedNodes: ComputedRef<MergedNode[]>
  mergedNodeMap: ComputedRef<Map<VKey, MergedNode>>
} {
  const mergedNodes = computed(() =>
    convertMergeNodes(props, props.dataSource, mergedChildrenKey.value, mergedGetKey.value, mergedLabelKey.value),
  )

  const mergedNodeMap = computed(() => {
    const map = new Map<VKey, MergedNode>()
    convertMergedNodeMap(mergedNodes.value, map)
    return map
  })

  return { mergedNodes, mergedNodeMap }
}

export function useFlattedNodes(
  mergedNodes: ComputedRef<MergedNode[]>,
  { expandedKeys }: ExpandableContext,
): ComputedRef<MergedNode[]> {
  return computed(() => {
    const _expandedKeysMap = new Map(expandedKeys.value.map((item, index) => [item, index]))
    if (_expandedKeysMap.size > 0) {
      const nodes = flatNode(mergedNodes.value, _expandedKeysMap)
      return nodes
    }

    return mergedNodes.value.map(item => ({ ...item, expanded: false, level: 0 }))
  })
}

export function convertMergeNodes(
  props: TreeProps,
  nodes: TreeNode[],
  childrenKey: string,
  getKey: GetNodeKey,
  labelKey: string,
  parentKey?: VKey,
  parentLevel?: number,
): MergedNode[] {
  const { disabled, loadChildren } = props

  const level = isNil(parentLevel) ? -1 : parentLevel
  return nodes.map((node, index) =>
    convertMergeNode(
      node,
      childrenKey,
      getKey,
      labelKey,
      disabled,
      !!loadChildren,
      index === 0,
      index === nodes.length - 1,
      level,
      parentKey,
    ),
  )
}

function convertMergeNode(
  rawNode: TreeNode,
  childrenKey: string,
  getKey: GetNodeKey,
  labelKey: string,
  disabled: ((node: TreeNode) => boolean | TreeNodeDisabled) | undefined,
  hasLoad: boolean,
  isFirst: boolean,
  isLast: boolean,
  level: number,
  parentKey?: VKey,
): MergedNode {
  const key = getKey(rawNode)
  const { check, drag, drop, select } = convertDisabled(rawNode, disabled)
  const subNodes = (rawNode as Record<string, unknown>)[childrenKey] as TreeNode[] | undefined
  const label = rawNode[labelKey] as string

  level++

  const children = subNodes?.map((subNode, index) =>
    convertMergeNode(
      subNode,
      childrenKey,
      getKey,
      labelKey,
      disabled,
      hasLoad,
      index === 0,
      index === subNodes.length - 1,
      level,
      key,
    ),
  )
  return {
    children,
    label,
    key,
    isFirst,
    isLeaf: rawNode.isLeaf ?? !(children?.length || hasLoad),
    isLast,
    parentKey,
    expanded: false,
    level,
    rawNode,
    checkDisabled: check,
    dragDisabled: drag,
    dropDisabled: drop,
    selectDisabled: select,
  }
}

function convertDisabled(node: TreeNode, disabled?: (node: TreeNode) => boolean | TreeNodeDisabled) {
  const nodeDisabled = node.disabled || {}
  if (nodeDisabled === true) {
    return { check: true, drag: true, drop: true, select: true }
  }
  let { check, drag, drop, select } = nodeDisabled
  if (disabled) {
    const treeDisabled = disabled(node) || {}
    if (treeDisabled === true) {
      return { check: true, drag: true, drop: true, select: true }
    }
    check = check || treeDisabled.check
    drag = drag || treeDisabled.drag
    drop = drop || treeDisabled.drop
    select = select || treeDisabled.select
  }
  return { check, drag, drop, select }
}

export function convertMergedNodeMap(mergedNodes: MergedNode[], map: Map<VKey, MergedNode>): void {
  mergedNodes.forEach(item => {
    const { key, children } = item
    map.set(key, item)
    if (children) {
      convertMergedNodeMap(children, map)
    }
  })
}

// TODO: performance optimization
// when virtual scrolling is enabled, this do not need to traverse all nodes
function flatNode(mergedNodes: MergedNode[], expandedKeysMap: Map<VKey, number>) {
  const flattedNodes: MergedNode[] = []
  const stack: MergedNode[] = []

  mergedNodes.forEach(node => {
    stack.push(node)

    while (stack.length) {
      const _node = stack.pop()
      if (_node) {
        const { children, key } = _node

        const expanded = expandedKeysMap.has(key)
        _node.expanded = expanded

        flattedNodes.push(_node)

        if (children && expanded) {
          for (let i = children.length; i > 0; i--) {
            stack.push(children[i - 1])
          }
        }
      }
    }
  })

  return flattedNodes
}
