
/**
 * Deferred rendering for Highcharts charts.
 * Event 'renderChart' will trigger the deferred rendering.
 * A special case is made for the series "Weighted Average" 
 * to be drawn in a second delay
 * 
 * Note that if a chart is to be redrawn, the container
 * needs to .off('renderChart') to clear out old binds 
 */
(function (H) {
    function deferRender(proceed) {
        var series = this,
            $renderTo = $(this.chart.container.parentNode);

        if ($renderTo.hasClass('rendered')) {
            proceed.call(series);
        }

        $renderTo.on('renderChart', function() {
            $(this).addClass('rendered');

            if (series.name === 'Weighted Average') {
                // Delay the weighted average line to AFTER columns
                setTimeout(function() {
                    if (series.hasOwnProperty('chart')) {
                        proceed.call(series);
                    }
                }, 800);
            }
            else {
                proceed.call(series);
            }
        });
    };

    H.wrap(H.Series.prototype, 'render', deferRender);
}(Highcharts));

Highcharts.pinkTheme = {
    colors: ["#81C784", "#64b5f6", "#EF5350" /* Add more for more color options */],
    chart: {
        backgroundColor: '#EF5350',
        style: {
            fontFamily: "'Roboto', sans-serif"
        },
        plotBorderColor: '#212121'
    },
    xAxis: {
        gridLineColor: '#212121',
        labels: {
            style: {
                color: '#FFFFFF'
            }
        }
    },
    yAxis: {
        gridLineColor: '#212121',
        labels: {
            style: {
                color: '#E0E0E3'
            }
        }
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
            color: '#F0F0F0'
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                color: '#B0B0B3'
            },
            marker: {
                lineColor: '#333'
            }
        },
        boxplot: {
            fillColor: '#505053'
        },
        candlestick: {
            lineColor: 'white'
        },
        errorbar: {
            color: 'white'
        }
    },
    legend: {
        itemStyle: {
            color: '#E0E0E3'
        },
        itemHoverStyle: {
            color: '#FFF'
        },
        itemHiddenStyle: {
            color: '#606063'
        }
    },
    credits: {
        style: {
            color: '#EF5350'
        }
    },
    labels: {
        style: {
            color: '#707073'
        }
    },

    drilldown: {
        activeAxisLabelStyle: {
            color: '#F0F0F3'
        },
        activeDataLabelStyle: {
            color: '#F0F0F3'
        }
    },

    navigation: {
        buttonOptions: {
            symbolStroke: '#DDDDDD',
            theme: {
                fill: '#505053'
            }
        }
    },

    // scroll charts
    rangeSelector: {
        buttonTheme: {
            fill: '#505053',
            stroke: '#000000',
            style: {
                color: '#CCC'
            },
            states: {
                hover: {
                    fill: '#707073',
                    stroke: '#000000',
                    style: {
                        color: 'white'
                    }
                },
                select: {
                    fill: '#000003',
                    stroke: '#000000',
                    style: {
                        color: 'white'
                    }
                }
            }
        },
        inputBoxBorderColor: '#505053',
        inputStyle: {
            backgroundColor: '#333',
            color: 'silver'
        },
        labelStyle: {
            color: 'silver'
        }
    },

    navigator: {
        handles: {
            backgroundColor: '#666',
            borderColor: '#AAA'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(255,255,255,0.1)',
        series: {
            color: '#7798BF',
            lineColor: '#A6C7ED'
        },
        xAxis: {
            gridLineColor: '#505053'
        }
    },

    scrollbar: {
        barBackgroundColor: '#808083',
        barBorderColor: '#808083',
        buttonArrowColor: '#CCC',
        buttonBackgroundColor: '#606063',
        buttonBorderColor: '#606063',
        rifleColor: '#FFF',
        trackBackgroundColor: '#404043',
        trackBorderColor: '#404043'
    },

    // special colors for some of the..?
    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
    background2: '#505053',
    dataLabelsColor: '#B0B0B3',
    textColor: '#C0C0C0',
    contrastTextColor: '#F0F0F3',
    maskColor: 'rgba(255,255,255,0.3)'
};

