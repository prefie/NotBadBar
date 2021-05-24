class TallGlass extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
                    <svg id="glass" class="animate-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 146 317">
                        <defs/>
                        <path id="first-layer" fill="transparent" d="M2.366 125.21h139.029l-11.102 37.968-23.544 22.138-34.788 9.488-36.545-9.488-21.084-22.138L2.366 125.21z"/>
                        <path fill="url(#first-linear)" d="M2.366 125.21h139.029l-11.102 37.968-23.544 22.138-34.788 9.488-36.545-9.488-21.084-22.138L2.366 125.21z"/>
                        <path id="second-layer" fill="transparent" d="M2.366 73.021h139.029v52.189H2.366z"/>
                        <path id="third-layer" fill="transparent" d="M2.366 20.831l12.861-9.523 17.109-4.172 18.777-2.921H92.007l20.029 2.92 15.857 4.173 13.502 9.523v52.19H2.365V20.83z"/>
                        <path fill="url(#third-linear)" d="M2.366 20.831l12.861-9.523 17.109-4.172 18.777-2.921H92.007l20.029 2.92 15.857 4.173 13.502 9.523v52.19H2.365V20.83z"/>
                        <path fill="#fff" d="M145.007 125.53a72.216 72.216 0 01-72.221 72.221 72.23 72.23 0 01-51.068-21.153A72.22 72.22 0 01.564 125.53h7.223a64.998 64.998 0 10129.998 0h7.222zM.564 22.506h7.218V125.53H.564z"/>
                        <path fill="#fff" d="M69.177 194.804h7.218v103.024h-7.218zM137.789 22.506h7.218V125.53h-7.218z"/>
                        <path fill="#fff" d="M71.657 292.395a1.927 1.927 0 012.257 0l20.412 14.763c1.514 1.095.74 3.487-1.128 3.487H52.373c-1.868 0-2.642-2.392-1.128-3.486l20.412-14.764z"/>
                        <path stroke="#fff" stroke-width="7.704" d="M141.155 22.506c0 1.238-.828 3.153-4.088 5.52-3.174 2.306-8.016 4.543-14.345 6.488-12.611 3.874-30.267 6.328-49.936 6.328-19.67 0-37.326-2.454-49.937-6.328-6.33-1.945-11.17-4.182-14.345-6.488-3.26-2.367-4.087-4.282-4.087-5.52 0-1.238.827-3.152 4.087-5.52 3.174-2.306 8.016-4.542 14.345-6.487C35.459 6.625 53.116 4.17 72.786 4.17c19.67 0 37.325 2.455 49.936 6.33 6.329 1.944 11.171 4.18 14.345 6.486 3.26 2.368 4.088 4.282 4.088 5.52z"/>
                        <rect width="5.534" height="39.462" x="14.322" y="47.17" fill="#fff" rx="2.767"/>
                        <rect width="5.534" height="39.462" x="24.428" y="58.72" fill="#fff" rx="2.767"/>
                        <defs>
                            <linearGradient id="first-linear" x1="71.88" x2="71.88" y1="125.21" y2="194.804" gradientUnits="userSpaceOnUse">
                                <stop id="upper" stop-color="transparent"/>
                                <stop offset="1" stop-color="#fff" stop-opacity="0"/>
                            </linearGradient>
                            <linearGradient id="third-linear" x1="71.88" x2="71.88" y1="4.215" y2="73.021" gradientUnits="userSpaceOnUse">
                                <stop offset=".524" stop-color="transparent"/>
                                <stop id="lower" offset="1" stop-color="transparent" stop-opacity=".91"/>
                            </linearGradient>
                        </defs>
                    </svg>`;
    }
}


customElements.define('tall-glass', TallGlass);