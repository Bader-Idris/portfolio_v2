// For fixing TypeScript import errors for .vue files
declare module '*.vue' {
  import { DefineComponent } from 'vue'

  // DefineComponent now takes three generic parameters: props, emit, slots
  const component: DefineComponent<{}, {}, any>
  export default component
}