Highcharts.darkTheme = {
    colors: ["#64B5F6", "#81C784", "#EF5350" /* Add more for more color options */],
    chart: {
        backgroundColor: '#212121',
        style: {
            fontFamily: "'Roboto', sans-serif"
        },
        plotBorderColor: '#606063'
    },
    xAxis: {
        gridLineColor: '#707073',
        labels: {
            style: {
                color: '#FFFFFF'
            }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        title: {
            style: {
                color: '#A0A0A3'
            }
        }
    },
    yAxis: {
        gridLineColor: '#707073',
        labels: {
            style: {
                color: '#E0E0E3'
            }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        tickWidth: 1,
        title: {
            style: {
                color: '#A0A0A3'
            }
        }
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
            color: '#F0F0F0'
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                color: '#B0B0B3'
            },
            marker: {
                lineColor: '#333'
            }
        },
        boxplot: {
            fillColor: '#505053'
        },
        candlestick: {
            lineColor: 'white'
        },
        errorbar: {
            color: 'white'
        }
    },
    legend: {
        itemStyle: {
            color: '#E0E0E3'
        },
        itemHoverStyle: {
            color: '#FFF'
        },
        itemHiddenStyle: {
            color: '#606063'
        }
    },
    credits: {
        style: {
            color: '#212121'
        }
    },
    labels: {
        style: {
            color: '#707073'
        }
    },

    drilldown: {
        activeAxisLabelStyle: {
            color: '#F0F0F3'
        },
        activeDataLabelStyle: {
            color: '#F0F0F3'
        }
    },

    navigation: {
        buttonOptions: {
            symbolStroke: '#DDDDDD',
            theme: {
                fill: '#505053'
            }
        }
    },

    // scroll charts
    rangeSelector: {
        buttonTheme: {
            fill: '#505053',
            stroke: '#000000',
            style: {
                color: '#CCC'
            },
            states: {
                hover: {
                    fill: '#707073',
                    stroke: '#000000',
                    style: {
                        color: 'white'
                    }
                },
                select: {
                    fill: '#000003',
                    stroke: '#000000',
                    style: {
                        color: 'white'
                    }
                }
            }
        },
        inputBoxBorderColor: '#505053',
        inputStyle: {
            backgroundColor: '#333',
            color: 'silver'
        },
        labelStyle: {
            color: 'silver'
        }
    },

    navigator: {
        handles: {
            backgroundColor: '#666',
            borderColor: '#AAA'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(255,255,255,0.1)',
        series: {
            color: '#7798BF',
            lineColor: '#A6C7ED'
        },
        xAxis: {
            gridLineColor: '#505053'
        }
    },

    scrollbar: {
        barBackgroundColor: '#808083',
        barBorderColor: '#808083',
        buttonArrowColor: '#CCC',
        buttonBackgroundColor: '#606063',
        buttonBorderColor: '#606063',
        rifleColor: '#FFF',
        trackBackgroundColor: '#404043',
        trackBorderColor: '#404043'
    },

    // special colors for some of the..?
    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
    background2: '#505053',
    dataLabelsColor: '#B0B0B3',
    textColor: '#C0C0C0',
    contrastTextColor: '#F0F0F3',
    maskColor: 'rgba(255,255,255,0.3)'
};

var g_dataset = null;

// Load an audiobite with the doc
var g_teehee = new Audio('/img/love/teehee.mp3');

function weightLanguage(percent, plural) 
{
    if (typeof plural === 'undefined') {
        plural = false;
    }

    var strings = [
        [90, 'loves', 'love'],
        [80, 'is really into', 'are really into'],
        [70, 'is somewhat into', 'are somewhat into'],
        [60, 'slightly likes', 'slightly like'],
        [50, 'is indifferent about', 'are indifferent about'],
        [40, 'slightly dislikes', 'slightly dislike'],
        [30, 'dislikes', 'dislike'],
        [10, 'definitely opposed to', 'are definitely opposed to'],
        [0, 'hates', 'hate']
    ];

    for (var i = 0; i < strings.length; i++) {
        if (percent >= strings[i][0]) {
            if (plural) {
                return strings[i][2];
            }

            return strings[i][1];
        }
    }
}

function prefixLanguage(category) 
{
    if (category === 'Switch') {
        return '';
    }

    if (category === 'Vanilla' || category === 'Submissive' || category === 'Dominant') {
        return 'being';
    }

    if (category[0] === 'A' || category[0] === 'E' || category[0] === 'O') {
        return 'being an';
    }

    return 'being a';
}

/**
 * Fucking English
 */
function aOrAn(category) 
{
    if (category[0] === 'A' || category[0] === 'E' || category[0] === 'O') {
        return 'an ';
    }

    return 'a ';
}

function catsHtml(categories) 
{
    if (typeof categories === 'string') {
        return '<span class="category">' + categories.trim() + '</span>'; 
    }

    if (categories.length < 2) {
        return '<span class="category">' + categories[0].trim() + '</span>';
    }

    return '<span class="category">' + categories[0].trim() + 
            '</span> / <span class="category">' + categories[1].trim() + 
            '</span>';
}

/**
 * Generate string for the lowest matching categories (neither of them interested)
 */
function bottomCategoriesLanguage()
{
    var left = '<span class="person">' + g_dataset.individuals[0].name + '</span>';
    var right = '<span class="person">' + g_dataset.individuals[1].name + '</span>';

    // Talk about the second lowest match and the lowest.
    // Pretty much guaranteed to be < 10% so we don't worry about varying language
    var lowest = g_dataset.comparative[g_dataset.comparative.length-1][0].split('<br>');
    var secondLowest = g_dataset.comparative[g_dataset.comparative.length-2][0].split('<br>');

    var msg = 'Neither of them seem to enjoy having ' + aOrAn(secondLowest[0]) + 
                catsHtml(secondLowest) + ' relationship '; 

    if (secondLowest.length > 1) {
        msg += 'where ' + left + ' is the ' + catsHtml(secondLowest[0]);
    }

    msg += ', and are definitely opposed to acting out ' + catsHtml(lowest) + ' together.';

    return msg;
}

/**
 * Generate a string for comparing the biggest difference between
 * a high one for the left, and a low one for the right.  
 */
function leftHighVsLowCategoriesLanguage()
{
    var left = '<span class="person">' + g_dataset.individuals[0].name + '</span>';
    var right = '<span class="person">' + g_dataset.individuals[1].name + '</span>';

    var pleft, pright, diff = 0, index = 0;

    // Pull the top 3 out so they don't count
    var comparative = g_dataset.comparative.concat().sort(comparativeSortWeightedAverages);
    comparative.splice(0, 3);
    
    // Go through, pick the highest difference with left high.
    for (var i = 0; i < comparative.length; i++) {
        pleft = comparative[i][1];
        pright = comparative[i][2];
        if (Math.abs(pleft - pright) > diff && pleft > pright) {
            diff = Math.abs(pleft - pright);
            index = i;
        }
    }

    var categories = comparative[index][0].split('<br>');

    var msg = left + ' seems to enjoy having ' + aOrAn(categories[0]) + catsHtml(categories) + ' relationship';

    if (categories.length > 1) {
        msg += ' with ' + left + ' as the ' + catsHtml(categories[0]);
    }

    msg += ', but ' + right + ' doesn\'t quite feel that way.';

    return msg;
}

/**
 * Generate a string for comparing the biggest difference between
 * a high one for the right, and a low one for the left. 
 */
function rightHighVsLowCategoriesLanguage()
{
    var left = '<span class="person">' + g_dataset.individuals[0].name + '</span>';
    var right = '<span class="person">' + g_dataset.individuals[1].name + '</span>';

    var pleft, pright, diff = 0, index = 0;

    // Pull the top 3 out so they don't count
    var comparative = g_dataset.comparative.concat().sort(comparativeSortWeightedAverages);
    comparative.splice(0, 3);
    
    // Go through, pick the highest difference with right high.
    for (var i = 0; i < comparative.length; i++) {
        pleft = comparative[i][1];
        pright = comparative[i][2];
        if (Math.abs(pleft - pright) > diff && pright > pleft) {
            diff = Math.abs(pleft - pright);
            index = i;
        }
    }

    var categories = comparative[index][0].split('<br>');
  
    // Likewise, [right] is into [being the CAT in ] a[n] [CATS] relationship, but [left] would be opposed to it.
  
    var msg = 'Likewise, ' + right + ' is into ';
    if (categories.length > 1) {
        msg += ' being the ' + catsHtml(categories[1]) + ' in ';
    }

    msg += aOrAn(categories[0]) + catsHtml(categories) + ' relationship, but ' + left + ' would be opposed to it.';
    return msg;
}

/**
 * Generate a FINAL message of success or failure
 */
function finalResultLanguage()
{
    g_dataset.comparative.sort(comparativeSortWeightedAverages);
    var percent = g_dataset.comparative[0][3];

    if (percent > 90) {
        return 'Nothing in the world would be able to keep these two apart!';
    }
    else if (percent > 80) {
        return 'Overall, a huge success! Start writing that fanfic boys!';
    }
    else if (percent > 70) {
        return 'A better chance than most relationships. Go for it!';
    }
    else if (percent > 60) {
        return 'Pretty average, but if both are willing to try new things, it could work!';
    }
    else if (percent > 50) {
        return 'A little creativity could still make this work! Get on it!'
    }
    else {
        return 'Mathematically, this wouldn\'t work out :(';
    }
}

/**
 * Generate string for the top match message for the two individuals
 */
function topCategoryLanguage()
{
    var categories = g_dataset.comparative[0][0].split('<br>');
    var percent = g_dataset.comparative[0][3];
    var right = '<span class="person">' + g_dataset.individuals[1].name + '</span>';
    var msg;

    var cats = function() {
        if (categories.length < 2) {
            return '<span class="category">' + categories[0].trim() + '</span>';
        }
        return '<span class="category">' + categories[0].trim() + 
                '</span> / <span class="category">' + categories[1].trim() + 
                '</span>';
    };

    if (percent >= 90) {
        msg = 'Both are absolutely in love with acting out their ' + cats() + ' fantasties';
        if (categories.length > 1) {
            msg += ', with ' + right + ' as the <span class="category">' + categories[1].trim() + '</span>';
        }

        if (categories[0] === 'Vanilla') {
            msg += '. While it\'s not the kinkiest, they\'re both into it enough to make it amazing!';
        }
        else {
            msg += '. Plane tickets need to be ordered tonight!';
        }
    }
    else if (percent >= 80) {
        msg = 'Both will absolutely enjoy playing out their ' + cats() + ' fantasties';
        if (categories.length > 1) {
            msg += ', with ' + right + ' as the <span class="category">' + categories[1].trim() + '</span>';
        }

        if (categories[0] === 'Vanilla') {
            msg += '. While it\'s not the kinkiest, they can still be successful with it.';
        }
        else {
            msg += '. This is an opportunity that can\'t be passed up!';
        }
    }
    else if (percent >= 70) {
        msg = 'Both are definitely into having ' + aOrAn(categories[0]) + cats() + ' relationship';
        if (categories.length > 1) {
            msg += ', with ' + right + ' as the <span class="category">' + categories[1] + '</span>';
        }
        if (categories[0] === 'Vanilla') {
            msg += '. While it\'s not the kinkiest, they can still be successful with it!';
        }
        else {
            msg += '. If they were to bump uglies tonight, this would be the way to go.';
        }
    }
    else if (percent >= 50) {
        msg = 'Both are definitely into having ' + aOrAn(categories[0]) + cats() + ' relationship';
        msg = 'There might be some bumps along the way, but it can work if they have a ' + 
            cats() + ' relationship with one another.';
    }
    else {
        msg = ' Best they could do is have ' + aOrAn(categories[0]) + cats() + 
            ' relationship. It probably won\'t work out, but they don\'t have much else in common.';
    }

    return msg;
}

function summaryLanguage(row)
{
    var options = row[0].split('<br>');
    if (options.length < 2) {
        return 'Chance of success in ' + aOrAn(row[0]) + catsHtml(row[0]) + ' relationship';
    } 
    else {
        // Split on the display break, and highlight who is who
        return 'Chance of success in ' + aOrAn(options[0]) + catsHtml(options) + ' relationship, with <span class="person">' +
            g_dataset.individuals[0].name + '</span> as the ' + options[0];
    }
}

/**
 * Comparator to sort on left individual's percentages (high first)
 */
function comparativeSortLeft(a, b)
{
    return b[1] - a[1];
}

/**
 * Comparator to sort on right individual's percentages (high first)
 */
function comparativeSortRight(a, b)
{
    return b[2] - a[2];
}

/**
 * Comparator to sort on weighted averages (high first)
 */
function comparativeSortWeightedAverages(a, b)
{
    return b[3] - a[3];
}

function categoriesSortPercent(a, b)
{
    return b[1] - a[1];
}

function drawShippingDetails()
{
    // Basically just labels, Highcharts will do the rest of the work
    $('.analysis .person-left').html(g_dataset.individuals[0].name);
    $('.analysis .person-right').html(g_dataset.individuals[1].name);

    // Setup the highcharts graph
    Highcharts.setOptions(Highcharts.darkTheme);

    var categories = [], left = [], right = [], wavg = [];
    var comparator = comparativeSortLeft;
    var length = g_dataset.comparative.length;

    // Check for alt views
    var $analysis = $('section.analysis');

    if ($analysis.hasClass('sort-averages')) {
        comparator = comparativeSortWeightedAverages;
    }

    // if ($analysis.hasClass('show-top-ten')) {
    //     comparator = comparativeSortWeightedAverages;
    //     length = 10;
    // }

    // Sort our dataset
    g_dataset.comparative.sort(comparator);

    // Transform for the table
    for (var i = 0; i < length; i++) {
        categories.push(g_dataset.comparative[i][0]);
        left.push(g_dataset.comparative[i][1]);
        right.push(g_dataset.comparative[i][2]);
        wavg.push(g_dataset.comparative[i][3]);
    }

    // Turn off old render binds
    $('#shipping-chart-container')
        .removeClass('rendered')
        .off('renderChart');

    // Setup a new chart
    $('#shipping-chart-container').highcharts({
        title: {
            text: ''
        },
        xAxis: {
            categories: categories
        },
        tooltip:{
            formatter: function() {
                if (this.series.name === 'Weighted Average') {
                    // Display average tooltip
                    return 'Weighted Average: ' + this.y + '%';
                } 
                else {
                    var category;

                    var options = this.x.split('<br>');
                    if (options.length < 2) {
                        category = this.x.trim();
                    } 
                    else {
                        // Split on the display break, and show the correct category
                        // based on which column we're hovering (left vs right)
                        if (this.series.name === g_dataset.individuals[0].name) {
                            category = options[0].trim();
                        }
                        else {
                            category = options[1].trim();
                        }
                    }

                    return this.series.name + '<br>' + this.y + '% ' + category;
                }
            }
        },
        series: [{
            type: 'column',
            name: g_dataset.individuals[0].name,
            data: left,
            cursor: 'help',
            animation: {
                duration: 1000
            },
            point: {
                events: {
                    click: function(e) {
                        var categories = this.category.split('<br>');
                        if (categories.length > 1) {
                            // Show left category
                            showMoreInformation(categories[0].trim());
                        }
                        else {
                            showMoreInformation(this.category.trim());
                        }
                    }
                }
            }
        }, {
            type: 'column',
            name: g_dataset.individuals[1].name,
            data: right,
            cursor: 'help',
            animation: {
                duration: 1000
            },
            point: {
                events: {
                    click: function(e) {
                        var categories = this.category.split('<br>');
                        if (categories.length > 1) {
                            // Show right category
                            showMoreInformation(categories[1].trim());
                        }
                        else {
                            showMoreInformation(this.category.trim());
                        }
                    }
                }
            }
        }, {
            type: 'spline',
            name: 'Weighted Average',
            data: wavg,
            animation: {
                duration: 2000
            },
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[3],
                fillColor: 'white'
            }
        }]
    });
}

