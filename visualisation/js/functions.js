export function moveProgressBar() {
    let elem = document.getElementById("progress-bar");
    let height = 100;
    let id = setInterval(frame, 1000); // тут время на приготовление коктейля
    function frame() {
        if (height <= 0) {
            clearInterval(id);
        } else {
            changeColor(elem);
            height--;
            elem.style.height = height + '%';
        }
    }
}

export function changeColor(e) {
    if (e.style.height) {
        let height = +(e.style.height).slice(0, -1);
        switch(true) {
            case (height <= 25):
                e.style.backgroundColor = "red";
                break;

            case (height > 25 && height <= 50):
                e.style.backgroundColor = "orange";
                break;

            case (height > 51 && height <= 75):
                e.style.backgroundColor = "yellow";
                break;

            case (height > 76 && height <= 100):
                e.style.backgroundColor = "green";
                break;
        }
    }
}
