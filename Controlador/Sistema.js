var ControllerSistema = {

     actualizar: function(data, render){

          if(render)
          {
                    hideSideBar();

                    $.ajax({
                         'url': configApp['UPDATE_URL'],
                         'beforeSend': function(){ loaderShow(); },
                         'success': function(data){
                              loaderHide();
                              data = $.parseJSON(data);
                              if(data[configApp['APP_NAME']]['version'] > configApp['VERSION'])
                              {
                                   modalConfirm({
                                        'html': 'Actualizar a la ultima version: '+data[configApp['APP_NAME']]['version'], 
                                        'onConfirm': function(){
                                              loaderShow();
                                              var transfer = new FileTransfer();
                                              url = data[configApp['APP_NAME']]['url'];
                                 
                                              transfer.download(
                                                   encodeURI(url), 
                                                   configApp['UPDATE_PATH']+configApp['APP_NAME']+".apk", 
                                                   function(file){  
                                                        loaderHide();
                                                        window.open(file.toURL(), '_system', 'location=no,closebuttoncaption=Close,enableViewportScale=yes');   
                                                   }, 
                                                   function(e){
                                                        modalAlert({'html': 'Error: fallo la actualizacion: '+e.code });  
                                                   }
                                              );
                                        }
                                   });
                              }
                              else
                              {
                                   $('#versionApp').html('<i class="fa fa-check"></i> Tienes la version mas actual de la aplicacion: '+configApp['VERSION']);
                              }
                         }
                    });

          }

     },

     configura: function(data, render){
          if(!render){

               dataApp['PARTICION_ID'] = $('#SistemaId').val();
               dataApp['API_KEY'] = $('#SistemaApi').val();

               writeJSON('dataApp', dataApp).done(function(result){
                          configApp['PARTICION_ID'] = dataApp['PARTICION_ID'];
                          configApp['API_KEY'] = dataApp['API_KEY'];
                          router.go('/Reunion/index/'); 
               });
          }
     }

};
