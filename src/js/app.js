(function f() {

    var turnRoute = false;
    var routeNode = document.getElementById('ticket-route');
    var priceNode = document.getElementById('ticket-price');
    var routeIconNode = document.getElementById('ticket-route-icon');
    var descriptionNode = document.getElementById('ticket-desc');
    var routeFromNode = routeNode.querySelector('[data-from]');
    var routeToNode = routeNode.querySelector('[data-to]');
    var currentRouteData = JSON.parse(localStorage.getItem('currentRouteData'));
    var currentRouteType = localStorage.getItem('currentRouteType') || 'type_1';

    if (currentRouteData) {
        renderRouteData();
        changeTypeContent();
        document.getElementById('route-type').checked = currentRouteType === 'type_2';
    }

    routeIconNode.addEventListener('dblclick', function () {
        document.getElementById('ticket-change-popup').style.display = '';
    });

    routeFromNode.addEventListener('dblclick', function () {
        if (!currentRouteData) return;
        renderRouteData();
        turnRoute = !turnRoute;
    })

    function renderRouteData() {
        routeFromNode.innerText = !turnRoute ? currentRouteData.to : currentRouteData.from;
        routeToNode.innerText = !turnRoute ? currentRouteData.from : currentRouteData.to;
        priceNode.innerText = currentRouteData['price_' + currentRouteType];
    }

    function changeTypeContent () {
        routeIconNode.querySelector('img').src = window.routes_content.ticket_icon[currentRouteType];
        descriptionNode.innerText = window.routes_content.description[currentRouteType];
    }

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

    document.getElementById('route-type').addEventListener('change', function () {
        currentRouteType = this.checked ? 'type_2' : 'type_1';
        localStorage.setItem('currentRouteType', currentRouteType);
        changeTypeContent();
        priceNode.innerText = currentRouteData['price_' + currentRouteType];
    });

    document.getElementById('route-select').addEventListener('change', function () {
        var routeCode = this.value;
        var routeData = window.routes.find(function (item) {
            return item.code === routeCode;
        })
        if (routeData) {
            localStorage.setItem('currentRouteData', JSON.stringify(routeData));
            currentRouteData = routeData;

            routeFromNode.innerText = currentRouteData.from;
            routeToNode.innerText = currentRouteData.to;
            priceNode.innerText = currentRouteData['price_' + currentRouteType];
        } else {
            alert('не найдены данные для маршрута ' + routeCode);
        }
    })
})();