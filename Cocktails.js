class TallGlassInProcess extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
                    <svg class="animate-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 146 317">
                        <defs/>
                        <path id="third-layer" fill="transparent" d="M2.366 20.831l12.861-9.523 17.109-4.172 18.777-2.921H92.007l20.029 2.92 15.857 4.173 13.502 9.523v52.19H2.365V20.83z"/>
                        <path fill="url(#third-linear)" d="M2.366 20.831l12.861-9.523 17.109-4.172 18.777-2.921H92.007l20.029 2.92 15.857 4.173 13.502 9.523v52.19H2.365V20.83z"/>
                        <path id="second-layer" fill="transparent" d="M2.366 73.021h139.029v52.189H2.366z"/>
                        <path id="first-layer" fill="transparent" d="M2.366 125.21h139.029l-11.102 37.968-23.544 22.138-34.788 9.488-36.545-9.488-21.084-22.138L2.366 125.21z"/>
                        <path fill="url(#first-linear)" d="M2.366 125.21h139.029l-11.102 37.968-23.544 22.138-34.788 9.488-36.545-9.488-21.084-22.138L2.366 125.21z"/>
                        <path fill="#fff" d="M145.007 125.53a72.216 72.216 0 01-72.221 72.221 72.23 72.23 0 01-51.068-21.153A72.22 72.22 0 01.564 125.53h7.223a64.998 64.998 0 10129.998 0h7.222zM.564 22.506h7.218V125.53H.564z"/>
                        <path fill="#fff" d="M69.177 194.804h7.218v103.024h-7.218zM137.789 22.506h7.218V125.53h-7.218z"/>
                        <path fill="#fff" d="M71.657 292.395a1.927 1.927 0 012.257 0l20.412 14.763c1.514 1.095.74 3.487-1.128 3.487H52.373c-1.868 0-2.642-2.392-1.128-3.486l20.412-14.764z"/>
                        <path stroke="#fff" stroke-width="7.704" d="M141.155 22.506c0 1.238-.828 3.153-4.088 5.52-3.174 2.306-8.016 4.543-14.345 6.488-12.611 3.874-30.267 6.328-49.936 6.328-19.67 0-37.326-2.454-49.937-6.328-6.33-1.945-11.17-4.182-14.345-6.488-3.26-2.367-4.087-4.282-4.087-5.52 0-1.238.827-3.152 4.087-5.52 3.174-2.306 8.016-4.542 14.345-6.487C35.459 6.625 53.116 4.17 72.786 4.17c19.67 0 37.325 2.455 49.936 6.33 6.329 1.944 11.171 4.18 14.345 6.486 3.26 2.368 4.088 4.282 4.088 5.52z"/>
                        <rect width="5.534" height="39.462" x="14.322" y="47.17" fill="#fff" rx="2.767"/>
                        <rect width="5.534" height="39.462" x="24.428" y="58.72" fill="#fff" rx="2.767"/>
                        <defs>
                            <linearGradient id="third-linear" x1="71.88" x2="71.88" y1="4.215" y2="73.021" gradientUnits="userSpaceOnUse">
                                <stop offset=".524" stop-color="transparent"/>
                                <stop id="lower" offset="1" stop-color="transparent" stop-opacity=".91"/>
                            </linearGradient>
                            <linearGradient id="first-linear" x1="71.88" x2="71.88" y1="125.21" y2="194.804" gradientUnits="userSpaceOnUse">
                                <stop id="upper" stop-color="transparent"/>
                                <stop offset="1" stop-color="#fff" stop-opacity="0"/>
                            </linearGradient>
                        </defs>
                    </svg>`;
    }
}

class RoundGlassInProcess extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
                    <svg class='animate-svg' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 237 286">
                        <defs/>
                        <path id="third-layer" fill="transparent" d="M40.152 139.663h157.812l-18.367 35.251-26.611 16.914-34.789 8.235-36.545-8.235-26.88-19.191-14.62-32.974z"/>
                        <path fill="url(#third-linear)" d="M40.152 139.663h157.812l-18.367 35.251-26.611 16.914-34.789 8.235-36.545-8.235-26.88-19.191-14.62-32.974z"/>
                        <path id="second-layer" fill="transparent" d="M42.026 101.562h154.86v38.101H42.026v-38.101z"/>
                        <path id="first-layer" fill="transparent" d="M52.4 73.217L71.162 56.97l17.407-4.642 21.083-2.321h20.89l19.922 2.32 21.276 7.157 13.54 16.441 6.383 13.927 1.985 13.347H42.584L52.4 73.217z"/>
                        <path fill="url(#first-linear)" d="M52.4 73.217L71.162 56.97l17.407-4.642 21.083-2.321h20.89l19.922 2.32 21.276 7.157 13.54 16.441 6.383 13.927 1.985 13.347H42.584L52.4 73.217z"/>
                        <path stroke="#fff" stroke-width="9" d="M174.293 62.961c0 .065-.086 1.146-2.77 2.94-2.517 1.683-6.456 3.375-11.727 4.866-10.479 2.964-25.217 4.857-41.68 4.857-16.462 0-31.2-1.893-41.68-4.857-5.27-1.491-9.21-3.183-11.727-4.866-2.683-1.794-2.77-2.875-2.77-2.94 0-.064.087-1.145 2.77-2.94 2.517-1.683 6.456-3.374 11.727-4.865 10.48-2.965 25.218-4.857 41.68-4.857 16.463 0 31.201 1.892 41.68 4.857 5.271 1.49 9.21 3.182 11.727 4.865 2.684 1.795 2.77 2.876 2.77 2.94z"/>
                        <path fill="#fff" d="M59.059 60a83.52 83.52 0 10118.115 0l-5.906 5.906a75.164 75.164 0 01-11.391 115.652 75.17 75.17 0 01-83.522 0 75.168 75.168 0 01-11.39-115.652L59.059 60z"/>
                        <path fill="#fff" d="M113.649 197.053h8.933v72.428h-8.933z"/>
                        <path fill="#fff" d="M118.116 262.894l41.52 17.293H76.597l41.519-17.293z"/>
                        <path stroke="#fff" stroke-width="4.173" d="M66.341 87.497c-4.411 3.373-12.29 21.463-4.505 34.541m11.659-28.417c-3.06 0-9.035 12.533-2.04 19.091"/>
                        <defs>
                            <linearGradient id="third-linear" x1="118.116" x2="118.116" y1="139.663" y2="200.063" gradientUnits="userSpaceOnUse">
                                <stop stop-color="transparent"/>
                                <stop id="lower" offset="1" stop-color="#fff" stop-opacity="0"/>
                            </linearGradient>
                            <linearGradient id="first-linear" x1="118.674" x2="118.674" y1="34.393" y2="103.199" gradientUnits="userSpaceOnUse">
                                <stop id="upper" offset=".524" stop-color="transparent"/>
                                <stop offset="1" stop-color="transparent" stop-opacity=".91"/>
                            </linearGradient>
                        </defs>
                    </svg>`;
    }
}

