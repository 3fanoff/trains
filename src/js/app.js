(function f() {

    var turnRoute = false;
    var routeNode = document.getElementById('ticket-route');
    var routeFromNode = routeNode.querySelector('[data-from]');
    var routeToNode = routeNode.querySelector('[data-to]');

    document.getElementById('ticket-route-icon').addEventListener('dblclick', function () {
        routeFromNode.innerText = !turnRoute ? routeNode.dataset.to : routeNode.dataset.from;
        routeToNode.innerText = !turnRoute ? routeNode.dataset.from : routeNode.dataset.to;
        turnRoute = !turnRoute;
    })

    var currentDate = new Date();
    var nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    document.getElementById('ticket-day').innerHTML = currentDate.toLocaleDateString('ru', { day: 'numeric', month: 'long'});
    document.getElementById('ticket-day-until').innerHTML = 'Действует до 01:00 ' + nextDate.toLocaleDateString('ru', { day: 'numeric', month: 'long'})

    var clickedBarcode = false;
    var flipTimeout, clickedTimeout;
    document.getElementById('ticket-barcode-svg').addEventListener('click', function () {
        if (clickedBarcode) return;
        clearTimeout(flipTimeout);
        clearTimeout(clickedTimeout);
        var element = this;
        /*var animationEnd = function () {
            this.removeAttribute('data-flip');
            this.removeEventListener(animationEnd);
        }*/

        clickedBarcode = true;
        /*this.addEventListener('transitionend', animationEnd)*/
        if (!this.hasAttribute('data-flip')) {
            flipTimeout = setTimeout(function () {
                element.removeAttribute('data-flip');

                clickedTimeout = setTimeout(function () {
                    clickedBarcode = false;
                }, 500);

            }, 500);
            this.setAttribute('data-flip', 'true');
        }
    });

    function getMultiplexor() {
        var multiplexor = localStorage.getItem('multiplexor');
        if (multiplexor === null) {
            multiplexor = 26301 + (Math.ceil(Math.random() * 100));
            localStorage.setItem('multiplexor', multiplexor);
        }
        return Number(multiplexor);
    }
    var initialDate = new Date(2025, 9, 23, 0, 0, 0);
    var hoursAfterInitial = Math.floor((currentDate.getTime() - initialDate.getTime()) / 1000 / 60 / 60);
    var initialID = 3682431558952;
    var generatedID = initialID + (getMultiplexor() * hoursAfterInitial);
    console.log(hoursAfterInitial + ' hours left');
    console.log(getMultiplexor());

    document.getElementById('ticket-id').innerHTML = generatedID.toString();
})();