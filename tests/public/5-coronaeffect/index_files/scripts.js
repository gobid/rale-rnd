var closeSvg = '<svg width="18.62" height="18.62" viewBox="0 0 25.545 25.544"><g id="close_3_"transform="translate(0 -0.001)"><path id="Path_23" data-name="Path 23" d="M15.032,12.773,25.077,2.728A1.6,1.6,0,0,0,22.818.469L12.773,10.514,2.727.469A1.6,1.6,0,0,0,.468,2.728L10.514,12.773.468,22.819a1.6,1.6,0,1,0,2.259,2.258L12.773,15.032,22.818,25.077a1.6,1.6,0,1,0,2.259-2.259Z" transform="translate(0 0)" fill="#28EDE5"></path></g></svg>';

var visualId = false;
$(document)
    .ready(function () {
        getChartFilters();
        typewriter();

        var params = (new URL(document.location)).searchParams;
        visualId = params.get('visualid');
    })
    .on('click', function(e) {
        $('.dropdown-list').removeClass('open');
        $('.popup').removeClass('open');
        $('body').removeClass('fixed');
    })
    .keyup(function(e) {
        if (e.keyCode === 27) { // esc => 27, enter => 13
            $('.dropdown-list').removeClass('open');
            $('.popup').removeClass('open');
            $('body').removeClass('fixed');
        }
    })
    .on('click', '.share-btn, .topicsInfo-btn svg, .pop-content, .upload-btn, .about-btn', function(e) {
        e.stopPropagation();
    })
    .on('click', '.dropdown-list label', function(e) {
        e.stopPropagation();
        var parent = $(this).parent('.dropdown-list');
        if(!parent.hasClass('open')) {
            $('.dropdown-list').removeClass('open');
            parent.addClass('open');
        } else {
            $('.dropdown-list').removeClass('open');
        }
    })
    .on('click', '.dropdown li', function(e) {
        e.stopPropagation();
        var me = $(this);
        var dropdown = me.parents('.dropdown-list');
        me.siblings().removeClass('active');
        me.addClass('active');
        dropdown.find('> label > span').html(me.html());
        dropdown.removeClass('open');
        $('.top-header').removeClass('open');

        getChartData();
    })
    .on('click', '.share-btn', function() {
        $('.popup#sharePop').addClass('open');
        $('body').addClass('fixed');
        $('.popup#sharePop').removeClass('share');
        if($(this).hasClass('visual')) {
            shareLinks(true);
            $('.popup#sharePop').addClass('share');
        }
        else shareLinks();
    })
    .on('click', '.about-btn', function() {
        $('.popup#aboutPop').addClass('open');
        $('body').addClass('fixed');
    })
    .on('click', '.close-pop', function() {
        $(this).parent().parent('.popup').removeClass('open');
        $('body').removeClass('fixed');
    })
    .on('click', '.topics-list li', function() {
        var me = $(this);
        $('.topics-list li svg').remove();
        $('.filter-topic span:last').html('');
        $('.top-header').removeClass('open');
        if (!me.hasClass('active')) {
            $('.topics-list li').removeClass('active');
            me.addClass('active');
            me.append(closeSvg);
            
            visualId = false
            getChartData(me.data('id'));
        } else {
            getChartData();
            removeDataSet();
        }
    })
    .on('click', '.topicsInfo-btn > svg', function() {
        $('.popup#topicsInfo').addClass('open');
        $('body').addClass('fixed');
    })
    .on('click', '.upload-btn', function() {
        $('.popup#uploadPop').addClass('open');
        $('body').addClass('fixed');
    })
    .on('change', '#input-upload', function(e) {
        var me = $(this);
        var fileName = e.target.files[0].name;
        var extension = fileName.substr( (fileName.lastIndexOf('.') +1) );
        if(extension == 'xlsx') {
            if($(this).prop('files')) {
                formdata = new FormData();
                file = $(this).prop('files')[0];
                formdata.append("file", file);
                $.ajax({
                    url: "http://coronaffect.com/api/upload-data",
                    type: 'POST',
                    method: 'POST',
                    data: formdata,
                    processData: false,
                    contentType: false,
                }).done(function(data) {
                    visualId = JSON.parse(data).chart_id;
                    $('.file-name').html(fileName);
                    $('.add-icon').hide();
                    $('.file-icon').show();
                    $('.visual-btn').removeAttr('disabled');
                });
            }
        } else {
            notify("File not supported!");
        }
    })
    .on('click', '.visual-btn', function() {
        $('#uploadPop').removeClass('open');
        $('.select-topic').hide();
        $('.visual-container').show();
        $('#generated-link').val(window.location.origin + '?visualid=' + visualId);
        getChartData(visualId);
    })
    .on('click', '.visual-container .close', function() {
        $('.select-topic').show();
        $('.visual-container').hide();

        updateDropdown($('.countries-dropdown'));
        updateDropdown($('.corona-filter'));
        removeDataSet();
        getChartData();
    })
    .on('click', '.notify .close', function() {
        $('.notify').removeClass('open');
    })
    .on('click', '.copy-link', function(e) {
        e.preventDefault();
        var copyText = document.getElementById("generated-link");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        notify('Copied to clipboard');
    })
    .on('click', '.footer-btn', function() {
        $('.footer-pop').addClass('open');
    })
    .on('click', '.btn-close-footer', function() {
        $('.footer-pop').removeClass('open');
    })
    .on('click', '.btn-filter', function() {
        $('.top-header').addClass('open');
    })
    .on('click', '.close-filter', function() {
        $('.top-header').removeClass('open');
    })
    .on('click', '.logo', function() {
        updateDropdown($('.countries-dropdown'));
        updateDropdown($('.corona-filter'));
        removeDataSet();
        getChartData();
    })

