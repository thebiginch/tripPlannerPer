$(function() {

    var map = initializeMap();
    var $addItemButton = $('#options-panel').find('button');

    var $listGroups = {
        hotel: $('#hotel-list').children('ul'),
        restaurant: $('#restaurant-list').children('ul'),
        activity: $('#activity-list').children('ul')
    };

    // var collections = {
    //     hotel: hotels,
    //     restaurant: restaurants,
    //     activity: activities
    // };

    var $itinerary = $('#itinerary');

    var $addDayButton = $('#day-add');
    var $dayTitle = $('#day-title').children('span');
    var $removeDayButton = $('#day-title').children('button');
    var $dayButtonList = $('.day-buttons');




    var days = [
        []
    ];

    var currentDayNum = 1;

    /*
    --------------------------
    END VARIABLE DECLARATIONS
    --------------------------
     */

    $addItemButton.on('click', function() {
        var $this = $(this);
        var $select = $this.siblings('select');
        var sectionName = $select.attr('data-type');
        var getValue = '';
        if (sectionName === 'hotel') getValue = 'Hotel';
        if (sectionName === 'restaurant') getValue = 'Restaurant';
        if (sectionName === 'activity') getValue = 'Activity';
        var itemId = parseInt($select.val(), 10);
        var collectionQuery = $.get('api/' + getValue + '?id=' + itemId).done(function(result) {
                console.log(result);
                var $list = $listGroups[sectionName];
                var item = result[0];
                var marker = drawMarker(map, sectionName, item.place.location);

                $list.append(create$item(item));

                days[currentDayNum - 1].push({
                    item: item,
                    marker: marker,
                    type: sectionName
                });

                mapFit();

            })
            // var collection = collections[sectionName];
            //var item = findInCollection(collection, itemId);
    });

    $itinerary.on('click', 'button.remove', function() {

        var $this = $(this);
        var $item = $this.parent();
        var itemName = $item.children('span').text();
        var day = days[currentDayNum - 1];
        var indexOfItemOnDay = findIndexOnDay(day, itemName);
        var itemOnDay = day.splice(indexOfItemOnDay, 1)[0];

        itemOnDay.marker.setMap(null);
        $item.remove();

        mapFit();

    });

    $addDayButton.on('click', function() {   

        var currentDay = $('.day-buttons').children().length

        $.post('./api/day/' + currentDay);

        var newDayNum = days.length + 1;
        var $newDayButton = createDayButton(newDayNum);
        days.push([]);
        $addDayButton.before($newDayButton);
        switchDay(newDayNum);
    });



    $dayButtonList.on('click', '.day-btn', function() {
        var dayNumberFromButton = parseInt($(this).text(), 10);
        switchDay(dayNumberFromButton);
    });

    $removeDayButton.on('click', function() {

        wipeDay();
        days.splice(currentDayNum - 1, 1);

        if (days.length === 0) {
            days.push([]);
        }

        reRenderDayButtons();
        switchDay(1);

    });

    fillInOptions('Hotel', $('#hotel-choices'));
    fillInOptions('Restaurant', $('#restaurant-choices'));
    fillInOptions('Activity', $('#activity-choices'));

    /*
    --------------------------
    END NORMAL LOGIC
    --------------------------
     */

    // Create element functions ----

    function create$item(item) {
        var $div = $('<div />');
        var $span = $('<span />').text(item.name);
        var $removeButton = $('<button class="btn btn-xs btn-danger remove btn-circle">x</button>');

        $div.append($span).append($removeButton);
        return $div;
    }

    function createDayButton(number) {
        return $('<button class="btn btn-circle day-btn">' + number + '</button>');
    }

    // End create element functions ----

    function fillInOptions(collection, $selectElement) {
        $.ajax({
            method: 'get',
            url: '/api/' + collection
        }).done(function(result) {
            console.log(result);
            result.forEach(function(item) {
                $selectElement.append('<option value="' + item.id + '">' + item.name + '</option>');
            });
        });
    }

    function switchDay(dayNum) {
        wipeDay();
        currentDayNum = dayNum;
        renderDay();
        $dayTitle.text('Day ' + dayNum);
        mapFit();
    }

    function renderDay() {

        var currentDay = days[currentDayNum - 1];

        $dayButtonList
            .children('button')
            .eq(currentDayNum - 1)
            .addClass('current-day');

        currentDay.forEach(function(attraction) {
            var $listToAddTo = $listGroups[attraction.type];
            $listToAddTo.append(create$item(attraction.item));
            attraction.marker.setMap(map);
        });
    }

    function wipeDay() {

        $dayButtonList.children('button').removeClass('current-day');

        Object.keys($listGroups).forEach(function(key) {
            $listGroups[key].empty();
        });

        if (days[currentDayNum - 1]) {
            days[currentDayNum - 1].forEach(function(attraction) {
                attraction.marker.setMap(null);
            });
        }

    }

    function reRenderDayButtons() {

        var numberOfDays = days.length;

        $dayButtonList.children('button').not($addDayButton).remove();

        for (var i = 0; i < numberOfDays; i++) {
            $addDayButton.before(createDayButton(i + 1));
        }

    }

    function mapFit() {

        var currentDay = days[currentDayNum - 1];
        var bounds = new google.maps.LatLngBounds();

        currentDay.forEach(function(attraction) {
            bounds.extend(attraction.marker.position);
        });

        map.fitBounds(bounds);

    }

    // Utility functions ------

    function findInCollection(collection, id) {
        return collection.filter(function(item) {
            return item.id === id;
        })[0];
    }

    function findIndexOnDay(day, itemName) {
        for (var i = 0; i < day.length; i++) {
            if (day[i].item.name === itemName) {
                return i;
            }
        }
        return -1;
    }

    // End utility functions ----

});
