(function($){
/* script plugin Matrice */

var methodsMatrice = {
    init : function(options){
		return this.each(function(){
			var $this = $(this),data = $this.data("matrice");
			
			var settings = $.extend( {
			  "width" : 5,
			  "force" : false,
			  "keepRatio" : true,
			  "layers" : []
			}, options);
			
			if(settings.layers.length == 0){
				settings.layers = Array(settings.width);
				for(var i=0;i<settings.width;i++)
					settings.layers[i] = 1;
			}
			if (!data || settings.force == true) {
				var matrice = Array(settings.width);
				for(var z=0;z<settings.width;z++){
					matrice[z] = Array(settings.width);
					for(var y=0;y<settings.width;y++){
						matrice[z][y] = Array(settings.width);
						for(var x=0;x<settings.width;x++){
							matrice[z][y][x] = 0;
						}
					}
				}
				$this.data("matrice", {target:$this, settings:settings, matrice:matrice});
		    }
        });
	},
	destroy : function(){
		return this.each(function(){
			$(this).removeData("matrice");
		});
	},
	toggleRatioKeeper : function(){
		return this.each(function(){
			$(this).data("matrice").settings.keepRatio = $(this).data("matrice").settings.keepRatio === true ? false : true;
		});
	},
	enableLayer : function(layer){
		return this.each(function(){
			var $this = $(this),settings = $this.data("matrice").settings;
			if(layer>=0 && layer <= settings.width-1)
				$this.data("matrice").settings.layers[layer] = 1;
		});
	},
	disableLayer : function(layer){
		return this.each(function(){
			var $this = $(this),settings = $this.data("matrice").settings;
				if(layer>=0 && layer <= settings.width-1)
					$this.data("matrice").settings.layers[layer] = 0;
		});
	},	
	isLayerEnabled : function(layer){
		var $this = $(this),settings = $this.data("matrice").settings;
		if(layer>=0 && layer < settings.width)
			return $this.data("matrice").settings.layers[layer] == 1;
		return false;
	},
    set : function(x,y,z,value){
		return this.each(function(){
			$(this).data("matrice").matrice[z][y][x] = value;
		});
	},
	setAll : function(value){
		return this.each(function(){
			var $this = $(this),width = $this.data("matrice").settings.width;
			for(var z=0;z<width;z++){
				if(!$this.matrice("isLayerEnabled",z))
					continue;
				for(var y=0;y<width;y++){
					for(var x=0;x<width;x++){
						$(this).matrice("set",x,y,z,value);
					}
				}
			}
		});
	},
	get : function(x,y,z){
		var width = $(this).data("matrice").settings.width;
		if(x>=0 && x<width && y>=0 && y<width && z>=0 && z<width)
			return $(this).data("matrice").matrice[z][y][x];
		return 0;
	},
	moveLeft : function(){
		return this.each(function(){
			var $this = $(this),width = $this.data("matrice").settings.width;
			for(var z=0;z<width;z++){
				if(!$this.matrice("isLayerEnabled",z))
					continue;
				for(var y=0;y<width;y++){
					for(var x=0;x<width;x++){
						$this.matrice("set",x,y,z, x+1 < width ? $this.matrice("get",x+1,y,z) : 0);
					}
				}
			}
		});
	},
	moveRight : function(){
		return this.each(function(){
			var $this = $(this),width = $this.data("matrice").settings.width;
			for(var z=0;z<width;z++){
				if(!$this.matrice("isLayerEnabled",z))
					continue;
				for(var y=0;y<width;y++){
					for(var x=width-1;x>=0;x--){
						$this.matrice("set",x,y,z, x-1 >= 0 ? $this.matrice("get",x-1,y,z) : 0);
					}
				}
			}
		});
	},
	moveTop : function(){
		return this.each(function(){
			var $this = $(this),width = $this.data("matrice").settings.width;
			for(var z=0;z<width;z++){
				if(!$this.matrice("isLayerEnabled",z))
					continue;
				for(var y=0;y<width;y++){
					for(var x=0;x<width;x++){
						$this.matrice("set",x,y,z, y+1 < width ? $this.matrice("get",x,y+1,z) : 0);
					}
				}
			}
		});
	},
	moveDown : function(){
		return this.each(function(){
			var $this = $(this),width = $this.data("matrice").settings.width;
			for(var z=0;z<width;z++){
				if(!$this.matrice("isLayerEnabled",z))
					continue;
				for(var y=width-1;y>=0;y--){
					for(var x=0;x<width;x++){
						$this.matrice("set",x,y,z, y-1 >= 0 ? $this.matrice("get",x,y-1,z) : 0);
					}
				}
			}
		});
	},
	getString : function(){
		var $this = $(this),width = $this.data("matrice").settings.width;	
		var script = "{";	
		for(var z=0;z<width;z++){
			script += "{";
			for(var y=width-1;y>=0;y--){
				script += "B";
				for(var x=0;x<width;x++){		
					script += $this.matrice("get",x,y,z);
				}
				if(y>0)
					script += ",";
			}
			script += "},";
		}
		script = script.substring(0,script.length-1);
		script += "}";
		return script;
	},
	fromString : function(value){
		var $this = $(this),width = $this.data("matrice").settings.width;	
		var index = 1; //var script = "{";	
		for(var z=0;z<width;z++){
			index++; //script += "{";
			for(var y=width-1;y>=0;y--){
				index++; //script += "B";
				for(var x=0;x<width;x++){
					//alert(value.charAt(index));
					$this.matrice("set",x,y,z,value.charAt(index)); //script += $this.matrice("get",x,y,z,);
					index++;
				}
				if(y>0)
					index++; //script += ",";
			}
			index += 2; //script += "},";
		}
		//script = script.substring(0,script.length-1);
		//script += "}";
		return index;
	},
	random : function(){
		return this.each(function(){
			var $this = $(this),width = $this.data("matrice").settings.width;
			for(var z=0;z<width;z++){
				if(!$this.matrice("isLayerEnabled",z))
					continue;
				for(var y=0;y<width;y++){
					for(var x=0;x<width;x++){
						var random = Math.floor(Math.random()*2);
						$this.matrice("set",x,y,z,random);
					}
				}
			}
		});
	},
	rotateLayer : function(){
		return this.each(function(){
			var $this = $(this),settings = $this.data("matrice").settings,width = settings.width;
			var keepRatio = settings.keepRatio === true;
			var limit = Math.floor(width/2);
			var total = 0;
			var pX,pY;
			var newMatrice = Array(width);
			for(var z=0;z<width;z++)
			{
				newMatrice[z] = Array(width);
				for(var y=0;y<width;y++)
				{
					if(newMatrice[z][y] == null)
						newMatrice[z][y] = Array(width);
					for(var x=0;x<width;x++){
						var valeur = $this.matrice("get",x,y,z);
						if(newMatrice[z][y][x] == null)
							newMatrice[z][y][x] = 0;
						if(!$this.matrice("isLayerEnabled",z)){
							newMatrice[z][y][x] = valeur;	continue;
						}
						pX = x;pY = y;
						if(x<limit && y<=limit){ //HG HAUT
							if(y-1>=0 && limit-y<limit-x){
								pY = y-1;
								if(keepRatio)
									pY = y-(limit-x);
								if(limit-pY>limit-x)
								{
									pX = x+((limit-pY)-(limit-x));
									pY = y-(limit-x)+((limit-pY)-(limit-x));
								}	
							}else{
								pX = x+1;
								if(keepRatio)
									pX = x+(limit-y);
							}
						}else if(x>=limit && y < limit){ // HD DROITE
							if(x+1<=width-1 && x-limit<limit-y)
							{
								pX = x+1;
								if(keepRatio)
									pX = x+(limit-y);
								if(pX-limit>limit-y)
								{
									pY = y+((pX-limit)-(limit-y));
									pX = x+(limit-y)-((pX-limit)-(limit-y));
								}
							}
							else{
								pY = y+1;
								if(keepRatio)
									pY = y+(x-limit);
							}
						}else if(x>limit && y >= limit){ // BD BAS
							if(y+1<=width-1 && y-limit<x-limit)
							{
								pY = y+1;
								if(keepRatio)
									pY = y+(x-limit);
								if(pY-limit>x-limit)
								{
									pX = x-((pY-limit)-(x-limit));
									pY = y+(x-limit)-((pY-limit)-(x-limit));
								}
							}
							else{
								pX = x-1;
								if(keepRatio)
									pX = x-(y-limit);
							}
						}else if(x<=limit && y > limit){ // BG GAUCHE
							if(x-1>=0 && limit-x<y-limit)
							{
								pX = x-1;
								if(keepRatio)
									pX = x-(y-limit);
								if(limit-pX>y-limit)
								{
									pY = y-((limit-pX)-(y-limit));
									pX = x-(y-limit)+((limit-pX)-(y-limit));
								}
							}
							else
							{
								pY = y-1;
								if(keepRatio)
									pY = y-(limit-x);
							}
						}
						if(newMatrice[z][pY] == null){
							newMatrice[z][pY] = Array(width);
							for(var i=0;i<width;i++)
								newMatrice[z][pY][i] = 0;
						}
						newMatrice[z][pY][pX] = valeur;				
					}
				}
			}
			$this.data("matrice").matrice = newMatrice;
		});
	},
	rotateLayerInverse : function(){
		return this.each(function(){
			var $this = $(this),matrice = $this.data("matrice").matrice,width = $this.data("matrice").settings.width;
			var newMatrice = Array(width);
			for(var z=0;z<width;z++){
				newMatrice[z] = Array(width);
				for(var y=0;y<width;y++){
					newMatrice[z][y] = Array(width);
					for(var x=0;x<width;x++){
						newMatrice[z][y][x] = $this.matrice("get",width-1-x,y,z);
					}
				}
			}
			$this.data("matrice").matrice = newMatrice;
			matrice = $this.matrice("rotateLayer").data("matrice").matrice;
			newMatrice = Array(width);
			for(var z=0;z<width;z++){
				newMatrice[z] = Array(width);
				for(var y=0;y<width;y++){
					newMatrice[z][y] = Array(width);
					for(var x=0;x<width;x++){
						newMatrice[z][y][x] = $this.matrice("get",width-1-x,y,z);
					}
				}
			}
			$this.data("matrice").matrice = newMatrice;
		});
	},
	rotateUp: function(){
		return this.each(function(){
			var $this = $(this),matrice = $this.data("matrice").matrice,width = $this.data("matrice").settings.width;
			var newMatrice = Array(width);
			var newZ;
			var newY = width-1;
			for(var z=0;z<width;z++){
				newZ=0;
				newMatrice[z] = Array(width);
				for(var y=0;y<width;y++){
					newMatrice[z][y] = Array(width);
					for(var x=0;x<width;x++){
						if($this.matrice("isLayerEnabled",z))
							newMatrice[z][y][x] = $this.matrice("get",x,newY,newZ);
						else
							newMatrice[z][y][x] = $this.matrice("get",x,y,z);
					}
					newZ++;
				}
				newY--;
			}
			$this.data("matrice").matrice = newMatrice;
		});
	},
	rotateDown : function(){
		return this.each(function(){
			$(this).matrice("rotateUp").matrice("rotateUp").matrice("rotateUp");
		});
	},
	rotateRight: function(){
		return this.each(function(){
			$(this).matrice("rotateLayerInverse").matrice("rotateLayerInverse").matrice("rotateUp").matrice("rotateLayer").matrice("rotateLayer");
		});
	},
	rotateLeft: function(){
		return this.each(function(){
			$(this).matrice("rotateRight").matrice("rotateRight").matrice("rotateRight");
		});
	},
	copyTo : function(direction){
		return this.each(function(){
			var $this = $(this),matrice = $this.data("matrice").matrice;settings = $this.data("matrice").settings, width = settings.width, newMatrice = Array(width),distance = 1;
			switch(direction){
				default :
				case 0 : distance=1;break;
				case 2 : distance=-1;break;
			}
			for(var z=0;z<width;z++){
				newMatrice[z] = Array(width);
				for(var y=0;y<width;y++){
					newMatrice[z][y] = Array(width);
					for(var x=0;x<width;x++){
						newMatrice[z][y][x] = 0;
						if($this.matrice("isLayerEnabled",z+distance) && $this.matrice("isLayerEnabled",z))
							newMatrice[z][y][x] = matrice[z+distance][y][x];
						else
							newMatrice[z][y][x] = matrice[z][y][x];
					}
				}
			}
			$this.data("matrice").matrice = newMatrice;
		});
	}
  };

  $.fn.matrice = function( method ) {
		if ( methodsMatrice[method] ) {
		  return methodsMatrice[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methodsMatrice.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist on jQuery.matrice' );
		}
	}
})(jQuery);
