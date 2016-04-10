      var configApp = {
           'APP_NAME': 'REUNION',
           'VERSION': 1.02,
           'URL': 'http://reunion.jolijun.com/',
           'CONFIG_PATH': 'file:///sdcard/',
           'UPDATE_URL': 'http://jolijun.com/app/index.php',
           'UPDATE_PATH': 'file:///sdcard/jolijun/',
           'API_KEY': '',
           'PARTICION_ID': 0
      };

      var dataApp = {
           'user': {},
           'list': [],
           'catalogs': [],
           'active': {},
           'type': 0,
           'push': ''
      };

      notEmpty = function(string){
           string = $.trim(string);
           return (string.length > 0);
      }

      log = function($options){
          var $defaults = {
               'app': configApp['APP_NAME'],
               'tipo': 'alta',
               'version': configApp['VERSION'],
               'url': '',
               'datos': '',
               'mensaje': '',
               'key': ''
          }

          $options = $.extend({}, $defaults, $options);

          $.ajax({
               'type': 'POST',
               'url': 'http://jolijun.com/logs/guarda.php',
               'data': $options,
               'success': function(data){
                    data = $.parseJSON(data);
                    if(data['result'] == 0){
                         console.log("Error: no log saved.");
                    }
               }
          });
      }

      init = function(context){

           context.find(".on-init").each(function(){
                self = $(this);
                data = self.data()
                for(var index in data)
                {
                     item = data[index];
                     if($.type(item) === 'string')
                     {
                          if(item.lastIndexOf("$.") === 0)
                          {
                               path = item.replace("$.", "");
                               data[index] = getFromPath(path, window);
                          }
                     }
                }
                window[self.data('function')](data);
           });

           context.find(".ajax-form").on("click", function(){
                ajaxForm($(this).data());
           });

           context.find(".time-picker").each(function(){
                var self = $(this);
                var parent = self.parent();
                var initialValue = $.trim(self.val());

                var container = $('<div />', {'class': 'col-md-12 time-picker-container'});
                var hour = $('<select></select>', {'class': 'form-control time-picker-hour'})
                var minute = $('<select></select>', {'class': 'form-control time-picker-minute'})
                var separator = $('<span></span>', {'class': 'form-control pull-left time-picker-separator', 'html': ':'});
                var interval = null;

                var populateSelect = function(select, limit){
                     for(var i = 0; i <= limit; i++){
                          h = (i < 10) ? "0"+i : i;
                          option = $('<option></option>');
                          option.val(h);
                          option.text(h);
                          select.append(option);
                     }
                }

                var checkChanges = function(){
                     hourValue = hour.val();
                     minuteValue = minute.val();
                     time = hourValue+":"+minuteValue;
                     self.val(time); 
                }

                populateSelect(hour, 23);
                populateSelect(minute, 59);
                hour.change(checkChanges);
                minute.change(checkChanges);

                container.append($('<div></div>', {'class': 'col-md-5 pull-left'}).append(hour)); 
                container.append(separator);
                container.append($('<div></div>', {'class': 'col-md-5 pull-left'}).append(minute));
                parent.append(container);
                self.hide();

                setInterval(function(){
                     if($('#'+self.attr('id')).length){
                          actualValue = $.trim(self.val());
                          if(actualValue != ''){
                               if(initialValue != actualValue){
                                    parts = actualValue.split(":");
                                    hour.val(parts[0]);
                                    minute.val(parts[1]);
                                    initialValue = actualValue;
                               }
                          }
                     }
                     else{
                          clearInterval(interval);
                     }
                }, 500);
           });

           context.find(".date-picker").each(function(){
                var self = $(this);
                var parent = self.parent();
                var initialValue = $.trim(self.val());

                var container = $('<div />', {'class': 'date-picker-container'});
                var day = $('<select></select>', {'class': 'date-picker-day'});
                var month = $('<select></select>', {'class': 'date-picker-month'});
                var year = $('<select></select>', {'class': 'date-picker-year'});
                var separator = $('<span></span>', {'class': 'date-picker-separator', 'html': '/'});
                var interval = null;

                var populateSelect = function(select, start, limit){
                     for(var i = start; i <= limit; i++){
                          h = (i < 10) ? "0"+i : i;
                          option = $('<option></option>');
                          option.val(h);
                          option.text(h);
                          select.append(option);
                     }
                }

                var checkChanges = function(){
                     dayValue = day.val();
                     monthValue = month.val();
                     yearValue = year.val();
                     date = yearValue+"-"+monthValue+"-"+dayValue;
                     self.val(date); 
                }

                actualYear = new Date().getFullYear();
                populateSelect(day, 0, 31);
                populateSelect(month, 0, 12);
                populateSelect(year, (actualYear-100), actualYear);
                day.change(checkChanges);
                month.change(checkChanges);
                year.change(checkChanges);
                year.val(actualYear);

                container.append(day);
                container.append(separator);
                container.append(month);
                container.append(separator.clone());
                container.append(year);
                parent.append(container);
                self.hide();

                setInterval(function(){
                     if($('#'+self.attr('id')).length){
                          actualValue = $.trim(self.val());
                          if(actualValue != ''){
                               if(initialValue != actualValue){
                                    parts = actualValue.split("-");
                                    year.val(parts[0]);
                                    month.val(parts[1]);
                                    day.val(parts[2]);
                                    initialValue = actualValue;
                               }
                          }
                     }
                     else{
                          clearInterval(interval);
                     }
                }, 500);
           });

      };

      var Router = function (layer, context, config){

           this.configDefault = {'viewPath': "Vista", "defaultRoute": "", 'eventSelector': '', 'callback': null};
           this.config = {};

           this.start = function(){
                this.config = $.extend({}, this.configDefault, config);
                this.route();
                this.delegate();
           };

           this.route = function(){

                path = document.location.hash;

                if(path == '')
                {
                     view = this.config['defaultRoute'];
                }
                else
                {
                     pathParts = path.split("/");
                     if(pathParts.length > 1)
                     {
                          if(pathParts[1] == 'Ver')
                          {
                               view = "/" + pathParts[2] + "/" + pathParts[3] + "/";
                          }
                          else
                          {
                               view = this.config['defaultRoute'];
                          }
                     }
                     else
                     {
                          view = this.config['defaultRoute'];
                     }
                }

                this.go(view, this.config['callback']);

           }

           this.go = function(view, callback){
                this.load(layer, view, callback);
                window.location.hash = '#/Ver'+view;
           }

           this.delegate = function(){
                
                $(document).on('click', this.config['eventSelector'], function(e){
                     e.preventDefault();
                     router.go($(this).attr('href'), $(this).data('callback'));
                });
           }

           this.load = function(layer, view, callback){
                parts = view.split("/");
                controller = parts[1];
                action = parts[2];

                view = controller+"/"+action;
                view = this.config['viewPath']+"/"+view+".html";

                $.ajax({
                     'url': view,
                     'error': function(){
                          alert("Error: No se pudo cargar la vista.");
                     },
                     'beforeSend': function(){
                          loaderShow();
                     },
                     'success': function(data){
                          for(index in configApp)
                          {
                               conf = configApp[index];
                               data = data.replace(new RegExp("{{"+index+"}}", "g"), conf);
                          }
                          layer.empty();
                          layer.html(data);
                          init(layer);

                          if(callback != null)
                          {
                               window[callback](data);
                          }
                          else
                          {
                               callAction(controller, action, data, true);
                          }
                          loaderHide();
                     }
                });
           };
      };

      validate = function(form){
           var result = true;
           var model = form.data('model');
           var validation = form.data('validation');

           if(validation){
                form.find(".form-error").hide();
                validations = window['models'][model]['validations'];
                
                for(var index in validations){
                     field = validations[index];
                     element = form.find(":input[name='"+index+"']");
                     for(var i in field){
                          check = field[i];
                          if(!window[check['callback']](element.val())){
                               error = $('#'+element.attr('id')+"Error");
                               error.html(check['message']);
                               error.show();
                               result = false;
                          }
                     }
                }
           }

           return result;
      }

      formSerialize = function(form){
           var data = {};

           form.find(':input').each(function(){
                var self = $(this);
                data[self.attr('name')] = self.val();
           });

           return data;
      }

      ajaxForm = function(config){

           configDefault = { 'id': '', 'success': null, 'controller': '', 'action': '' };
           config = $.extend({}, configDefault, config);
           var form = $(config['id']);
           var serialized = form.serialize();
           var formUrl = form.attr('action');

           if(validate(form)){
           
                $.ajax({
                     'type': form.attr('method'),
                     'url': form.attr('action'),
                     'data': serialized,
                     'error': function(xqXHR){
                          log({'tipo': 'error', 'url': formUrl, 'datos': serialized, 'mensaje': xqXHR.responseText});
                          loaderShow(xqXHR.responseText);
                     },
                     'beforeSend': function(){
                          loaderShow();
                     },
                     'success': function(data){
                          if(config['success'] != null)
                          {
                               window[config['success']](data);
                          }
                          else
                          {
                               callAction(config['controller'], config['action'], data, false);
                          }
                          log({'tipo': 'envio', 'url': formUrl, 'datos': serialized, 'mensaje': data});
                          loaderHide();
                     }
                });
           }
      };

      setOption = function(config){

      	   configDefault = {'selector': "", 'options': null, 'selected': null, 'type': 'assoc', 'key': 'id', 'label': 'label' };
           config = $.extend({}, configDefault, config);
           config['element'] = $(config['selector']);
           config['element'].find('option').remove();

           if(config['type'] == 'assoc')
           {
                 for(var index in config['options'])
                 {
                 	  item = config['options'][index];
                      option = $('<option />');
                      option.text(item[config['label']]);
                      option.val(item[config['key']]);
                      config['element'].append(option);
                 }
           }
           else if(config['type'] == 'array')
           {
                 for(var index in config['options'])
                 {
                      option = $('<option />');
                      option.text(config['options'][index]);
                      option.val(index);
                      config['element'].append(option);
                 }
           }

           if(config['selected'] != null)
           {
                config['element'].val(config['selected']);
           }
      };

      setOptionRemote = function(config){
      	   configDefault = {'url': '' };
           config = $.extend({}, configDefault, config);

           $.ajax({
                'url': config['url'],
                'success': function(data){
                     config['options'] = $.parseJSON(data);
                     setOption(config);
                }
           });
      };

      callAction = function(controller, action, data, render){

           controller = "Controller"+controller;

           if(window[controller] !== undefined)
           {
                controller = window[controller];
                if(controller[action] !== undefined)
                {
                     controller[action](data, render);
                }
           }
      };

      modal = function(config){
           configDefault = { 'id': '', 'html': '', 'buttons': [] };
           config = $.extend({}, configDefault, config);
           var body = $('body'), modal = null;
           var html = '';

           html += '<div id="'+config['id']+'" class="dialog">';
           html += '<div class="dialog-content">'+config['html']+'</div>';
           html += '<div class="dialog-buttons"></div>';
           html += '</div>';

           modal = $(html);
           for(i in config['buttons'])
           {
                button = config['buttons'][i];

                modal.find('.dialog-buttons').append(button);
           }

           body.append(modal);
           return modal;
      }

      modalAlert = function(config){
           configDefault = { 'onClose': null };
           config = $.extend({}, configDefault, config);
           var $modal = null;

           close = $('<button />', {'html': '<i class="fa fa-close"></i> Cerrar', 'type': 'button', 'class': 'btn btn-danger'});
           close.click(function(){
                if(config['onClose'] != null)
                {
                     config['onClose'].call();
                }
                $modal.remove();
           });

           config['buttons'] = [close];
           $modal = modal(config);
      };

      modalConfirm = function(config){
           configDefault = { 'onConfirm': null, 'onCancel': null };
           config = $.extend({}, configDefault, config);
           var $modal = null;

           confirm = $('<button />', {'html': '<i class="fa fa-check"></i> Aceptar', 'type': 'button', 'class': 'btn btn-success'});
           confirm.click(function(){
                if(config['onConfirm'] != null)
                {
                     config['onConfirm'].call();
                }
                $modal.remove();
           });

           cancel = $('<button />', {'html': '<i class="fa fa-close"></i> Cancelar', 'type': 'button', 'class': 'btn btn-danger'});
           cancel.click(function(){
                if(config['onCancel'] != null)
                {
                     config['onCancel'].call();
                }
                $modal.remove();
           });

           config['buttons'] = [confirm, cancel];
           $modal = modal( config );
      };

      loaderShow = function(html){
           html = (html == null) ? '<i class="fa fa-gear fa-spin fa-5x"></i>' : html;
           modalAlert({
                'id': 'loaderFullApp',
                'html': html
           });
      };

      loaderHide = function(){
           $('#loaderFullApp').remove();
      };

      bindData = function(config){
           configDefault = { 'selector': null, 'data': {}, 'filter': '' };
           config = $.extend({}, configDefault, config);

           var element = $(config['selector']);

           element.find(config['filter']).each(function(){
                var item = $(this);
                path = item.data('path');
                value = getFromPath(path, config['data']);
                if($.type(value) == 'boolean')
                {
                     value = (value) ? 1 : 0;
                }

                if(item.is('input') || item.is('select') || item.is('textarea') || item.is('button'))
                {
                     item.val(value);
                }
                else
                {
                     item.html(value);
                }
           });

      };

      getFromPath = function(path, data){

           parts = path.split(".");
           value = data;

           for(i in parts)
           {

                part = parts[i];
                if(value[part] !== undefined)
                {
                     value = value[part];
                }
           }

           type = $.type(value); 
           value = (type == 'string' || type == 'number') ? value : "";

           return value;
      };

      getExtension = function(name)
      {
          name = name.substr((name.lastIndexOf('.')+1));
          return name;
      };

      writeJSON = function(fileName, fileData){
          var deferred = $.Deferred();
          fileName = configApp['APP_NAME'].toLowerCase()+"_"+fileName;
          fileData = JSON.stringify(fileData);
          
          window.resolveLocalFileSystemURL(configApp['CONFIG_PATH'], function(dir) {
               dir.getFile(fileName+".json", {create:true}, function(file) {
                    file.createWriter(function(fileWriter) {
                         fileWriter.seek(fileWriter.length);
                         //var blob = new Blob([fileData], {type:'text/plain'});
                         fileWriter.write(fileData);
                         deferred.resolve(true);
                    });      
               });
          }, function(){
               deferred.resolve(false);
          });

          return deferred.promise();
      }

      readJSON = function(fileName){

          var deferred = $.Deferred()
          fileName = configApp['APP_NAME'].toLowerCase()+"_"+fileName;
          window.resolveLocalFileSystemURL(configApp['CONFIG_PATH']+fileName+".json", function(fileEntry) {
               fileEntry.file(function(file) {
                    var reader = new FileReader();

                    reader.onloadend = function(e) {
                         deferred.resolve(this.result);
                    }

                    reader.readAsText(file);
               });

          }, function(){
               deferred.reject();
          });

          return deferred.promise();
      }

      substr = function(string, maxLength){
  
           var limit = maxLength-3;
           if(string.length > maxLength){
                string = string.substring(0, limit)+"...";
           }

           return string;
      }

      arrayRemoveElement = function(array, index){
           var newArray = [];

           for(var i in array){
                if(i != index){
                     newArray.push(array[i]);
                }
           }

           return newArray;
      }

