$('#table').bootstrapTable({
	id: "table",
    url: '/list_vms', // URL of the web service that lists the VMs and containers
    method: 'GET',
    pagesize: 10,
    pagination: true,
    clickToSelect: true,
    singleSelect: true,
    showRefresh: true,
    // Set the columns that we will show in the table, using the fields provided from the JSON in the WS
    columns: [{
        field: 'id',
        title: 'ID'
    }, {
        field: 'hostname',
        title: 'Hostname'
    } , {
        field: 'provider',
        title: 'Provider'
    },{
        field: 'status',
        title: 'Status'
    }
    
    
    
    ],
    onClickRow:  function (row, $element) {// event when we click in a row
        // we grab the provider and the server id
        provider = row.provider;
        id = row.id;
        $.ajax({ // we do an ajax call to the ws that will return the details
						  type: "POST",
						  url: "/getServerDetails",
						  data: JSON.stringify({  provider:provider, id:id}),//we pass the provider and the server id
						  dataType: 'json',
				        contentType: 'application/json',
						  success: function ( dataCheck){ //if the call is successfull we write teh details on the fields in the form
													$('#details').show();
													$('#hostname').val(dataCheck.name);
													$('#server_id').val(dataCheck.id);
													$('#networks').val(dataCheck.networks);
													$('#sec_group').val(dataCheck.security_group);
													$('#image').val(dataCheck.image);
													$('#key_name').val(dataCheck.key_name);
													$('#user_passwd').val(dataCheck.user_passwd);
													$('#flavor').val(dataCheck.flavor);
													$('#provider').val(row.provider);
													$('#status').val(row.status);
													
						}
				      
				
				});
    }
});


$('#play').on('click', function (event) {
		// grab the provider and the sevrer id
		data = $('#provider').val();
		id= $('#server_id').val();
		// ajax call to perform the operation against the wb
	  $.ajax({
		  type: "POST",
		  url: "/play",
		  data: JSON.stringify({  id: id, provider: data}),
		  dataType: 'json',
          contentType: 'application/json',
		  success: function ( dataCheck){
			  $('#table').bootstrapTable('refresh');// refresh the table
		}
	});
});
$('#pause').on('click', function (event) {
	    // grab the provider and the sevrer id
		data = $('#provider').val();
		id= $('#server_id').val();
	  $.ajax({
		  type: "POST",
		  url: "/pause",
		  data: JSON.stringify({  id: id, provider: data}),
		  dataType: 'json',
          contentType: 'application/json',
		  success: function ( dataCheck){
			 $('#table').bootstrapTable('refresh');// refresh the table
		}
	});
});
 
$('#delete').on('click', function (event) {
		// grab the provider and the sevrer id
		data = $('#provider').val();
		id= $('#server_id').val();
		// ajax call to perform the operation against the wb
	  $.ajax({
		  type: "POST",
		  url: "/delete",
		  data: JSON.stringify({  id: id, provider: data}),
		  dataType: 'json',
          contentType: 'application/json',
		  success: function ( dataCheck){
			  $('#table').bootstrapTable('refresh');// refresh the table
		}
	});
});

$('#reboot').on('click', function (event) {
		// grab the provider and the sevrer id
		data = $('#provider').val();
		id= $('#server_id').val();
		// ajax call to perform the operation against the wb
	  $.ajax({
		  type: "POST",
		  url: "/reboot",
		  data: JSON.stringify({  id: id, provider: data}),
		  dataType: 'json',
          contentType: 'application/json',
		  success: function ( dataCheck){
			  $('#table').bootstrapTable('refresh'); // refresh the table
		}
	});
});
