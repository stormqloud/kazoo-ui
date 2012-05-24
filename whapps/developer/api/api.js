winkstart.module('developer', 'api', {

        subscribe: {
             'api.activate' : 'activate',
        },

        templates: {
            api: 'tmpl/api.html',
            form: 'tmpl/form.html'
        },

        css: [
            'css/api.css'
        ]

    },

    function(args) {
        var THIS = this;

        winkstart.registerResources(THIS.__whapp, THIS.config.resources);
    },
    {

        render_api: function(data, target) {
            var THIS = this,
                form_html = null;

            THIS.schema_to_template(data, function(template, clean){
                form_html =  THIS.templates.form.tmpl({
                    schema: template
                });
                console.log(clean);
                console.log(template);
            });

            $('*[rel=popover]:not([type="text"])', form_html).popover({
                trigger: 'hover'
            });

            $('*[rel=popover][type="text"]', form_html).popover({
                trigger: 'focus'
            });

            $('#show', form_html).click(function() {
                $('.hide', form_html).slideToggle();
            });

            (target)
                .empty()
                .append(form_html);
        },

        schema_to_template: function(schema, callback) {
            var tmp = {},
                new_schema = {},
                clean = function(data, target) {
                    var new_schema = {};

                    $.each(data, function(k, o){
                        switch(o.type) {
                            case 'object':
                                if(o.properties) {
                                    target[k] = {};
                                    clean(o.properties, target[k]);
                                } else {
                                    new_schema[k] = o;
                                }
                                break;
                            case 'array':
                                if(o.enum){
                                    new_schema[k] = o;
                                } else {
                                    target[k] = {};
                                    clean(o.items.properties, target[k]);
                                }
                                break;
                            default:
                                new_schema[k] = o;
                                break;
                        }
                    });

                    $.extend(target, new_schema);
                },
                template = function (data, target, name) {
                    var new_schema = {};

                    $.each(data, function(k, o){
                        if(o.type){
                            (name) ? o.input_name = name + '.' + k : o.input_name = k;
                            new_schema[k] = o
                        } else {
                            (name) ? k = name + '.' + k : k = k;
                            template(o, target, k);
                        }

                    });

                    $.extend(target, new_schema);
                };

            clean(schema, tmp);
            template(tmp, new_schema);

            if(typeof callback == "function"){
                callback(new_schema, tmp);
            }
        },

        activate: function(parent) {
            var THIS = this,
               api_html = THIS.templates.api.tmpl();

            (parent || $('#ws-content'))
                .empty()
                .append(api_html);

            var schema = {
   "name": {
       "description": "A friendly name for the voicemail box",
       "required": "true",
       "type": "string",
       "minLength": 1,
       "maxLength": 128
   },
   "owner_id": {
       "description": "The ID of the user object that 'owns' the voicemail box",
       "type": "string",
       "minLength": 32,
       "maxLength": 32
   },
   "mailbox": {
       "description": "The voicemail box number",
       "required": "true",
       "type": "string",
       "minLength": 2,
       "maxLength": 6
   },
   "pin": {
       "description": "The pin number for the voicemail box",
       "type": "string",
       "minLength": 4,
       "maxLength": 6
   },
   "require_pin": {
       "description": "Determines if a pin is required to check the voicemail from the users devices",
       "type": "boolean",
       "default": false
   },
   "check_if_owner": {
       "description": "Determines if when the user calls their own voicemail they should be prompted to sign in",
       "type": "boolean",
       "default": true
   },
   "is_setup": {
       "description": "Determines if the user has completed the initial configuration",
       "type": "boolean",
       "default": false
   },
   "skip_greeting": {
       "description": "Determines if the greeting should be skipped",
       "type": "boolean",
       "default": false
   },
   "skip_instructions": {
       "description": "Determines if the instructions after the greeting and prior to composing a message should be played",
       "type": "boolean",
       "default": false
   },
   "media": {
       "description": "The media (prompt) parameters",
       "type": "object",
       "properties": {
           "unavailable": {
               "description": "The ID of a media object that should be used as the unavailable greeting",
               "type": "string",
               "minLength": 32,
               "maxLength": 32
           }
       },
       "default": {
       }
   },
   "notifications": {
       "description": "The notifications parameters for this account",
       "type": "object",
       "properties": {
           "voicemail_to_email": {
               "description": "The voicemail to email notification parameters for this account",
               "type": "object",
               "properties": {
                   "email_text_template": {
                       "description": "The email html body template.  Has access to an acccount, service, and voicemail object",
                       "type": "string"
                   },
                   "email_html_template": {
                       "description": "The email text body template.  Has access to an acccount, service, and voicemail object",
                       "type": "string"
                   },
                   "email_subject_template": {
                       "description": "The email subject template.  Has access to an acccount, service, and voicemail object",
                       "type": "string"
                   },
                   "support_number": {
                       "description": "The support number provided to the templates",
                       "type": "string",
                       "maxLength": 128
                   },
                   "support_email": {
                       "description": "The support email provided to the templates",
                       "type": "string",
                       "maxLength": 256
                   },
                   "service_url": {
                       "description": "The support number provided to the templates",
                       "type": "string",
                       "maxLength": 128
                   },
                   "service_name": {
                       "description": "The service name provided",
                       "type": "string",
                       "maxLength": 128
                   },
                   "service_provider": {
                       "description": "The service provider name",
                       "type": "string",
                       "maxLength": 128
                   },
                   "send_from": {
                       "description": "The from address used when sending the email",
                       "type": "string",
                       "maxLength": 256
                   }
               }
           }
       },
       "default": {
       }
   },
   "messages": {
       "description": "The messages that have been left in the voicemail box",
       "type": "array",
       "items": {
           "properties": {
               "timestamp": {
                   "description": "The UTC timestamp, in gregorian seconds, that the voicemail was left on",
                   "type": "string"
               },
               "from": {
                   "description": "The SIP from header",
                   "type": "string",
                   "maxLength": 128
               },
               "to": {
                   "description": "The SIP to header",
                   "type": "string",
                   "maxLength": 128
               },
               "caller_id_number": {
                   "description": "The reported caller id number",
                   "type": "string",
                   "maxLength": 15
               },
               "caller_id_name": {
                   "description": "The reported caller id name",
                   "type": "string",
                   "maxLength": 15
               },
               "folder": {
                   "description": "The folder the message belongs to",
                   "type": "string",
                   "enum": [
                       "deleted",
                       "saved",
                       "new"
                   ]
               },
               "media_id": {
                   "description": "The ID of the message media object",
                   "type": "string",
                   "minLength": 32,
                   "maxLength": 32
               }
           }
       },
       "default": [
       ]
   }
};

            THIS.render_api(schema, $('#api-view'));
        }
    }
);