function drawShippingGraph()
{
    // Fire off a signal to the deferred renderer
    $('#shipping-chart-container').trigger('renderChart');
}

function drawIndividualAnalysisDetails($container, individual) 
{
    // Sort our dataset
    individual.categories.sort(categoriesSortPercent);

    var top1 = individual.categories[0];
    var top2 = individual.categories[1];
    var bottom1 = individual.categories[individual.categories.length-1];
    var bottom2 = individual.categories[individual.categories.length-2];

    // Update labels
    $container.find('.person').html(individual.name);
    $container.find('.top-1').html(top1[0]);
    $container.find('.top-2').html(individual.categories[1][0]);
    $container.find('.bottom-1').html(bottom1[0]);
    $container.find('.bottom-2').html(bottom2[0]);

    $container.find('.top-phrase').html( 
        weightLanguage(top1[1]) + ' ' + prefixLanguage(top1[0]) + 
        ' <span class="category">' + top1[0] + '</span> and ' + 
        weightLanguage(top2[1]) + ' ' + prefixLanguage(top2[0]) + 
        ' <span class="category">' + top2[0] + '</span>'
    );

    $container.find('.bottom-phrase').html( 
        weightLanguage(bottom2[1]) + ' ' + prefixLanguage(bottom2[0]) + 
        ' <span class="category">' + bottom2[0] + '</span> and ' + 
        weightLanguage(bottom1[1]) + ' ' + prefixLanguage(bottom1[0]) + 
        ' <span class="category">' + bottom1[0] + '</span>'
    );
}

