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
		$(this.el).empty().hide();

		//render element
		that.render();

		//create events
		that.events();	
	};

	slySlider.prototype.render = function(){

		var that = this;

		//render default
		that.renderDefault();

		//render modules, when complete fade element in
		$.when(
			that.renderImage(that.modules.img),
			that.renderText(that.modules.txt),
			that.renderControls(that.modules.ctrlPrev, that.modules.ctrlNext),
			that.renderThumbs(that.modules.thumbs)
		).then(function(){

			//fade in slideshow
			$(that.el).fadeIn();
		});
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

		var that = this, img,
			dfd = $.Deferred();

		//if no src
		if(!src){

			//get src for image, if imgSrc isn't set, get first img
			src = (that.config.imgSrc) ? that.config.imgSrc : $(that.linkList[0]).attr('href');
		}

		//preload image
		that.preloadImages(src).done(function(){

			img = $('<img/>', {

				'src' : src
			});

			//insert image into module
			$(module).html(img);

			//resolve
			dfd.resolve();
		});

		//return promise
		return dfd.promise();	
	};

	slySlider.prototype.renderText = function(module, title){

		var that = this, link, title,
			dfd = $.Deferred();

		//if no title
		if(!title){

			//find and store link
			link = that.findLink(that.config.imgSrc);

			//store link's title
			title = $(link).attr('title');
		}

		//insert title into module
		$(module).html(title);

		//resolve
		dfd.resolve();

		//return promise
		return dfd.promise();
	};

	slySlider.prototype.renderControls = function(modPrev, modNext){

		var that = this,
			dfd = $.Deferred();

		//resolve
		dfd.resolve();

		//return promise
		return dfd.promise();			
	};

	slySlider.prototype.renderThumbs = function(module){

		var that = this, i, l, ul, li, src = [],
			dfd = $.Deferred();

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

			//add to src array
			src.push($(that.linkList[i]).find('img').attr('src'));
		}

		//preload images
		that.preloadImages(src).done(function(){

			//insert list to module
			$(module).html(ul);

			//set list's width
			that.setListWidth(ul);

			//resolve
			dfd.resolve();			
		});

		//return promise
		return dfd.promise();
	};

	slySlider.prototype.events = function(){

		var that = this;

		$(that.modules.thumbs).on('click', 'li a', function(e){

			//on thumb click
			that.eventThumbClick(this);

			//prevent default
			e.preventDefault();
		});

		$(that.modules.thumbs).on('mousemove', function(e){

			//on thumb mouse move
			that.eventThumbMouseMove(this, e.pageX - $(this).offset().left);

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

	slySlider.prototype.eventThumbMouseMove = function(ctn, relX){

		var that = this,
			$ctn = $(ctn),
			ul = $ctn.find('ul'),
			ctnW, ulW, leftOver, marginRight, percent, move;

		//store container width
		ctnW = $ctn.width();

		//store ul width
		ulW = ul.width();

		//find last margin right
		marginRight = parseInt($(ul).find('li').last().css('margin-right'), 10);

		//find left over space
		leftOver = ulW - ctnW;

		//if margin right, remove last margin off of left over
		if(marginRight){

			leftOver = leftOver - marginRight;
		}

		//find percent, limit to 3 decimal points
		percent = (relX / ctnW).toFixed(3);

		//find out how many pixels to move
		move = (percent * leftOver).toFixed(3);

		//move list
		ul.css({ 'left' : '-' + move + 'px' });
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

	slySlider.prototype.setListWidth = function(ul){

		var i, l, 
			$ul = $(ul),
			li = $ul.find('li'),
			w = 0;


		//for each list item
		for(i = 0, l = li.length; i < l; ++i){

			//find and store outerWidth
			w = w + $(li[i]).outerWidth(true);
		}

		$ul.css('width', w);
	};

	/**
	 * Helper function for passing arrays of promises to $.when
	 */
	$.whenArray = function ( array ) {
		return $.when.apply( this, array );
	};


	/**
	 * Accepts a single image src or an array of image srcs.
	 * @return Promise that resolves once images have loaded.
	 */
	slySlider.prototype.preloadImages = function(srcs) {
		var dfd = $.Deferred(),
			promises = [],
			img,
			l,
			p;

		if (!$.isArray(srcs)) {
			srcs = [srcs];
		}

		l = srcs.length;

		for (var i = 0; i < l; i++) {
			p = $.Deferred();
			img = $("<img />");

			img.load(p.resolve);
			img.error(p.resolve);

			promises.push(p);

			img.get(0).src = srcs[i];
		}

		$.whenArray(promises).done(dfd.resolve);

		return dfd.promise();
	}

	$.fn.slySlider = function(options){

		//for each element in collection
		return this.each(function(){

			//create new slySlider
			new slySlider(this, options);
		});
	};

})(jQuery, window);