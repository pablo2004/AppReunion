      
      models['Convocatoria'] = {
           'validations': {
                'nombre': [{'callback': 'notEmpty', 'message': '<i class="fa fa-times"></i> El campo no debe estar vacio.'}],
                'objetivos': [{'callback': 'notEmpty', 'message': '<i class="fa fa-times"></i> El campo no debe estar vacio.'}]
                
           }
     };