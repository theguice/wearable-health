
$.getJSON('get_users.php', function(data) {
    console.log(data);

    var table='<table class="table table-striped">';
    table += '<tr><th>Name</th><th>User ID</th><th>Begin Date</th><th>Last Synced</th><th>Basis</th><th>Lumo</th><th>Moves</th></tr>';

    // loop over each object in the array to create rows
    $.each( data, function( index, item){
         // add to html string started above
	 table+='<tr><td>'+item[0]+'</td><td>'+item[1]+'</td><td>'+item[2]+'</td><td><button class="btn btn-small btn-primary" type="button">'+item[3]+'</button></td><td>'+item[4]+'</td><td>'+item[5]+'</td><td>'+item[6]+'</td></tr>';
    });
    table += '</table>';
    
    // insert the html string
    $("#users").html( table );
});