class ShortGlassInProcess extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
                    <svg class='animate-svg' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 146 265">
                        <defs/>
                        <path id="third-layer" fill="transparent" d="M4.05 82.283h137.69l-8.359 26.862H14.249L4.05 82.283z"/>
                        <path fill="url(#third-linear)" d="M4.05 82.283h137.69l-8.359 26.862H14.249L4.05 82.283z"/>
                        <path id="second-layer" fill="transparent" d="M15.219 109.145h116.98l-12.998 13.864-14.442 9.532-32.597 10.105-33.836-10.105-13.864-9.532-9.243-13.864z"/>
                        <path id="first-layer" fill="transparent" d="M4.532 52.821l13.575-6.354 21.086-5.488 21.663-2.889H93.495l19.352 2.889 15.597 4.044 12.998 9.82 2.119 27.44H4.531V52.821z"/>
                        <path fill="url(#first-linear)" d="M4.532 52.821l13.575-6.354 21.086-5.488 21.663-2.889H93.495l19.352 2.889 15.597 4.044 12.998 9.82 2.119 27.44H4.531V52.821z"/>
                        <path fill="#fff" d="M145.205 72.959a72.219 72.219 0 01-72.22 72.221 72.229 72.229 0 01-51.069-21.153A72.219 72.219 0 01.763 72.959h7.222a64.998 64.998 0 00110.961 45.961 65.007 65.007 0 0019.037-45.961h7.222zM.763 54.31h7.218v18.649H.763zM137.987 54.31h7.218v18.649h-7.218z"/>
                        <path fill="#fff" d="M69.376 142.233h7.218v103.024h-7.218z"/>
                        <path fill="#fff" d="M71.855 239.824a1.924 1.924 0 012.258 0l20.412 14.763c1.513 1.095.74 3.487-1.129 3.487H52.572c-1.868 0-2.642-2.392-1.129-3.487l20.412-14.763z"/>
                        <path stroke="#fff" stroke-width="7.704" d="M141.353 56.249c0 1.238-.827 3.152-4.087 5.52-3.174 2.306-8.016 4.543-14.345 6.487-12.611 3.875-30.267 6.33-49.937 6.33-19.67 0-37.325-2.455-49.936-6.33-6.33-1.944-11.171-4.181-14.346-6.487-3.26-2.368-4.087-4.282-4.087-5.52 0-1.238.828-3.152 4.087-5.52 3.175-2.306 8.016-4.543 14.345-6.487 12.612-3.875 30.268-6.33 49.937-6.33 19.67 0 37.326 2.455 49.937 6.33 6.329 1.944 11.171 4.181 14.345 6.487 3.26 2.368 4.087 4.282 4.087 5.52z"/>
                        <rect width="3.079" height="13.786" x="15.597" y="78.437" fill="#fff" rx="1.539" transform="rotate(-1.262 15.597 78.437)"/>
                        <rect width="3.079" height="13.786" x="20.055" y="85.294" fill="#fff" rx="1.539" transform="rotate(-1.262 20.055 85.294)"/>
                        <defs>
                            <linearGradient id="third-linear" x1="72.742" x2="72.742" y1="82.283" y2="109.145" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#fff" stop-opacity="0"/>
                                <stop id="lower" offset="1" stop-color="transparent"/>
                            </linearGradient>
                            <linearGradient id="first-linear" x1="74.046" x2="74.046" y1="13.477" y2="82.283" gradientUnits="userSpaceOnUse">
                                <stop id="upper" offset=".524" stop-color="transparent"/>
                                <stop offset="1" stop-color="transparent" stop-opacity=".91"/>
                            </linearGradient>
                        </defs>
                    </svg>`;
    }
}

class WaterGlassInProcess extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
                    <svg class='animate-svg' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 174 246">
                        <defs/>
                        <path id="third-layer" fill="transparent" d="M19.335 159.835h134.476l-5.379 41.04-3.68 28.554-16.421 6.551-48.41 5.379-50.677-11.93-3.114-21.76-6.795-47.834z"/>
                        <path fill="url(#third-linear)" d="M19.335 159.835h134.476l-5.379 41.04-3.68 28.554-16.421 6.551-48.41 5.379-50.677-11.93-3.114-21.76-6.795-47.834z"/>
                        <path id="second-layer" fill="transparent" d="M15.089 107.646h143.818l-5.096 52.189H19.649l-4.56-52.189z"/>
                        <path id="first-layer" fill="transparent" d="M9.71 55.456L4.897 19.404 36.888 8.362l33.69-3.68H97.19l26.045 1.982 19.616 3.397 23.983 7.078-3.681 38.317-4.246 52.19H15.372L9.71 55.456z"/>
                        <path fill="url(#first-linear)" d="M9.71 55.456L4.897 19.404 36.888 8.362l33.69-3.68H97.19l26.045 1.982 19.616 3.397 23.983 7.078-3.681 38.317-4.246 52.19H15.372L9.71 55.456z"/>
                        <path stroke="#fff" stroke-width="8" d="M169.038 20.674c0 .143-.045.595-.756 1.403-.733.834-1.995 1.829-3.947 2.903-3.9 2.146-9.808 4.207-17.451 5.986-15.223 3.544-36.454 5.773-60.045 5.773-23.59 0-44.822-2.23-60.045-5.773-7.643-1.779-13.551-3.84-17.45-5.986-1.952-1.074-3.215-2.07-3.948-2.903-.71-.808-.755-1.26-.755-1.403 0-.143.045-.594.755-1.403.733-.833 1.996-1.829 3.947-2.903 3.9-2.146 9.808-4.207 17.451-5.986C42.017 6.84 63.248 4.61 86.84 4.61s44.822 2.23 60.045 5.773c7.643 1.78 13.551 3.84 17.451 5.986 1.952 1.074 3.214 2.07 3.947 2.903.711.809.756 1.26.756 1.403z"/>
                        <path fill="#fff" fill-rule="evenodd" d="M24.435 223.916a6.664 6.664 0 00-.16 1.441c0 11.082 27.98 20.065 62.493 20.065 34.312 0 62.165-8.879 62.489-19.871-6.05 2.632-13.289 4.866-21.401 6.584-10.288 3.198-24.777 5.287-41.088 5.287-16.66 0-31.42-2.179-41.743-5.494-2.621-.841-4.843-1.72-6.68-2.595-5.212-1.58-9.889-3.401-13.91-5.417z" clip-rule="evenodd"/>
                        <path fill="#fff" d="M2.121 22.385l7.172-.789 22.233 205.677-7.25-3.357L2.121 22.385zM171.412 24.151l-7.172-.788-21.755 205.367 6.772-3.047 22.155-201.532z"/>
                        <rect width="5.71" height="35.922" x="19.649" y="46.506" fill="#fff" rx="2.855" transform="rotate(-5.21 19.649 46.506)"/>
                        <rect width="5.71" height="35.922" x="31.358" y="56.613" fill="#fff" rx="2.855" transform="rotate(-3.957 31.358 56.613)"/>
                        <defs>
                            <linearGradient id="third-linear" x1="86.839" x2="86.839" y1="159.835" y2="229.429" gradientUnits="userSpaceOnUse">
                                <stop stop-color="transparent"/>
                                <stop id="lower" offset="1" stop-color="#fff" stop-opacity="0"/>
                            </linearGradient>
                            <linearGradient id="first-linear" x1="86.839" x2="86.839" y1="38.84" y2="107.646" gradientUnits="userSpaceOnUse">
                                <stop id="upper" offset=".524" stop-color="transparent"/>
                                <stop offset="1" stop-color="transparent" stop-opacity=".91"/>
                            </linearGradient>
                        </defs>
                    </svg>`;
    }
}

customElements.define('round-glass', RoundGlassInProcess);
customElements.define('tall-glass', TallGlassInProcess);
customElements.define('short-glass', ShortGlassInProcess);
customElements.define('water-glass', WaterGlassInProcess);