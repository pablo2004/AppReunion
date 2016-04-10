      
      models['Reunion'] = {
           'validations': {
                'descripcion': [{'callback': 'notEmpty', 'message': '<i class="fa fa-times"></i> Debes escribir la descripcion.'}],
                'imagen': [{'callback': 'notEmpty', 'message': '<i class="fa fa-times"></i> Debes Tomar la foto.'}]
           }
     };