function drawIndividualAnalysisChart($container, color, individual)
{
    var categories = [], percentages = [];

    // Sort our dataset
    individual.categories.sort(categoriesSortPercent);

    // Transform for the table
    for (var i = 0; i < 5; i++) {
        categories.push(individual.categories[i][0]);
        percentages.push(individual.categories[i][1]);
    }

    // Setup Highcharts to use alt theme
    Highcharts.setOptions(Highcharts.pinkTheme);

    // Clean out old binds
    $container.find('.chart-container')
        .removeClass('rendered')
        .off('renderChart');

    // Draw the graph
    $container.find('.chart-container').highcharts({
        colors: [color],
        chart: {
            polar: true,
            type: 'area'
        },
        title: {
            text: ''
        },
        pane: {
            size: '80%'
        },
        tooltip:{
            formatter: function(){
                return this.y + '% ' + this.x;
            }
        },
        xAxis: {
            categories: categories,
            tickmarkPlacement: 'on',
            lineWidth: 0
        },
        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
        },
        legend: {
            enabled: false
        },
        series: [{
            data: percentages,
            pointPlacement: 'off',
            cursor: 'help',
            animation: {
                duration: 2000
            },
            point: {
                events: {
                    click: function() {
                        showMoreInformation(this.category);
                    }
                }
            }
        }]
    });
}