$(window).on('resize', function() {
    UpdateChartDim();
})
$('.topics-list-container').on('scroll', function() {
    var top = $('.topics-list-container').scrollTop();
    var containerHeight = $('.topics-list-container').height();
    var height = $('.topics-list-container ul').height();

    $('.selection-area .top-shadow, .selection-area .bottom-shadow').show();
    if(5 > top > 0)
        $('.selection-area .top-shadow').hide();
    if((top+containerHeight+1) >= height)
        $('.selection-area .bottom-shadow').hide();
})
function shareLinks(visual) {
    $('.share-list a').each(function() {
        var me = $(this);
        var href = me.data('href');
        if(visual)
            href = href.replace('{URL}', $('#generated-link').val());
        else
            href = href.replace('{URL}', window.location.origin);
        href = href.replace('{TITLE}', aText[0]);
        me.attr('href', href);
    })
}
function UpdateChartDim() {
    if($(window).width() < 992) {
        $('.main-wrapper .chart-area .chart-section').css('height', ($(window).height() - 2 - ($('.main-wrapper aside.side').innerHeight() + $('.main-wrapper > footer').innerHeight())));
    } else {
        $('.main-wrapper .chart-area .chart-section').css('min-height', '100vh')
    }
}
function getChartFilters() {
    $.ajax({
        url: "http://pixonal.com/corona/public/api/charts"
    }).done(function(data) {
        $('.topics-list, .corona-filter .dropdown > ul').html("");
        data.data.forEach(element => {
            if(element.is_corona == "1")
                $('.corona-filter .dropdown > ul').append('<li data-id='+element.id+'>'+element.name.replace('corona_', '')+' Cases</li>');
            if(element.is_corona == "0")
                $('.topics-list').append('<li data-id='+element.id+' title='+element.name+'>'+element.name+'</li>');
        });
        UpdateChartDim();
        getCountries();
        if($('.topics-list-container ul').height() == $('.topics-list-container').height()) {
            $('.selection-area .top-shadow, .selection-area .bottom-shadow').hide();
        }
    });
}
function getCountries() {
    $.ajax({
        url: "http://pixonal.com/corona/public/api/countries"
    }).done(function(data) {
        var html = "";
        data.data.forEach(element => {
            html += '<li data-id='+element.id+'>'+element.name.replace('Global', 'cases globally')+'</li>';
        });
        $('.countries-dropdown .dropdown > ul').html(html);

        $('.countries-dropdown .dropdown > ul li:first').addClass('active');
        $('.corona-filter .dropdown > ul li:first').addClass('active');

        getChartData();
    });
}
function updateDropdown(dropdown, value) {
    var selected;
    if(value)
        selected = dropdown.find('.dropdown > ul li[data-id='+value+']');
    else
        selected = dropdown.find('.dropdown > ul li:first');
    if(selected.length) {
        dropdown.find('.dropdown > ul li').removeClass('active');
        selected.addClass('active');
        dropdown.find('> label.btn > span').html(selected.text());
    }
}
function getChartData(topicId) {
    $('.corona-filter').show();
    var country = $('.countries-dropdown .dropdown > ul li.active').data('id');
    var coronaFilter = $('.corona-filter .dropdown > ul li.active').data('id');

    if(topicId) coronaFilter = topicId;
    
    $('.preloader').fadeIn();
    updateDropdown($('.countries-dropdown'), country);
    updateDropdown($('.corona-filter'), coronaFilter);

    $.ajax({
        url: "http://pixonal.com/corona/public/api/data?country_id="+country+"&chart_id="+coronaFilter
    }).done(function(data) {
        $('.preloader').fadeOut();
        bindChartData(data, topicId);
    });
}
function notify(msg) {
    $('.notify span').html(msg);
    $('.notify').addClass('open');
    setTimeout(function() {
        $('.notify').removeClass('open');
    }, 3000);
}
//********************************************************************************//
// Typing text
// set up text to print, each item in array is new line
var aText = new Array(
    "Make more sense of the Coronavirus data across the globe by mapping it with other data points to identify the trends and patterns."
);
var iSpeed = 50; // time delay of print out
var iIndex = 0; // start printing array at this posision
var iArrLength = aText[0].length; // the length of the text array
var iScrollAt = 20; // start scrolling up at this many lines

