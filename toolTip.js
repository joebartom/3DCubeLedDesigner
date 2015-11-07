(function($){
/* script plugin ToolTip */

var methodsTooltip = {
	init : function(options){
	
		var $this = $(this);
		var settings = $.extend({
			"element": "img",
			"width" : 100,
			"getValue" : null
			},options);
		$(document).on("mouseenter",settings.element,function(e){
			var element = e.currentTarget;
			var	value = $(element).html();
			if(settings.getValue !== null && typeof(settings.getValue) === "function")
				value = settings.getValue.apply(element);
			var tooltip = $("<div class=\"tooltip\" style=\"position:absolute;z-index:9999;top:"+e.clientY+"px;left:"+e.clientX+"px;background-color:grey;width:auto;height:auto;padding:2px;\">"+value+"</div>");
			$(element).after(tooltip);
		});
	
		$(document).on("mouseleave",settings.element,function(e){
			$(".tooltip").remove();
		});
		//return this.each(function(){
		//});
	},
	destroy : function(){
		//return this.each(function(){
		$(this).removeData("tooltip").remove();
		//});
	}
  };
  
  $.fn.tooltip = function( method ) {
		if ( methodsTooltip[method] ) {
		  return methodsTooltip[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methodsTooltip.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}
	}
})(jQuery);
