import { mount } from '@vue/test-utils'
import FolderPage from '@/views/FolderPage.vue'
import { describe, expect, test } from 'vitest'
describe('FolderPage.vue', function () {
  test('renders folder view', function () {
    var mockRoute = {
      params: {
        id: 'Outbox'
      }
    }
    var wrapper = mount(FolderPage, {
      global: {
        mocks: {
          $route: mockRoute
        }
      }
    })
    expect(wrapper.text()).toMatch('Explore UI Components')
  })
})
