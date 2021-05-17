class RoundGlass extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
                    <svg class="animate-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 237 286">
                      <defs/>
                      <path id="first-layer" fill="transparent" d="M40.152 139.663h157.812l-18.367 35.251-26.611 16.914-34.789 8.235-36.545-8.235-26.88-19.191-14.62-32.974z"/>
                      <path fill="url(#first-linear)" d="M40.152 139.663h157.812l-18.367 35.251-26.611 16.914-34.789 8.235-36.545-8.235-26.88-19.191-14.62-32.974z"/>
                      <path id="second-layer" fill="transparent" d="M42.026 101.562h154.86v38.101H42.026v-38.101z"/>
                      <path id="third-layer" fill="transparent" d="M52.4 73.217L71.162 56.97l17.407-4.642 21.083-2.321h20.89l19.922 2.32 21.276 7.157 13.54 16.441 6.383 13.927 1.985 13.347H42.584L52.4 73.217z"/>
                      <path fill="url(#third-linear)" d="M52.4 73.217L71.162 56.97l17.407-4.642 21.083-2.321h20.89l19.922 2.32 21.276 7.157 13.54 16.441 6.383 13.927 1.985 13.347H42.584L52.4 73.217z"/>
                      <path stroke="#fff" stroke-width="9" d="M174.293 62.961c0 .065-.086 1.146-2.77 2.94-2.517 1.683-6.456 3.375-11.727 4.866-10.479 2.964-25.217 4.857-41.68 4.857-16.462 0-31.2-1.893-41.68-4.857-5.27-1.491-9.21-3.183-11.727-4.866-2.683-1.794-2.77-2.875-2.77-2.94 0-.064.087-1.145 2.77-2.94 2.517-1.683 6.456-3.374 11.727-4.865 10.48-2.965 25.218-4.857 41.68-4.857 16.463 0 31.201 1.892 41.68 4.857 5.271 1.49 9.21 3.182 11.727 4.865 2.684 1.795 2.77 2.876 2.77 2.94z"/>
                      <path fill="#fff" d="M59.059 60a83.52 83.52 0 10118.115 0l-5.906 5.906a75.164 75.164 0 01-11.391 115.652 75.17 75.17 0 01-83.522 0 75.168 75.168 0 01-11.39-115.652L59.059 60z"/>
                      <path fill="#fff" d="M113.649 197.053h8.933v72.428h-8.933z"/>
                      <path fill="#fff" d="M118.116 262.894l41.52 17.293H76.597l41.519-17.293z"/>
                      <path stroke="#fff" stroke-width="4.173" d="M66.341 87.497c-4.411 3.373-12.29 21.463-4.505 34.541m11.659-28.417c-3.06 0-9.035 12.533-2.04 19.091"/>
                      <defs>
                        <linearGradient id="first-linear" x1="118.116" x2="118.116" y1="139.663" y2="200.063" gradientUnits="userSpaceOnUse">
                          <stop id="upper" stop-color="transparent"/>
                          <stop offset="1" stop-color="#fff" stop-opacity="0"/>
                        </linearGradient>
                        <linearGradient id="third-linear" x1="118.674" x2="118.674" y1="34.393" y2="103.199" gradientUnits="userSpaceOnUse">
                          <stop offset=".524" stop-color="transparent"/>
                          <stop id="lower" offset="1" stop-color="transparent" stop-opacity=".91"/>
                        </linearGradient>
                      </defs>
                    </svg>`;
    }
}

customElements.define('round-glass', RoundGlass);