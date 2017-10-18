export default class Modal {
	constructor(options) {
		if (options === undefined) options = {};
		if (options.fromTop === 0) options.fromTop = '0';
		this.defaults = {
			width: options.width || 300,
			height: options.height || 200,
			closeButton: options.closeButton === false ? false : true,
			content: options.content || "",
			overlay: options.overlay === false ? false : true,
			backgroundColor: options.backgroundColor || 'white',
			fromTop: options.fromTop || 10
		}
	}
	
	show() {
		
		var docFrag = document.createDocumentFragment();

		this.overlay = document.createElement("div");
		this.overlay.className = "modal-overlay ";
		docFrag.appendChild(this.overlay);

		if (!this.defaults.overlay) {
			this.overlay.style.backgroundColor = 'rgba(0,0,0,0)';
		}
		
		this.modal = document.createElement("div");
		this.modal.className = 'modal-box';
		this.modal.style.width = this.defaults.width + 'px';
		this.modal.style.height = this.defaults.height + 'px';
		this.modal.style.backgroundColor = this.defaults.backgroundColor;
		this.modal.style.marginTop = this.defaults.fromTop + '%';
		this.overlay.appendChild(this.modal);
		
		if (this.defaults.closeButton) {
			var self = this;
			this.closeButton = document.createElement('div');
			this.closeButton.className = 'modal-closebutton';
			this.closeButton.addEventListener('click', () => self.close() ); // this.close.bind(this)
			this.modal.appendChild(this.closeButton);
		}

		this.contentDiv = document.createElement("div");
		this.contentDiv.className = 'modal-content';
		this.contentDiv.innerHTML = this.defaults.content;
		this.modal.appendChild(this.contentDiv);

		document.body.appendChild(docFrag);
	}
	
	close() {
		document.querySelector('.modal-overlay').remove();
	}
};
