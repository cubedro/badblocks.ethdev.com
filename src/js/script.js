function format ( d ) {
	return d.toString();
}

(function() {
	$('body').on('mouseenter', '[data-toggle="tooltip"]', function( event ) {
		$(this).tooltip('show');
	}).on('mouseleave', '[data-toggle="tooltip"]', function( event ) {
		$(this).tooltip('hide');
	});

	var badBlocks = $('#reportsTable').dataTable({
		"bProcessing" : true,
		"bServerSide" : true,
		"sAjaxSource" : '/mongo/get/datatable',
		"columns": [
			{
				"class" : "details-control",
				"data" : "block"
			},
			{ "data" : "errorType" },
			{ "data" : "category" },
			{ "data" : "ip" },
			{ "data" : "createdAt" }
		],
		"order": [[4, 'desc']]
	});

	var detailRows = [];

	$('#example tbody').on( 'click', 'tr td.details-control', function () {
		var tr = $(this).closest('tr');
		var row = dt.row( tr );
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

// (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
// (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
// m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
// })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

// ga('create', 'UA-63657296-1', 'auto');
// ga('send', 'pageview');