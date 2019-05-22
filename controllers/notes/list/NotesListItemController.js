const NotesListItemController = NoteBaseController.extend({
	tag: 'li',
	class_name: 'note-as-list',

	events: {
		'click': 'note_click'
	},

	board: null,
	model: null,

	init: function()
	{
		this.render();
		var renchange = () => this.render();
		this.with_bind(this.model, 'change', renchange);
		this.with_bind(this.model.get('file'), 'change', renchange);

		var hammer = new Hammer.Manager(this.el, {domEvents: true});
		hammer.add(new Hammer.Press({time: 750}));
		hammer.on('press', function(e) {
			this.open_edit();
		}.bind(this));
		hammer.on('pressup', function(e) {
			this._cancel_click = true;
			setTimeout(function() { this._cancel_click = false; }.bind(this), 200);
		}.bind(this));
		this.bind('release', function() {
			hammer.destroy();
		});

		this.parent();
	},

	render: function()
	{
		var type = this.model.get('type');
		var note = this.model.toJSON();
		if(!type) {
			this.malformed_note(note);
		}
		if(note.file) {
			note.file.blob_url = this.model.get('file').get('blob_url');
			if(note.file.meta && note.file.meta.width && note.file.meta.height)
			{
				note.file.img_height = 100 * (note.file.meta.height / note.file.meta.width);
			}
		}
		const board = turtl.profile.get('boards').get(this.model.get('board_id'));
		this.html(view.render('notes/list/item-for-list', {
			board: board ? board.toJSON() : null,
			note: note
		})).bind(this);
	},

	note_click: function(e) {
		// hammer press hack
		if(this._cancel_click) return;

		var event = e.event || {};
		var atag = Composer.find_parent('li.note a', e.target, this.el);
		// middle click
		if(atag && (event.button == 4 || event.which == 2)) return;
		// shift/ctrl+click
		if(atag && (e.control || e.shift)) return;

		// nvm lolol open the note
		if(e) e.stop();
		this.open_note();
	},

	open_note: function(e) {
		if(e) e.stop();
		new NotesViewController({
			model: this.model
		});
	},

	open_edit: function(e) {
		if(e) e.stop();
		var space = turtl.profile.current_space();
		if(!permcheck(space, Permissions.permissions.edit_note)) return;
		new NotesEditController({
			model: this.model
		});
	},
});

