//var $base_url = "http://localhost:8888";
//var $base_url = "https://people.ischool.berkeley.edu/~shubham/wearable-health"; 
var $base_url = "https://groups.ischool.berkeley.edu/healthstudy"; 

/* console.log('assigning click handler'); */
/*
if (!$("#option_heartrate").is(":checked")) {
	console.log('checked');
}
*/
$(".top").on('click', function() {
	if ($('#option_heartrate').is(":checked")) {
		$(".line.line0").css("visibility", "visible");
		$(".line.base0").css("visibility", "visible");
	} else {
		$(".line.line0").css("visibility", "hidden");
		$(".line.base0").css("visibility", "hidden");
	}
	if ($('#option_steps').is(":checked")) {
		$(".bar.bar1").css("visibility", "visible");
	} else {
		$(".bar.bar1").css("visibility", "hidden");
	}
	if ($('#option_calories').is(":checked")) {
		$(".bar.bar2").css("visibility", "visible");
	} else {
		$(".bar.bar2").css("visibility", "hidden");
	}
	if ($('#option_gsr').is(":checked")) {
		$(".line.line3").css("visibility", "visible");
		$(".line.base3").css("visibility", "visible");
	} else {
		$(".line.line3").css("visibility", "hidden");
		$(".line.base3").css("visibility", "hidden");
	}
	if ($('#option_posture').is(":checked")) {
		$(".line.line4").css("visibility", "visible");
		$(".line.base4").css("visibility", "visible");
	} else {
		$(".line.line4").css("visibility", "hidden");
		$(".line.base4").css("visibility", "hidden");
	}
	if ($('#option_skin_temp').is(":checked")) {
		$(".line.line5").css("visibility", "visible");
		$(".line.base5").css("visibility", "visible");
	} else {
		$(".line.line5").css("visibility", "hidden");
		$(".line.base5").css("visibility", "hidden");
	}
	if ($('#option_air_temp').is(":checked")) {
		$(".line.line6").css("visibility", "visible");
		$(".line.base6").css("visibility", "visible");
	} else {
		$(".line.line6").css("visibility", "hidden");
		$(".line.base6").css("visibility", "hidden");
	}
//	if ($('#option_posture').is(":checked")) {
//		$(".line.line7").css("visibility", "visible");
//		$(".line.base7").css("visibility", "visible");
//	} else {
//		$(".line.line7").css("visibility", "hidden");
//		$(".line.base7").css("visibility", "hidden");
//	}
	// TODO: Temporarily all lumo back data is hidden till we decide how to make it a part of the interface
	// and an algorithm to represent good posture based on sitting scores, standing scores, etc
	$(".line.line7").css("visibility", "hidden");
	$(".line.base7").css("visibility", "hidden");


});