varDump = function() {

  var output = '',
    pad_char = ' ',
    pad_val = 4,
    lgth = 0,
    i = 0

  var _getFuncName = function (fn) {
    var name = (/\W*function\s+([\w\$]+)\s*\(/)
      .exec(fn)
    if (!name) {
      return '(Anonymous)'
    }
    return name[1]
  }

  var _repeat_char = function (len, pad_char) {
    var str = ''
    for (var i = 0; i < len; i++) {
      str += pad_char
    }
    return str
  }
  var _getInnerVal = function (val, thick_pad) {
    var ret = ''
    if (val === null) {
      ret = 'NULL'
    } else if (typeof val === 'boolean') {
      ret = 'bool(' + val + ')'
    } else if (typeof val === 'string') {
      ret = 'string(' + val.length + ') "' + val + '"'
    } else if (typeof val === 'number') {
      if (parseFloat(val) == parseInt(val, 10)) {
        ret = 'int(' + val + ')'
      } else {
        ret = 'float(' + val + ')'
      }
    }
    // The remaining are not PHP behavior because these values only exist in this exact form in JavaScript
    else if (typeof val === 'undefined') {
      ret = 'undefined'
    } else if (typeof val === 'function') {
      var funcLines = val.toString()
        .split('\n')
      ret = ''
      for (var i = 0, fll = funcLines.length; i < fll; i++) {
        ret += (i !== 0 ? '\n' + thick_pad : '') + funcLines[i]
      }
    } else if (val instanceof Date) {
      ret = 'Date(' + val + ')'
    } else if (val instanceof RegExp) {
      ret = 'RegExp(' + val + ')'
    } else if (val.nodeName) {
      // Different than PHP's DOMElement
      switch (val.nodeType) {
        case 1:
          if (typeof val.namespaceURI === 'undefined' || val.namespaceURI === 'http://www.w3.org/1999/xhtml') {
          // Undefined namespace could be plain XML, but namespaceURI not widely supported
            ret = 'HTMLElement("' + val.nodeName + '")'
          } else {
            ret = 'XML Element("' + val.nodeName + '")'
          }
          break
        case 2:
          ret = 'ATTRIBUTE_NODE(' + val.nodeName + ')'
          break
        case 3:
          ret = 'TEXT_NODE(' + val.nodeValue + ')'
          break
        case 4:
          ret = 'CDATA_SECTION_NODE(' + val.nodeValue + ')'
          break
        case 5:
          ret = 'ENTITY_REFERENCE_NODE'
          break
        case 6:
          ret = 'ENTITY_NODE'
          break
        case 7:
          ret = 'PROCESSING_INSTRUCTION_NODE(' + val.nodeName + ':' + val.nodeValue + ')'
          break
        case 8:
          ret = 'COMMENT_NODE(' + val.nodeValue + ')'
          break
        case 9:
          ret = 'DOCUMENT_NODE'
          break
        case 10:
          ret = 'DOCUMENT_TYPE_NODE'
          break
        case 11:
          ret = 'DOCUMENT_FRAGMENT_NODE'
          break
        case 12:
          ret = 'NOTATION_NODE'
          break
      }
    }
    return ret
  }

  var _formatArray = function (obj, cur_depth, pad_val, pad_char) {
    var someProp = ''
    if (cur_depth > 0) {
      cur_depth++
    }

    var base_pad = _repeat_char(pad_val * (cur_depth - 1), pad_char)
    var thick_pad = _repeat_char(pad_val * (cur_depth + 1), pad_char)
    var str = ''
    var val = ''

    if (typeof obj === 'object' && obj !== null) {
      if (obj.constructor && _getFuncName(obj.constructor) === 'PHPJS_Resource') {
        return obj.var_dump()
      }
      lgth = 0
      for (someProp in obj) {
        lgth++
      }
      str += 'array(' + lgth + ') {\n'
      for (var key in obj) {
        var objVal = obj[key]
        if (typeof objVal === 'object' && objVal !== null && !(objVal instanceof Date) && !(objVal instanceof RegExp) &&
          !objVal.nodeName) {
          str += thick_pad + '[' + key + '] =>\n' + thick_pad + _formatArray(objVal, cur_depth + 1, pad_val,
            pad_char)
        } else {
          val = _getInnerVal(objVal, thick_pad)
          str += thick_pad + '[' + key + '] =>\n' + thick_pad + val + '\n'
        }
      }
      str += base_pad + '}\n'
    } else {
      str = _getInnerVal(obj, thick_pad)
    }
    return str
  }

  output = _formatArray(arguments[0], 0, pad_val, pad_char)
  for (i = 1; i < arguments.length; i++) {
    output += '\n' + _formatArray(arguments[i], 0, pad_val, pad_char)
  }

  return output;
}