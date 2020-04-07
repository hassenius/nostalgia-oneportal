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

$('#create').on('click', function (event) { // this will trigger when click on the create server icon

htmlRemove = function(id){ // this code will help to remove html code when it will not be needed based on teh provider selection

	var elem = document.getElementById(id);
	if (elem != null) 
	elem.parentNode.removeChild(elem);
}
 
 BootstrapDialog.show({ //this will create the window that will pop up
			id: "create_server",
			title: "Create Server...",
			closable: false,
			 buttons: [{
                    label: 'Cancel',
                    cssClass: 'btn-danger',
                    action: function(dialogRef){// this will close teh window when we click on Cancel
                        dialogRef.close();
                    }},
                    {
                    label: 'Create',
                    cssClass: 'btn-primary',
                    action: function(dialogRef){ // this is the action that will take place when click oncreate button
						data = $('#provider_select').val(); // grab the provider selection
						if(data=='SoftLayer'){ // if SoftLayer is selected
							//grab these data for the provisioning
	                       	processor = $("#CPU option:selected").val();
							memory = $('#memory option:selected').val();
							block = $('#block_devices option:selected').val();
							os = $('#OS option:selected').val();
							network = $('#network option:selected').val();
							datacenter = $('#datacenter option:selected').val();
							hostname = $('#server_name').val();
							domain = $('#domain').val();
							$.ajax({// perform the ajax call to provision anew server
							  type: "POST",
							  url: "/create_cci",
							  data: JSON.stringify({  processor: processor, location: datacenter, memory: memory, block: block, network: network, os: os, hostname: hostname, domain: domain}),
							  dataType: 'json',
					        contentType: 'application/json',
							  success: function ( dataCheck)
														{
														BootstrapDialog.show({// show a windows uinforming the server was created
					            message: 'Server created!'
					        });
							}
					      
					
					});
	                    }
	                    //same behaviour for Bluebox
	                    if(data=='BlueBox'){
	                       	processor = $("#CPU option:selected").val();
							os = $('#OS option:selected').val();
							network = $('#network option:selected').val();
							hostname = $('#server_name').val();
							keypair = $('#keypair').val();
							sec_group = $('#sec_groups').val();
							$.ajax({
							  type: "POST",
							  url: "/create_vm",
							  data: JSON.stringify({  processor: processor, network: network, os: os, hostname: hostname,  sec_group:sec_group[0], keypair:keypair}),
							  dataType: 'json',
					        contentType: 'application/json',
							  success: function ( dataCheck)
														{
														BootstrapDialog.show({
					            message: 'Server created!'
					        });
							}
					      
					
					});
	                    }
                    }
                    
                    },
                    ],
            message: function(dialog) { // Add the html code that will appear in the provisioning window, fields, button...
             var code = '<div class="box box-default"> <div class="box-header with-border"> \
						<h3 class="box-title">Create Server...</h3> \
						<div class="box-tools pull-right">\
          </div>\
        </div>\
        <!-- /.box-header -->\
        <div class="box-body">\
          <div class="row">\
            <div class="col-md-6">\
              <div class="form-group">\
                <label>Provider</label>\
                <select id="provider_select" class="form-control select2" style="width: 100%;">\
                  <option selected="selected">Select one...</option>\
                  <option>SoftLayer</option>\
                  <option>BlueBox</option>\
                </select>\
                 <label>CPU</label>\
                <select class="form-control select2" id="CPU" multiple="CPU" data-placeholder="Select a CPU" style="width: 100%;">\
                </select>\
                <label>OS</label>\
                <select class="form-control select2" id="OS" multiple="Operating System" data-placeholder="Select a OS" style="width: 100%;">\
                </select>\
                <label>Network</label>\
                <select class="form-control select2" id="network" multiple="Network data-placeholder="Select a Network" style="width: 100%;">\
                </select>\
                 <label>hotname</label>\
                 <input id="server_name" type="text" name="hostname">\
                </select>\
              </div>\
              </div>\
               <div class="col-md-6">\
              <div id="group" class="form-group">\
                <div id="Option_1" \
                </div>\
              </div>\
              </div>\
              </div>\
              </div>\
              </div>\
              <script src="static/js/functions.js"></script>'
			 return code;}
        });
})




