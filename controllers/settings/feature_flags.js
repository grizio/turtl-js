const FeatureFlagsController = FormController.extend({
  xdom: true,

  elements: {
    'form': 'el_form',
    '#list_format_grid': 'list_format_grid',
    '#list_format_list': 'list_format_list',
    'p.load': 'el_loader'
  },

  events: {
    'submit form': 'save'
  },

  formclass: 'settings-feature_flags',
  buttons: false,

  init: function () {
    turtl.push_title(i18next.t('Feature flags'), '/settings');

    this.with_bind(turtl.events, 'api:connect', this.render.bind(this));
    this.with_bind(turtl.events, 'api:disconnect', this.render.bind(this));

    this.parent();
    this.render();
  },

  render: function () {
    const connected = turtl.connected;
    return this.html(view.render('settings/feature_flags', {
      connected: connected,
      feature_flags: turtl.user.setting('feature_flags') || {}
    }))
      .then(() => {
        if (!connected) this.el_form && this.el_form.addClass('bare');
        else this.el_form && this.el_form.removeClass('bare');
        if (this.inp_cur_password) this.inp_cur_password.focus.delay(300, this.inp_cur_password);
      });
  },

  save: function (e) {
    if (e) e.stop();

    turtl.user.setting('feature_flags', {
      list_format: this.list_format_list.get('checked') ? 'list' : 'grid',
    });
    turtl.route('/settings')
  }
});

