function format ( d ) {
	return "<pre><code>" + JSON.stringify({ block: d.block, info: d.info }, null, '\t') + "</code></pre>";
}

(function() {
	$('body').on('mouseenter', '[data-toggle="tooltip"]', function( event ) {
		$(this).tooltip('show');
	}).on('mouseleave', '[data-toggle="tooltip"]', function( event ) {
		$(this).tooltip('hide');
	});

	var page = 1;

	var badBlocks = $('#reportsTable').DataTable({
		"processing" : true,
		"serverSide" : true,
		"ajax" : '/mongo/get/datatable',
		"columns": [
			{
				"class" : "counter",
				"name" : "index",
				"data" : function (row, type, set, meta) {
					if(typeof meta !== 'undefined')
						return meta.row + 1 + badBlocks.page.info().start;

					return 0;
				},
				"orderable" : false,
				"searchable" : false
			},
			{
				"class" : "details-control",
				"mData" : "block",
				"render" : function (data, type, row) {
					if(data.length > 65) {
						data = data.substring(0,64) + "...";
					}
					return data;
				},
				"orderable" : false,
				"name" : "block"
			},
			{ "mData" : "errorType", "name" : "errorType" },
			{ "mData" : "category", "name" : "category" },
			{ "mData" : "ip", "name" : "ip" },
			{ "mData" : "createdAt", "name" : "createdAt" },
			{
				"mData" : "info",
				"name" : "info",
				"orderable" : false,
				"searchable" : false,
				"visible" : false
			}
		],
		"order": [[5, 'desc']]
	});

	var detailRows = [];

	$('#reportsTable tbody').on( 'click', 'tr td.details-control', function () {
		var tr = $(this).closest('tr');
		var row = badBlocks.row( tr );
		var idx = $.inArray( tr.attr('id'), detailRows );

		if ( row.child.isShown() ) {
			tr.removeClass( 'details' );
			row.child.hide();

			// Remove from the 'open' array
			detailRows.splice( idx, 1 );
		}
		else {
			tr.addClass( 'details' );
			row.child( format( row.data() ) ).show();

			// Add to the 'open' array
			if ( idx === -1 ) {
				detailRows.push( tr.attr('id') );
			}
		}
	} );

	badBlocks.on( 'draw', function () {
		$.each( detailRows, function ( i, id ) {
			$('#'+id+' td.details-control').trigger( 'click' );
		});
	});
})();

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-63657296-2', 'auto');
ga('send', 'pageview');