function drawSideBySideDetails()
{
    drawIndividualAnalysisDetails($('.side-by-side-left'), g_dataset.individuals[0]);
    drawIndividualAnalysisDetails($('.side-by-side-right'), g_dataset.individuals[1]);

    // We also draw the charts now, but don't animate until they're in view
    drawIndividualAnalysisChart($('.side-by-side-left'), '#64B5F6', g_dataset.individuals[0]);
    drawIndividualAnalysisChart($('.side-by-side-right'), '#81C784', g_dataset.individuals[1]);
}

function drawSideBySideCharts()
{
    // Push animation
    $('.side-by-side-left .chart-container').trigger('renderChart');
    $('.side-by-side-right .chart-container').trigger('renderChart');
}

function drawFinalResultsCounters()
{
    // Sort our dataset
    g_dataset.comparative.sort(comparativeSortWeightedAverages);

    // Animated counters for top 3 percentages
    // Note, CountUp library needs these to be IDs
    (new CountUp('top-1-percent', 0, g_dataset.comparative[0][3])).start();
    (new CountUp('top-2-percent', 0, g_dataset.comparative[1][3])).start();
    (new CountUp('top-3-percent', 0, g_dataset.comparative[2][3])).start();
}

function drawFinalResultsDetails()
{
    // Sort our dataset
    g_dataset.comparative.sort(comparativeSortWeightedAverages);

    var $container = $('section.results');

    // Description fields of the top 3 
    $container.find('.top-1-info').html(summaryLanguage(g_dataset.comparative[0]));
    $container.find('.top-2-info').html(summaryLanguage(g_dataset.comparative[1]));
    $container.find('.top-3-info').html(summaryLanguage(g_dataset.comparative[2]));

    $container.find('.top-details').html(topCategoryLanguage());
    $container.find('.bottom-details').html(bottomCategoriesLanguage());
    $container.find('.left-difference').html(leftHighVsLowCategoriesLanguage());
    $container.find('.right-difference').html(rightHighVsLowCategoriesLanguage());

    $container.find('.success-or-fail p').html(finalResultLanguage());

    // Add a FINAL result, based on our top match
    if (g_dataset.comparative[0][3] > 50) {
        $container.find('.success-or-fail i').addClass('teehee').html('favorite');
    } else {
        $container.find('.success-or-fail i').removeClass('teehee').html('block');
    }
}

