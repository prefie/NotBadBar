class WaterGlass extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
                    <svg id="glass" class="animate-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 174 246">
                      <defs/>
                      <path id="first-layer" fill="transparent" d="M19.335 159.835h134.476l-5.379 41.04-3.68 28.554-16.421 6.551-48.41 5.379-50.677-11.93-3.114-21.76-6.795-47.834z"/>
                      <path fill="url(#first-linear)" d="M19.335 159.835h134.476l-5.379 41.04-3.68 28.554-16.421 6.551-48.41 5.379-50.677-11.93-3.114-21.76-6.795-47.834z"/>
                      <path id="second-layer" fill="transparent" d="M15.089 107.646h143.818l-5.096 52.189H19.649l-4.56-52.189z"/>
                      <path id="third-layer" fill="transparent" d="M9.71 55.456L4.897 19.404 36.888 8.362l33.69-3.68H97.19l26.045 1.982 19.616 3.397 23.983 7.078-3.681 38.317-4.246 52.19H15.372L9.71 55.456z"/>
                      <path fill="url(#third-linear)" d="M9.71 55.456L4.897 19.404 36.888 8.362l33.69-3.68H97.19l26.045 1.982 19.616 3.397 23.983 7.078-3.681 38.317-4.246 52.19H15.372L9.71 55.456z"/>
                      <path stroke="#fff" stroke-width="8" d="M169.038 20.674c0 .143-.045.595-.756 1.403-.733.834-1.995 1.829-3.947 2.903-3.9 2.146-9.808 4.207-17.451 5.986-15.223 3.544-36.454 5.773-60.045 5.773-23.59 0-44.822-2.23-60.045-5.773-7.643-1.779-13.551-3.84-17.45-5.986-1.952-1.074-3.215-2.07-3.948-2.903-.71-.808-.755-1.26-.755-1.403 0-.143.045-.594.755-1.403.733-.833 1.996-1.829 3.947-2.903 3.9-2.146 9.808-4.207 17.451-5.986C42.017 6.84 63.248 4.61 86.84 4.61s44.822 2.23 60.045 5.773c7.643 1.78 13.551 3.84 17.451 5.986 1.952 1.074 3.214 2.07 3.947 2.903.711.809.756 1.26.756 1.403z"/>
                      <path fill="#fff" fill-rule="evenodd" d="M24.435 223.916a6.664 6.664 0 00-.16 1.441c0 11.082 27.98 20.065 62.493 20.065 34.312 0 62.165-8.879 62.489-19.871-6.05 2.632-13.289 4.866-21.401 6.584-10.288 3.198-24.777 5.287-41.088 5.287-16.66 0-31.42-2.179-41.743-5.494-2.621-.841-4.843-1.72-6.68-2.595-5.212-1.58-9.889-3.401-13.91-5.417z" clip-rule="evenodd"/>
                      <path fill="#fff" d="M2.121 22.385l7.172-.789 22.233 205.677-7.25-3.357L2.121 22.385zM171.412 24.151l-7.172-.788-21.755 205.367 6.772-3.047 22.155-201.532z"/>
                      <rect width="5.71" height="35.922" x="19.649" y="46.506" fill="#fff" rx="2.855" transform="rotate(-5.21 19.649 46.506)"/>
                      <rect width="5.71" height="35.922" x="31.358" y="56.613" fill="#fff" rx="2.855" transform="rotate(-3.957 31.358 56.613)"/>
                      <defs>
                        <linearGradient id="first-linear" x1="86.839" x2="86.839" y1="159.835" y2="229.429" gradientUnits="userSpaceOnUse">
                          <stop id="upper" stop-color="transparent"/>
                          <stop offset="1" stop-color="#fff" stop-opacity="0"/>
                        </linearGradient>
                        <linearGradient id="third-linear" x1="86.839" x2="86.839" y1="38.84" y2="107.646" gradientUnits="userSpaceOnUse">
                          <stop offset=".524" stop-color="transparent"/>
                          <stop id="lower" offset="1" stop-color="transparent" stop-opacity=".91"/>
                        </linearGradient>
                      </defs>
                    </svg>`;
    }
}

customElements.define('water-glass', WaterGlass);