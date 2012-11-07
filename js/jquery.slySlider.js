;(function($, win){

	//create defaults
	var defaults = {

		classNames : {
			ctn : 'sly-ctn',
			img : 'sly-img',
			txt : 'sly-txt',
			ctrlPrev : 'sly-prev',
			ctrlNext : 'sly-next',
			thumbs : 'sly-thumbs'
		},

		render : 'default'
	};

	function slySlider(el, options){

		var that = this;

		//cache element
		that.el = el;
		
		//create config
		that.config = $.extend({}, defaults, options);

		//create modules
		that.modules = that.createModules();

		//store imageList
		that.imageList = $(el).find('a');

		//initialize menu
		that.init();
	};

	slySlider.prototype.init = function(){

		var that = this;

		//empty element
		$(this.el).empty();

		//render element
		that.render();
	};

	slySlider.prototype.render = function(){

		var that = this;

		//render default
		that.renderDefault();

		//render modules
		that.renderImage(that.modules.img);
		that.renderText(that.modules.txt);
		that.renderControls(that.modules.ctrlPrev, that.modules.ctrlNext);
		that.renderThumbs(that.modules.thumbs);
	};

	slySlider.prototype.renderDefault = function(){

		var that = this;
		
		//append container to el
		$(this.el).append(that.modules.ctn);

		//append elements to container
		that.modules.ctn.append(that.modules.img)
						.append(that.modules.txt)
						.append(that.modules.ctrlPrev)
						.append(that.modules.ctrlNext)
						.append(that.modules.thumbs);
	};

	slySlider.prototype.renderImage = function(){

		var that = this;
	};

	slySlider.prototype.renderText = function(){

		var that = this;
	};

	slySlider.prototype.renderControls = function(){

		var that = this;
	};

	slySlider.prototype.renderThumbs = function(){

		var that = this;
	};				

	slySlider.prototype.createModules = function(){

		var that = this;		

		//create modules
		var modules = {

			ctn : $('<div>', {

				'class' : that.config.classNames.ctn
			}),

			img : $('<div>', {

				'class' : that.config.classNames.img
			}),

			txt : $('<div>', {

				'class' : that.config.classNames.txt
			}),

			ctrlPrev : $('<div>', {

				'class' : that.config.classNames.ctrlPrev
			}),

			ctrlNext : $('<div>', {

				'class' : that.config.classNames.ctrlNext
			}),

			thumbs : $('<div>', {

				'class' : that.config.classNames.thumbs
			})
		}

		//return modules object
		return modules;
	};

	$.fn.slySlider = function(options){

		//for each element in collection
		return this.each(function(){

			//create new slySlider
			new slySlider(this, options);
		});
	};

})(jQuery, window);