/**
 * Reset scrollfire to animate charts/details on page scroll
 */
function resetAnimations()
{
    // Highcharts rendering when we pass through each chart
    // Problem with scrollfire: If it's already visible on the page, it doesn't
    // test until a scroll event is fired once. 
    Materialize.scrollFire([
        {
            selector: '.side-by-side', 
            offset: 400, 
            callback: 'drawSideBySideCharts()'
        },
        {
            selector: '.analysis',
            offset: 400,
            callback: 'drawShippingGraph()'
        },
        {
            selector: '.results',
            offset: 400,
            callback: 'drawFinalResultsCounters()'
        }
    ]);

    // Fire a fake scroll event, just to trigger scrollFire to start working.
    // Bit of a hack, but scrollfire doesn't add the listener until a scroll event.
    if (typeof Event === 'function') {
        window.dispatchEvent(new Event('scroll'));
    }
}

/**
 * Redraw analysis details along the page.
 * This is static information, and not graphs/animations 
 * (which should animate via scrollfire as the user scrolls)
 */
function redrawDetails()
{
    drawFinalResultsDetails();
    drawSideBySideDetails();
    drawShippingDetails();
}

function loadShipping() 
{
    var left = $('a.shipping-left').html();
    var right = $('a.shipping-right').html();

    // Clear names from both lists
    $('.shipping-list a').each(function() {
        if ($(this).html() === left || $(this).html() === right) {
            $(this).hide();
        }
        else {
            $(this).show();
        }
    });

    var url = '/love/' + left + '/x/' + right;

    $.getJSON(url)
        .done(function(data) {
            g_dataset = data;

            redrawDetails();
            resetAnimations();

            // Update our document URL alongside content
            history.pushState({}, left + ' x ' + right, url);
        });

    // Reset controls
    $('.sort-shipping').html('sort by averages');
    $('section.analysis').removeClass('sort-averages');
}

