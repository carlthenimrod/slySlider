;(function($, win){

	//create defaults
	var defaults = {

		classNames : {

			active : 'sly-active',
			activeThumb : 'sly-active-thumb',
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

	slySlider.prototype.renderImage = function(module){

		var that = this, img, src,
			dfd = $.Deferred();

		//get src for image, if imgSrc isn't set, get first img
		src = (that.config.imgSrc) ? that.config.imgSrc : $(that.linkList[0]).attr('href');

		//preload image
		that.preloadImages(src).done(function(){

			img = $('<img/>', {

				'src' : src
			});

			//if not loaded insert and add active class
			$(module).html(img.addClass(that.config.classNames.active));

			//resolve
			dfd.resolve();
		});

		//return promise
		return dfd.promise();	
	};

	slySlider.prototype.renderText = function(module){

		var that = this, link, title,
			dfd = $.Deferred();

		//find and store link
		link = that.findLink(that.config.imgSrc);

		//store link's title
		title = $(link).attr('title');

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

		var that = this, i, l, ul, li, src = [], active,
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

			//find active thumb
			active = (that.config.imgSrc) ? that.findLink(imgSrc) : that.findLink();

			//add active class
			$(active).addClass(that.config.classNames.activeThumb);

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

		//change active link
		that.activeLink = link;

		//remove active class from all thumbs
		$('.' + that.config.classNames.thumbs + ' a').removeClass(that.config.classNames.activeThumb);

		//add active class to selected thumb
		$(link).addClass(that.config.classNames.activeThumb);

		//transition
		that.transition();
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

	slySlider.prototype.transition = function(){

		var that = this,
			active = that.modules.img.find('img.sly-active')[0],
			activeSrc = $(active).attr('src'),
			$link = $(that.activeLink),
			newSrc = $link.attr('href'),
			title = $link.attr('title'),
			img;

		//if the activeSrc is not equal to the newSrc, proceed
		if(activeSrc !== newSrc){

			//if active element is not animating
			if($('.' + that.config.classNames.active).not(':animated').length){

				//preload images
				that.preloadImages(newSrc).done(function(){

					//create new image
					img = $('<img/>', {

						'src' : newSrc
					});

					//append image to image module
					that.modules.img.append(img);

					//fade out active image
					$('.' + that.config.classNames.active).stop().fadeOut(1000, function(){

						//remove after animation completion
						$(this).remove();

						//add active class to new image
						img.addClass(that.config.classNames.active);

						//add new title
						that.modules.txt.html(title);

						//transition again
						that.transition();
					});					
				});	
			}
		}
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

		$.when.apply(this, promises).done(dfd.resolve);

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