var iTextPos = 0; // initialise text position
var sContents = ''; // initialise contents variable
var iRow; // initialise current row

function typewriter() {
    sContents = ' ';
    iRow = Math.max(0, iIndex - iScrollAt);
    var destination = document.getElementById("typedtext");

    while (iRow < iIndex) {
        sContents += aText[iRow++] + '<br />';
    }
    destination.innerHTML = sContents + aText[iIndex].substring(0, iTextPos) + "_";
    if (iTextPos++ == iArrLength) {
        iTextPos = 0;
        iIndex++;
        if (iIndex != aText.length) {
            iArrLength = aText[iIndex].length;
            setTimeout("typewriter()", 500);
        }
    } else {
        setTimeout("typewriter()", iSpeed);
    }
}

//************************* CHART ***********************//
var xAxesMinTicks, xAxesMaxTicks, yAxesSuggestedMin1, yAxesSuggestedMin2, yAxesSuggestedMax1, yAxesSuggestedMax2, panRangeMin, panRangeMax, firstDate, lastDate;
var months = [];
var config = {
    type: 'LineWithLine',
    data: { datasets: [] },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        legend: { display: false },
        // tooltips: {
        //     enabled: false,
        //     callbacks: {
        //         title: function() {},
        //         label: function(tooltipItem, data) {
        //             var label = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].text || '';
        //             if(label)
        //                 return label;
        //         }
        //     },
        //     backgroundColor: '#1F212B',
        //     bodyFontColor: '#FFFFFF',
        //     bodyFontSize: 16,
        //     displayColors: false,
        //     bodyFontFamily: '"IBM Plex Sans", sans-serif',
        //     xPadding: 25,
        //     yPadding: 15,
        //     width: 250,
        //     xAlign: 'center',
        //     yAlign: 'bottom',
        // },
        // tooltips: {
        //     mode: 'index',
        //     intersect: false,
        // },
        tooltips: {
            enabled: false,
            mode: 'index',
            intersect: false,
            // custom: customTooltips
            custom: function(tooltip) {
                var positionY = this._chart.canvas.offsetTop;
                var positionX = this._chart.canvas.offsetLeft;

                $('.chartjs-tooltip').css({ opacity: 0 });
                if (!tooltip || !tooltip.opacity) { return; }
                
                if (tooltip.dataPoints.length > 0) {
                    tooltip.dataPoints.forEach(function(dataPoint) {
                        var content = config.data.datasets[dataPoint.datasetIndex].data[dataPoint.index].label;
                        var $tooltip = $('#tooltip-' + dataPoint.datasetIndex);
                        $tooltip.html(content);
                        content = config.data.datasets[dataPoint.datasetIndex].data[dataPoint.index].milestone;
                        $('#tooltip-0').html(content);
                        $tooltip.css({
                            opacity: 1,
                            top: positionY + 20 + dataPoint.y + 'px',
                            left: positionX + dataPoint.x + 'px',
                        });
                    });
                }
            }
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                // offset: true,
                display: false,
                type: "time",
                time: { unit: 'month' },
                gridLines: { color: "#707070", drawBorder: false, /*offsetGridLines: true*/},
                ticks: {
                    maxRotation: 0,
                    beginAtZero: true,
                    fontColor: '#868686',
                    // alignment: 'end',
                    labelOffset: '20',
                    fontSize: 16,
                    fontFamily: '"IBM Plex Sans", sans-serif',
                    textTransform: 'uppercase',
                    min: xAxesMinTicks,
                    max: xAxesMaxTicks,
                }
            }],
            yAxes: [{
                display: false,
                ticks: {
                    suggestedMax: yAxesSuggestedMax1,
                    suggestedMin: yAxesSuggestedMin1
                },
                position: 'left',
                id: 'y-axis-1',
            }, {
                display: false,
                ticks: {
                    suggestedMax: yAxesSuggestedMax2,
                    suggestedMin: yAxesSuggestedMin2
                },
                position: 'right',
                id: 'y-axis-2',
            }]
        },
        pan: {
            enabled: true,
            mode: "x",
            speed: 10,
            threshold: 0,
            rangeMin: { x: panRangeMin },
            rangeMax: { x: panRangeMax }
        },
        zoom: {
            enabled: false,
            drag: false,
            mode: "x",
            sensitivity: 3,
            rangeMin: { x: panRangeMin },
            rangeMax: { x: panRangeMax },
            onZoom: function() {}
        }
    }
}
var draw = Chart.controllers.line.prototype.draw;
Chart.defaults.LineWithLine = Chart.defaults.line;
Chart.controllers.LineWithLine = Chart.controllers.line.extend({
    draw: function(ease) {
        Chart.controllers.line.prototype.draw.call(this, ease);
        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
            var activePoint = this.chart.tooltip._active[0],
                ctx = this.chart.ctx,
                hoverDay = moment(config.data.datasets[1].data[activePoint._index].x).format("D MMM Y"),
                lineHieghtAdj = ($('.chart-section').innerHeight() * 0.22),
                x = activePoint.tooltipPosition().x,
                topY = this.chart.scales['y-axis-1'].top + lineHieghtAdj,
                bottomY = this.chart.scales['y-axis-1'].bottom;
            
            // draw line & background
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.fillStyle = '#FF4970';
            ctx.fillRect(x - 55, topY - 35, 110, 30);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#A3A3A3';
            ctx.fillStyle = '#0A0A0A';
            ctx.textAlign = 'center';
            ctx.font = '500 15px "IBM Plex Sans", sans-serif';
            ctx.fillText(hoverDay.toUpperCase(), x, topY - 14);
            ctx.setLineDash([2, 1, 0]);
            ctx.stroke();
            ctx.restore();
        }
   }
});
window.onload = function () {
    var ctx = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(ctx, config);
};
function bindChartData(data, topic) {
    if(topic) {
        if(data.data.length) {
            var secondDataset = {
                fill: false,
                borderWidth: 2,
                borderColor: "#1EEDE5",
                pointRadius: 0,
                data: [],
                yAxisID: 'y-axis-2'
            }
            yAxesSuggestedMin2 = yAxesSuggestedMax2 = 0;
            data.data.forEach((element) => {
                secondDataset.data.push({x: moment(element.date).toDate(), y: element.value, label: element.label});
                if(element.value < yAxesSuggestedMin2) yAxesSuggestedMin2 = element.value; // get min value
                if(element.value > yAxesSuggestedMax2) yAxesSuggestedMax2 = element.value; // get max value
            })
            config.options.scales.yAxes[1].ticks.suggestedMin = yAxesSuggestedMin2 - (yAxesSuggestedMax2*0.1);
            config.options.scales.yAxes[1].ticks.suggestedMax = (yAxesSuggestedMax2 + (yAxesSuggestedMax2*0.4));

            config.data.datasets[2] = secondDataset;
            if($('.topics-list .active').length) {
                $('.filter-topic span:last').html($('.topics-list .active').text());
                $('.filter-topic span').show();
            }
        } else {
            removeDataSet();
        }
    } else {
        var MilestoneDataset = {
            fill: false,
            borderWidth: 2,
            borderRadius: 15,
            pointRadius: 10,
            pointHoverRadius: 15,
            showLine: false,
            backgroundColor: "#0027FF",
            data: [],
            yAxisID: 'y-axis-1'
        };
        var firstDataset = {
            fill: false,
            borderDash: [2, 4],
            borderWidth: 2,
            pointRadius: 0,
            borderColor: "#FFFFFF",
            backgroundColor: "#0027FF",
            pointBorderColor: "#0027FF",
            pointBackgroundColor: "#0027FF",
            data: [],
            yAxisID: 'y-axis-1'
        };
        yAxesSuggestedMin1 = yAxesSuggestedMax1 = 0;
        data.data.forEach((element, index) => {
            if(element.milestone)
                MilestoneDataset.data.push({x: element.date, y: element.value, label: element.label, milestone: element.milestone});
            else
                MilestoneDataset.data.push({x: element.date, y: null, label: element.label, milestone: element.milestone});
            firstDataset.data.push({x: element.date, y: element.value, label: element.label, milestone: element.milestone}); // push to chart dataset
            if(index == 0) firstDate = moment(element.date).subtract(5, 'day').toDate(); // first date in data array
            if (index == (data.data.length-1)) lastDate = moment(element.date).add(5, 'day').toDate(); // last date in data array
            if(element.value < yAxesSuggestedMin1) yAxesSuggestedMin1 = element.value; // get min value
            if(element.value > yAxesSuggestedMax1) yAxesSuggestedMax1 = element.value; // get max value
        });
        config.options.pan.rangeMin.x = config.options.scales.xAxes[0].ticks.min = firstDate;
        config.options.pan.rangeMax.x = config.options.scales.xAxes[0].ticks.max = lastDate;
        config.options.scales.yAxes[0].ticks.suggestedMin = yAxesSuggestedMin1 - (yAxesSuggestedMax1*0.1);
        config.options.scales.yAxes[0].ticks.suggestedMax = (yAxesSuggestedMax1 + (yAxesSuggestedMax1*0.4));
        config.data.datasets[0] = MilestoneDataset;
        config.data.datasets[1] = firstDataset;
        // removeDataSet();
        if (visualId) getChartData(visualId);
    }

    resetZoom();
    window.myLine.update();
}
var zoomArray = ['noZoom', '3month', '1month'];
var isScrolling, currentZoomIndex = 1;
document.getElementById("canvas").addEventListener('wheel', function(event) {
    window.clearTimeout( isScrolling );
    isScrolling = setTimeout(function() {
        if (event.deltaY < 0) {
            (currentZoomIndex < zoomArray.length) ? currentZoomIndex += 1 : currentZoomIndex=zoomArray.length;
        }
        else if (event.deltaY > 0) {
            (currentZoomIndex > 1) ? currentZoomIndex -= 1 : currentZoomIndex=1;
        }
        zoomChart();
	}, 200);
});
function zoomChart() {
    switch (currentZoomIndex) {
        case 1: // default
            resetZoom();
            break;
        case 2:
            $('#grid').attr('class', 'zoom-1');
            config.options.scales.xAxes[0].time.unit = 'month';
            config.options.scales.xAxes[0].ticks.min = firstDate;
            config.options.scales.xAxes[0].ticks.max = moment(firstDate).add(2, 'month').toDate();
            $('.reset-zoom').show();
            break;
        case 3:
            $('#grid').attr('class', 'zoom-2');
            config.options.scales.xAxes[0].time.unit = 'week';
            config.options.scales.xAxes[0].ticks.min = firstDate;
            config.options.scales.xAxes[0].ticks.max =  moment(firstDate).add(1, 'month').toDate();
            $('.reset-zoom').show();
            break;
    }
    window.myLine.update();
}
function zoomIn() {
    $('.reset-zoom').show();
    (currentZoomIndex < zoomArray.length) ? currentZoomIndex += 1 : currentZoomIndex=zoomArray.length;
    zoomChart();
}
function zoomOut() {
    $('.reset-zoom').show();
    (currentZoomIndex > 1) ? currentZoomIndex -= 1 : currentZoomIndex=1;
    zoomChart();
}
function resetZoom() {
    currentZoomIndex = 1;
    $('.reset-zoom').hide();
    $('#grid').removeAttr('class');
    config.options.scales.xAxes[0].time.unit = 'month';
    config.options.scales.xAxes[0].ticks.min = firstDate;
    config.options.scales.xAxes[0].ticks.max = lastDate;
    window.myLine.resetZoom();
}
function removeDataSet() {
    visualId = false;
    $('.topics-list li').removeClass('active');
    $('.topics-list li svg').remove();
    $('.filter-topic span').hide();
    if(config.data.datasets.length == 3) {
        config.data.datasets.pop();
        window.myLine.update();
    }
}