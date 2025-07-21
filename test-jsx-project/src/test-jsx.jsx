import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TestJSX',
  setup() {
    return () => (
      <div>
        <h1>Hello JSX</h1>
        <p>This is a test for JSX support in Vue 3</p>
      </div>
    )
  }
})