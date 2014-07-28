// this javascript function builds a table one line at a time, with responses from a get_users.php api call.


$.getJSON('../api/get_users.php', function(data) {
    console.log(data);

    var table='<table class="table table-striped">';
    table += '<tr><th>ID</th><th>Username</th><th>Password</th><th>Begin Date</th><th>Basis_u</th><th>Basis_p</th><th>Lumo_u</th><th>Lumo_p</th><th>Lumo_api</th><th>Moves_u</th><th>Moves_p</th><th>Latest Basis</th><th>Latest Lumo</th><th>Latest Moves</th></tr>';

    // loop over each object in the array to create rows
    $.each( data, function( index, item){
         // add to html string started above
	 table+='<tr><td>'+item[0]+'</td><td>'+item[1]+'</td><td>'+item[2]+'</td><td>'+item[3]+'</td><td>'+item[4]+'</td><td>'+item[5]+'</td><td>'+item[6]+'</td><td>'+item[7]+'</td><td>'+item[8]+'</td><td>'+item[9]+'</td><td>'+item[10]+'</td><td>'+item[11]+'</td><td>'+item[12]+'</td><td>'+item[13]+'</td></tr>';
    });
    table += '</table>';
    
    // insert the html string
    $("#users").html( table );
});