function showMoreInformation(category) {

    // Hide any open modal
    // There's an interesting modal bug where the overlay
    // sometimes doesn't get removed when we try to call closeModal()
    // across multiple selectors (i.e. $('modal').closeModal()).
    // So, if there's an overlay, we trigger a click on that directly
    // and through Materialize, that should close any open modal
    $('.lean-overlay').click();

    // Open the modal associated with the category
    // Another bug in Matcss is that if we try to openModal a bad
    // selector, it shows the overlay but doesn't show the modal. 
    // Rather, we should check for it to exist before even trying.
    var $modal = $('.modal-tmyk[data-category="' + category + '"]');

    if ($modal.length > 0) {
        $modal.openModal();
    }
}

$(function() {
    $('select').material_select();
    $('.modal-trigger').leanModal();

    $('.shipping-left, .shipping-right').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: true, // Displays dropdown below the button
        alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });

    $('.shipping-list a').click(function() {
        var id = $(this).closest('ul').attr('id');
        var $label = $('a[data-activates="' + id + '"]');

        $label.html($(this).html());
        loadShipping();
    });

    $('.try-another').click(function() {
        // Both html/body needed for IE support (meh)
        $('html, body').animate({ scrollTop: 350 }, 'slow');
        return false;
    });

    // TODO: Seems to be a (HighCharts?) bug where if we regenerate one
    // of the tables, most of them fail to show hover icons.
    $('.sort-shipping').click(function() {
        var $analysis = $('section.analysis');
        $analysis.toggleClass('sort-averages');

        if ($analysis.hasClass('sort-averages')) {
            $(this).html('sort by default');
        }
        else {
            $(this).html('sort by averages');
        }

        drawShippingDetails();
        drawShippingGraph();
    });

    $('main').on('click', '.teehee', function() {
        g_teehee.play();
    });

    // Clicking on a category will show additional information about it
    $('main').on('click', '.category', function() {
        var category = $(this).html().trim();
        showMoreInformation(category);
    });

    // $('.top-shipping').click(function() {
    //     var $analysis = $('section.analysis');

    //     $analysis
    //         .toggleClass('show-top-ten');

    //     if ($analysis.hasClass('show-top-ten')) {
    //         $(this).html('show all');
    //     }
    //     else {
    //         $(this).html('show top 10');
    //     }

    //     drawShippingAverages();
    // });
    loadShipping();

});
