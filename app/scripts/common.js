(function($){
	if ( !$ ) {
		return;
	}



	$.fn.findNear = function ( selector ) {
		var $foundArray = $();

		this.each(function(){
			var $current = $(this);


			for ( var i = 0; i < 10; i++ ) {

				var $children = $current.find(selector);
				if ( $children.length ) {
					$foundArray = $foundArray.add($children);
					break;
				}

				var $siblings = $current.siblings(selector);
				if ( $siblings.length ) {
					$foundArray = $foundArray.add($siblings);
					break;
				}

				var $insideAllSiblings = $current.siblings().find(selector);
				if ( $insideAllSiblings ) {
					$foundArray = $foundArray.add($insideAllSiblings.first());
					break;
				}

				$current = $current.parent();
			}
		});
		return $foundArray
	};


	// DOM Ready
	$(function(){
		var $window = $(window);

		/*
		 *	ShowMore
		 */
		$(".Actions.ShowMore").click(function(){
			var $this = $(this);
			$this.toggleClass("Open");

			var relation = $this.attr("rel");
			if ( relation && relation.length ) {
				$(relation).find(".More").toggle();

				return false
			}

			$this.findNear(".More").toggle();

			return false;
		});


		$window.scroll(function(){
			var scrollTop = $window.scrollTop();

			$(".Sticky:not(.Clone)").each(function(){
				var $this = $(this);

				if ( !$this.hasClass("Stick") ) {
					$this.data("sticky-top", $this.offset().top);
				}

				if (scrollTop > $this.data("sticky-top")) {
					if ( !$this.hasClass("Stick") ) {
						var $clone = $this.clone().insertBefore($this);
						$clone.addClass("Clone");
						$this.data("sticky-clone", $clone);

						$this.addClass("Stick");
					}
				} else {
					if ( $this.hasClass("Stick") ) {
						$this.removeClass("Stick");
						$this.data("sticky-clone").remove();
					}
				}
			});
		});



		// http://css-tricks.com/snippets/jquery/smooth-scrolling/
		(function(){
			function filterPath(string) {
				return string
						       .replace(/^\//,'')
						       .replace(/(index|default).[a-zA-Z]{3,4}$/,'')
						       .replace(/\/$/,'');
			}
			var locationPath = filterPath(location.pathname);
			var scrollElem = scrollableElement('html', 'body');

			$('a[href*=#]').each(function() {
				var thisPath = filterPath(this.pathname) || locationPath;
				if (  locationPath == thisPath
						      && (location.hostname == this.hostname || !this.hostname)
						      && this.hash.replace(/#/,'') ) {
					var $target = $(this.hash), target = this.hash;
					if (target) {
						$(this).click(function(event) {
							var targetOffset = $target.offset().top;


							if ( $(".Sticky.Stick").length ) {
								targetOffset = targetOffset - $(".Sticky.Stick").outerHeight(true) * 1.2;
							}

							event.preventDefault();
							$(scrollElem).animate({scrollTop: targetOffset}, 400, function() {
								location.hash = target;
								$(scrollElem).scrollTop(targetOffset);
							});
						});
					}
				}
			});

			// use the first element that is "scrollable"
			function scrollableElement(els) {
				for (var i = 0, argLength = arguments.length; i <argLength; i++) {
					var el = arguments[i],
							$scrollElement = $(el);
					if ($scrollElement.scrollTop()> 0) {
						return el;
					} else {
						$scrollElement.scrollTop(1);
						var isScrollable = $scrollElement.scrollTop()> 0;
						$scrollElement.scrollTop(0);
						if (isScrollable) {
							return el;
						}
					}
				}
				return [];
			}
		})();
	});


})(jQuery);