import App from 'demo/App.svelte';
import 'demo/style.css';
import { mount } from 'svelte';

const app = mount(App, {
    target: document.getElementById('app')!
});

export default app;
