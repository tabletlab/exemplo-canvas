;(function($) {
	Canvas = {
		elStageH: null,
		elStageV: null,
		elCanvas: null,
		elWrapCores: null,
		$cores: null,
		ctxCanvas: null,

		cores: [
			'rgba(255, 242, 000, 1)',
			'rgba(250, 166, 026, 1)',
			'rgba(228, 078, 048, 1)',
			'rgba(255, 255, 255, 1)',
			'rgba(000, 255, 018, 1)',
			'rgba(000, 234, 255, 1)',
			'rgba(234, 000, 255, 1)',
			'rgba(042, 000, 255, 1)'
		],

		traco: {
			lastX: null,
			lastY: null,
			cor: null,

			offsetX: -83,
			offsetY: -83,
			larguraTraco: 5,
		},


		init: function() {
	        if (TL.sysInfo().appleDevice) {
				var self = this;

				// Inicializa Propriedades
				self.elStageH = document.getElementById('horizontal');
				self.elStageV = document.getElementById('vertical');
				self.elCanvas = document.getElementById('blankScreen');
				self.elWrapCores = document.getElementById('cores');

				self.ctxCanvas = self.elCanvas.getContext('2d');

				// Inicia Cores
				self.appendCores();
				self.$cores = $(self.elWrapCores).children("button");

				// Ajusta a orientacao
				self.ajustaOrientacao();

				// Eventos
				window.addEventListener('resize', self._windowResize, false);
				self.$cores.on('touchstart', self._corTouchStart);
				self.elCanvas.addEventListener('touchstart', self._canvasTouchStarted, false);
				// Inicializa com cor
				self.selecionaCor(self.$cores.eq(0));
	        } else {
	        	$('#horizontal').hide();
				$('#alert').html('Este recurso não está disponível para esta plataforma em tablets Android.');
				$('#alert').show();
	        }
		},


		appendCores: function() {
			var self = this;
			var $wrapCores = $(self.elWrapCores);

			for(var x=0; x<self.cores.length; x++) {
				var $botao = $("<button />");
				$botao.css("background-color", self.cores[x]);
				$botao.data('idx', x);
				$botao.html("Cor");
				$wrapCores.append($botao);
			}
		},



		ajustaOrientacao: function() {
			var self = this;
			self.traco.offsetX = self.elCanvas.offsetLeft*-1;
			self.traco.offsetY = self.elCanvas.offsetTop*-1;
		},

		iniciarTraco: function(x, y) {
			var self = this;

			self.traco.ultimoX = x;
			self.traco.ultimoY = y;

			self.ctxCanvas.lineCap = 'round';
			self.ctxCanvas.lineJoin = 'round';
			self.ctxCanvas.lineWidth = self.traco.larguraTraco;
			self.ctxCanvas.globalCompositeOperation = 'source-over';
		},

		fazerTraco: function(x, y) {
			var self = this;
			var c = self.ctxCanvas;

			c.beginPath();
			c.moveTo(self.traco.ultimoX, self.traco.ultimoY);
			c.strokeStyle = self.traco.cor;
			c.lineTo(x, y);
			c.stroke();
			c.closePath();

			self.traco.ultimoX = x;
			self.traco.ultimoY = y;
		},

		finalizarTraco: function(x, y) {
			var self = this;

		},

		canvasRemoveEventos: function() {
			var self = this;
			self.elCanvas.removeEventListener('touchmove', self._canvasTouchMove, false);
			self.elCanvas.removeEventListener('touchend', self._canvasTouchEnd, false);
			self.elCanvas.removeEventListener('touchcancel', self._canvasTouchCancel, false);
		},

		selecionaCor: function($cor) {
			var self = this;
			self.$cores.removeClass("ativo");
			self.traco.cor = self.cores[$cor.data('idx')];
			$cor.addClass("ativo");
		},

		_windowResize: function() {
			var self = Canvas;
			self.ajustaOrientacao();
		},

		_corTouchStart: function() {
			var self = Canvas;
			self.selecionaCor($(this));
		},

		_canvasTouchStarted: function(e) {
			var self = Canvas;
			e.preventDefault();

			if(e.touches.length==1) {
				self.iniciarTraco(e.touches[0].pageX+self.traco.offsetX, e.touches[0].pageY+self.traco.offsetY);
				self.elCanvas.addEventListener('touchmove', self._canvasTouchMove, false);
				self.elCanvas.addEventListener('touchend', self._canvasTouchEnd, false);
				self.elCanvas.addEventListener('touchcancel', self._canvasTouchCancel, false);
			}
		},

		_canvasTouchMove: function(e) {
			var self = Canvas;
			e.preventDefault();
			self.fazerTraco(e.touches[0].pageX+self.traco.offsetX, e.touches[0].pageY+self.traco.offsetY);
		},

		_canvasTouchCancel: function(e) {
			var self = Canvas;
			e.preventDefault();
			if(e.touches.length==0) {
				self.canvasRemoveEventos();
			}
		},

		_canvasTouchEnd: function(e) {
			var self = Canvas;
			e.preventDefault();
			if(e.touches.length==0) {
				self.finalizarTraco(e.changedTouches[0].pageX+self.traco.offsetX, e.changedTouches[0].pageY+self.traco.offsetX);
				self.canvasRemoveEventos();
			}
		}
	};

	$(window).load(function() { Canvas.init(); });
})(jQuery);