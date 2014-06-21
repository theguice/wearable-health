$(document).ready(function() {
	
	console.log(basis3);
	console.log(lumo);
    console.log("places", moves_places);
    console.log("activities", moves_activities);

	var i;
	var acts = [];
	for (i=0; i<lumo.acts.length; i++) {
		// if key not existis, create it first
		if (acts[lumo.acts[i].t] == null) {
			acts[lumo.acts[i].t] = [];
		}
		acts[lumo.acts[i].t].push(lumo.acts[i]);
	}
	console.log(acts);

	// lumo
	// 288 5-minute intervals per day
	stacked_data = [];
	act_counts = [];
	undocumented = [];
	labels = ['C_STEPS','C_STU','C','INACT','LB','LF','LL','LR','NW','R','SBF','SBL','SBR','SBS','SG','STBF','STBL','STBR','STBS','STG','W'];
	for (j=0; j<labels.length; j++) {
		stacked_data[labels[j]] = [];
		act_counts[labels[j]] = 0;
	}
	for (i=0; i<288; i++) {
		t = 1401840000 + (i*300);

		if (acts[t] == null) {
			for (j=0; j<labels.length; j++) {
				stacked_data[labels[j]].push(0);
				act_counts[labels[j]]++;
			}
		} else {
			//console.log(acts[t]);
			for (j=0; j<acts[t].length; j++) {
				if (stacked_data[acts[t][j]['act']] == null) {
					//console.log("Undocumented Act: ", acts[t][j]['act']);
					if (undocumented.indexOf(acts[t][j]['act']) == -1) {
						undocumented.push(acts[t][j]['act']);
					}

				} else {
					stacked_data[acts[t][j]['act']].push(acts[t][j]['pct']);
					act_counts[acts[t][j]['act']]++;
				}
			}
			
			// give 0's to the acts that weren't present
			for (k=0; k<labels.length; k++) {
				if (act_counts[labels[k]] < i+1) {
					stacked_data[labels[k]].push(0);
					act_counts[labels[k]]++;
				}
			}
		}
	}
	console.log(stacked_data);
	console.log(act_counts);
	console.log(undocumented);


    // create places
    for (i=0; i<moves_places[0].segments.length; i++) {
        var start = moves_places[0].segments[i].startTime.replace(/.*T/, '').replace(/-.*/, '');
        var end = moves_places[0].segments[i].endTime.replace(/.*T/, '').replace(/-.*/, '');
        var width = Math.round(((end - start)/2400), 1);
        if (width < 0) {
            width = Math.round(((240000 - start)/2400), 1);
        }
        var div=document.createElement("div");
        $(div).addClass("place").width(width+'%').html(moves_places[0].segments[i].place.name);
        $('#container-places').append(div);
    }


$(function () {
        $('#container-hr').highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: false	
            },
            exporting: {
            	enabled: false
        	},
        	credits: {
            	enabled: false
        	},
            xAxis: {
            	labels: {
            		enabled: false
            	},
                type: 'datetime',
                minRange: 1 * 24 * 3600000 // one day

            },
            yAxis: {
                title: {
                    text: 'Heart rate'
                },
                labels: {
                    align: 'left',
                    x: 0,
                    y: -2
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
    
            series: [{
                type: 'area',
                name: 'BPM',
                pointInterval: (24 * 60 * 60)*2/3,
                pointStart: Date.UTC(2014, 5, 3, 0, 0),
                data: basis3.metrics.heartrate.values
            }]
        });
    });

$(function () {
        $('#container-cal').highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: false
            },
            exporting: {
            	enabled: false
        	},
        	credits: {
            	enabled: false
        	},
            xAxis: {
            	labels: {
            		enabled: false
            	},
                type: 'datetime',
                minRange: 1 * 24 * 3600000 // one day
            },
            yAxis: {
                title: {
                    text: 'Calories'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[1]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
    
            series: [{
                type: 'area',
                name: 'Calories',
                pointInterval: (24 * 60 * 60)*2/3,
                pointStart: Date.UTC(2014, 5, 3, 0, 0),
                data: basis3.metrics.calories.values
            }]
        });
    });

