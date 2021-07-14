import { flushPromises, mount, MountingOptions } from '@vue/test-utils'
import { createFakeEvent, renderWork } from '@tests'
import Avatar from '../src/Avatar'
import { AvatarProps } from '../src/types'
import { h } from 'vue'
import { IxIcon } from '@idux/components/icon'

const imageBase64 =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1OCAoODQ2NjMpIC0gaHR0cHM6Ly9za2V0Y2guY29tIC0tPgogICAgPHRpdGxlPjUxMjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iNTAlIiB5MT0iMCUiIHgyPSI1MCUiIHkyPSI5OS42Mjc4NTA1JSIgaWQ9ImxpbmVhckdyYWRpZW50LTEiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDBBQ0ZGIiBvZmZzZXQ9IjAlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMzMzY2RkYiIG9mZnNldD0iMTAwJSI+PC9zdG9wPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSI1MCUiIHkxPSIwJSIgeDI9IjUwJSIgeTI9IjEwMCUiIGlkPSJsaW5lYXJHcmFkaWVudC0yIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzFEQjgzRiIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjNzJEMTNEIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPC9kZWZzPgogICAgPGcgaWQ9IjUxMiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZD0iTTE3Ny44NjkyNSwyNDguOTI4NjgyIEwyODAuNTE5MjA2LDMzNS4wNjIyMjIgQzI0MC43NTkwMDUsMzgyLjQ0NjU4NCAxNzAuMTE0Mzc4LDM4OC42MjcxODggMTIyLjczMDAxNiwzNDguODY2OTg3IEwxMTIuOTkyNTk3LDM0MC42OTU1OSBDODUuMjQ4NDQzMiwzMTcuMjM1NzE4IDU3LjM0MTc3NTUsMjkzLjgxOTQ4NyAyOS4yNzI1OTM4LDI3MC40NDY4OTggTDM2Ljk4NjA0NTEsMjYxLjI1NDM2NSBDNTUuMzkzNTQ1NiwyMzkuMzE3MTYgODEuMjE1MDAyOCwyMjcuMjcxMTE4IDEwNy43MTA4NywyMjUuNzA1ODczIEwxMTMuMzk2NDIzLDIyNS41MzA3OTggQzEzNi4xNjAyNzQsMjI1LjQ3NTQwMiAxNTkuMDY1OTMyLDIzMy4xNTA4MjQgMTc3Ljg2OTI1LDI0OC45Mjg2ODIgWiIgaWQ9Iui3r+W+hCIgZmlsbD0iIzIwNEVEOSI+PC9wYXRoPgogICAgICAgIDxwYXRoIGQ9Ik0zODEuNzUyMzkzLDE4MC41MzgwMzYgTDM4OS4zMjY2NjIsMTgwLjkxMTk3MyBMMzk0LjgwNDIyNCwxODEuNDUwODI5IEw0MDIuMDY0NTE3LDE4Mi41MTcxNjYgTDQwNy41NjUxNDcsMTgzLjU5NzY2NiBMNDEzLjc0NjMzOCwxODUuMTAwMjg4IEw0MjAuNjc3NjQyLDE4Ny4xNjE2MiBMNDI2LjM1MDY2LDE4OS4xNTgzNzUgTDQzMi44NTAyNiwxOTEuODA4MDMgTDQzNS43MjcwNCwxOTMuMTEwNTYgTDQzNS43MjcwNCwxOTMuMTEwNTYgTDQ0MS40MTU1OTIsMTk1LjkzNDUyNCBMNDQ3LjIyMDUxMywxOTkuMTc4NDE4IEw0NTMuNzcyNzk1LDIwMy4zMjA3OTMgTDQ1OC42MTM5ODQsMjA2Ljc0Mjc2NSBMNDYzLjI4NjA4NiwyMTAuMzY4NTEgTDQ2OC43NTQxNDgsMjE1LjA2MzA2NCBMNDczLjg5MzE5NSwyMTkuOTgwMzQ2IEw0NzguMTMyNTIxLDIyNC40NjIzMjIgTDQ4MC4zNTQ0ODEsMjI2Ljk4NTg3MyBMNDgwLjM1NDQ4MSwyMjYuOTg1ODczIEw0ODQuODMyMDEyLDIzMi40ODg4MDIgTDQ4OC41MjE4NzYsMjM3LjUwOTgyNCBMMjg5LjE4OTgxMywzNzcuMDgzNjM3IEMyNzAuMjkwMzUxLDM5MC4zMTcxODMgMjQ4LjUzNDIyMSwzOTcuMjQxMTEyIDIyNi42NzM5NzMsMzk3Ljk5MzYwMSBMMjIwLjExNTUyNywzOTguMDM0MzQzIEMxOTMuODkxMjcsMzk3LjQ1Nzg0MyAxNjcuOTEzNDQ5LDM4OC4wMTQzNjcgMTQ2LjkzODQ2NiwzNjkuOTQyNjgzIEwxMzEuMDcyMzI2LDM1Ni4xMzU0NDggTDEzMS4wNzIzMjYsMzU2LjEzNTQ0OCBMMTEwLjU0NjAxNSwzMzguNTg3NTc2IEwzMDIuNTUzOTM5LDIwNC41NzM4NTMgQzMwOS44Mzg3NCwxOTkuNDg5MzU5IDMxNy40NTM4NTUsMTk1LjIzMTQyNSAzMjUuMjg3OTA1LDE5MS43ODAzMjggTDMzMy4xODk1MTEsMTg4LjU5NzkyIEMzMzcuMjkzMzI0LDE4Ny4wOTYzMTMgMzQxLjQ0NDc3MiwxODUuODA3MTI2IDM0NS42MjkwMzEsMTg0LjcyNzUyNiBMMzUxLjkyODE3MiwxODMuMjY0OTYxIEwzNTguNTc2NzQ2LDE4Mi4wNjYyOCBMMzY1LjU0MzcyMSwxODEuMTc5NDIgTDM3Mi4yMDE2OTEsMTgwLjY3NzM2OSBDMzc1LjM4NjczMywxODAuNTE3MTAzIDM3OC41NzI0MjYsMTgwLjQ3MTAzNSAzODEuNzUyMzkzLDE4MC41MzgwMzYgWiIgaWQ9Iui3r+W+hCIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC0xKSI+PC9wYXRoPgogICAgICAgIDxwYXRoIGQ9Ik0yMDUuNTU1NDA4LDEyOS44Nzc5MDMgTDI1NC41ODIyNTMsMTcxLjAxNjMxMSBDMjM0LjcwMjE1MiwxOTQuNzA4NDkyIDE5OS4zNzk4MzksMTk3Ljc5ODc5NCAxNzUuNjg3NjU4LDE3Ny45MTg2OTMgTDEzMS4yNTcwOCwxNDAuNjM3MDEyIEwxMzUuMTEzODA2LDEzNi4wNDA3NDUgQzE1Mi44NjM4OTUsMTE0Ljg4NzAxMiAxODQuNDAxNjc1LDExMi4xMjc4MTQgMjA1LjU1NTQwOCwxMjkuODc3OTAzIFoiIGlkPSLot6/lvoQiIGZpbGw9IiMwMzc4MkEiPjwvcGF0aD4KICAgICAgICA8cGF0aCBkPSJNMjg4LjI1ODAyNSwxMDQuNTEzNzYyIEwyOTMuMDY1MjMyLDEwNC44ODgxNjUgTDI5Ny41MTAxNjYsMTA1LjU4ODM2IEwzMDIuMzA1MTE3LDEwNi43Mzk2OSBMMzA1LjkxNDI0OSwxMDcuODkyNDE1IEwzMTAuMDY1ODM2LDEwOS41NDUzMzkgTDMxMC4wNjU4MzYsMTA5LjU0NTMzOSBMMzEyLjgwMjYyMSwxMTAuODQxNzg5IEwzMTcuMjMwMDQ1LDExMy4zMjU2MzQgTDMxOC44MTY4LDExNC4zNDM5MjIgTDMyMS4xNjYyMzEsMTE1Ljk4OTgyNiBMMzIzLjIzNzMxNSwxMTcuNTkwMzMxIEwzMjQuODcyMzA3LDExOC45NjMyNTcgTDMyNy4wOTA4OTcsMTIwLjk5ODcyMyBMMzI4Ljg0NjU1OSwxMjIuNzY3ODUzIEwzMjguODQ2NTU5LDEyMi43Njc4NTMgTDMzMC41MzkxMjcsMTI0LjYyNDc5OCBMMzMyLjM2ODkwOSwxMjYuODI0OTI4IEwzMzQuNDc2MTA1LDEyOS42NTM3ODIgTDI1Mi42NTMyNDMsMTg2Ljk0Njc2NyBDMjQzLjk1NTEyNCwxOTMuMDM3MjU2IDIzNC4wNDcxMjcsMTk2LjQ1NDcwNyAyMjQuMDAyNDI1LDE5Ny4yNTMzMjcgTDIxOC45NzM2NTEsMTk3LjQzNDY1MSBDMjA1LjU1OTcwNiwxOTcuMzM3NTU5IDE5Mi4yMjA3MDgsMTkyLjYwMDgyNSAxODEuNTAwNDc4LDE4My4zNTI5MzQgTDE2OS41MDk5OTgsMTczLjAwOTI1MiBMMjUyLjI4MjcyNiwxMTUuMTMyODEgQzI1NC42ODA0ODUsMTEzLjQ1NjI0NyAyNTcuMTU5NDg1LDExMS45ODI1NzMgMjU5LjY5OTM0MiwxMTAuNzA4MTg3IEwyNjMuODA1ODA1LDEwOC44NDExOTYgTDI2My44MDU4MDUsMTA4Ljg0MTE5NiBMMjY2LjI4MjQzOSwxMDcuODkyODYzIEwyNzEuMDcxMDUxLDEwNi40MTAxNjYgTDI3MS4wNzEwNTEsMTA2LjQxMDE2NiBMMjc1LjkzMDM4NiwxMDUuMzQ4ODM3IEwyNzkuMTg3NDg4LDEwNC44NzQzMjcgTDI4MC44NjU2MzQsMTA0LjcwMTkxNCBDMjgzLjMyOTM1NSwxMDQuNDg0MzY5IDI4NS43OTg1MzksMTA0LjQyMjU0NSAyODguMjU4MDI1LDEwNC41MTM3NjIgWiIgaWQ9Iui3r+W+hCIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC0yKSI+PC9wYXRoPgogICAgPC9nPgo8L3N2Zz4='