$("#provider_select").on('change', function (event) {// this function will gather the options for ecah provider when selected
  data = $('#provider_select').val();
  $.ajax({// ajax call to get the options
		  type: "POST",
		  url: "/create_options",
		  data: JSON.stringify({  provider: data}),
		  dataType: 'json',
          contentType: 'application/json',
		  success: function ( dataCheck){
							if(data=='SoftLayer')// if softlayer is selected we do some arrangements
									{
									htmlRemove('sec_group_div');// we remove options that we dont need for SoftLayer
									htmlRemove('key_name_div');
									// we add the option we need for SoftLayer
									var html_softlayer =  '<div id="datacenter_div" \
														 <label>location</label>\
										                <select class="form-control select2" id="datacenter" multiple="Location" data-placeholder="Select a Datacenter" style="width: 100%;">\
										                </select>\
										                </div>\
										                <div id="memory_div" label=Memory"\
										                 <label>Memory</label>\
										                <select class="form-control select2" id="memory" multiple="Memory" data-placeholder="Select a Memory" style="width: 100%;">\
										                </select>\
										                </div>\
										                <div id="block_div" label=Block Devices"\
										                 <label>Block Devices</label>\
										                <select class="form-control select2" id="block_devices" multiple="Block Devices" data-placeholder="Select a storage" style="width: 100%;">\
										                </select>\
										                </div>\
										                <div id="domain_div" label=Domain"\
														 <label>Domain</label>\
														 <input id="domain" type="text" name="domain">\
														</select>\
														</div>'
									// we add teh html code with the options to teh windows html code
									document.getElementById("Option_1").innerHTML = html_softlayer;
									$(dataCheck).each(function(index, value){
														$(value.datacenters).each(function(index, value){
															$('#datacenter').append($('<option>', { 
																value: value.template.datacenter.name,
																text : value.template.datacenter.name
															}));
														});
													
									});
									$(dataCheck).each(function(index, value){
														$(value.processors).each(function(index, value){
															$('#CPU').append($('<option>', { 
																value: value.template.startCpus,
																text : value.itemPrice.item.description
															}));
														});
													
									});
									$(dataCheck).each(function(index, value){
														$(value.memory).each(function(index, value){
															$('#memory').append($('<option>', { 
																value: value.template.maxMemory,
																text : value.itemPrice.item.description
															}));
														});
													
									});
									$(dataCheck).each(function(index, value){
														$(value.blockDevices).each(function(index, value){
															$('#block_devices').append($('<option>', { 
																value: value.template.blockDevices[0].diskImage.capacity,
																text : value.itemPrice.item.description
															}));
														});
													
									});
									$(dataCheck).each(function(index, value){
														$(value.operatingSystems).each(function(index, value){
															$('#OS').append($('<option>', { 
																value: value.template.operatingSystemReferenceCode,
																text : value.itemPrice.item.description
															}));
														});
													
									});
									$(dataCheck).each(function(index, value){
														$(value.networkComponents).each(function(index, value){
															$('#network').append($('<option>', { 
																value: value.template.networkComponents[0].maxSpeed,
																text : value.itemPrice.item.description
															}));
														});
													
									});
								}
							if(data=='BlueBox'){// same behaviour forBlueBox selection
															
									htmlRemove('memory_div');
									htmlRemove('block_div');
									htmlRemove('domain_div');
									htmlRemove('datacenter_div');
									var html_sec_group =  '<div id="sec_groups_div" \
												<label>Security Groups</label>\
												<select class="form-control select2" id="sec_groups" multiple="Security Groups" hidden data-placeholder="Select a security groups" style="width: 100%;">\
												</select>\
												</div>\
												<div id="key_name_div" \
												<label>KeyPairs</label>\
												<select class="form-control select2" id="keypair" multiple="KeyPairs" hidden data-placeholder="Select a KeyPairs" style="width: 100%;">\
												</select>\
												</div>';					
									document.getElementById("Option_1").innerHTML = html_sec_group;
									$(dataCheck).each(function(index, value){
														$(value.flavors).each(function(index, value){
															$('#CPU').append($('<option>', { 
																value: value.id,
																text : value.name
															}));
														});
													
									});
									$(dataCheck).each(function(index, value){
														$(value.images).each(function(index, value){
															$('#OS').append($('<option>', { 
																value: value.id,
																text : value.name
															}));
														});
													
									});
									$(dataCheck).each(function(index, value){
														$(value.networks).each(function(index, value){
															$('#network').append($('<option>', { 
																value: value.id,
																text : value.name
															}));
														});
													
									});
									
									$(dataCheck).each(function(index, value){
														$(value.sec_groups).each(function(index, value){
															$('#sec_groups').append($('<option>', { 
																value: value.id,
																text : value.name
															}));
														});
													
									});
									$(dataCheck).each(function(index, value){
														$(value.keypairs).each(function(index, value){
															$('#keypair').append($('<option>', { 
																value: value.id,
																text : value.name
															}));
														});
									});
									
								}
		
}	
});      

});

$('#close_create_cci_server').on('click', function (event) {
	create_server.removeClass('show');
})

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
