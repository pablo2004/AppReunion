var ControllerReunion = {

     index: function(data, render){

          if(render){
               hideSideBar();
               dataApp['user'] = [];
               $('#irConvocar').hide();
               $('#irCompromisos').hide();
               $('#irConvocatorias').hide();
               $('#irProductividad').hide();
               $('#irCierreSesion').hide();
               $('#irConfirma').hide();
          }

     },

     acceso: function(data, render) {

          if(!render){

               data = $.parseJSON(data);
               if(data['on'] == 0){
                    $('#UsuarioPasswordError').html('<i class="fa fa-arrow-up"></i> Password Incorrecto.');
                    $('#UsuarioPasswordError').show();
               }
               else{
                    dataApp['user'] = data;
                    router.go('/Reunion/convocatorias/');
                    $('#irConvocar').show();
                    $('#irCompromisos').show();
                    $('#irConvocatorias').show();
                    $('#irProductividad').show();
                    $('#irCierreSesion').show();
                    $('#irConfirma').show();
                    ControllerReunion.registroGCM();
               }
          }

     },

     registroGCM: function(){

          if(dataApp['user']['Usuario']['push'] == ''){
               var push = PushNotification.init({
                    android: {
                        "senderID": "894137570315", //894137570315
                        "sound": true,
                        "vibrate": true
                    }
               });
      
               push.on('registration', function(pushData) {
                    modalAlert({"html": "Mensaje: Notificaciones Activadas."});
                    pushValue = $.trim(pushData.registrationId);
                    var pushUrl = configApp['URL']+'convocatorias/apiPush/?usuario_id='+dataApp['user']['Usuario']['id']+'&particion_id='+configApp['PARTICION_ID']+'&api='+configApp['API_KEY'];
                    $.ajax({
                         'type': 'POST',
                         'url': pushUrl,
                         'data': {'push': pushValue },
                         'error': function(xqXHR){
                              log({'tipo': 'error', 'url': pushUrl, 'mensaje': xqXHR.responseText});
                         },
                         'success': function(){
                              dataApp['user']['Usuario']['push'] = pushValue;
                         }
                    });
               });
                 
          }
     },

     convocatorias: function(records, render){
          
          if(render){

               hideSideBar();
               
               var listUrl = configApp['URL']+'convocatorias/apiConvocatorias/?usuario_id='+dataApp['user']['Usuario']['id']+'&particion_id='+configApp['PARTICION_ID']+'&api='+configApp['API_KEY'];
               
               $.ajax({
                     'url': listUrl,
                     'error': function(xqXHR){
                          log({'tipo': 'error', 'url': listUrl, 'mensaje': xqXHR.responseText});
                     },
                     'success': function(data){
                          data = $.parseJSON(data);
 
                          var lista = $('#lista');
                          lista.html('');

                          if(data.length == 0){
                              $('#sinRegistro').show();
                              lista.hide();
                          }
                          else{
                              $('#sinRegistro').hide();
                              lista.show();
                          }

                          for(var i in data){
                               record = data[i];
                               lista.append('<a data-index="'+i+'" data-id="'+record['Convocatoria']['nombre']+'" href="#" class="convoca list-group-item">'+record['Convocatoria']['nombre']+' <i style="float:right;margin-top:8px;" class="fa fa-chevron-right"></i></a>');
                          }

                          $('.convoca').click(function(e){
                               e.preventDefault();
                               var self = $(this);
                               var html = '', record;
                               record = data[self.data('index')];
                               html += '<h3><i class="fa fa-certificate"></i>Confirmar Asistencia: '+record['Convocatoria']['nombre']+'</h3><br />';
                               html += '<i class="fa fa-calendar"></i> Fecha: '+moment(record['Convocatoria']['fecha']).format('DD/MM/YYYY')+'<br />';
                               html += '<i class="fa fa-clock-o"></i> Hora: '+record['Convocatoria']['hora_inicio']+'<br />';
                               
                               var buttons = [], $modal = null;
                               confirm = $('<button />', {'html': '<i class="fa fa-thumbs-up"></i> Si', 'type': 'button', 'class': 'btn btn-success'});
                               cancel = $('<button />', {'html': '<i class="fa fa-thumbs-down"></i> No', 'type': 'button', 'class': 'btn btn-danger'});
                               close = $('<button />', {'html': '<i class="fa fa-times"></i> Cerrar', 'type': 'button', 'class': 'btn'});
                               
                               confirm.click(function(){
                                    var listConfirm = configApp['URL']+'convocatorias/apiAsistencia/?padre_id='+record['Convocatoria']['oid']+'&estatus_id=3&usuario_id='+dataApp['user']['Usuario']['id']+'&particion_id='+configApp['PARTICION_ID']+'&api='+configApp['API_KEY'];
                                    $.ajax({
                                         'url': listConfirm,
                                         'error': function(xqXHR){
                                              log({'tipo': 'error', 'url': listConfirm, 'mensaje': xqXHR.responseText});
                                         },
                                         'success': function(){
                                              $modal.remove();
                                              router.go("/Reunion/convocatorias/");
                                         }
                                    });
                               });

                               cancel.click(function(){
                                    var listCancel = configApp['URL']+'convocatorias/apiAsistencia/?padre_id='+record['Convocatoria']['oid']+'&estatus_id=2&usuario_id='+dataApp['user']['Usuario']['id']+'&particion_id='+configApp['PARTICION_ID']+'&api='+configApp['API_KEY'];
                                    $.ajax({
                                         'url': listCancel,
                                         'error': function(xqXHR){
                                              log({'tipo': 'error', 'url':listCancel, 'mensaje': xqXHR.responseText});
                                         },
                                         'success': function(){
                                              $modal.remove();
                                              dataApp['active'] = record;
                                              dataApp['type'] = 0;
                                              router.go("/Reunion/archivos/");
                                         }
                                    });
                               });

                               close.click(function(){
                                    $modal.remove();
                               });

                               buttons.push(confirm);
                               buttons.push(cancel);
                               buttons.push(close);

                               $modal = modal({
                                   'html': html,
                                   'buttons': buttons
                               });

                          });
                     }
               });
          }

     },

     archivos: function(data, render){

          if(render){

               if(dataApp['type'] == 0){
                    $('#ReunionMensaje').html('<i class="fa fa-info"></i> Justificar con evidencia.');
                    $('#ReunionTipoId').val(3);
                    $('#ReunionCompromisoId').val(0);
               }
               else{
                    $('#ReunionMensaje').html('<i class="fa fa-info"></i> Capturar evidencia.');
                    $('#ReunionTipoId').val(2);
                    $('#ReunionCompromisoId').val(dataApp['active']['Compromiso']['id']);
               }

               $('#ReunionPadreId').val(dataApp['active']['Convocatoria']['oid']);
               $('#ReunionUsuarioId').val(dataApp['user']['Usuario']['id']);
               $('#ReunionParticionId').val(dataApp['user']['Usuario']['particion_id']);

               $('#ReunionFoto').click(function(){

                    navigator.camera.getPicture(function(imageData){

                         $('#ReunionImagen').val($.trim(imageData));

                    }, function(){}, { 'saveToPhotoAlbum': false, 'targetWidth': 600, 'targetHeight': 600, 'quality': 90, 'destinationType': Camera.DestinationType.DATA_URL });

               });
          }
          else{
               modalAlert({'html': '&iexcl;Evidencia Enviadad!'});
               $('#ReunionImagen').val("");
          }
     },

     compromisos: function(data, render){
          
          if(render){

               hideSideBar();
               var listUrl = configApp['URL']+'convocatorias/apiCompromisos/?usuario_id='+dataApp['user']['Usuario']['id']+'&particion_id='+configApp['PARTICION_ID']+'&api='+configApp['API_KEY'];
               
               $.ajax({
                     'url': listUrl,
                     'error': function(xqXHR){
                          log({'tipo': 'error', 'url': listUrl, 'mensaje': xqXHR.responseText});
                     },
                     'success': function(data){
                          data = $.parseJSON(data);
 
                          var lista = $('#lista');
                          lista.html('');
                          var colores = {1: "danger", 2: "info", 3: "success"};
                         
                          if(data.length == 0){
                              $('#sinRegistro').show();
                              lista.hide();
                          }
                          else{
                              $('#sinRegistro').hide();
                              lista.show();
                          }

                          for(var i in data){
                               record = data[i];
                               lista.append('<a data-index="'+i+'" href="#" class="compromiso list-group-item list-group-item-'+colores[record['Compromiso']['estatus_id']]+'"><i class="fa fa-calendar"></i> '+record['Convocatoria']['nombre']+'<br /><i class="fa fa-check-square-o"></i> '+substr(record['Compromiso']['descripcion'], 20)+'</a>');
                          }

                          $('.compromiso').click(function(e){
                               e.preventDefault();
                               var self = $(this);
                               var html = '', record;
                               record = data[self.data('index')];

                               html += '<h3>&iquest;Haz completado el compromiso?</h3><br />';
                               html += record['Compromiso']['descripcion'];
                               
                               modalConfirm({
                                    'html': html,
                                    'onConfirm': function(){
                                         var statusUrl = configApp['URL']+'convocatorias/apiCompromiso/?id='+record['Compromiso']['id']+'&particion_id='+configApp['PARTICION_ID']+'&api='+configApp['API_KEY'];
                                         $.ajax({
                                              'url': statusUrl,
                                              'error': function(xqXHR){
                                                   log({'tipo': 'error', 'url': listUrl, 'mensaje': xqXHR.responseText});
                                              },
                                              'success': function(){
                                                   dataApp['active'] = record;
                                                   dataApp['type'] = 1;
                                                   router.go("/Reunion/archivos/");
                                              }
                                         });
                                    }
                               });

                          });
                     }
               });
          }

     },

     convocar: function(data, render){

          if(!render){
               modalAlert({'html': '&iexcl;Convocatoria Enviada!'});
          }
          else{
               hideSideBar();
          }

     }

};