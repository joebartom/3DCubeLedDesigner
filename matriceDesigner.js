(function($){
/* script plugin Matrice Designer */

var methodsMatriceDesigner = {
	init : function(options){
		return this.each(function(){
			var $this = $(this),data = $this.data("matriceDesigner");
			var settings = $.extend({
				"width" : 5,
				"patterns" : "body",
				"script" : "body",
				"layerPerLayer" : "off",
				"styleDir" : "blue"
				},options);
		
			var largeur = $(settings.width).val()*1;
			var surface = largeur * largeur;
			var layers;
			if(settings.layerPerLayer === "on"){
				layers = Array(largeur);
				for(var i=0;i<largeur;i++){
					layers[i] = 1;
				}
			}
			if(data && window.confirm("Confirmer le rechargement ?") == 0)
				return;
			else if (!data)
				$this.data("matriceDesigner",{settings:settings})
			
			var designer = $('<div class="mdDesigner"></div>');
			for(var z=0;z<largeur;z++){
				var table = $("<table></table>");
				var tbody = $("<tbody></tbody>");
				if(settings.layerPerLayer === "on"){
					var trInvisible = $("<tr></tr>");
					var tdSelection = $('<td class="mdLayerSelection" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'toggleLayer\','+z+',this);"></td>');
					tdSelection.prop("rowspan",largeur*1+1);
					trInvisible.append(tdSelection);
					tbody.append(trInvisible);
				}
				for(var y=0;y<largeur;y++){
					var tr = $("<tr></tr>");
					for(var x=0;x<largeur;x++){
						var td = $("<td></td>");
						var input = $('<input type="checkbox" class="mdPoint" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'set\','+x+','+y+','+z+',$(this).is(\':checked\') ? 1 : 0);"></input');
						td.append(input);
						tr.append(td);
					}
					tbody.append(tr);
				}
				table.attr("class","mdLayer layer_"+z);
				table.append(tbody);
				designer.append(table);
			}		
			$this
			.empty()
			.addClass("matriceDesigner")		
			.append($('<span class="controls"></span>')
				.append($('<span class="buttons"></span>')
					.append('<img src="Images/'+settings.styleDir+'/copy_up.png" alt="" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'copy\',0);"/>')
					.append('<img src="Images/'+settings.styleDir+'/copy_down.png" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'copy\',2);"/>')
					.append('<img src="Images/'+settings.styleDir+'/up.png" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'move\',0);"/>')
					.append('<img src="Images/'+settings.styleDir+'/down.png" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'move\',2);"/>')
					.append('<img src="Images/'+settings.styleDir+'/left.png" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'move\',3);"/>')
					.append('<img src="Images/'+settings.styleDir+'/right.png" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'move\',1);"/>')
					.append('<img src="Images/'+settings.styleDir+'/rotate_right.png" alt="rot. droite" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'move\',10);"/>')
					.append('<img src="Images/'+settings.styleDir+'/rotate_left.png" alt="rot. droite" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'move\',11);"/>')
					.append('<img src="Images/'+settings.styleDir+'/rotate_up.png" alt="rot. up" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'move\',20);"/>')
					.append('<img src="Images/'+settings.styleDir+'/rotate_down.png" alt="rot. down" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'move\',22);"/>')
					.append('<img src="Images/'+settings.styleDir+'/rotate_out_left.png" alt="rot. out left" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'move\',23);"/>')
					.append('<img src="Images/'+settings.styleDir+'/rotate_out_right.png" alt="rot. out right" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'move\',21);"/>')
					.append('<img src="Images/'+settings.styleDir+'/add.png" class="btnPopulate" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'populate\');"/>')
					.append('<img src="Images/'+settings.styleDir+'/del.png" class="btnEmpty" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'empty\');"/>')
					.append('<img src="Images/'+settings.styleDir+'/random.png" class="btnRandom" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'random\');"/>')
					.append('<img src="Images/'+settings.styleDir+'/view.png" class="btnView" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'toggleView\');"/>')
					.append('<img src="Images/'+settings.styleDir+'/shopping.png" class="btnEnregistrerMotif" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'save\');"/></span>')
					.append('<img src="Images/'+settings.styleDir+'/close.png" class="btnClose" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'destroy\').remove()"/>'))
				.append($('<span class="inputs"></span>')
					.append($('<input type="text" class="mdTxtTimeToDisplay"/>'))
					.append('<input type="checkbox" class="mdChkTimeToDisplay" checked="checked" onchange="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'toggleRatioKeeper\');"/>')))
			.append(designer)
			.matrice({width:largeur,force:true,synchro:'on',layers:layers});	

		});
	},
	destroy : function(){
		return this.each(function(){
			$(this).matrice("destroy").removeData("matriceDesigner").remove();
		});
	},
	toggleLayer : function(layer,elm){
		return this.each(function(){
			var $this = $(this);
			if($this.matrice("isLayerEnabled",layer)){
				$this.matrice("disableLayer",layer);
				$(elm).css("opacity","0.3");
			}
			else{
				$this.matrice("enableLayer",layer);
				$(elm).css("opacity","1");
			}
		});
	},
	toggleRatioKeeper : function(){
		return this.each(function(){
			$(this).matrice("toggleRatioKeeper");
		});
	},
	random : function(){
		return this.each(function(){
			$(this).matrice("random").matriceDesigner("show");
		});
	},
	show : function(){
		return this.each(function(){
			var $this = $(this),largeur = $(this).data("matrice").settings.width;
			var x = 0;
			var y = 0;
			var z = 0;
			$this.find(".mdPoint").each(function(){
				if($this.matrice("get",x,y,z) == 1)
						$(this).prop("checked",true);
				else
						$(this).prop("checked",false);
				x++;
				if(x%largeur==0)
				{
					x=0;
					y++;
				}
				if(y>0 && y%largeur == 0)
				{
					y=0;
					z++;
				}			
			});	
		});
	},
	set : function(x,y,z,value){
		return this.each(function(){
			$(this).matrice("set",x,y,z,value);
		});
	},
	save : function(){
		return this.each(function(){
			var $this = $(this),settings = $this.data("matriceDesigner").settings;
			var buffer = $this
			.clone(true)
			.data("matriceDesigner",$.extend(true,{},$this.data("matriceDesigner")))
			.data("matrice",$.extend(true,{},$this.data("matrice")));
			//if(buffer.find(".btnClose").length ==0)
			//	buffer.find(".buttons").append('<img src="Images/'+settings.styleDir+'/close.png" class="btnClose" onclick="$(this).closest(\'.matriceDesigner\').matriceDesigner(\'destroy\').remove();"/>');
			buffer.removeAttr("id");
			$(settings.patterns).append(buffer);
		});
	},
	saveAll : function(){
		return this.each(function(){
			if($(this).data("matriceDesigner")!=null){
				var $this = $(this),settings = $this.data("matriceDesigner").settings;
				var largeur = $(settings.width).val();
				var nbLeds = largeur*1+2;
				var nbMotifs = 0;
				var script = "";
				$(settings.patterns).find(".matriceDesigner").each(function(){
						$(this).matrice("rotateDown");
						var timeToDisplay = $(this).find(".mdTxtTimeToDisplay").val();
						if(timeToDisplay == null || timeToDisplay < 0)
							timeToDisplay = 10;
						script += $(this).matrice("getString");
						script = script.substring(0,script.length-1);
						script += ",{"+timeToDisplay+"},{30}}";
						script += ",";
						nbMotifs++;
						$(this).matrice("rotateUp")
				});
				script = script.substring(0,script.length-1);
				$(settings.script).val("unsigned const int numberOfPatterns="+nbMotifs+";unsigned const int cubeSize="+largeur+";PROGMEM const byte patterns["+nbMotifs+"]["+nbLeds+"]["+largeur+"] ={"+script+"};");
			}
		});
	},
	importAll : function(value){
		if(value == null)
			return;
		var $this = $(this),settings = $this.data("matriceDesigner").settings,width = $this.data("matrice").settings.width;	
		value = value.substring(value.indexOf("=")+1);
		var nbPatterns = value.substring(0,value.indexOf(";"));
		value = value.substring(value.indexOf("=")+1);
		var widthIn = value.substring(0,value.indexOf(";"));
		value = value.substring(value.indexOf("{")+1);
		value = value.substring(0,value.length-2);
		while(value.length>0){
			value = value.substring($this.matrice("fromString",value));
			value = value.substring(value.indexOf("{")+1);
			$(".mdTxtTimeToDisplay").val(value.substring(0,value.indexOf("}")));
			value = value.substring(value.indexOf("{")+1);
			var intensity = value.substring(0,value.indexOf("}"));
			value = value.substring(value.indexOf("}")+3);
			$this.matrice("rotateUp").matriceDesigner("save");
		}
		$(settings.patterns).find(".matriceDesigner").matriceDesigner("show");
		$this.matriceDesigner("destroy").remove();
	},
	clearAll : function(){
		return this.each(function(){
			if($(this).data("matriceDesigner")!=null){
				var settings = $(this).data("matriceDesigner").settings;
				$(settings.patterns).empty();
				$(settings.script).empty();
			}
		});
	},
	move : function(direction){
		return this.each(function(){
			switch(direction){
				case 0 : 
					$(this).matrice("moveTop");
					break;
				case 1 : 
					$(this).matrice("moveRight");
					break;
				case 2 : 
					$(this).matrice("moveDown");
					break;
				case 3 : 
					$(this).matrice("moveLeft");
					break;	
				case 10 :
					$(this).matrice("rotateLayer");
					break;
				case 11 :
					$(this).matrice("rotateLayerInverse");
					break;
				case 20 : 
					$(this).matrice("rotateUp");
					break;
				case 21 : 
					$(this).matrice("rotateRight");
					break;	
				case 22 : 
					$(this).matrice("rotateDown");
					break;
				case 23 : 
					$(this).matrice("rotateLeft");
					break;
				default:
					alert("no direction");
			}
			$(this).matriceDesigner("show");
		});
	},
	copy : function(direction){
		return this.each(function(){
			$(this).matrice("copyTo",direction).matriceDesigner("show");
		});
	},
	empty : function(){
		return this.each(function(){
			$(this).matrice("setAll",0).matriceDesigner("show");
		});
	},
	populate : function(){
		return this.each(function(){
			$(this).matrice("setAll",1).matriceDesigner("show");
		});
	},
	toggleView : function(){
		return this.each(function(){
			var $this = $(this), settings = $this.data("matriceDesigner").settings,width = $(this).data("matrice").settings.width,index = 0,move = 8,opacityRatio = 1/width;
			if(settings["isViewing"] == null || !settings.isViewing){
				$this.find(".mdLayer").css("position","absolute");
				var inverse = $.makeArray($this.find("table")).reverse();
				var height = 0;
				$(inverse).each(function(){
					height = $(this).height();
					$(this)
					.css("margin-top",index*move+"px")
					.css("margin-left",index*move+"px")
					//.css("opacity",(index+1)*opacityRatio)
					if(index==width-1)
						$(this).css("opacity",1);
					else
						$(this).css("opacity",0.2);
					index++;
				});
				$this.css("margin-bottom",($this.height()+height)+"px");					
				if(settings["isViewing"] != null)
					settings.isViewing = true;
				else
					$this.data("matriceDesigner").settings = $.extend({"isViewing":true},settings);
			}else{
				$this.find(".mdLayer").css("position","relative").css("margin","0").css("opacity",1);
				$this.css("margin-bottom","0");
					settings.isViewing = false;
			}
		});
	}
  };
  
  $.fn.matriceDesigner = function( method ) {
		if ( methodsMatriceDesigner[method] ) {
		  return methodsMatriceDesigner[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methodsMatriceDesigner.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist on jQuery.matriceDesigner' );
		}
	}
})(jQuery);