const getScaleStyle = (style: string) => {
  return +/(\w+)\(([^)]*)\)/g.exec(style)![2]
}

describe('Avatar', () => {
  const AvatarMount = (options?: MountingOptions<Partial<AvatarProps>>) =>
    mount(Avatar, { ...(options as MountingOptions<AvatarProps>) })

  renderWork<AvatarProps>(Avatar)

  describe('image', () => {
    test('src work', async () => {
      const wrapper = AvatarMount({ props: { src: imageBase64 } })
      expect(wrapper.html()).toMatchSnapshot()
    })

    test('alt work', async () => {
      const wrapper = AvatarMount({ props: { src: imageBase64 } })
      expect(wrapper.find('img').element.alt).toBe('')

      const alt = 'alt work'
      await wrapper.setProps({ alt })

      expect(wrapper.find('img').element.alt).toBe(alt)
    })

    test('srcset work', async () => {
      const wrapper = AvatarMount({ props: { src: imageBase64 } })
      expect(wrapper.find('img').element.srcset).toBe('')

      const srcset = 'srcset.svg'
      await wrapper.setProps({ srcset })

      expect(wrapper.find('img').element.srcset).toBe(srcset)
    })

    test('error work', async () => {
      const wrapper = AvatarMount({ props: { src: imageBase64 } })
      const src = 'https://error.svg'
      const onError = jest.fn()
      await wrapper.setProps({ src, onError })
      const event = createFakeEvent('error')
      await wrapper.vm.handleError(event)

      expect(onError).toBeCalledWith(event)

      // default fallback icon
      expect(wrapper.find('.ix-icon-user').exists()).toBe(true)

      //  fallback text
      const text = 'fallback text'
      await wrapper.setProps({ text })
      await wrapper.vm.handleError(event)

      expect(wrapper.find('.ix-avatar-text').text()).toBe(text)
    })
  })

  describe('text', () => {
    test('text work', async () => {
      let text = 'text'
      const wrapper = AvatarMount({ props: { text } })
      expect(wrapper.find('.ix-avatar-text').text()).toBe(text)

      text = 'text2'

      await wrapper.setProps({ text })

      expect(wrapper.find('.ix-avatar-text').text()).toBe(text)
    })

    test('text slot work', async () => {
      const text = 'text'
      const textSlot = 'text slot'
      const wrapper = AvatarMount({ props: { text }, slots: { default: () => textSlot } })
      expect(wrapper.find('.ix-avatar-text').text()).toBe(textSlot)
    })

    test('short text work', async () => {
      const text = 'U'

      jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function () {
        return this.className === 'ix-avatar-text' ? 10 : 40
      })

      const wrapper = AvatarMount({ props: { text } })
      await flushPromises()

      expect(getScaleStyle(wrapper.find('.ix-avatar-text')!.attributes('style'))).toBe(1)

      jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockClear()
    })

    test('long text work', async () => {
      const text = 'LongUsername'

      jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function () {
        return this.className === 'ix-avatar-text' ? 80 : 40
      })

      const wrapper = AvatarMount({ props: { text } })
      await flushPromises()

      expect(getScaleStyle(wrapper.find('.ix-avatar-text')!.attributes('style'))).toBeLessThan(1)

      jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockClear()
    })

    test('gap work', async () => {
      const text = 'LongUsername'

      jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function () {
        return this.className === 'ix-avatar-text' ? 80 : 40
      })

      const wrapper = AvatarMount({ props: { text } })
      await flushPromises()

      const defaultScale = getScaleStyle(wrapper.find('.ix-avatar-text')!.attributes('style'))

      await wrapper.setProps({ gap: 8 })
      await flushPromises()

      expect(getScaleStyle(wrapper.find('.ix-avatar-text')!.attributes('style'))).toBeLessThan(defaultScale)

      await wrapper.setProps({ gap: 2 })
      await flushPromises()

      expect(getScaleStyle(wrapper.find('.ix-avatar-text')!.attributes('style'))).toBeGreaterThan(defaultScale)

      jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockClear()
    })
  })

  test('icon work', async () => {
    const wrapper = AvatarMount()
    expect(wrapper.find('.ix-icon-user').exists()).toBe(true)

    await wrapper.setProps({ icon: 'up' })

    expect(wrapper.find('.ix-icon-up').exists()).toBe(true)

    await wrapper.setProps({ icon: h(IxIcon, { name: 'down' }) })

    expect(wrapper.find('.ix-icon-down').exists()).toBe(true)
  })

  test('icon slot work', async () => {
    const wrapper = AvatarMount({
      props: { icon: 'up' },
      slots: { icon: () => h(IxIcon, { name: 'down' }) },
    })

    expect(wrapper.find('.ix-icon-down').exists()).toBe(true)
  })

  test('shape work', async () => {
    const wrapper = AvatarMount()
    expect(wrapper.classes()).toContain('ix-avatar-circle')

    await wrapper.setProps({ shape: 'square' })

    expect(wrapper.classes()).toContain('ix-avatar-square')
  })

  test('size work', async () => {
    const wrapper = AvatarMount()
    expect(wrapper.classes()).toContain('ix-avatar-medium')

    await wrapper.setProps({ size: 'large' })

    expect(wrapper.classes()).toContain('ix-avatar-large')

    await wrapper.setProps({ size: 'small' })

    expect(wrapper.classes()).toContain('ix-avatar-small')

    await wrapper.setProps({ size: 64 })

    expect(wrapper.attributes('style')).toContain('width: 64px; height: 64px; line-height: 64px; font-size: 32px;')
  })
})