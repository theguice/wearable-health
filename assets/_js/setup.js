var $base_url = "http://localhost:8888";
/* var $base_url = "https://groups.ischool.berkeley.edu/healthstudy"; */

/* console.log('assigning click handler'); */
/*
if (!$("#option_heartrate").is(":checked")) {
	console.log('checked');
}
*/
$(".top").on('click', function() {
	if ($('#option_heartrate').is(":checked")) {
		$(".line.line0").css("visibility", "hidden");
	} else {
		$(".line.line0").css("visibility", "visible");
	}
	if ($('#option_steps').is(":checked")) {
		$(".line.line1").css("visibility", "hidden");
	} else {
		$(".line.line1").css("visibility", "visible");
	}
	if ($('#option_calories').is(":checked")) {
		$(".line.line2").css("visibility", "hidden");
	} else {
		$(".line.line2").css("visibility", "visible");
	}
	if ($('#option_gsr').is(":checked")) {
		$(".line.line3").css("visibility", "hidden");
	} else {
		$(".line.line3").css("visibility", "visible");
	}
	if ($('#option_posture').is(":checked")) {
		$(".line.line4").css("visibility", "hidden");
	} else {
		$(".line.line4").css("visibility", "visible");
	}
	if ($('#option_skin_temp').is(":checked")) {
		$(".line.line5").css("visibility", "hidden");
	} else {
		$(".line.line5").css("visibility", "visible");
	}
	if ($('#option_air_temp').is(":checked")) {
		$(".line.line6").css("visibility", "hidden");
	} else {
		$(".line.line6").css("visibility", "visible");
	}
});