$(function () {
        $('#container-airtemp').highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: false
            },
            exporting: {
            	enabled: false
        	},
        	credits: {
            	enabled: false
        	},
            xAxis: {
            	labels: {
            		enabled: false
            	},
                type: 'datetime',
                minRange: 1 * 24 * 3600000 // one day
            },
            yAxis: {
                title: {
                    text: 'Air Temp (°f)'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[2]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
    
            series: [{
                type: 'area',
                name: 'Air Temp (°f)',
                pointInterval: (24 * 60 * 60)*2/3,
                pointStart: Date.UTC(2014, 5, 3, 0, 0),
                data: basis3.metrics.air_temp.values
            }]
        });
    });


$(function () {
        $('#container-skintemp').highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: false
            },
            exporting: {
            	enabled: false
        	},
        	credits: {
            	enabled: false
        	},
            xAxis: {
            	labels: {
            		enabled: false
            	},
                type: 'datetime',
                minRange: 1 * 24 * 3600000 // one day
            },
            yAxis: {
                title: {
                    text: 'Skin Temp (°f)'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[3]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
    
            series: [{
                type: 'area',
                name: 'Skin Temp (°f)',
                pointInterval: (24 * 60 * 60)*2/3,
                pointStart: Date.UTC(2014, 5, 3, 0, 0),
                data: basis3.metrics.skin_temp.values
            }]
        });
    });


$(function () {
        $('#container-gsr').highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: false
            },
            exporting: {
            	enabled: false
        	},
        	credits: {
            	enabled: false
        	},
            xAxis: {
            	labels: {
            		enabled: false
            	},
                type: 'datetime',
                minRange: 1 * 24 * 3600000 // one day
            },
            yAxis: {
                title: {
                    text: 'GSR'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[6]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
    
            series: [{
                type: 'area',
                name: 'GSR',
                pointInterval: (24 * 60 * 60)*2/3,
                pointStart: Date.UTC(2014, 5, 3, 0, 0),
                data: basis3.metrics.gsr.values
            }]
        });
    });
    
    


$(function () {
        $('#container-steps').highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: false
            },
            exporting: {
            	enabled: false
        	},
        	credits: {
            	enabled: false
        	},
            xAxis: {
                type: 'datetime',
                minRange: 1 * 24 * 3600000 // one day
            },
            yAxis: {
                title: {
                    text: 'Steps'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[5]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
    
            series: [{
                type: 'area',
                name: 'Steps',
                pointInterval: (24 * 60 * 60)*2/3,
                pointStart: Date.UTC(2014, 5, 3, 0, 0),
                data: basis3.metrics.steps.values
            }]
        });
    });
    
    




    $(function () {
        $('#container-lumo').highcharts({
            chart: {
                type: 'column'
            },
            exporting: {
            	enabled: false
        	},
        	credits: {
            	enabled: false
        	},
            title: {
                text: 'Lumo Back'
            },
            xAxis: {
                type: 'linear',
                ceiling: 288 // one day
            },
            yAxis: {
                min: 0,
                title: {
                    text: '% time spent'
                }
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                column: {
                    stacking: 'percent'
                },
                series: {
                	groupPadding: 0
            	}
            },
                series: [{
                name: 'LB',
                data: stacked_data['LB']
            }, {
                name: 'LF',
                data: stacked_data['LF']
            }, {
                name: 'LL',
                data: stacked_data['LL']
            }, {
                name: 'LR',
                data: stacked_data['LR']
            }, {
                name: 'NW',
                data: stacked_data['NW']
            }, {
                name: 'R',
                data: stacked_data['R']
            }, {
                name: 'SBF',
                data: stacked_data['SBF']
            }, {
                name: 'SBL',
                data: stacked_data['SBL']
            }, {
                name: 'SBR',
                data: stacked_data['SBR']
            }, {
                name: 'SBS',
                data: stacked_data['SBS']
            }, {
                name: 'SG',
                data: stacked_data['SG']
            }, {
                name: 'STBF',
                data: stacked_data['STBF']
            }, {
                name: 'STBL',
                data: stacked_data['STBL']
            }, {
                name: 'STBR',
                data: stacked_data['STBR']
            }, {
                name: 'STBS',
                data: stacked_data['STBS']
            }, {
                name: 'STG',
                data: stacked_data['STG']
            }, {
                name: 'W',
                data: stacked_data['W']
            }]
        });
    });
    


    


});