;(function($, win){

	//create defaults
	var defaults = {

		classNames : {

			active : 'sly-active',
			ctn : 'sly-ctn',
			ctrlPrev : 'sly-prev',
			ctrlNext : 'sly-next',
			img : 'sly-img',
			thumbs : 'sly-thumbs',
			txt : 'sly-txt'
		},

		imgSrc : false,

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

		//store linkList
		that.linkList = $(el).find('a');

		//initialize menu
		that.init();
	};

	slySlider.prototype.init = function(){

		var that = this;

		//empty element
		$(this.el).empty();

		//render element
		that.render();

		//create events
		that.events();	
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

	slySlider.prototype.renderImage = function(module, src){

		var that = this, img, imgSrc;

		//if src is provided
		if(src){
			imgSrc = src;
		}
		else{

			//get src for image, if imgSrc isn't set, get first img
			imgSrc = (that.config.imgSrc) ? that.config.imgSrc : $(that.linkList[0]).attr('href');
		}

		//create img element
		img = document.createElement('img');

		//set src attribute
		img.setAttribute('src', imgSrc);

		//onload, insert img
		img.onload = function(){

			//insert img
			$(module).html(img);
		};

		//onerror, alert
		img.onerror = function(){

			alert('Error: Failed to load image.');
		};		
	};

	slySlider.prototype.renderText = function(module, title){

		var that = this, link, title;

		//if no title
		if(!title){

			//find and store link
			link = that.findLink(that.config.imgSrc);

			//store link's title
			title = $(link).attr('title');
		}

		//insert title into module
		$(module).html(title);
	};

	slySlider.prototype.renderControls = function(modPrev, modNext){

		var that = this;
	};

	slySlider.prototype.renderThumbs = function(module){

		var that = this, i, l, ul, li;

		//create unordered list element
		ul = $('<ul>');

		//for each element in linkList
		for(i = 0, l = that.linkList.length; i < l; ++i){

			//create list element
			li = $('<li>');

			//append element to list item
			li.append(that.linkList[i]);

			//append list element to ul
			ul.append(li);
		}

		//append list to module
		$(module).append(ul);
	};

	slySlider.prototype.events = function(){

		var that = this;

		$(that.modules.thumbs).on('click', 'li a', function(e){

			//on thumb click
			that.eventThumbClick(this);

			//prevent default
			e.preventDefault();
		});

		$(that.modules.img).on('click', '');	
	};

	slySlider.prototype.eventThumbClick = function(link){

		var that = this;

		//render elements
		that.renderImage(that.modules.img, $(link).attr('href'));
		that.renderText(that.modules.txt, $(link).attr('title'));
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

	slySlider.prototype.findLink = function(href){

		var that = this, i, l;

		//if href is false, find first link's href
		if(!href){

			href = $(that.linkList[0]).attr('href');
		}

		//for each element in linkList
		for(i = 0, l = that.linkList.length; i < l; ++i){

			//if href matches current links href
			if(href === $(that.linkList[i]).attr('href')){

				//return link
				return that.linkList[i];
			}
		}
	};

	$.fn.slySlider = function(options){

		//for each element in collection
		return this.each(function(){

			//create new slySlider
			new slySlider(this, options);
		});
	};

})(jQuery, window);