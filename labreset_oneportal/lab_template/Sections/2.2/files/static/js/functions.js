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
    
    
    
    ]
});
