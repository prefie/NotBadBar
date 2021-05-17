class ShortGlass extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
                    <svg class="animate-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 146 265">
                      <defs/>
                      <path id="first-layer" fill="transparent" d="M15.219 109.145h116.98l-12.998 13.864-14.442 9.532-32.597 10.105-33.836-10.105-13.864-9.532-9.243-13.864z"/>
                      <path fill="url(#first-linear)" d="M15.219 109.145h116.98l-12.998 13.864-14.442 9.532-32.597 10.105-33.836-10.105-13.864-9.532-9.243-13.864z"/>
                      <path id="second-layer" fill="transparent" d="M4.05 82.283h137.69l-8.359 26.862H14.249L4.05 82.283z"/>
                      <path id="third-layer" fill="transparent" d="M4.532 52.821l13.575-6.354 21.086-5.488 21.663-2.889H93.495l19.352 2.889 15.597 4.044 12.998 9.82 2.119 27.44H4.531V52.821z"/>
                      <path fill="url(#third-linear)" d="M4.532 52.821l13.575-6.354 21.086-5.488 21.663-2.889H93.495l19.352 2.889 15.597 4.044 12.998 9.82 2.119 27.44H4.531V52.821z"/>
                      <path fill="#fff" d="M145.205 72.959a72.219 72.219 0 01-72.22 72.221 72.229 72.229 0 01-51.069-21.153A72.219 72.219 0 01.763 72.959h7.222a64.998 64.998 0 00110.961 45.961 65.007 65.007 0 0019.037-45.961h7.222zM.763 54.31h7.218v18.649H.763zM137.987 54.31h7.218v18.649h-7.218z"/>
                      <path fill="#fff" d="M69.376 142.233h7.218v103.024h-7.218z"/>
                      <path fill="#fff" d="M71.855 239.824a1.924 1.924 0 012.258 0l20.412 14.763c1.513 1.095.74 3.487-1.129 3.487H52.572c-1.868 0-2.642-2.392-1.129-3.487l20.412-14.763z"/>
                      <path stroke="#fff" stroke-width="7.704" d="M141.353 56.249c0 1.238-.827 3.152-4.087 5.52-3.174 2.306-8.016 4.543-14.345 6.487-12.611 3.875-30.267 6.33-49.937 6.33-19.67 0-37.325-2.455-49.936-6.33-6.33-1.944-11.171-4.181-14.346-6.487-3.26-2.368-4.087-4.282-4.087-5.52 0-1.238.828-3.152 4.087-5.52 3.175-2.306 8.016-4.543 14.345-6.487 12.612-3.875 30.268-6.33 49.937-6.33 19.67 0 37.326 2.455 49.937 6.33 6.329 1.944 11.171 4.181 14.345 6.487 3.26 2.368 4.087 4.282 4.087 5.52z"/>
                      <rect width="3.079" height="13.786" x="15.597" y="78.437" fill="#fff" rx="1.539" transform="rotate(-1.262 15.597 78.437)"/>
                      <rect width="3.079" height="13.786" x="20.055" y="85.294" fill="#fff" rx="1.539" transform="rotate(-1.262 20.055 85.294)"/>
                      <defs>
                        <linearGradient id="first-linear" x1="72.082" x2="72.082" y1="109.145" y2="142.646" gradientUnits="userSpaceOnUse">
                          <stop id="upper" stop-color="transparent"/>
                          <stop offset="1" stop-color="#fff" stop-opacity="0"/>
                        </linearGradient>
                        <linearGradient id="third-linear" x1="74.046" x2="74.046" y1="13.477" y2="82.283" gradientUnits="userSpaceOnUse">
                          <stop offset=".524" stop-color="transparent"/>
                          <stop id="lower" offset="1" stop-color="transparent" stop-opacity=".91"/>
                        </linearGradient>
                      </defs>
                    </svg>`;
    }
}

customElements.define('short-glass', ShortGlass);